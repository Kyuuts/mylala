import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { MOCK_MODULES, MOCK_FLASHCARDS } from '../services/mockData';
import { calculateSRS } from '../utils/srsAlgorithm';
import { getCurrentWeekId, getTierFromXP, PEER_CONTESTANTS } from '../utils/rankSystem';
import { generateSalt, hashPassword, verifyPassword } from '../utils/cryptoAuth';

// Helper to generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Cryptographically hashed credentials for admin (no plaintext password in source code or storage)
const ADMIN_SALT = 'mylala_admin_salt_2026';
const ADMIN_HASH = 'd03e6af7680f447830431fc0eff5a9be99d23c9d7c330e8941e748786f6f1369';

const INITIAL_ACCOUNTS = {
  imam: {
    id: 'admin-imam-001',
    username: 'imam',
    email: 'imam@mylala.app',
    name: 'Imam',
    role: 'admin',
    salt: ADMIN_SALT,
    passwordHash: ADMIN_HASH,
    createdAt: '2026-11-01T00:00:00.000Z',
  },
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Authentication State
      isAuthenticated: false,
      user: null, // { id, username, email, name, role }
      userId: generateUUID(),

      // Gamification & Ranked State
      streak: 1,
      lastStudyDate: null, // 'YYYY-MM-DD'
      xp: 0,
      weeklyXp: 0,
      lastWeekId: getCurrentWeekId(),
      completedModules: [], // array of read module IDs

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

        if (accounts[cleanUser]) {
          return { success: false, error: 'Username sudah terdaftar! Silakan login di tab Masuk.' };
        }
        const emailExists = Object.values(accounts).some((acc) => acc.email === cleanEmail);
        if (emailExists) {
          return { success: false, error: 'Email sudah terdaftar! Silakan gunakan email lain atau masuk.' };
        }

        let supabaseUserId = null;
        const { isOnline, isSupabaseReady } = state;

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
        if (prevUserId) {
          updatedProgressByUserId[prevUserId] = state.userProgress || {};
        }
        updatedProgressByUserId[assignedUserId] = {}; // Brand new clean slate!

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
          },
          userId: assignedUserId,
          userProgress: {}, // 0 cards reviewed, 100% clean
          userProgressByUserId: updatedProgressByUserId,
          xp: 0,
          weeklyXp: 0,
          streak: 1,
          completedModules: [],
          syncNotification: `Akun "${cleanUser}" berhasil dibuat! Selamat belajar, ${cleanName}.`,
        });

        // 4. Sync initial zero weekly stats to Supabase for the new member
        get().syncWeeklyStatsToSupabase();

        return { success: true };
      },

      // Action: Authentication Login with Supabase Auth & Secure Salted Hash Verification
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

        // 1. Try Supabase Auth if online and identifier is an email (or linked to email)
        let targetEmail = cleanId.includes('@') ? cleanId : null;
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
              const userName = supUser.user_metadata?.name || cleanId;
              const userUsername = supUser.user_metadata?.username || cleanId.split('@')[0];

              // Isolate user progress: store previous user's progress
              const prevUserId = state.userId;
              const updatedProgressByUserId = { ...(state.userProgressByUserId || {}) };
              if (prevUserId) {
                updatedProgressByUserId[prevUserId] = state.userProgress || {};
              }

              const userSavedProg = updatedProgressByUserId[supUserId] || {};

              set({
                isAuthenticated: true,
                user: {
                  id: supUserId,
                  username: userUsername,
                  email: supUser.email,
                  name: userName,
                  role: 'member',
                },
                userId: supUserId,
                userProgress: userSavedProg,
                userProgressByUserId: updatedProgressByUserId,
                syncNotification: `Selamat datang kembali, ${userName}!`,
              });

              // Pull user's latest cloud progress & stats
              get().fetchUserProgressFromSupabase(supUserId);
              get().syncWeeklyStatsToSupabase();

              return { success: true };
            }
          } catch (err) {
            console.warn('Supabase signInWithPassword note:', err.message);
          }
        }

        // 2. Offline / Local Cryptographic Hash Verification
        const existing =
          accounts[cleanId] ||
          Object.values(accounts).find(
            (a) => a.username?.toLowerCase() === cleanId || a.email?.toLowerCase() === cleanId
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
            // Isolate user progress
            const prevUserId = state.userId;
            const updatedProgressByUserId = { ...(state.userProgressByUserId || {}) };
            if (prevUserId) {
              updatedProgressByUserId[prevUserId] = state.userProgress || {};
            }

            const userSavedProg = updatedProgressByUserId[existing.id] || {};

            set({
              isAuthenticated: true,
              user: {
                id: existing.id,
                username: existing.username,
                email: existing.email,
                name: existing.name,
                role: existing.role || 'member',
              },
              userId: existing.id,
              userProgress: userSavedProg,
              userProgressByUserId: updatedProgressByUserId,
              syncNotification: `Selamat datang kembali, ${existing.name}!`,
            });

            if (isOnline && isSupabaseReady) {
              get().fetchUserProgressFromSupabase(existing.id);
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
          error: 'Akun belum terdaftar! Silakan buat akun baru di tab "Daftar Akun Baru".',
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

        const updatedByUserId = { ...(userProgressByUserId || {}) };
        if (userId) {
          updatedByUserId[userId] = userProgress || {};
        }

        set({
          isAuthenticated: false,
          user: null,
          userProgress: {},
          userProgressByUserId: updatedByUserId,
          syncNotification: null,
        });
      },

      // Action: Network connectivity change
      setOnline: async (isOnline) => {
        set({ isOnline });
        if (isOnline) {
          await get().syncOfflineQueue();
        }
      },

      dismissNotification: () => {
        set({ syncNotification: null });
      },

      // Action: Set CEFR placement test result
      setUserCefrLevel: (levelCode) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, cefrLevel: levelCode };
          set({ user: updatedUser });
        }
        get().addXP(50, `Menyelesaikan Language Scanner (${levelCode})`);
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
        if (cleanUsername !== oldUsername && updatedAccounts[oldUsername]) {
          const prevAccount = updatedAccounts[oldUsername];
          delete updatedAccounts[oldUsername];
          updatedAccounts[cleanUsername] = {
            ...prevAccount,
            name: cleanName,
            username: cleanUsername,
            avatarUrl: newAvatarUrl,
          };
        } else if (updatedAccounts[cleanUsername]) {
          updatedAccounts[cleanUsername] = {
            ...updatedAccounts[cleanUsername],
            name: cleanName,
            username: cleanUsername,
            avatarUrl: newAvatarUrl,
          };
        }

        set({
          user: updatedUser,
          accounts: updatedAccounts,
          syncNotification: 'Profil dan foto berhasil diperbarui!',
        });

        // Sync metadata to Supabase Auth if online
        if (isOnline && isSupabaseReady) {
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

        // Sync updated avatar and name to Leaderboard
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
          const moduleMap = new Map(MOCK_MODULES.map((m) => [m.id, m]));
          state.modules.forEach((m) => moduleMap.set(m.id, m));
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

      // Action: Fetch flashcards and enrich with user progress
      fetchFlashcards: async (moduleId = 'all') => {
        const { isOnline, isSupabaseReady, userId } = get();

        // Ensure newly added master curriculum flashcards are merged into state
        set((state) => {
          const cardMap = new Map(MOCK_FLASHCARDS.map((c) => [c.id, c]));
          state.flashcards.forEach((c) => cardMap.set(c.id, c));
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

          return {
            xp: newTotal,
            weeklyXp: newWeekly,
            lastWeekId: currentWeek,
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

        const payload = {
          user_id: userId,
          username: (user?.username || 'user').toLowerCase(),
          name: user?.name || 'Pembelajar MyLala',
          avatar_url: user?.avatarUrl || null,
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
      },

      // Action: Mark module cheat sheet as read (rewards +20 XP once per module)
      markModuleRead: (moduleId) => {
        const state = get();
        const readList = state.completedModules || [];
        if (!readList.includes(moduleId)) {
          set({
            completedModules: [...readList, moduleId],
          });
          get().addXP(20, 'Menyelesaikan Cheat Sheet Modul');
        }
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
          const userIdx = remoteData.findIndex((u) => u.user_id === userId);
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
          const isUser = Boolean(item.isCurrentUser || item.user_id === userId);
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

        // 3. Update Daily Streak
        const todayStr = new Date().toISOString().split('T')[0];
        if (lastStudyDate !== todayStr) {
          set({
            streak: (streak || 0) + 1,
            lastStudyDate: todayStr,
          });
        }

        // 4. Optimistic update to isolated local user store
        const updatedProgMap = {
          ...userProgress,
          [flashcardId]: updatedProgressRecord,
        };

        const updatedByUserId = {
          ...(userProgressByUserId || {}),
          [userId]: updatedProgMap,
        };

        set({
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
        const { isOnline, isSupabaseReady } = get();

        const moduleId = moduleData.id || `mod-custom-${Date.now()}`;
        const newModule = {
          id: moduleId,
          category: moduleData.category || 'Vocab',
          title: moduleData.title.trim(),
          content_markdown: moduleData.content_markdown.trim(),
          created_at: new Date().toISOString(),
        };

        const newFlashcards = flashcardsData.map((c, idx) => ({
          id: c.id || `card-custom-${Date.now()}-${idx}`,
          module_id: moduleId,
          front_text: c.front_text.trim(),
          back_text: c.back_text.trim(),
          example_sentence: (c.example_sentence || '').trim(),
          created_at: new Date().toISOString(),
        }));

        set((state) => ({
          modules: [newModule, ...state.modules],
          flashcards: [...state.flashcards, ...newFlashcards],
          syncNotification: `Modul "${newModule.title}" & ${newFlashcards.length} kartu berhasil ditambahkan!`,
        }));

        if (isOnline && isSupabaseReady) {
          try {
            await supabase.from('modules').insert([newModule]);
            if (newFlashcards.length > 0) {
              await supabase.from('flashcards').insert(newFlashcards);
            }
          } catch (err) {
            console.warn('Supabase sync for new module failed (cached locally):', err.message);
          }
        }

        return { moduleId, success: true };
      },

      // Reset progress to clean slate (pure zero)
      resetUserProgress: () => {
        const { userId, userProgressByUserId } = get();
        const updatedByUserId = { ...(userProgressByUserId || {}) };
        if (userId) {
          updatedByUserId[userId] = {};
        }
        set({
          userProgress: {},
          userProgressByUserId: updatedByUserId,
          offlineQueue: [],
          xp: 0,
          weeklyXp: 0,
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
        userProgress: state.userProgress,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        xp: state.xp,
        weeklyXp: state.weeklyXp,
        lastWeekId: state.lastWeekId,
        completedModules: state.completedModules,
        modules: state.modules,
        flashcards: state.flashcards,
        offlineQueue: state.offlineQueue,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.accounts) {
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
      },
    }
  )
);
