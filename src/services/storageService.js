/**
 * Local Storage Service for Offline PWA Mode & Local Progress
 */

const STORAGE_KEYS = {
  MODULES: 'pl_modules_cache',
  FLASHCARDS: 'pl_flashcards_cache',
  PROGRESS: 'pl_user_progress',
  QUEUE: 'pl_offline_sync_queue',
  USER_ID: 'pl_device_user_id',
};

// Generate or retrieve persistent local user ID for guest/offline sessions
export function getOrCreateUserId() {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    // Generate UUID v4 format
    userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
}

export const storageService = {
  getModules() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MODULES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setModules(modules) {
    try {
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
    } catch (e) {
      console.warn('Failed to cache modules to localStorage', e);
    }
  },

  getFlashcards() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setFlashcards(flashcards) {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(flashcards));
    } catch (e) {
      console.warn('Failed to cache flashcards to localStorage', e);
    }
  },

  getProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveProgress(flashcardId, progressData) {
    try {
      const allProgress = this.getProgress();
      allProgress[flashcardId] = {
        ...progressData,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  },

  // Offline Sync Queue for pending Supabase uploads
  getQueue() {
    try {
      const q = localStorage.getItem(STORAGE_KEYS.QUEUE);
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  },

  enqueue(item) {
    try {
      const q = this.getQueue();
      q.push({ ...item, timestamp: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(q));
    } catch (e) {
      console.warn('Failed to enqueue item', e);
    }
  },

  clearQueue() {
    localStorage.removeItem(STORAGE_KEYS.QUEUE);
  },
};

