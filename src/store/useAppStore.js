import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { MOCK_MODULES, MOCK_FLASHCARDS } from '../services/mockData';
import { calculateSRS } from '../utils/srsAlgorithm';
import { getCurrentWeekId, getTierFromXP, PEER_CONTESTANTS } from '../utils/rankSystem';

// Helper to generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Authentication State
      isAuthenticated: false,
      user: null, // { username: 'imam', name: 'Imam' }
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
      userProgress: {}, // { [flashcardId]: { repetitions, easeFactor, interval, status, next_review_date, last_reviewed_at } }
      offlineQueue: [], // [ { user_id, flashcard_id, status, next_review_date, updated_at } ]

      // Action: Authentication Login (Supports Admin Imam & Multi-User Friends)
      login: (username, password) => {
        const cleanUser = (username || '').trim();
        const cleanPass = (password || '').trim();

        if (!cleanUser) {
          return { success: false, error: 'Silakan masukkan nama atau username Anda!' };
        }

        // 1. Akun Khusus Pemilik (Imam)
        if (cleanUser.toLowerCase() === 'imam') {
          if (cleanPass === 'imam123@') {
            set({
              isAuthenticated: true,
              user: { username: 'imam', name: 'Imam', role: 'admin' },
              syncNotification: 'Selamat datang kembali, Imam!',
            });
            return { success: true };
          }
          return {
            success: false,
            error: 'Password untuk akun imam salah! (Gunakan: imam123@)',
          };
        }

        // 2. Akses Otomatis untuk Teman (Nama Sendiri)
        if (cleanUser.length >= 2) {
          const capitalized = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
          set({
            isAuthenticated: true,
            user: { username: cleanUser.toLowerCase(), name: capitalized, role: 'member' },
            syncNotification: `Selamat datang di MyLala, ${capitalized}!`,
          });
          return { success: true };
        }

        return {
          success: false,
          error: 'Nama pengguna minimal 2 karakter!',
        };
      },

      // Action: Logout
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
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
            const { data: remoteProgress } = await supabase
              .from('user_progress')
              .select('*')
              .eq('user_id', userId);

            if (remoteProgress && remoteProgress.length > 0) {
              set((state) => {
                const merged = { ...state.userProgress };
                remoteProgress.forEach((p) => {
                  merged[p.flashcard_id] = {
                    ...merged[p.flashcard_id],
                    status: p.status,
                    next_review_date: p.next_review_date,
                    updated_at: p.updated_at,
                    last_reviewed_at: p.updated_at,
                  };
                });
                return { userProgress: merged };
              });
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
        const activeProgress = get().userProgress;
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
        if (!isOnline || !isSupabaseReady) return;

        const currentWeek = getCurrentWeekId();
        const cardsReviewed = Object.values(userProgress || {}).filter(
          (p) => p && p.last_reviewed_at
        ).length;

        const payload = {
          user_id: userId,
          username: (user?.username || 'user').toLowerCase(),
          name: user?.name || 'Imam',
          year_week: currentWeek,
          weekly_xp: weeklyXp || 0,
          cards_reviewed: cardsReviewed,
          streak: streak || 1,
          updated_at: new Date().toISOString(),
        };

        try {
          await supabase
            .from('user_weekly_stats')
            .upsert(payload, { onConflict: 'user_id,year_week' });
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
          avatar: '🌟',
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
          // If no one in DB yet, show current user alongside starter active peer benchmarks
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
          return {
            id: item.id || item.user_id,
            name: isUser ? (user?.name ? `${user.name} (Kamu)` : 'Kamu') : (item.name || item.username),
            avatar: isUser ? '🌟' : (item.avatar || '👤'),
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
        const { userId, userProgress, isOnline, isSupabaseReady, streak, lastStudyDate } = get();
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

        // 4. Optimistic update to local store
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            [flashcardId]: updatedProgressRecord,
          },
        }));

        const payloadForSupabase = {
          user_id: userId,
          flashcard_id: flashcardId,
          status: newSRS.status,
          next_review_date: newSRS.next_review_date,
          updated_at: updatedProgressRecord.updated_at,
        };

        // 3. Sync to Supabase or enqueue for offline sync
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

      // Action: Compute live metrics with genuine fresh-user logic
      getMetrics: () => {
        const { flashcards, userProgress } = get();
        const now = new Date();

        let newCardsCount = 0;
        let learningCount = 0;
        let reviewCount = 0;
        let masteredCount = 0;
        let dueCount = 0;

        flashcards.forEach((card) => {
          const prog = userProgress[card.id];

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

      // Reset progress to clean slate
      resetUserProgress: () => {
        set({ userProgress: {}, offlineQueue: [] });
      },
    }),
    {
      name: 'personal_langua_storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        userId: state.userId,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        xp: state.xp,
        weeklyXp: state.weeklyXp,
        lastWeekId: state.lastWeekId,
        completedModules: state.completedModules,
        modules: state.modules,
        flashcards: state.flashcards,
        userProgress: state.userProgress,
        offlineQueue: state.offlineQueue,
      }),
    }
  )
);
