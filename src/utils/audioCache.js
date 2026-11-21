/**
 * Persistent IndexedDB Audio Cache for MyLala PWA
 * Caches synthesized audio blobs (Kokoro TTS WAVs) locally in the browser.
 * Ensures zero-latency (0 ms) playback and 100% offline playback for recurring flashcards and sentences.
 */

const DB_NAME = 'MyLala_AudioCache_v1';
const STORE_NAME = 'audio_clips';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('voice', 'voice', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn('[AudioCache] Failed to open IndexedDB:', request.error);
      resolve(null);
    };
  });

  return dbPromise;
}

/**
 * Generate consistent cache key for a given voice and text prompt
 */
export async function generateCacheKey(voice = 'af_heart', text = '') {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, '')
    .replace(/\s+/g, ' ');

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(`${voice}::${normalized}`);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `${voice}_${hashHex.slice(0, 20)}`;
    } catch {
      // Fallback if subtle crypto is not available
    }
  }

  // Fallback simple hash
  let hash = 0;
  const str = `${voice}::${normalized}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `${voice}_${Math.abs(hash).toString(36)}`;
}

/**
 * Retrieve cached audio blob by key
 * @param {string} key
 * @returns {Promise<Blob | null>}
 */
export async function getCachedAudio(key) {
  if (!key) return null;
  const db = await getDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(req.result.blob);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    } catch (err) {
      console.warn('[AudioCache] Read error:', err);
      resolve(null);
    }
  });
}

/**
 * Save audio blob into IndexedDB cache
 * @param {string} key
 * @param {Blob} blob
 * @param {Object} metadata
 */
export async function saveCachedAudio(key, blob, metadata = {}) {
  if (!key || !blob) return;
  const db = await getDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        id: key,
        blob,
        voice: metadata.voice || 'af_heart',
        text: metadata.text || '',
        size: blob.size || 0,
        createdAt: Date.now(),
      };

      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch (err) {
      console.warn('[AudioCache] Save error:', err);
      resolve(false);
    }
  });
}

/**
 * Get total cached audio clips count
 */
export async function getCacheStats() {
  const db = await getDB();
  if (!db) return { count: 0 };

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const countReq = store.count();

      countReq.onsuccess = () => resolve({ count: countReq.result || 0 });
      countReq.onerror = () => resolve({ count: 0 });
    } catch {
      resolve({ count: 0 });
    }
  });
}

/**
 * Clear all cached audio files
 */
export async function clearAudioCache() {
  const db = await getDB();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}
