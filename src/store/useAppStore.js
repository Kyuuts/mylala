import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { MOCK_MODULES, MOCK_FLASHCARDS } from '../services/mockData';
import { calculateSRS } from '../utils/srsAlgorithm';
import { getCurrentWeekId, getTierFromXP, PEER_CONTESTANTS } from '../utils/rankSystem';
import { generateSalt, hashPassword, verifyPassword, ADMIN_AVATAR_REAL } from '../utils/cryptoAuth';

// Helper to generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Cryptographically hashed credentials for seed accounts (ensures offline & fresh incognito sessions work seamlessly)
const ADMIN_SALT = 'mylala_admin_salt_2026';
const ADMIN_HASH = 'd03e6af7680f447830431fc0eff5a9be99d23c9d7c330e8941e748786f6f1369';

const INITIAL_ACCOUNTS = {
  kyuut: {
    id: 'admin-imam-001',
    username: 'kyuut',
    previousUsername: 'imam',
    email: 'kyuut@mylala.app',
    name: 'kyuut',
    avatarUrl: ADMIN_AVATAR_REAL,
    role: 'admin',
    salt: ADMIN_SALT,
    passwordHash: ADMIN_HASH,
    createdAt: '2026-11-01T00:00:00.000Z',
  },
  imam: {
    id: 'admin-imam-001',
    username: 'imam',
    previousUsername: 'kyuut',
    email: 'imam@mylala.app',
    name: 'kyuut',
    avatarUrl: ADMIN_AVATAR_REAL,
    role: 'admin',
    salt: ADMIN_SALT,
    passwordHash: ADMIN_HASH,
    createdAt: '2026-11-01T00:00:00.000Z',
  },
};

// Helper: Calculate accurate daily streak based on calendar day difference
const calculateDailyStreak = (currentStreak, lastStudyDate) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // If never studied, first study session starts streak at 1
  if (!lastStudyDate) {
    return { streak: 1, lastStudyDate: todayStr };
  }

  // Already studied today: streak remains unchanged
  if (lastStudyDate === todayStr) {
    return { streak: Math.max(1, currentStreak || 1), lastStudyDate: todayStr };
  }

  // Compare calendar days in UTC to prevent timezone skew
  const todayDate = new Date(todayStr + 'T00:00:00Z');
  const lastDate = new Date(lastStudyDate + 'T00:00:00Z');
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Studied yesterday: continuous streak!
    return { streak: (currentStreak || 0) + 1, lastStudyDate: todayStr };
  } else if (diffDays > 1) {
    // Missed 1 or more full days: streak broken, resets to 1
    return { streak: 1, lastStudyDate: todayStr };
  } else {
    return { streak: Math.max(1, currentStreak || 1), lastStudyDate: todayStr };
  }
};

// Helper: Extract snapshot of active user's progression stats
const snapshotActiveStats = (state) => ({
  cefrLevel: state.cefrLevel || 'A1',
  passedExams: state.passedExams || [],
  completedModules: state.completedModules || [],
  rewardedModuleIds: state.rewardedModuleIds || [],
  streak: state.streak !== undefined ? state.streak : 0,
  lastStudyDate: state.lastStudyDate || null,
  xp: state.xp || 0,
  weeklyXp: state.weeklyXp || 0,
  hasClaimedScannerXP: state.hasClaimedScannerXP || false,
});

// Helper: Get clean or saved stats for a specific user ID
const resolveUserStats = (userId, userStatsByUserId) => {
  const isSpecialAdmin = userId === 'admin-imam-001';
  const existing = userStatsByUserId?.[userId];
  const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  if (existing) {
    const rawLevel = existing.cefrLevel || (isSpecialAdmin ? 'A2' : 'A1');
    const effectiveLevel =
      isSpecialAdmin && CEFR_ORDER.indexOf(rawLevel) < CEFR_ORDER.indexOf('A2') ? 'A2' : rawLevel;
    const effectivePassed =
      isSpecialAdmin && (!existing.passedExams || !existing.passedExams.includes('A1'))
        ? Array.from(new Set([...(existing.passedExams || []), 'A1']))
        : (existing.passedExams || []);

    return {
      cefrLevel: effectiveLevel,
      passedExams: effectivePassed,
      completedModules: existing.completedModules || (isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : []),
      rewardedModuleIds: existing.rewardedModuleIds || (isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : []),
      streak: existing.streak !== undefined ? existing.streak : (isSpecialAdmin ? 3 : 0),
      lastStudyDate: existing.lastStudyDate || (isSpecialAdmin ? new Date().toISOString().split('T')[0] : null),
      xp: Math.max(existing.xp || 0, isSpecialAdmin ? 1130 : 0),
      weeklyXp: Math.max(existing.weeklyXp || 0, isSpecialAdmin ? 1130 : 0),
      hasClaimedScannerXP: existing.hasClaimedScannerXP || isSpecialAdmin,
    };
  }

  if (isSpecialAdmin) {
    return {
      cefrLevel: 'A2',
      passedExams: ['A1'],
      completedModules: ['mod-starter-svo', 'mod-starter-tenses'],
      rewardedModuleIds: ['mod-starter-svo', 'mod-starter-tenses'],
      streak: 3,
      lastStudyDate: new Date().toISOString().split('T')[0],
      xp: 1130,
      weeklyXp: 1130,
      hasClaimedScannerXP: true,
    };
  }

  return {
    cefrLevel: 'A1',
    passedExams: [],
    completedModules: [],
    rewardedModuleIds: [],
    streak: 0,
    lastStudyDate: null,
    xp: 0,
    weeklyXp: 0,
    hasClaimedScannerXP: false,
  };
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Authentication State
      isAuthenticated: false,
      user: null, // { id, username, email, name, role }
      userId: generateUUID(),

      // Gamification & Ranked State
      streak: 0,
      lastStudyDate: null, // 'YYYY-MM-DD'
      xp: 0,
      weeklyXp: 0,
      lastWeekId: getCurrentWeekId(),
      completedModules: [], // array of read module IDs
      rewardedModuleIds: [], // array of module IDs that have received one-time +20 XP reward

      // CEFR Level & Journey Progression State
      cefrLevel: 'A1', // Active level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
      passedExams: [], // Array of passed level codes e.g. ['A1']
      dashboardSelectedLevel: null, // One-shot level redirect

      // Network & Sync State
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isSupabaseReady: isSupabaseConfigured(),
      syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'
      syncNotification: null,

      // Core Data
      modules: MOCK_MODULES,
      flashcards: MOCK_FLASHCARDS,
      userProgress: {}, // active user's progress map: { [cardId]: { status, repetitions, ... } }
      userProgressByUserId: {}, // partitioned progress map per userId
      userStatsByUserId: {}, // partitioned progression & CEFR level stats per userId
      offlineQueue: [], // [ { user_id, flashcard_id, status, next_review_date, updated_at } ]

      // Accounts Registry (Username -> Account Profile with Salt & Hash only)
      accounts: INITIAL_ACCOUNTS,

      // Action: Register new user with Supabase Auth & Secure Salted Hashing
      register: async (arg1, arg2, arg3, arg4) => {
        let email, username, name, password;
        if (typeof arg1 === 'object' && arg1 !== null) {
          email = arg1.email;
          username = arg1.username;
          name = arg1.name;
          password = arg1.password;
        } else {
          username = arg1;
          name = arg2;
          password = arg3;
          email = arg4;
        }

        const cleanUser = (username || '').trim().toLowerCase();
        const cleanName = (name || '').trim();
        const cleanPass = (password || '').trim();
        const cleanEmail = (email || '').trim().toLowerCase();

        if (!cleanName || cleanName.length < 2) {
          return { success: false, error: 'Silakan masukkan nama lengkap atau panggilan Anda!' };
        }
        if (!cleanUser || cleanUser.length < 3 || !/^[a-z0-9_]+$/.test(cleanUser)) {
          return { success: false, error: 'Username minimal 3 karakter (huruf, angka, tanpa spasi)!' };
        }
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          return { success: false, error: 'Silakan masukkan alamat email yang valid (contoh: nama@gmail.com)!' };
        }
        if (!cleanPass || cleanPass.length < 6) {
          return { success: false, error: 'Password minimal 6 karakter demi keamanan akun Anda!' };
        }

        const state = get();
        const accounts = state.accounts || INITIAL_ACCOUNTS;
        const { isOnline, isSupabaseReady } = state;

        if (accounts[cleanUser]) {
          return { success: false, error: 'Username sudah terdaftar! Silakan login di tab Masuk.' };
        }
        const emailExists = Object.values(accounts).some((acc) => acc.email === cleanEmail);
        if (emailExists) {
          return { success: false, error: 'Email sudah terdaftar! Silakan gunakan email lain atau masuk.' };
        }

        // Check if username or email already exists in Supabase (USER_SYNC or user_accounts)
        if (isOnline && isSupabaseReady) {
          try {
            const { data: syncRows } = await supabase
              .from('user_weekly_stats')
              .select('username, avatar_url')
              .eq('year_week', 'USER_SYNC');

            if (syncRows && syncRows.length > 0) {
              for (const row of syncRows) {
                let parsed = null;
                try {
                  if (row.avatar_url && row.avatar_url.startsWith('{')) {
                    parsed = JSON.parse(row.avatar_url);
                  }
                } catch (_) {}

                const uName = (row.username || parsed?.username || '').toLowerCase();
                const uEmail = (parsed?.email || '').toLowerCase();
                if (uName === cleanUser) {
                  return { success: false, error: 'Username sudah terdaftar di cloud! Silakan masuk di tab Masuk.' };
                }
                if (uEmail === cleanEmail) {
                  return { success: false, error: 'Email sudah terdaftar di cloud! Silakan masuk dengan email ini.' };
                }
              }
            }
          } catch (_) {}

          try {
            const { data: cloudAcc } = await supabase
              .from('user_accounts')
              .select('username, email')
              .or(`username.eq.${cleanUser},email.eq.${cleanEmail}`)
              .maybeSingle();

            if (cloudAcc) {
              if (cloudAcc.username?.toLowerCase() === cleanUser) {
                return { success: false, error: 'Username sudah terdaftar di cloud! Silakan masuk di tab Masuk.' };
              }
              if (cloudAcc.email?.toLowerCase() === cleanEmail) {
                return { success: false, error: 'Email sudah terdaftar di cloud! Silakan masuk dengan email ini.' };
              }
            }
          } catch (_) {}
        }

        let supabaseUserId = null;

        // 1. Register to Supabase Auth when online
        if (isOnline && isSupabaseReady) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: cleanEmail,
              password: cleanPass,
              options: {
                data: {
                  username: cleanUser,
                  name: cleanName,
                },
              },
            });

            if (error) {
              if (error.message && error.message.toLowerCase().includes('already registered')) {
                return { success: false, error: 'Email ini sudah terdaftar di server. Silakan masuk!' };
              }
              console.warn('Supabase Auth signUp note:', error.message);
            } else if (data?.user?.id) {
              supabaseUserId = data.user.id;
            }
          } catch (err) {
            console.warn('Supabase signUp network note:', err.message);
          }
        }

        // 2. Generate secure one-way hash with cryptographically random salt
        const assignedUserId = supabaseUserId || generateUUID();
        const salt = generateSalt();
        const passwordHash = await hashPassword(cleanPass, salt);

        const newAccount = {
          id: assignedUserId,
          username: cleanUser,
          email: cleanEmail,
          name: cleanName,
          role: 'member',
          salt,
          passwordHash,
          createdAt: new Date().toISOString(),
        };

        // 3. Guarantee Clean Slate Isolation for new user (Fix Step 2 Bug: 0 Due Cards!)
        const prevUserId = state.userId;
        const updatedProgressByUserId = { ...(state.userProgressByUserId || {}) };
        const updatedStatsByUserId = { ...(state.userStatsByUserId || {}) };
        if (prevUserId) {
          updatedProgressByUserId[prevUserId] = state.userProgress || {};
          updatedStatsByUserId[prevUserId] = snapshotActiveStats(state);
        }
        updatedProgressByUserId[assignedUserId] = {}; // Brand new clean slate!
        updatedStatsByUserId[assignedUserId] = resolveUserStats(assignedUserId, null);

        set({
          accounts: {
            ...accounts,
            [cleanUser]: newAccount,
          },
          isAuthenticated: true,
          user: {
            id: assignedUserId,
            username: cleanUser,
            email: cleanEmail,
            name: cleanName,
            role: 'member',
            authProvider: supabaseUserId ? 'supabase' : 'local',
            isLocalOffline: !supabaseUserId,
          },
          userId: assignedUserId,
          userProgress: {}, // 0 cards reviewed, 100% clean
          userProgressByUserId: updatedProgressByUserId,
          userStatsByUserId: updatedStatsByUserId,
          cefrLevel: 'A1',
          passedExams: [],
          completedModules: [],
          rewardedModuleIds: [],
          xp: 0,
          weeklyXp: 0,
          streak: 0,
          lastStudyDate: null,
          dashboardSelectedLevel: 'A1',
          syncNotification: `Akun "${cleanUser}" berhasil dibuat! Selamat belajar, ${cleanName}.`,
        });

        // 4. Sync initial zero weekly stats to Supabase for the new member
        get().syncWeeklyStatsToSupabase();

        // 5. Sync account to Supabase profiles & user_accounts for seamless cross-device login
        if (isOnline && isSupabaseReady) {
          try {
            await supabase.from('profiles').upsert({
              id: assignedUserId,
              username: cleanUser,
              name: cleanName,
              avatar_url: null,
              role: 'member',
              updated_at: new Date().toISOString(),
            });
          } catch (_) {}

          try {
            await supabase.from('user_accounts').upsert({
              id: assignedUserId,
              username: cleanUser,
              email: cleanEmail,
              name: cleanName,
              avatar_url: null,
              salt,
              password_hash: passwordHash,
              role: 'member',
              created_at: new Date().toISOString(),
            });
          } catch (e) {
            console.warn('user_accounts cloud registration notice:', e.message);
          }
        }

        return { success: true };
      },

      // Action: Authentication Login with Cloud-first Cross-Device Sync, Supabase Auth & Salted Hash
      login: async (arg1, arg2) => {
        let identifier, password;
        if (typeof arg1 === 'object' && arg1 !== null) {
          identifier = arg1.identifier || arg1.username;
          password = arg1.password;
        } else {
          identifier = arg1;
          password = arg2;
        }

        const cleanId = (identifier || '').trim().toLowerCase();
        const cleanPass = (password || '').trim();

        if (!cleanId) {
          return { success: false, error: 'Silakan masukkan username atau email Anda!' };
        }
        if (!cleanPass) {
          return { success: false, error: 'Silakan masukkan password Anda!' };
        }

        const state = get();
        const accounts = state.accounts || INITIAL_ACCOUNTS;
        const { isOnline, isSupabaseReady } = state;

        // 1. Primary Authority: Official Supabase Auth (Server-side Bcrypt verification - VULN-05 Remediation)
        let targetEmail = cleanId.includes('@') ? cleanId : null;
        if (!targetEmail && isOnline && isSupabaseReady) {
          try {
            const { data: rpcEmail } = await supabase.rpc('get_email_for_username', {
              target_username: cleanId,
            });
            if (rpcEmail) {
              targetEmail = rpcEmail;
            }
          } catch (_) {}
        }
        if (!targetEmail) {
          const matchedAccount = accounts[cleanId] || Object.values(accounts).find((a) => a.username === cleanId);
          if (matchedAccount?.email) {
            targetEmail = matchedAccount.email;
          }
        }

        if (targetEmail && isOnline && isSupabaseReady) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: targetEmail,
              password: cleanPass,
            });

            if (!error && data?.user) {
              const supUser = data.user;
              const supUserId = supUser.id;
              let userName = supUser.user_metadata?.name || cleanId;
              let userUsername = supUser.user_metadata?.username || cleanId.split('@')[0];
              let userAvatar = supUser.user_metadata?.avatar_url || null;
              let userRole = supUser.user_metadata?.role || 'member';

              // Pull public profile from profiles table
              try {
                const { data: prof } = await supabase
                  .from('profiles')
                  .select('username, name, avatar_url, role')
                  .eq('id', supUserId)
                  .maybeSingle();

                if (prof) {
                  if (prof.name) userName = prof.name;
                  if (prof.username) userUsername = prof.username;
                  if (prof.avatar_url) userAvatar = prof.avatar_url;
                  if (prof.role) userRole = prof.role;
                }
              } catch (_) {}

              // Isolate user progress & progression stats from previous user
              const prevUserId = state.userId;
              const updatedProgressByUserId = { ...(state.userProgressByUserId || {}) };
              const updatedStatsByUserId = { ...(state.userStatsByUserId || {}) };
              if (prevUserId && prevUserId !== supUserId) {
                updatedProgressByUserId[prevUserId] = state.userProgress || {};
                updatedStatsByUserId[prevUserId] = snapshotActiveStats(state);
              }

              const userSavedProg = updatedProgressByUserId[supUserId] || {};
              const userSavedStats = resolveUserStats(supUserId, updatedStatsByUserId);

              set({
                isAuthenticated: true,
                user: {
                  id: supUserId,
                  username: userUsername,
                  email: supUser.email,
                  name: userName,
                  avatarUrl: userAvatar,
                  role: userRole,
                  authProvider: 'supabase',
                  isLocalOffline: false,
                },
                userId: supUserId,
                userProgress: userSavedProg,
                userProgressByUserId: updatedProgressByUserId,
                userStatsByUserId: updatedStatsByUserId,
                cefrLevel: userSavedStats.cefrLevel,
                passedExams: userSavedStats.passedExams,
                completedModules: userSavedStats.completedModules,
                rewardedModuleIds: userSavedStats.rewardedModuleIds,
                streak: userSavedStats.streak,
                lastStudyDate: userSavedStats.lastStudyDate,
                xp: userSavedStats.xp,
                weeklyXp: userSavedStats.weeklyXp,
                dashboardSelectedLevel: userSavedStats.cefrLevel,
                syncNotification: `Selamat datang kembali, ${userName}!`,
              });

              // Pull user's latest cloud progress & stats from Supabase server
              await get().fetchUserProgressFromSupabase(supUserId);
              await get().fetchUserStatsFromSupabase(supUserId, userUsername);
              get().syncWeeklyStatsToSupabase();

              return { success: true };
            } else if (error) {
              // Supabase Auth failed (e.g. user was registered locally or email confirmation pending)
              // Log warning and fall through to Step 2 and Step 3 so offline-first local accounts can still log in!
              console.warn('Supabase signInWithPassword note:', error.message);
            }
          } catch (err) {
            console.warn('Supabase signInWithPassword note:', err.message);
          }
        }

        // 2. Cross-Device Cloud Sync Verification (via user_weekly_stats USER_SYNC & user_accounts)
        let cloudAccount = null;
        let cloudSyncData = null;
        const isSpecialAdmin = cleanId === 'kyuut' || cleanId === 'imam' || cleanId === 'admin-imam-001' || cleanId.includes('kyuut@') || cleanId.includes('imam@');

        if (isOnline && isSupabaseReady) {
          // 2a. Primary cross-device canonical sync row check (unrestricted RLS for anon)
          try {
            const { data: syncRows } = await supabase
              .from('user_weekly_stats')
              .select('*')
              .eq('year_week', 'USER_SYNC');

            if (syncRows && syncRows.length > 0) {
              const matchedRows = [];
              for (const row of syncRows) {
                let parsed = null;
                try {
                  if (row.avatar_url && row.avatar_url.startsWith('{')) {
                    parsed = JSON.parse(row.avatar_url);
                  }
                } catch (_) {}

                const uName = (row.username || parsed?.username || '').toLowerCase();
                const prevName = (parsed?.previousUsername || '').toLowerCase();
                const uEmail = (parsed?.email || '').toLowerCase();
                const uId = (row.user_id || parsed?.id || '').toLowerCase();

                if (
                  uName === cleanId ||
                  prevName === cleanId ||
                  uEmail === cleanId ||
                  uId === cleanId ||
                  (cleanId === 'imam' && (uName === 'kyuut' || (parsed?.name || '').toLowerCase().includes('imam'))) ||
                  (cleanId === 'kyuut' && (uName === 'imam' || (parsed?.name || '').toLowerCase().includes('imam')))
                ) {
                  matchedRows.push({ row, parsed });
                }
              }

              if (matchedRows.length > 0) {
                // Canonical priority sort:
                // 1. admin-imam-001 canonical ID first
                // 2. Highest CEFR level (A2 > A1)
                // 3. Highest XP (1130 > 0)
                const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                matchedRows.sort((a, b) => {
                  const aIsAdmin = a.row.user_id === 'admin-imam-001';
                  const bIsAdmin = b.row.user_id === 'admin-imam-001';
                  if (aIsAdmin && !bIsAdmin) return -1;
                  if (!aIsAdmin && bIsAdmin) return 1;

                  const aLevel = a.parsed?.cefrLevel || 'A1';
                  const bLevel = b.parsed?.cefrLevel || 'A1';
                  const diffLevel = CEFR_ORDER.indexOf(bLevel) - CEFR_ORDER.indexOf(aLevel);
                  if (diffLevel !== 0) return diffLevel;

                  const aXp = a.parsed?.xp || a.row.weekly_xp || 0;
                  const bXp = b.parsed?.xp || b.row.weekly_xp || 0;
                  return bXp - aXp;
                });

                const bestMatch = matchedRows[0];
                const row = bestMatch.row;
                cloudSyncData = bestMatch.parsed || {
                  id: row.user_id,
                  username: row.username,
                  name: row.name,
                  xp: row.weekly_xp,
                  weeklyXp: row.weekly_xp,
                  streak: row.streak,
                };

                const resolvedAvatar =
                  (cloudSyncData.avatarUrl && cloudSyncData.avatarUrl.length < 10000)
                    ? cloudSyncData.avatarUrl
                    : (isSpecialAdmin ? ADMIN_AVATAR_REAL : null);

                cloudAccount = {
                  id: isSpecialAdmin ? 'admin-imam-001' : (row.user_id || cloudSyncData.id),
                  username: isSpecialAdmin ? 'kyuut' : (cloudSyncData.username || row.username),
                  email: isSpecialAdmin ? 'kyuut@mylala.app' : (cloudSyncData.email || `${row.username}@mylala.app`),
                  name: isSpecialAdmin ? 'kyuut' : (cloudSyncData.name || row.name),
                  avatar_url: resolvedAvatar,
                  role: isSpecialAdmin ? 'admin' : (cloudSyncData.role || 'member'),
                  salt: cloudSyncData.salt || ADMIN_SALT,
                  password_hash: cloudSyncData.passwordHash || ADMIN_HASH,
                };
              }
            }
          } catch (err) {
            console.warn('Supabase USER_SYNC check note:', err.message);
          }

          // 2b. Fallback check to user_accounts table
          if (!cloudAccount) {
            try {
              const { data } = await supabase
                .from('user_accounts')
                .select('*')
                .or(`username.eq.${cleanId},email.eq.${cleanId}`)
                .maybeSingle();

              if (data) {
                cloudAccount = data;
              }
            } catch (_) {}
          }
        }

        if (cloudAccount) {
          const isValid = await verifyPassword(cleanPass, cloudAccount.salt, cloudAccount.password_hash);
          if (isValid) {
            const prevUserId = state.userId;
            const updatedProgressByUserId = { ...(state.userProgressByUserId || {}) };
            const updatedStatsByUserId = { ...(state.userStatsByUserId || {}) };
            if (prevUserId && prevUserId !== cloudAccount.id) {
              updatedProgressByUserId[prevUserId] = state.userProgress || {};
              updatedStatsByUserId[prevUserId] = snapshotActiveStats(state);
            }

            const userSavedProg = updatedProgressByUserId[cloudAccount.id] || cloudSyncData?.userProgress || {};
            const userSavedStats = resolveUserStats(cloudAccount.id, updatedStatsByUserId);

            // Cloud progression promotion (if cloud level is higher, elevate local immediately)
            const isSpecialAdmin = cloudAccount.id === 'admin-imam-001' || cloudAccount.username === 'kyuut' || cloudAccount.username === 'imam';
            const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
            const localLevel = userSavedStats.cefrLevel || (isSpecialAdmin ? 'A2' : 'A1');
            const cloudLevel = cloudSyncData?.cefrLevel || localLevel;
            let effectiveLevel =
              CEFR_ORDER.indexOf(cloudLevel) > CEFR_ORDER.indexOf(localLevel) ? cloudLevel : localLevel;
            if (isSpecialAdmin && CEFR_ORDER.indexOf(effectiveLevel) < CEFR_ORDER.indexOf('A2')) {
              effectiveLevel = 'A2';
            }

            const effectivePassed = Array.from(
              new Set([...(userSavedStats.passedExams || []), ...(cloudSyncData?.passedExams || []), ...(isSpecialAdmin ? ['A1'] : [])])
            );
            const effectiveCompleted = Array.from(
              new Set([...(userSavedStats.completedModules || []), ...(cloudSyncData?.completedModules || []), ...(isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : [])])
            );
            const effectiveRewarded = Array.from(
              new Set([...(userSavedStats.rewardedModuleIds || []), ...(cloudSyncData?.rewardedModuleIds || []), ...(isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : [])])
            );
            const effectiveXp = Math.max(userSavedStats.xp || 0, cloudSyncData?.xp || 0, isSpecialAdmin ? 1130 : 0);
            const effectiveWeeklyXp = Math.max(userSavedStats.weeklyXp || 0, cloudSyncData?.weeklyXp || 0, isSpecialAdmin ? 1130 : 0);
            const effectiveStreak = Math.max(userSavedStats.streak || 1, cloudSyncData?.streak || 1, isSpecialAdmin ? 3 : 1);
            const resolvedAvatar = (cloudAccount.avatar_url && cloudAccount.avatar_url.length < 10000)
              ? cloudAccount.avatar_url
              : (isSpecialAdmin ? ADMIN_AVATAR_REAL : null);

            const mergedStats = {
              ...userSavedStats,
              cefrLevel: effectiveLevel,
              passedExams: effectivePassed,
              completedModules: effectiveCompleted,
              rewardedModuleIds: effectiveRewarded,
              xp: effectiveXp,
              weeklyXp: effectiveWeeklyXp,
              streak: effectiveStreak,
              lastStudyDate: cloudSyncData?.lastStudyDate || userSavedStats.lastStudyDate || (isSpecialAdmin ? new Date().toISOString().split('T')[0] : null),
            };

            updatedStatsByUserId[cloudAccount.id] = mergedStats;
            if (cloudSyncData?.userProgress) {
              updatedProgressByUserId[cloudAccount.id] = {
                ...userSavedProg,
                ...cloudSyncData.userProgress,
              };
            }

            // Save account into local registry so offline & subsequent sessions work seamlessly
            const updatedAccounts = {
              ...(state.accounts || INITIAL_ACCOUNTS),
              [cloudAccount.username.toLowerCase()]: {
                id: cloudAccount.id,
                username: cloudAccount.username,
                previousUsername: cloudSyncData?.previousUsername,
                email: cloudAccount.email,
                name: cloudAccount.name,
                avatarUrl: resolvedAvatar,
                role: cloudAccount.role || 'member',
                salt: cloudAccount.salt,
                passwordHash: cloudAccount.password_hash,
                createdAt: cloudSyncData?.createdAt || new Date().toISOString(),
              },
            };

            set({
              isAuthenticated: true,
              accounts: updatedAccounts,
              user: {
                id: cloudAccount.id,
                username: cloudAccount.username,
                email: cloudAccount.email,
                name: cloudAccount.name,
                avatarUrl: resolvedAvatar,
                role: cloudAccount.role || 'member',
                cefrLevel: effectiveLevel,
                authProvider: 'local',
                isLocalOffline: false,
              },
              userId: cloudAccount.id,
              userProgress: updatedProgressByUserId[cloudAccount.id] || {},
              userProgressByUserId: updatedProgressByUserId,
              userStatsByUserId: updatedStatsByUserId,
              cefrLevel: effectiveLevel,
              passedExams: effectivePassed,
              completedModules: effectiveCompleted,
              rewardedModuleIds: effectiveRewarded,
              streak: effectiveStreak,
              lastStudyDate: mergedStats.lastStudyDate,
              xp: effectiveXp,
              weeklyXp: effectiveWeeklyXp,
              dashboardSelectedLevel: effectiveLevel,
              syncNotification: `Selamat datang kembali, ${cloudAccount.name}!`,
            });

            await get().fetchUserProgressFromSupabase(cloudAccount.id);
            await get().fetchUserStatsFromSupabase(cloudAccount.id, cloudAccount.username);
            get().syncWeeklyStatsToSupabase();

            return { success: true };
          }
          // If cloudAccount password check fails, fall through to local accounts before giving up
        }

        // 3. Offline / Local Cryptographic Hash Verification
        // Supports current username, previous username (e.g. renamed imam -> kyuut), or email
        const existing =
          accounts[cleanId] ||
          Object.values(accounts).find(
            (a) =>
              a.username?.toLowerCase() === cleanId ||
              a.previousUsername?.toLowerCase() === cleanId ||
              a.email?.toLowerCase() === cleanId ||
              (cleanId === 'imam' && (a.username?.toLowerCase() === 'kyuut' || a.name?.toLowerCase().includes('imam'))) ||
              (cleanId === 'kyuut' && (a.username?.toLowerCase() === 'imam' || a.name?.toLowerCase().includes('imam')))
          );

        if (existing) {
          // If legacy plain-text password exists from an older version, migrate it on the fly
          if (existing.password && !existing.passwordHash) {
            const salt = generateSalt();
            const passwordHash = await hashPassword(existing.password, salt);
            existing.salt = salt;
            existing.passwordHash = passwordHash;
            delete existing.password;
          }

          const isValid = await verifyPassword(cleanPass, existing.salt, existing.passwordHash);
          if (isValid) {
            // Isolate user progress & progression stats
            const prevUserId = state.userId;
            const updatedProgressByUserId = { ...(state.userProgressByUserId || {}) };
            const updatedStatsByUserId = { ...(state.userStatsByUserId || {}) };
            if (prevUserId && prevUserId !== existing.id) {
              updatedProgressByUserId[prevUserId] = state.userProgress || {};
              updatedStatsByUserId[prevUserId] = snapshotActiveStats(state);
            }

            const userSavedProg = updatedProgressByUserId[existing.id] || {};
            const userSavedStats = resolveUserStats(existing.id, updatedStatsByUserId);

            set({
              isAuthenticated: true,
              user: {
                id: existing.id,
                username: existing.username,
                email: existing.email,
                name: existing.name,
                avatarUrl: existing.avatarUrl || null,
                role: existing.role || 'member',
                authProvider: 'local',
                isLocalOffline: true,
              },
              userId: existing.id,
              userProgress: userSavedProg,
              userProgressByUserId: updatedProgressByUserId,
              userStatsByUserId: updatedStatsByUserId,
              cefrLevel: userSavedStats.cefrLevel,
              passedExams: userSavedStats.passedExams,
              completedModules: userSavedStats.completedModules,
              rewardedModuleIds: userSavedStats.rewardedModuleIds,
              streak: userSavedStats.streak,
              lastStudyDate: userSavedStats.lastStudyDate,
              xp: userSavedStats.xp,
              weeklyXp: userSavedStats.weeklyXp,
              dashboardSelectedLevel: userSavedStats.cefrLevel,
              syncNotification: `Selamat datang kembali, ${existing.name}!`,
            });

            if (isOnline && isSupabaseReady) {
              await get().fetchUserProgressFromSupabase(existing.id);
              await get().fetchUserStatsFromSupabase(existing.id, existing.username);
              get().syncWeeklyStatsToSupabase();
              get().syncLocalAccountsToCloud();
            }

            return { success: true };
          }
          return {
            success: false,
            error: 'Password yang Anda masukkan salah!',
          };
        }

        return {
          success: false,
          error: 'Akun belum terdaftar! Silakan periksa kembali username/email Anda atau buat akun baru di tab "Daftar Akun Baru".',
        };
      },

      // Action: Logout
      logout: async () => {
        const { isOnline, isSupabaseReady, userId, userProgress, userProgressByUserId } = get();
        if (isOnline && isSupabaseReady) {
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.warn('Supabase signOut notice:', e);
          }
        }

        // Security Remediation (VULN-09): Sanitize sensitive API caches upon logout on shared devices
        if (typeof window !== 'undefined' && 'caches' in window) {
          try {
            const cacheKeys = await caches.keys();
            for (const key of cacheKeys) {
              if (key.includes('supabase') || key.includes('user')) {
                await caches.delete(key);
              }
            }
          } catch (e) {
            console.warn('Cache cleanup on logout notice:', e);
          }
        }

        const updatedByUserId = { ...(userProgressByUserId || {}) };
        const updatedStatsByUserId = { ...(get().userStatsByUserId || {}) };
        if (userId) {
          updatedByUserId[userId] = userProgress || {};
          updatedStatsByUserId[userId] = snapshotActiveStats(get());
        }

        set({
          isAuthenticated: false,
          user: null,
          userId: null,
          userProgress: {},
          userProgressByUserId: updatedByUserId,
          userStatsByUserId: updatedStatsByUserId,
          cefrLevel: 'A1',
          passedExams: [],
          completedModules: [],
          rewardedModuleIds: [],
          streak: 0,
          lastStudyDate: null,
          xp: 0,
          weeklyXp: 0,
          dashboardSelectedLevel: 'A1',
          syncNotification: null,
        });
      },

      // Action: Network connectivity change
      setOnline: async (isOnline) => {
        set({ isOnline });
        if (isOnline) {
          await get().syncOfflineQueue();
          await get().syncLocalAccountsToCloud();
        }
      },

      // Action: Auto-sync all local accounts to Supabase (USER_SYNC & user_accounts) for cross-device availability
      syncLocalAccountsToCloud: async () => {
        const { accounts, isOnline, isSupabaseReady } = get();
        if (!isOnline || !isSupabaseReady || !accounts) return;

        const list = Object.values(accounts);
        for (const acc of list) {
          if (!acc || !acc.username) continue;
          try {
            const cleanUser = acc.username.toLowerCase();
            const isSpecialAdmin = cleanUser === 'kyuut' || cleanUser === 'imam' || acc.id === 'admin-imam-001';
            const canonicalId = isSpecialAdmin ? 'admin-imam-001' : (acc.id || `usr-${cleanUser}`);

            const stats = resolveUserStats(canonicalId, get().userStatsByUserId || {});
            const resolvedAvatar = (acc.avatarUrl && acc.avatarUrl.length < 10000)
              ? acc.avatarUrl
              : (isSpecialAdmin ? ADMIN_AVATAR_REAL : null);

            const syncPayload = {
              version: 2,
              id: canonicalId,
              username: isSpecialAdmin ? 'kyuut' : cleanUser,
              previousUsername: acc.previousUsername || (cleanUser === 'kyuut' ? 'imam' : (cleanUser === 'imam' ? 'kyuut' : null)),
              email: isSpecialAdmin ? 'kyuut@mylala.app' : (acc.email || `${cleanUser}@mylala.app`),
              name: isSpecialAdmin ? 'kyuut' : (acc.name || acc.username),
              avatarUrl: resolvedAvatar,
              role: isSpecialAdmin ? 'admin' : (acc.role || 'member'),
              salt: acc.salt || ADMIN_SALT,
              passwordHash: acc.passwordHash || ADMIN_HASH,
              cefrLevel: isSpecialAdmin ? 'A2' : (stats.cefrLevel || 'A1'),
              passedExams: isSpecialAdmin ? ['A1'] : (stats.passedExams || []),
              completedModules: isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : (stats.completedModules || []),
              rewardedModuleIds: isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : (stats.rewardedModuleIds || []),
              xp: Math.max(stats.xp || 0, isSpecialAdmin ? 1130 : 0),
              weeklyXp: Math.max(stats.weeklyXp || 0, isSpecialAdmin ? 1130 : 0),
              streak: Math.max(stats.streak || 1, isSpecialAdmin ? 3 : 1),
              lastStudyDate: stats.lastStudyDate || (isSpecialAdmin ? new Date().toISOString().split('T')[0] : null),
              updatedAt: new Date().toISOString(),
            };

            await supabase.from('user_weekly_stats').upsert({
              user_id: canonicalId,
              username: syncPayload.username,
              name: syncPayload.name,
              avatar_url: JSON.stringify(syncPayload),
              year_week: 'USER_SYNC',
              weekly_xp: syncPayload.xp,
              cards_reviewed: 0,
              streak: syncPayload.streak,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,year_week' });
          } catch (_) {}

          // Also attempt user_accounts table as secondary mirror
          try {
            const cleanUser = acc.username.toLowerCase();
            const isSpecialAdmin = cleanUser === 'kyuut' || cleanUser === 'imam' || acc.id === 'admin-imam-001';
            const canonicalId = isSpecialAdmin ? 'admin-imam-001' : (acc.id || `usr-${cleanUser}`);

            await supabase.from('user_accounts').upsert({
              id: canonicalId,
              username: isSpecialAdmin ? 'kyuut' : cleanUser,
              email: isSpecialAdmin ? 'kyuut@mylala.app' : (acc.email || `${cleanUser}@mylala.app`),
              name: isSpecialAdmin ? 'kyuut' : (acc.name || acc.username),
              avatar_url: (acc.avatarUrl && acc.avatarUrl.length < 10000) ? acc.avatarUrl : (isSpecialAdmin ? ADMIN_AVATAR_REAL : null),
              salt: acc.salt || ADMIN_SALT,
              password_hash: acc.passwordHash || '',
              role: isSpecialAdmin ? 'admin' : (acc.role || 'member'),
              created_at: acc.createdAt || new Date().toISOString(),
            }, { onConflict: 'username' });
          } catch (_) {
            // Silently ignore if table doesn't exist or RLS restricted
          }
        }
      },

      dismissNotification: () => {
        set({ syncNotification: null });
      },

      // Action: Set CEFR placement test result
      setUserCefrLevel: (levelCode) => {
        const state = get();
        const { user, userId } = state;
        const updatedUser = user ? { ...user, cefrLevel: levelCode } : user;
        const currentStats = (state.userStatsByUserId || {})[userId] || snapshotActiveStats(state);
        const alreadyClaimed = Boolean(currentStats.hasClaimedScannerXP);

        const updatedStats = userId
          ? {
              ...(state.userStatsByUserId || {}),
              [userId]: {
                ...currentStats,
                cefrLevel: levelCode,
                hasClaimedScannerXP: true,
              },
            }
          : state.userStatsByUserId;

        set({
          cefrLevel: levelCode,
          user: updatedUser,
          userStatsByUserId: updatedStats,
          dashboardSelectedLevel: levelCode,
          syncNotification: `Level belajarmu telah disetel ke ${levelCode}. Selamat belajar!`,
        });

        if (!alreadyClaimed) {
          get().addXP(50, `Menyelesaikan Language Scanner (${levelCode})`);
        }
        get().syncWeeklyStatsToSupabase();
      },

      // Action: Programmatic Dashboard Level Navigation
      setDashboardSelectedLevel: (levelCode) => {
        set({ dashboardSelectedLevel: levelCode });
      },

      // Action: Update User Profile (Username, Name, and Avatar / Photo)
      updateProfile: async ({ name, username, avatarUrl }) => {
        const state = get();
        const { user, accounts, isOnline, isSupabaseReady } = state;
        if (!user) return { success: false, error: 'User belum login.' };

        const cleanName = (name || user.name || '').trim();
        const rawUsername = (username || user.username || '').trim().toLowerCase();
        const cleanUsername = rawUsername.replace(/[^a-z0-9_]/g, '');

        if (!cleanName || cleanName.length < 2) {
          return { success: false, error: 'Nama minimal 2 karakter!' };
        }
        if (!cleanUsername || cleanUsername.length < 3) {
          return { success: false, error: 'Username minimal 3 karakter (huruf, angka, tanpa spasi)!' };
        }

        // Check if username is taken by another account
        const oldUsername = (user.username || '').toLowerCase();
        if (cleanUsername !== oldUsername && accounts && accounts[cleanUsername]) {
          return { success: false, error: `Username @${cleanUsername} sudah digunakan oleh akun lain!` };
        }

        const newAvatarUrl = avatarUrl !== undefined ? avatarUrl : (user.avatarUrl || null);

        const updatedUser = {
          ...user,
          name: cleanName,
          username: cleanUsername,
          avatarUrl: newAvatarUrl,
        };

        // Update accounts dictionary
        const updatedAccounts = { ...(accounts || {}) };
        const activeKey = accounts[cleanUsername] ? cleanUsername : (accounts[oldUsername] ? oldUsername : cleanUsername);
        const existingAcc = updatedAccounts[activeKey] || {};

        if (cleanUsername !== oldUsername && updatedAccounts[oldUsername]) {
          delete updatedAccounts[oldUsername];
        }
        updatedAccounts[cleanUsername] = {
          ...existingAcc,
          id: user.id,
          name: cleanName,
          username: cleanUsername,
          previousUsername: oldUsername || existingAcc.previousUsername || null,
          email: user.email || existingAcc.email || `${cleanUsername}@mylala.app`,
          avatarUrl: newAvatarUrl,
        };

        set({
          user: updatedUser,
          accounts: updatedAccounts,
          syncNotification: 'Profil dan foto berhasil diperbarui!',
        });

        // 1. Sync updated profile & avatar to Supabase profiles & user_accounts table
        if (isOnline && isSupabaseReady) {
          try {
            await supabase.from('profiles').upsert({
              id: user.id,
              username: cleanUsername,
              name: cleanName,
              avatar_url: newAvatarUrl,
              updated_at: new Date().toISOString(),
            });
          } catch (_) {}

          try {
            await supabase.from('user_accounts').upsert({
              id: user.id,
              username: cleanUsername,
              email: user.email || `${cleanUsername}@mylala.app`,
              name: cleanName,
              avatar_url: newAvatarUrl,
              salt: existingAcc.salt || 'mylala_salt',
              password_hash: existingAcc.passwordHash || '',
              role: user.role || 'member',
            }, { onConflict: 'username' });
          } catch (e) {
            console.warn('user_accounts update notice:', e.message);
          }

          // 2. Sync metadata to Supabase Auth if online
          try {
            await supabase.auth.updateUser({
              data: {
                name: cleanName,
                username: cleanUsername,
                avatar_url: newAvatarUrl,
              },
            });
          } catch (e) {
            console.warn('Supabase updateUser metadata note:', e.message);
          }
        }

        // 3. Sync updated avatar and name to Leaderboard
        await get().syncWeeklyStatsToSupabase();

        return { success: true };
      },

      // Helper alias for case flexibility
      addXp: (amount, reason = '') => {
        get().addXP(amount, reason);
      },

      // Action: Fetch and cache modules with seamless mock merging
      fetchModules: async (category = 'All') => {
        const { isOnline, isSupabaseReady } = get();

        // Ensure newly added master curriculum modules are merged into state
        set((state) => {
          const moduleMap = new Map();
          (state.modules || []).forEach((m) => moduleMap.set(m.id, m));
          MOCK_MODULES.forEach((m) => moduleMap.set(m.id, m));
          return { modules: Array.from(moduleMap.values()) };
        });

        if (isOnline && isSupabaseReady) {
          try {
            let query = supabase
              .from('modules')
              .select('id, category, title, content_markdown, created_at')
              .order('created_at', { ascending: true });

            if (category && category !== 'All') {
              query = query.eq('category', category);
            }

            const { data, error } = await query;
            if (!error && data && data.length > 0) {
              set((state) => {
                const existingMap = new Map(MOCK_MODULES.map((m) => [m.id, m]));
                data.forEach((m) => existingMap.set(m.id, m));
                state.modules.forEach((m) => existingMap.set(m.id, m));
                return { modules: Array.from(existingMap.values()) };
              });
            }
          } catch (err) {
            console.warn('Supabase fetchModules failed, using local store:', err.message);
          }
        }

        // Return unified list from store
        const localModules = get().modules;
        const filtered =
          category && category !== 'All'
            ? localModules.filter((m) => m.category === category)
            : localModules;

        return { data: filtered, error: null };
      },

      // Action: Fetch single module
      fetchModuleById: async (id) => {
        const { isOnline, isSupabaseReady, modules } = get();

        if (isOnline && isSupabaseReady) {
          try {
            const { data, error } = await supabase
              .from('modules')
              .select('*')
              .eq('id', id)
              .single();

            if (!error && data) {
              return { data, error: null };
            }
          } catch (err) {
            console.warn('Supabase fetchModuleById failed:', err.message);
          }
        }

        const found = modules.find((m) => m.id === id) || MOCK_MODULES.find((m) => m.id === id);
        return { data: found || null, error: found ? null : new Error('Modul tidak ditemukan') };
      },

      // Action: Fetch user progress from Supabase
      fetchUserProgressFromSupabase: async (targetUserId) => {
        const { isOnline, isSupabaseReady } = get();
        if (!isOnline || !isSupabaseReady || !targetUserId) return;

        try {
          const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', targetUserId);

          if (!error && data && data.length > 0) {
            const progMap = {};
            data.forEach((p) => {
              progMap[p.flashcard_id] = {
                flashcard_id: p.flashcard_id,
                status: p.status,
                repetitions: p.repetitions || 1,
                easeFactor: p.ease_factor || 2.5,
                interval: p.interval || 1,
                next_review_date: p.next_review_date,
                last_reviewed_at: p.updated_at,
              };
            });

            set((state) => ({
              userProgress: { ...state.userProgress, ...progMap },
              userProgressByUserId: {
                ...state.userProgressByUserId,
                [targetUserId]: {
                  ...(state.userProgressByUserId?.[targetUserId] || {}),
                  ...progMap,
                },
              },
            }));
          }
        } catch (err) {
          console.warn('Failed to load user progress from Supabase:', err.message);
        }
      },

      // Action: Fetch user weekly stats & XP directly from Supabase server
      fetchUserStatsFromSupabase: async (targetUserId, targetUsername) => {
        const { isOnline, isSupabaseReady } = get();
        if (!isOnline || !isSupabaseReady || (!targetUserId && !targetUsername)) return;

        const currentWeek = getCurrentWeekId();
        try {
          let data = null;

          // 1. Primary lookup: by user_id for current week
          if (targetUserId) {
            const { data: byId } = await supabase
              .from('user_weekly_stats')
              .select('*')
              .eq('year_week', currentWeek)
              .eq('user_id', targetUserId)
              .maybeSingle();
            data = byId;
          }

          // 2. Fallback lookup: by username (for cross-device / fresh sessions)
          if (!data && targetUsername) {
            const { data: byUser } = await supabase
              .from('user_weekly_stats')
              .select('*')
              .eq('year_week', currentWeek)
              .eq('username', targetUsername.toLowerCase())
              .maybeSingle();
            data = byUser;
          }

          // 3. Cross-device canonical progression sync row lookup (USER_SYNC)
          let syncData = null;
          try {
            const { data: syncRows } = await supabase
              .from('user_weekly_stats')
              .select('*')
              .eq('year_week', 'USER_SYNC');

            if (syncRows && syncRows.length > 0) {
              const targetU = (targetUsername || '').toLowerCase();
              const targetId = (targetUserId || '').toLowerCase();
              const matchedRows = [];

              for (const row of syncRows) {
                let parsed = null;
                if (row.avatar_url && row.avatar_url.startsWith('{')) {
                  try {
                    parsed = JSON.parse(row.avatar_url);
                  } catch (_) {}
                }

                const rowU = (row.username || parsed?.username || '').toLowerCase();
                const rowPrev = (parsed?.previousUsername || '').toLowerCase();
                const rowId = (row.user_id || parsed?.id || '').toLowerCase();

                if (
                  rowU === targetU ||
                  rowPrev === targetU ||
                  rowId === targetId ||
                  (targetU === 'kyuut' && (rowU === 'imam' || rowPrev === 'kyuut')) ||
                  (targetU === 'imam' && (rowU === 'kyuut' || rowPrev === 'imam'))
                ) {
                  matchedRows.push({ row, parsed });
                }
              }

              if (matchedRows.length > 0) {
                const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                matchedRows.sort((a, b) => {
                  const aIsAdmin = a.row.user_id === 'admin-imam-001';
                  const bIsAdmin = b.row.user_id === 'admin-imam-001';
                  if (aIsAdmin && !bIsAdmin) return -1;
                  if (!aIsAdmin && bIsAdmin) return 1;

                  const aLevel = a.parsed?.cefrLevel || 'A1';
                  const bLevel = b.parsed?.cefrLevel || 'A1';
                  const diffLevel = CEFR_ORDER.indexOf(bLevel) - CEFR_ORDER.indexOf(aLevel);
                  if (diffLevel !== 0) return diffLevel;

                  const aXp = a.parsed?.xp || a.row.weekly_xp || 0;
                  const bXp = b.parsed?.xp || b.row.weekly_xp || 0;
                  return bXp - aXp;
                });

                syncData = matchedRows[0].parsed;
              }
            }
          } catch (err) {
            console.warn('Could not fetch USER_SYNC row:', err.message);
          }

          const isSpecialAdmin =
            targetUserId === 'admin-imam-001' ||
            (targetUsername || '').toLowerCase() === 'kyuut' ||
            (targetUsername || '').toLowerCase() === 'imam';

          // 4. Cloud profile & avatar lookup from profiles (and fallback to user_accounts)
          let cloudAvatar = (data?.avatar_url && !data.avatar_url.startsWith('{')) ? data.avatar_url : null;
          let cloudName = data?.name || null;
          if (syncData?.avatarUrl && !syncData.avatarUrl.startsWith('{')) {
            cloudAvatar = syncData.avatarUrl;
          }
          if (syncData?.name && !cloudName) {
            cloudName = syncData.name;
          }

          if (isSpecialAdmin) {
            if (!cloudAvatar || cloudAvatar.length > 10000) {
              cloudAvatar = ADMIN_AVATAR_REAL;
            }
            if (!cloudName) {
              cloudName = 'kyuut';
            }
          }

          try {
            const lookupConditions = [];
            if (targetUserId) lookupConditions.push(`id.eq.${targetUserId}`);
            if (targetUsername) lookupConditions.push(`username.eq.${targetUsername.toLowerCase()}`);

            if (lookupConditions.length > 0) {
              const { data: profData } = await supabase
                .from('profiles')
                .select('avatar_url, name')
                .or(lookupConditions.join(','))
                .maybeSingle();

              if (profData) {
                if (profData.avatar_url && (!isSpecialAdmin || profData.avatar_url.length < 10000)) {
                  cloudAvatar = profData.avatar_url;
                }
                if (profData.name && !cloudName) cloudName = profData.name;
              } else {
                const { data: accData } = await supabase
                  .from('user_accounts')
                  .select('avatar_url, name')
                  .or(lookupConditions.join(','))
                  .maybeSingle();

                if (accData) {
                  if (accData.avatar_url && (!isSpecialAdmin || accData.avatar_url.length < 10000)) {
                    cloudAvatar = accData.avatar_url;
                  }
                  if (accData.name && !cloudName) cloudName = accData.name;
                }
              }
            }
          } catch (_) {}

          if (data || cloudAvatar || syncData || isSpecialAdmin) {
            const remoteXp = Math.max(data?.weekly_xp || 0, syncData?.xp || 0, isSpecialAdmin ? 1130 : 0);
            const remoteWeeklyXp = Math.max(data?.weekly_xp || 0, syncData?.weeklyXp || 0, isSpecialAdmin ? 1130 : 0);
            const remoteStreak = Math.max(data?.streak || 1, syncData?.streak || 1, isSpecialAdmin ? 3 : 1);
            const canonicalUserId = isSpecialAdmin ? 'admin-imam-001' : (data?.user_id || syncData?.id || targetUserId);

            set((state) => {
              if (state.userId !== canonicalUserId && state.userId !== targetUserId) return {};

              // Progressive CEFR Level Promotion across devices
              const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
              const localLevel = state.cefrLevel || (isSpecialAdmin ? 'A2' : 'A1');
              const remoteLevel = syncData?.cefrLevel || (isSpecialAdmin ? 'A2' : localLevel);
              const localIdx = CEFR_ORDER.indexOf(localLevel);
              const remoteIdx = CEFR_ORDER.indexOf(remoteLevel);
              let highestLevel = remoteIdx > localIdx ? remoteLevel : localLevel;
              if (isSpecialAdmin && CEFR_ORDER.indexOf(highestLevel) < CEFR_ORDER.indexOf('A2')) {
                highestLevel = 'A2';
              }

              const mergedPassed = Array.from(
                new Set([...(state.passedExams || []), ...(syncData?.passedExams || []), ...(isSpecialAdmin ? ['A1'] : [])])
              );
              const mergedCompleted = Array.from(
                new Set([...(state.completedModules || []), ...(syncData?.completedModules || []), ...(isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : [])])
              );
              const mergedRewarded = Array.from(
                new Set([...(state.rewardedModuleIds || []), ...(syncData?.rewardedModuleIds || []), ...(isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : [])])
              );

              const currentXp = Math.max(state.xp || 0, remoteXp);
              const currentWeeklyXp = Math.max(state.weeklyXp || 0, remoteWeeklyXp);
              const currentStreak = Math.max(state.streak || 1, remoteStreak);

              const updatedStats = {
                ...(state.userStatsByUserId || {}),
                [canonicalUserId]: {
                  ...((state.userStatsByUserId || {})[canonicalUserId] || snapshotActiveStats(state)),
                  cefrLevel: highestLevel,
                  passedExams: mergedPassed,
                  completedModules: mergedCompleted,
                  rewardedModuleIds: mergedRewarded,
                  xp: currentXp,
                  weeklyXp: currentWeeklyXp,
                  streak: currentStreak,
                  lastStudyDate: syncData?.lastStudyDate || state.lastStudyDate || (isSpecialAdmin ? new Date().toISOString().split('T')[0] : null),
                },
              };

              const finalAvatar = (cloudAvatar && cloudAvatar.length < 10000)
                ? cloudAvatar
                : (isSpecialAdmin ? ADMIN_AVATAR_REAL : (state.user?.avatarUrl || null));

              const nextState = {
                userId: canonicalUserId,
                cefrLevel: highestLevel,
                dashboardSelectedLevel: highestLevel,
                passedExams: mergedPassed,
                completedModules: mergedCompleted,
                rewardedModuleIds: mergedRewarded,
                weeklyXp: currentWeeklyXp,
                xp: currentXp,
                streak: currentStreak,
                userStatsByUserId: updatedStats,
                user: state.user
                  ? {
                      ...state.user,
                      id: canonicalUserId,
                      cefrLevel: highestLevel,
                      name: cloudName || data?.name || state.user.name,
                      avatarUrl: finalAvatar,
                    }
                  : state.user,
              };

              if (syncData?.userProgress && Object.keys(syncData.userProgress).length > 0) {
                nextState.userProgress = {
                  ...(state.userProgress || {}),
                  ...syncData.userProgress,
                };
              }

              return nextState;
            });
          }
        } catch (err) {
          console.warn('Could not fetch user stats from Supabase:', err.message);
        }
      },

      // Action: Fetch flashcards and enrich with user progress
      fetchFlashcards: async (moduleId = 'all') => {
        const { isOnline, isSupabaseReady, userId } = get();

        // Ensure newly added master curriculum flashcards are merged into state
        set((state) => {
          const cardMap = new Map();
          (state.flashcards || []).forEach((c) => cardMap.set(c.id, c));
          MOCK_FLASHCARDS.forEach((c) => cardMap.set(c.id, c));
          return { flashcards: Array.from(cardMap.values()) };
        });

        let cards = [];

        if (isOnline && isSupabaseReady) {
          try {
            let query = supabase
              .from('flashcards')
              .select('id, module_id, front_text, back_text, example_sentence, created_at')
              .order('created_at', { ascending: true });

            if (moduleId && moduleId !== 'all') {
              query = query.eq('module_id', moduleId);
            }

            const { data, error } = await query;
            if (!error && data && data.length > 0) {
              set((state) => {
                const map = new Map(MOCK_FLASHCARDS.map((c) => [c.id, c]));
                data.forEach((c) => map.set(c.id, c));
                state.flashcards.forEach((c) => map.set(c.id, c));
                return { flashcards: Array.from(map.values()) };
              });
            }

            // Fetch remote progress for active user
            if (userId) {
              get().fetchUserProgressFromSupabase(userId);
            }
          } catch (err) {
            console.warn('Supabase fetchFlashcards failed, fallback to store:', err.message);
          }
        }

        // Always resolve from unified store
        cards = get().flashcards;
        if (moduleId && moduleId !== 'all') {
          cards = cards.filter((c) => c.module_id === moduleId);
        }

        // Enrich cards with active user progress metadata
        const activeProgress = get().userProgress || {};
        const enriched = cards.map((c) => {
          const prog = activeProgress[c.id];
          const hasStudied = Boolean(prog && prog.last_reviewed_at);

          return {
            ...c,
            status: hasStudied ? prog.status : 'New',
            repetitions: prog?.repetitions || 0,
            interval: prog?.interval || 0,
            next_review_date: prog?.next_review_date || null,
            isNew: !hasStudied,
          };
        });

        return { data: enriched, error: null };
      },

      // Action: Add XP and update weekly rank progress
      addXP: (amount, reason = '') => {
        const currentWeek = getCurrentWeekId();
        set((state) => {
          const isNewWeek = state.lastWeekId !== currentWeek;
          const baseWeekly = isNewWeek ? 0 : (state.weeklyXp || 0);
          const newWeekly = baseWeekly + amount;
          const newTotal = (state.xp || 0) + amount;
          const userId = state.userId;

          const updatedStats = userId
            ? {
                ...(state.userStatsByUserId || {}),
                [userId]: {
                  ...((state.userStatsByUserId || {})[userId] || snapshotActiveStats(state)),
                  xp: newTotal,
                  weeklyXp: newWeekly,
                },
              }
            : state.userStatsByUserId;

          return {
            xp: newTotal,
            weeklyXp: newWeekly,
            lastWeekId: currentWeek,
            userStatsByUserId: updatedStats,
            syncNotification: reason ? `+${amount} XP: ${reason}` : null,
          };
        });

        // Sync new XP score to Supabase Realtime Leaderboard
        get().syncWeeklyStatsToSupabase();
      },

      // Action: Sync user's weekly XP & progress to Supabase user_weekly_stats
      syncWeeklyStatsToSupabase: async () => {
        const { isOnline, isSupabaseReady, userId, user, weeklyXp, streak, userProgress } = get();
        if (!isOnline || !isSupabaseReady || !userId) return;

        const currentWeek = getCurrentWeekId();
        const cardsReviewed = Object.values(userProgress || {}).filter(
          (p) => p && p.last_reviewed_at
        ).length;

        // 1. Weekly leaderboard row (year_week = 'YYYY-Wxx')
        const payload = {
          user_id: userId,
          username: (user?.username || 'user').toLowerCase(),
          name: user?.name || 'Pembelajar MyLala',
          avatar_url: user?.avatarUrl && !user.avatarUrl.startsWith('{') ? user.avatarUrl : null,
          year_week: currentWeek,
          weekly_xp: weeklyXp || 0,
          cards_reviewed: cardsReviewed,
          streak: streak || 1,
          updated_at: new Date().toISOString(),
        };

        try {
          const { error } = await supabase
            .from('user_weekly_stats')
            .upsert(payload, { onConflict: 'user_id,year_week' });

          // If remote table hasn't added avatar_url column yet, fallback gracefully
          if (error && error.message && error.message.toLowerCase().includes('avatar_url')) {
            const { avatar_url, ...fallbackPayload } = payload;
            await supabase
              .from('user_weekly_stats')
              .upsert(fallbackPayload, { onConflict: 'user_id,year_week' });
          }
        } catch (err) {
          console.warn('Realtime weekly stats sync notice:', err.message);
        }

        // 2. Canonical Cross-Device Progression Sync row (year_week = 'USER_SYNC')
        try {
          const state = get();
          const isSpecialAdmin =
            userId === 'admin-imam-001' ||
            (user?.username || '').toLowerCase() === 'kyuut' ||
            (user?.username || '').toLowerCase() === 'imam';
          const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
          const activeAccount = (state.accounts || INITIAL_ACCOUNTS)[(user?.username || '').toLowerCase()] || {};

          let effectiveCefr = state.cefrLevel || (isSpecialAdmin ? 'A2' : 'A1');
          if (isSpecialAdmin && CEFR_ORDER.indexOf(effectiveCefr) < CEFR_ORDER.indexOf('A2')) {
            effectiveCefr = 'A2';
          }

          const effectivePassed = isSpecialAdmin && (!state.passedExams || !state.passedExams.includes('A1'))
            ? Array.from(new Set([...(state.passedExams || []), 'A1']))
            : (state.passedExams || []);

          const effectiveCompleted = isSpecialAdmin && (!state.completedModules || state.completedModules.length === 0)
            ? ['mod-starter-svo', 'mod-starter-tenses']
            : (state.completedModules || []);

          const effectiveRewarded = isSpecialAdmin && (!state.rewardedModuleIds || state.rewardedModuleIds.length === 0)
            ? ['mod-starter-svo', 'mod-starter-tenses']
            : (state.rewardedModuleIds || []);

          const effectiveAvatar =
            user?.avatarUrl && user.avatarUrl.length < 10000 && !user.avatarUrl.startsWith('{')
              ? user.avatarUrl
              : (isSpecialAdmin ? ADMIN_AVATAR_REAL : null);

          const effectiveXp = Math.max(state.xp || 0, isSpecialAdmin ? 1130 : 0);
          const effectiveWeeklyXp = Math.max(state.weeklyXp || 0, isSpecialAdmin ? 1130 : 0);
          const effectiveStreak = Math.max(state.streak || 1, isSpecialAdmin ? 3 : 1);

          const syncMeta = {
            version: 2,
            id: isSpecialAdmin ? 'admin-imam-001' : userId,
            username: isSpecialAdmin ? 'kyuut' : (user?.username || 'user').toLowerCase(),
            previousUsername: activeAccount.previousUsername || (user?.username === 'kyuut' ? 'imam' : undefined),
            email: isSpecialAdmin ? 'kyuut@mylala.app' : (user?.email || `${(user?.username || 'user').toLowerCase()}@mylala.app`),
            name: isSpecialAdmin ? 'kyuut' : (user?.name || 'Pembelajar MyLala'),
            avatarUrl: effectiveAvatar,
            role: isSpecialAdmin ? 'admin' : (user?.role || 'member'),
            salt: activeAccount.salt || ADMIN_SALT,
            passwordHash: activeAccount.passwordHash || ADMIN_HASH,
            cefrLevel: effectiveCefr,
            passedExams: effectivePassed,
            completedModules: effectiveCompleted,
            rewardedModuleIds: effectiveRewarded,
            userProgress: state.userProgress || {},
            xp: effectiveXp,
            weeklyXp: effectiveWeeklyXp,
            streak: effectiveStreak,
            lastStudyDate: state.lastStudyDate || new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
          };

          await supabase.from('user_weekly_stats').upsert({
            user_id: syncMeta.id,
            username: syncMeta.username,
            name: syncMeta.name,
            avatar_url: JSON.stringify(syncMeta),
            year_week: 'USER_SYNC',
            weekly_xp: effectiveXp,
            cards_reviewed: cardsReviewed,
            streak: effectiveStreak,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,year_week' });
        } catch (syncErr) {
          console.warn('Realtime canonical USER_SYNC notice:', syncErr.message);
        }
      },

      // Action: Mark module cheat sheet as read (rewards +20 XP strictly ONCE per module)
      markModuleRead: (moduleId) => {
        const state = get();
        const readList = state.completedModules || [];
        const rewardedList = state.rewardedModuleIds || [];
        const isRead = readList.includes(moduleId);
        const alreadyRewarded = rewardedList.includes(moduleId);
        const userId = state.userId;

        if (!isRead) {
          const newCompleted = [...readList, moduleId];
          const newRewarded = alreadyRewarded ? rewardedList : [...rewardedList, moduleId];
          const updatedStats = userId
            ? {
                ...(state.userStatsByUserId || {}),
                [userId]: {
                  ...((state.userStatsByUserId || {})[userId] || snapshotActiveStats(state)),
                  completedModules: newCompleted,
                  rewardedModuleIds: newRewarded,
                },
              }
            : state.userStatsByUserId;

          set({
            completedModules: newCompleted,
            rewardedModuleIds: newRewarded,
            userStatsByUserId: updatedStats,
          });
          if (!alreadyRewarded) {
            get().addXP(20, 'Menyelesaikan Cheat Sheet Modul');
            get().syncWeeklyStatsToSupabase();
          }
        }
      },

      // Action: Toggle module cheat sheet as read/unread (XP awarded strictly ONCE per module)
      toggleModuleCompleted: (moduleId) => {
        const state = get();
        const readList = state.completedModules || [];
        const rewardedList = state.rewardedModuleIds || [];
        const isRead = readList.includes(moduleId);
        const userId = state.userId;

        if (isRead) {
          // Unmark: remove from completedModules, but KEEP in rewardedModuleIds to prevent XP farming!
          const newCompleted = readList.filter((id) => id !== moduleId);
          const updatedStats = userId
            ? {
                ...(state.userStatsByUserId || {}),
                [userId]: {
                  ...((state.userStatsByUserId || {})[userId] || snapshotActiveStats(state)),
                  completedModules: newCompleted,
                },
              }
            : state.userStatsByUserId;

          set({
            completedModules: newCompleted,
            userStatsByUserId: updatedStats,
          });
          return { completed: false, xpAwarded: 0 };
        } else {
          // Mark: add to completedModules, award XP ONLY if never rewarded before
          const alreadyRewarded = rewardedList.includes(moduleId);
          const newCompleted = [...readList, moduleId];
          const newRewarded = alreadyRewarded ? rewardedList : [...rewardedList, moduleId];
          const updatedStats = userId
            ? {
                ...(state.userStatsByUserId || {}),
                [userId]: {
                  ...((state.userStatsByUserId || {})[userId] || snapshotActiveStats(state)),
                  completedModules: newCompleted,
                  rewardedModuleIds: newRewarded,
                },
              }
            : state.userStatsByUserId;

          set({
            completedModules: newCompleted,
            rewardedModuleIds: newRewarded,
            userStatsByUserId: updatedStats,
          });
          if (!alreadyRewarded) {
            get().addXP(20, 'Menyelesaikan Cheat Sheet Modul');
            get().syncWeeklyStatsToSupabase();
            return { completed: true, xpAwarded: 20 };
          }
          return { completed: true, xpAwarded: 0 };
        }
      },

      // Action: Complete Level Exit Exam & Level Up
      completeLevelExam: (levelCode, score, totalQuestions) => {
        const state = get();
        const passedList = state.passedExams || [];
        const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const currentIdx = CEFR_ORDER.indexOf(levelCode);
        const nextLevel =
          currentIdx !== -1 && currentIdx < CEFR_ORDER.length - 1
            ? CEFR_ORDER[currentIdx + 1]
            : levelCode;

        const updatedPassed = passedList.includes(levelCode) ? passedList : [...passedList, levelCode];
        const updatedUser = state.user ? { ...state.user, cefrLevel: nextLevel } : state.user;
        const userId = state.userId;

        const updatedStats = userId
          ? {
              ...(state.userStatsByUserId || {}),
              [userId]: {
                ...((state.userStatsByUserId || {})[userId] || snapshotActiveStats(state)),
                cefrLevel: nextLevel,
                passedExams: updatedPassed,
              },
            }
          : state.userStatsByUserId;

        set({
          cefrLevel: nextLevel,
          passedExams: updatedPassed,
          user: updatedUser,
          userStatsByUserId: updatedStats,
          dashboardSelectedLevel: nextLevel,
          syncNotification: `Selamat! Kamu resmi lulus Ujian ${levelCode} dan naik ke Level ${nextLevel}! 🎉`,
        });

        get().addXP(150, `Lulus Ujian Kelulusan Level ${levelCode} (${score}/${totalQuestions})`);
        get().syncWeeklyStatsToSupabase();

        return { success: true, nextLevel };
      },

      // Action: Compute live weekly leaderboard from Supabase with user position
      fetchLeaderboard: async () => {
        const { isOnline, isSupabaseReady, user, userId, weeklyXp, streak, userProgress } = get();
        const currentWeek = getCurrentWeekId();

        let remoteData = [];

        if (isOnline && isSupabaseReady) {
          try {
            const { data, error } = await supabase
              .from('user_weekly_stats')
              .select('*')
              .eq('year_week', currentWeek)
              .order('weekly_xp', { ascending: false });

            if (!error && data && data.length > 0) {
              remoteData = data;

              // Enrich contestants whose avatar_url is missing with avatars from profiles
              try {
                const { data: profRows } = await supabase
                  .from('profiles')
                  .select('id, username, avatar_url');

                if (profRows && profRows.length > 0) {
                  const avatarMap = new Map();
                  profRows.forEach((p) => {
                    if (p.avatar_url) {
                      if (p.id) avatarMap.set(p.id, p.avatar_url);
                      if (p.username) avatarMap.set(p.username.toLowerCase(), p.avatar_url);
                    }
                  });

                  remoteData = remoteData.map((row) => ({
                    ...row,
                    avatar_url: row.avatar_url || avatarMap.get(row.user_id) || avatarMap.get(row.username?.toLowerCase()) || null,
                  }));
                }
              } catch (_) {}
            }
          } catch (err) {
            console.warn('Could not fetch remote leaderboard, using local store:', err.message);
          }
        }

        const cardsReviewed = Object.values(userProgress || {}).filter(
          (p) => p && p.last_reviewed_at
        ).length;

        const currentUserEntry = {
          id: userId,
          user_id: userId,
          name: user?.name ? `${user.name} (Kamu)` : 'Kamu',
          avatar: user?.avatarUrl || '🌟',
          avatarUrl: user?.avatarUrl || null,
          isCurrentUser: true,
          streak: streak || 1,
          weeklyXp: weeklyXp || 0,
          cardsReviewed,
        };

        let combined = [];

        if (remoteData.length > 0) {
          const userIdx = remoteData.findIndex(
            (u) =>
              u.user_id === userId ||
              (user?.username && u.username?.toLowerCase() === user.username.toLowerCase())
          );
          if (userIdx >= 0) {
            remoteData[userIdx] = {
              ...remoteData[userIdx],
              ...currentUserEntry,
              weeklyXp: Math.max(remoteData[userIdx].weekly_xp || 0, weeklyXp || 0),
            };
            combined = remoteData;
          } else {
            combined = [...remoteData, currentUserEntry];
          }
        } else {
          // If no one in DB yet, show current user alongside peer contestants
          combined = [...PEER_CONTESTANTS, currentUserEntry];
        }

        // Sort descending by XP
        combined.sort((a, b) => {
          const xpA = a.weeklyXp !== undefined ? a.weeklyXp : (a.weekly_xp || 0);
          const xpB = b.weeklyXp !== undefined ? b.weeklyXp : (b.weekly_xp || 0);
          return xpB - xpA;
        });

        return combined.map((item, index) => {
          const xpValue = item.weeklyXp !== undefined ? item.weeklyXp : (item.weekly_xp || 0);
          const isUser = Boolean(
            item.isCurrentUser ||
            item.user_id === userId ||
            (user?.username && item.username?.toLowerCase() === user.username.toLowerCase())
          );
          const avatarUrl = isUser ? (user?.avatarUrl || null) : (item.avatar_url || item.avatarUrl || null);
          return {
            id: item.id || item.user_id,
            name: isUser ? (user?.name ? `${user.name} (Kamu)` : 'Kamu') : (item.name || item.username),
            avatar: isUser ? (user?.avatarUrl || '🌟') : (item.avatar || '👤'),
            avatarUrl: avatarUrl,
            streak: item.streak || 1,
            cardsReviewed: item.cardsReviewed || item.cards_reviewed || 0,
            weeklyXp: xpValue,
            isCurrentUser: isUser,
            rank: index + 1,
            tier: getTierFromXP(xpValue),
          };
        });
      },

      // Action: Submit Flashcard Rating with SM-2 Spaced Repetition calculation
      submitProgress: async (flashcardId, rating) => {
        const { userId, userProgress, isOnline, isSupabaseReady, streak, lastStudyDate, userProgressByUserId } = get();
        const currentProgress = userProgress[flashcardId] || {};

        // 1. Calculate new spaced repetition values
        const newSRS = calculateSRS(currentProgress, rating);

        const updatedProgressRecord = {
          ...currentProgress,
          ...newSRS,
          flashcard_id: flashcardId,
          last_reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // 2. Award XP based on recall rating
        const xpEarned = rating === 'Easy' ? 15 : rating === 'Good' ? 10 : 5;
        get().addXP(xpEarned, `Latihan Kartu (${rating})`);

        // 3. Update Daily Streak with accurate calendar date calculation
        const { streak: newStreak, lastStudyDate: newLastStudyDate } = calculateDailyStreak(
          streak,
          lastStudyDate
        );

        // 4. Optimistic update to isolated local user store
        const updatedProgMap = {
          ...userProgress,
          [flashcardId]: updatedProgressRecord,
        };

        const updatedByUserId = {
          ...(userProgressByUserId || {}),
          [userId]: updatedProgMap,
        };

        const updatedStats = userId
          ? {
              ...(get().userStatsByUserId || {}),
              [userId]: {
                ...((get().userStatsByUserId || {})[userId] || snapshotActiveStats(get())),
                streak: newStreak,
                lastStudyDate: newLastStudyDate,
              },
            }
          : get().userStatsByUserId;

        set({
          streak: newStreak,
          lastStudyDate: newLastStudyDate,
          userStatsByUserId: updatedStats,
          userProgress: updatedProgMap,
          userProgressByUserId: updatedByUserId,
        });

        const payloadForSupabase = {
          user_id: userId,
          flashcard_id: flashcardId,
          status: newSRS.status,
          next_review_date: newSRS.next_review_date,
          updated_at: updatedProgressRecord.updated_at,
        };

        // 5. Sync to Supabase or enqueue for offline sync
        if (isOnline && isSupabaseReady) {
          try {
            const { error } = await supabase
              .from('user_progress')
              .upsert(payloadForSupabase, { onConflict: 'user_id,flashcard_id' });

            if (error) throw error;
            return { success: true, synced: true };
          } catch (err) {
            console.warn('Supabase upsert failed, adding to offline queue:', err.message);
            set((state) => ({
              offlineQueue: [...state.offlineQueue, payloadForSupabase],
            }));
            return { success: true, queued: true };
          }
        } else {
          // Offline mode: queue for later synchronization
          set((state) => ({
            offlineQueue: [...state.offlineQueue, payloadForSupabase],
          }));
          return { success: true, queued: true };
        }
      },

      // Action: Flush and sync pending offline items to Supabase
      syncOfflineQueue: async () => {
        const { offlineQueue, isOnline, isSupabaseReady } = get();

        if (!isOnline || !isSupabaseReady || offlineQueue.length === 0) {
          return { syncedCount: 0 };
        }

        set({ syncStatus: 'syncing' });

        try {
          const { error } = await supabase
            .from('user_progress')
            .upsert(offlineQueue, { onConflict: 'user_id,flashcard_id' });

          if (error) throw error;

          const syncedCount = offlineQueue.length;
          set({
            offlineQueue: [],
            syncStatus: 'synced',
            syncNotification: `Berhasil menyinkronkan ${syncedCount} progres kartu ke cloud!`,
          });

          setTimeout(() => {
            set({ syncStatus: 'idle' });
          }, 4000);

          return { syncedCount, error: null };
        } catch (err) {
          console.error('Failed to flush offline queue:', err);
          set({ syncStatus: 'error' });
          return { syncedCount: 0, error: err };
        }
      },

      // Action: Compute live metrics with genuine fresh-user logic (Fix Step 2 Bug)
      getMetrics: () => {
        const { flashcards, userProgress } = get();
        const now = new Date();

        let newCardsCount = 0;
        let learningCount = 0;
        let reviewCount = 0;
        let masteredCount = 0;
        let dueCount = 0;

        flashcards.forEach((card) => {
          const prog = userProgress ? userProgress[card.id] : null;

          // Check if card has ever been reviewed
          if (!prog || !prog.last_reviewed_at) {
            newCardsCount++;
          } else {
            if (prog.status === 'Mastered') {
              masteredCount++;
            } else if (prog.status === 'Review') {
              reviewCount++;
            } else {
              learningCount++;
            }

            // Only cards that have actually been studied and reached review date are "Due"
            if (prog.next_review_date && new Date(prog.next_review_date) <= now) {
              dueCount++;
            }
          }
        });

        return {
          totalCards: flashcards.length,
          newCardsCount,
          learningCount,
          reviewCount,
          masteredCount,
          dueCount, // 0 for brand new user!
        };
      },

      // Action: Create and save a custom module with its paired flashcards
      createCustomModule: async ({ moduleData, flashcardsData = [] }) => {
        const { isOnline, isSupabaseReady, user } = get();
        const currentUserId = user?.id || null;

        const moduleId = moduleData.id || `mod-custom-${Date.now()}`;
        const newModule = {
          id: moduleId,
          category: moduleData.category || 'Vocab',
          title: moduleData.title.trim(),
          content_markdown: moduleData.content_markdown.trim(),
          user_id: currentUserId,
          is_custom: true,
          created_at: new Date().toISOString(),
        };

        const newFlashcards = flashcardsData.map((c, idx) => ({
          id: c.id || `card-custom-${Date.now()}-${idx}`,
          module_id: moduleId,
          front_text: c.front_text.trim(),
          back_text: c.back_text.trim(),
          example_sentence: (c.example_sentence || '').trim(),
          user_id: currentUserId,
          is_custom: true,
          created_at: new Date().toISOString(),
        }));

        set((state) => ({
          modules: [newModule, ...state.modules],
          flashcards: [...state.flashcards, ...newFlashcards],
          syncNotification: `Modul "${newModule.title}" & ${newFlashcards.length} kartu berhasil ditambahkan!`,
        }));

        if (isOnline && isSupabaseReady) {
          try {
            const { error: modError } = await supabase.from('modules').insert([newModule]);
            if (modError) {
              console.warn('Supabase sync module notice (retained locally):', modError.message);
            }
            if (newFlashcards.length > 0) {
              const { error: cardError } = await supabase.from('flashcards').insert(newFlashcards);
              if (cardError) {
                console.warn('Supabase sync flashcards notice (retained locally):', cardError.message);
              }
            }
          } catch (err) {
            console.warn('Supabase sync for new module failed (cached locally):', err.message);
          }
        }

        return { moduleId, success: true };
      },

      // Action: Add single flashcard directly (used by Reading page & custom card creation - Fix BUG-01)
      addFlashcard: async (card) => {
        const { isOnline, isSupabaseReady, user } = get();
        const currentUserId = user?.id || null;

        const newCard = {
          id: card.id || `card-user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          module_id: card.module_id || 'mod-starter-conversation',
          front_text: (card.front_text || '').trim(),
          back_text: (card.back_text || '').trim(),
          example_sentence: (card.example_sentence || '').trim(),
          source: card.source || 'Bacaan',
          user_id: currentUserId,
          is_custom: true,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          flashcards: [newCard, ...(state.flashcards || [])],
          syncNotification: `Kosakata "${newCard.front_text.slice(0, 25)}..." berhasil disimpan ke kartu latihan! 🗂️`,
        }));

        if (isOnline && isSupabaseReady) {
          try {
            const { error: cardError } = await supabase.from('flashcards').insert([newCard]);
            if (cardError) {
              console.warn('Supabase sync single card notice (retained locally):', cardError.message);
            }
          } catch (err) {
            console.warn('Supabase sync for single flashcard notice (cached locally):', err.message);
          }
        }

        return { success: true, card: newCard };
      },

      // Reset progress to clean slate (pure zero)
      resetUserProgress: () => {
        const { userId, userProgressByUserId, userStatsByUserId } = get();
        const updatedByUserId = { ...(userProgressByUserId || {}) };
        const updatedStatsByUserId = { ...(userStatsByUserId || {}) };
        if (userId) {
          updatedByUserId[userId] = {};
          updatedStatsByUserId[userId] = {
            cefrLevel: 'A1',
            passedExams: [],
            completedModules: [],
            rewardedModuleIds: [],
            streak: 1,
            lastStudyDate: null,
            xp: 0,
            weeklyXp: 0,
          };
        }
        set({
          userProgress: {},
          userProgressByUserId: updatedByUserId,
          userStatsByUserId: updatedStatsByUserId,
          offlineQueue: [],
          xp: 0,
          weeklyXp: 0,
          streak: 0,
          lastStudyDate: null,
          cefrLevel: 'A1',
          passedExams: [],
          completedModules: [],
          rewardedModuleIds: [],
        });
      },
    }),
    {
      name: 'personal_langua_storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        userId: state.userId,
        // Secure accounts storing ONLY salt + passwordHash - NEVER plaintext passwords
        accounts: state.accounts,
        userProgressByUserId: state.userProgressByUserId,
        userStatsByUserId: state.userStatsByUserId,
        userProgress: state.userProgress,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        xp: state.xp,
        weeklyXp: state.weeklyXp,
        lastWeekId: state.lastWeekId,
        completedModules: state.completedModules,
        rewardedModuleIds: state.rewardedModuleIds,
        cefrLevel: state.cefrLevel,
        passedExams: state.passedExams,
        modules: state.modules,
        flashcards: state.flashcards,
        offlineQueue: state.offlineQueue,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Verify active user's stats partition on reload/rehydrate
        const isSpecialAdmin =
          state.userId === 'admin-imam-001' ||
          (state.user?.username || '').toLowerCase() === 'kyuut' ||
          (state.user?.username || '').toLowerCase() === 'imam';

        if (state.userId && state.userStatsByUserId) {
          const activeUserStats = state.userStatsByUserId[state.userId];
          if (activeUserStats) {
            state.cefrLevel = isSpecialAdmin ? 'A2' : (activeUserStats.cefrLevel || 'A1');
            state.passedExams = isSpecialAdmin
              ? Array.from(new Set([...(activeUserStats.passedExams || []), 'A1']))
              : (activeUserStats.passedExams || []);
            state.completedModules = activeUserStats.completedModules || (isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : []);
            state.rewardedModuleIds = activeUserStats.rewardedModuleIds || (isSpecialAdmin ? ['mod-starter-svo', 'mod-starter-tenses'] : []);
            state.xp = Math.max(activeUserStats.xp || 0, isSpecialAdmin ? 1130 : 0);
            state.weeklyXp = Math.max(activeUserStats.weeklyXp || 0, isSpecialAdmin ? 1130 : 0);
            state.lastStudyDate = activeUserStats.lastStudyDate || null;

            // Check if streak was broken due to inactivity (>1 day missed)
            const todayStr = new Date().toISOString().split('T')[0];
            let effectiveStreak = activeUserStats.streak !== undefined ? activeUserStats.streak : (isSpecialAdmin ? 3 : 0);
            if (activeUserStats.lastStudyDate && activeUserStats.lastStudyDate !== todayStr) {
              const todayDate = new Date(todayStr + 'T00:00:00Z');
              const lastDate = new Date(activeUserStats.lastStudyDate + 'T00:00:00Z');
              const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
              if (diffDays > 1) {
                effectiveStreak = isSpecialAdmin ? 3 : 0;
              }
            }
            state.streak = effectiveStreak;
          }
        }

        // Canonical protection for admin user profile & level
        if (isSpecialAdmin) {
          state.cefrLevel = 'A2';
          state.dashboardSelectedLevel = 'A2';
          if (!state.passedExams || !state.passedExams.includes('A1')) {
            state.passedExams = Array.from(new Set([...(state.passedExams || []), 'A1']));
          }
          if (state.user) {
            state.user.cefrLevel = 'A2';
            if (!state.user.avatarUrl || state.user.avatarUrl.length > 10000) {
              state.user.avatarUrl = ADMIN_AVATAR_REAL;
            }
          }
        }

        if (state.accounts) {
          // Migration safeguard: remove any legacy plaintext password in localStorage
          Object.keys(state.accounts).forEach(async (key) => {
            const acc = state.accounts[key];
            if (acc && acc.password) {
              const salt = generateSalt();
              const hash = await hashPassword(acc.password, salt);
              acc.salt = salt;
              acc.passwordHash = hash;
              delete acc.password;
            }
          });
        }

        // Fetch fresh stats from cloud on startup if user is logged in
        if (state.userId && state.user && typeof state.fetchUserStatsFromSupabase === 'function') {
          setTimeout(() => {
            state.fetchUserStatsFromSupabase(state.userId, state.user.username);
          }, 300);
        }
      },
    }
  )
);
