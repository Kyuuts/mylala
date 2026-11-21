/**
 * Unified Text-To-Speech (TTS) Service for MyLala PWA
 * Powered by Kokoro-82M AI (via kokoro-js WebGPU/WASM) + Persistent IndexedDB Caching
 * with zero-latency Graceful Fallback to Natural Neural Web Speech API.
 */

import { generateCacheKey, getCachedAudio, saveCachedAudio } from '../utils/audioCache';

export const KOKORO_VOICES = [
  {
    id: 'af_heart',
    name: 'Heart',
    accent: 'en-US',
    gender: 'Female',
    badge: 'Studio Grade A ❤️',
    desc: 'Suara paling halus, hangat & berintonasi alami (Default)',
  },
  {
    id: 'af_bella',
    name: 'Bella',
    accent: 'en-US',
    gender: 'Female',
    badge: 'Ekspresif 🔥',
    desc: 'Ceria, artikulasi sangat jelas untuk pemula',
  },
  {
    id: 'af_nicole',
    name: 'Nicole',
    accent: 'en-US',
    gender: 'Female',
    badge: 'Jelas & Tenang 🎧',
    desc: 'Laju stabil & aksen netral yang nyaman didengar',
  },
  {
    id: 'am_michael',
    name: 'Michael',
    accent: 'en-US',
    gender: 'Male',
    badge: 'Warm American 🚹',
    desc: 'Suara pria Amerika ramah & percaya diri',
  },
  {
    id: 'am_fenrir',
    name: 'Fenrir',
    accent: 'en-US',
    gender: 'Male',
    badge: 'Deep & Clear 🚹',
    desc: 'Vokal tegas, cocok untuk latihan listening lanjutan',
  },
  {
    id: 'bf_emma',
    name: 'Emma',
    accent: 'en-GB',
    gender: 'Female',
    badge: 'British Native 🇬🇧',
    desc: 'Aksen London lembut & elegan',
  },
  {
    id: 'bm_george',
    name: 'George',
    accent: 'en-GB',
    gender: 'Male',
    badge: 'British Native 🇬🇧',
    desc: 'Aksen British formal bergaya penutur Oxford',
  },
];

class TTSService {
  constructor() {
    this.kokoro = null;
    this.isLoadingModel = false;
    this.modelPromise = null;
    this.status = 'idle'; // 'idle' | 'loading' | 'ready' | 'generating' | 'speaking' | 'error'
    this.loadProgress = { percent: 0, file: '' };
    this.currentAudio = null;
    this.listeners = new Set();
    this.preferredVoice = this._loadPreferredVoice();
  }

  _loadPreferredVoice() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('mylala_tts_voice') || 'af_heart';
    }
    return 'af_heart';
  }

  setPreferredVoice(voiceId) {
    this.preferredVoice = voiceId;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('mylala_tts_voice', voiceId);
    }
    this._notifyListeners();
  }

  getPreferredVoice() {
    return this.preferredVoice;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Immediately emit current state
    listener({
      status: this.status,
      progress: this.loadProgress,
      preferredVoice: this.preferredVoice,
      isKokoroReady: !!this.kokoro,
    });
    return () => this.listeners.delete(listener);
  }

  _notifyListeners() {
    const state = {
      status: this.status,
      progress: this.loadProgress,
      preferredVoice: this.preferredVoice,
      isKokoroReady: !!this.kokoro,
    };
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (e) {
        console.error('[TTSService] Listener error:', e);
      }
    });
  }

  _setStatus(status, extra = {}) {
    this.status = status;
    if (extra.progress !== undefined) this.loadProgress = extra.progress;
    this._notifyListeners();
  }

  /**
   * Preload or initialize Kokoro model in the background
   */
  async initKokoro() {
    if (this.kokoro) return this.kokoro;
    if (this.modelPromise) return this.modelPromise;

    this.isLoadingModel = true;
    this._setStatus('loading', { progress: { percent: 0, file: 'model initialization' } });

    this.modelPromise = (async () => {
      try {
        const { KokoroTTS } = await import('kokoro-js');

        const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
        const device = hasWebGPU ? 'webgpu' : 'wasm';
        const dtype = hasWebGPU ? 'fp32' : 'q8';

        const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
          dtype,
          device,
          progress_callback: (item) => {
            if (item && item.status === 'progress' && item.total) {
              const percent = Math.round((item.loaded / item.total) * 100);
              this._setStatus('loading', {
                progress: { percent, file: item.file || 'weights' },
              });
            }
          },
        });

        this.kokoro = tts;
        this.isLoadingModel = false;
        this._setStatus('ready', { progress: { percent: 100, file: 'complete' } });
        return tts;
      } catch (err) {
        console.warn('[TTSService] Kokoro load failed, fallback enabled:', err);
        this.isLoadingModel = false;
        this._setStatus('error', { error: err.message });
        throw err;
      } finally {
        this.modelPromise = null;
      }
    })();

    return this.modelPromise;
  }

  /**
   * Clean text for high-fidelity speech synthesis
   */
  cleanTextForSpeech(text = '') {
    if (!text) return '';
    return text
      .replace(/_+/g, ' ... ') // replace fill-in-the-blank underscores with brief pause
      .replace(/[*_#`~>]/g, '') // strip markdown
      .replace(/\(Pilihan:.*?\)/gi, '') // strip choices hint
      .replace(/\[.*?\]/g, '') // strip bracket tags
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Play an audio Blob via HTMLAudioElement
   */
  _playAudioBlob(blob) {
    return new Promise((resolve, reject) => {
      this.stop();

      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      this._setStatus('speaking');

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this._setStatus('ready');
        resolve();
      };

      audio.onerror = (e) => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this._setStatus('ready');
        reject(e);
      };

      audio.play().catch((err) => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        this._setStatus('ready');
        reject(err);
      });
    });
  }

  /**
   * Smart Neural Web Speech API fallback with prioritised natural voices
   */
  _playNeuralBrowserFallback(text, voiceId = 'af_heart', speed = 0.92) {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceId.startsWith('b') ? 'en-GB' : 'en-US';
      utterance.rate = speed;

      // Select highest-quality neural voice if available
      const voices = window.speechSynthesis.getVoices() || [];
      const isBritish = voiceId.startsWith('b');
      const isMale = voiceId.startsWith('am_') || voiceId.startsWith('bm_');

      let matchedVoice = null;

      // Priority 1: Natural / Online Neural voices
      if (isBritish) {
        matchedVoice =
          voices.find((v) => v.name.includes('Ryan Online (Natural)') || v.name.includes('Sonia Online (Natural)')) ||
          voices.find((v) => v.name.includes('Google UK English') && (isMale ? v.name.includes('Male') : v.name.includes('Female'))) ||
          voices.find((v) => v.lang.toLowerCase().includes('gb') && v.name.includes('Natural')) ||
          voices.find((v) => v.lang.toLowerCase().includes('gb'));
      } else {
        matchedVoice =
          voices.find(
            (v) =>
              (isMale ? v.name.includes('Guy Online (Natural)') : v.name.includes('Jenny Online (Natural)')) ||
              v.name.includes('Aria Online (Natural)')
          ) ||
          voices.find((v) => v.name.includes('Google US English')) ||
          voices.find((v) => v.lang.toLowerCase().includes('us') && v.name.includes('Natural')) ||
          voices.find((v) => v.lang.toLowerCase().includes('us') && !v.name.includes('David') && !v.name.includes('Desktop'));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      this._setStatus('speaking');

      utterance.onend = () => {
        this._setStatus('ready');
        resolve();
      };

      utterance.onerror = () => {
        this._setStatus('ready');
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Main speak method:
   * 1. Checks local IndexedDB cache (0 ms playback if found).
   * 2. If Kokoro is ready -> synthesizes audio, caches to IndexedDB, and plays.
   * 3. If Kokoro is loading or not available -> plays instant Smart Neural Voice, while loading Kokoro in background.
   */
  async speak(text, options = {}) {
    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) return;

    const voice = options.voice || this.preferredVoice;
    const speed = options.speed || 1.0;

    // 1. Check IndexedDB Cache first
    const cacheKey = await generateCacheKey(voice, cleanText);
    const cachedBlob = await getCachedAudio(cacheKey);

    if (cachedBlob) {
      try {
        await this._playAudioBlob(cachedBlob);
        return;
      } catch (err) {
        console.warn('[TTSService] Cached audio playback failed, regenerating:', err);
      }
    }

    // 2. If Kokoro is ready, generate audio directly
    if (this.kokoro) {
      try {
        this._setStatus('generating');
        const rawAudio = await this.kokoro.generate(cleanText, {
          voice,
          speed,
        });

        const blob = rawAudio.toBlob();
        // Save to cache asynchronously
        saveCachedAudio(cacheKey, blob, { voice, text: cleanText });

        await this._playAudioBlob(blob);
        return;
      } catch (err) {
        console.warn('[TTSService] Kokoro generation error, falling back:', err);
      }
    }

    // 3. Fallback: Kokoro is not ready yet -> trigger background load & speak via Neural Web Speech
    if (!this.kokoro && !this.isLoadingModel) {
      // Start downloading model in the background so next time it is ready!
      this.initKokoro().catch(() => {});
    }

    await this._playNeuralBrowserFallback(cleanText, voice, 0.92);
  }

  /**
   * Stop any running speech or audio playback immediately
   */
  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    this._setStatus(this.kokoro ? 'ready' : 'idle');
  }

  /**
   * Check if Kokoro model is loaded and ready
   */
  isReady() {
    return !!this.kokoro;
  }
}

export const ttsService = new TTSService();
export default ttsService;
