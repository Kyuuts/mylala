import { supabase, isSupabaseConfigured } from './supabase';
import { storageService, getOrCreateUserId } from './storageService';
import { MOCK_FLASHCARDS } from './mockData';
import { calculateNextReview } from '../utils/srsAlgorithm';

export const flashcardService = {
  /**
   * Fetch flashcards for a specific module or all modules
   */
  async getFlashcards(moduleId = null, userId = null) {
    let cards = [];

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        let query = supabase
          .from('flashcards')
          .select('id, module_id, front_text, back_text, example_sentence, created_at')
          .order('created_at', { ascending: true });

        if (moduleId && moduleId !== 'all') {
          query = query.eq('module_id', moduleId);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (data && data.length > 0) {
          cards = data;
          storageService.setFlashcards(cards);
        }
      } catch (err) {
        console.warn('Supabase getFlashcards failed, falling back to cache:', err.message);
      }
    }

    if (cards.length === 0) {
      const cached = storageService.getFlashcards();
      cards = cached && cached.length > 0 ? cached : MOCK_FLASHCARDS;

      if (moduleId && moduleId !== 'all') {
        cards = cards.filter((c) => c.module_id === moduleId);
      }
    }

    // Attach user progress (status, next_review_date) from isolated user cache / Supabase
    const progressMap = await this.getUserProgressMap(userId);
    const enrichedCards = cards.map((card) => {
      const progress = progressMap[card.id] || {
        status: 'Learning',
        next_review_date: new Date().toISOString(),
      };
      return {
        ...card,
        status: progress.status,
        next_review_date: progress.next_review_date,
      };
    });

    return { data: enrichedCards, error: null };
  },

  /**
   * Get user progress map as a dictionary { [flashcard_id]: { status, next_review_date } }
   */
  async getUserProgressMap(userId = null) {
    const activeUserId = userId || getOrCreateUserId();
    const localProgress = storageService.getProgress(activeUserId);

    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('flashcard_id, status, next_review_date, updated_at')
          .eq('user_id', activeUserId);

        if (!error && data) {
          const supabaseMap = {};
          data.forEach((p) => {
            supabaseMap[p.flashcard_id] = {
              status: p.status,
              next_review_date: p.next_review_date,
            };
            // Sync to local user cache
            storageService.saveProgress(p.flashcard_id, p, activeUserId);
          });
          return { ...localProgress, ...supabaseMap };
        }
      } catch (err) {
        console.warn('Could not fetch user_progress from Supabase:', err.message);
      }
    }

    return localProgress;
  },

  /**
   * Submit flashcard review outcome ('Hard', 'Good', 'Easy')
   * Uses Spaced Repetition Algorithm to update next_review_date and status
   */
  async submitProgress({ flashcardId, rating, currentStatus, userId = null }) {
    if (!flashcardId || !rating) {
      return { data: null, error: new Error('flashcardId and rating are required') };
    }

    const activeUserId = userId || getOrCreateUserId();
    const { status: newStatus, next_review_date } = calculateNextReview(currentStatus, rating);

    const progressRecord = {
      user_id: activeUserId,
      flashcard_id: flashcardId,
      status: newStatus,
      next_review_date,
      updated_at: new Date().toISOString(),
    };

    // 1. Immediately persist in local storage (instant optimistic UI & offline safety)
    storageService.saveProgress(flashcardId, progressRecord, activeUserId);

    // 2. Sync to Supabase if available and online
    if (isSupabaseConfigured() && navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .upsert(progressRecord, { onConflict: 'user_id,flashcard_id' })
          .select()
          .single();

        if (error) throw error;
        return { data: progressRecord, error: null, synced: true };
      } catch (err) {
        console.warn('Supabase upsert failed, queueing for background offline sync:', err.message);
        storageService.enqueue(progressRecord);
        return { data: progressRecord, error: null, synced: false, queued: true };
      }
    } else {
      // Enqueue to offline sync queue
      storageService.enqueue(progressRecord);
      return { data: progressRecord, error: null, synced: false, queued: true };
    }
  },

  /**
   * Sync pending offline items to Supabase
   */
  async syncOfflineQueue() {
    if (!isSupabaseConfigured() || !navigator.onLine) {
      return { syncedCount: 0, error: 'Network or Supabase not ready' };
    }

    const queue = storageService.getQueue();
    if (queue.length === 0) return { syncedCount: 0 };

    try {
      const recordsToUpsert = queue.map((item) => ({
        user_id: item.user_id,
        flashcard_id: item.flashcard_id,
        status: item.status,
        next_review_date: item.next_review_date,
        updated_at: item.updated_at,
      }));

      const { error } = await supabase
        .from('user_progress')
        .upsert(recordsToUpsert, { onConflict: 'user_id,flashcard_id' });

      if (error) throw error;

      storageService.clearQueue();
      return { syncedCount: queue.length, error: null };
    } catch (err) {
      console.warn('Sync offline queue failed:', err.message);
      return { syncedCount: 0, error: err };
    }
  },

  /**
   * Calculate summary statistics for Dashboard
   */
  async getDashboardMetrics(userId = null) {
    const { data: cards } = await this.getFlashcards('all', userId);
    const now = new Date();

    let learningCount = 0;
    let reviewCount = 0;
    let masteredCount = 0;
    let dueCount = 0;

    cards.forEach((card) => {
      if (card.status === 'Mastered') {
        masteredCount++;
      } else if (card.status === 'Review') {
        reviewCount++;
      } else {
        learningCount++;
      }

      // Only count due if card has actually been scheduled and reached due time
      if (card.next_review_date && new Date(card.next_review_date) <= now) {
        dueCount++;
      }
    });

    return {
      totalCards: cards.length,
      learningCount,
      reviewCount,
      masteredCount,
      dueCount,
    };
  },
};

