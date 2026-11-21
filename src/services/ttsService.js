/**
 * Unified Text-To-Speech (TTS) Service for MyLala PWA
 * Powered by Microsoft Edge / Azure Neural Voices + Persistent IndexedDB Caching
 * with zero-latency Graceful Fallback to Natural Browser Neural Voices.
 */

import { generateCacheKey, getCachedAudio, saveCachedAudio } from '../utils/audioCache';

export const EDGE_AZURE_VOICES = [
  {
    id: 'en-US-JennyNeural',
    name: 'Jenny',
    locale: 'en-US',
    gender: 'Female',
    flag: '🇺🇸',
    badge: 'Paling Natural & Ramah ⭐',
    desc: 'Suara wanita Amerika berintonasi lembut, sangat jernih (Default Lala)',
  },
  {
    id: 'en-US-GuyNeural',
    name: 'Guy',
    locale: 'en-US',
    gender: 'Male',
    flag: '🇺🇸',
    badge: 'Santai & Bersahabat 🚹',
    desc: 'Suara pria Amerika kasual, artikulasi natural & nyaman didengar',
  },
  {
    id: 'en-US-AriaNeural',
    name: 'Aria',
    locale: 'en-US',
    gender: 'Female',
    flag: '🇺🇸',
    badge: 'Ekspresif & Energik 🔥',
    desc: 'Intonasi hidup, dinamis, sangat cocok untuk percakapan seru',
  },
  {
    id: 'en-US-ChristopherNeural',
    name: 'Christopher',
    locale: 'en-US',
    gender: 'Male',
    flag: '🇺🇸',
    badge: 'Percaya Diri & Jelas 🚹',
    desc: 'Vokal tegas dengan tempo stabil, ideal untuk listening pemula & menengah',
  },
  {
    id: 'en-US-EmmaNeural',
    name: 'Emma',
    locale: 'en-US',
    gender: 'Female',
    flag: '🇺🇸',
    badge: 'Hangat & Elegan 🌸',
    desc: 'Suara ramah bergaya narator profesional',
  },
  {
    id: 'en-GB-RyanNeural',
    name: 'Ryan',
    locale: 'en-GB',
    gender: 'Male',
    flag: '🇬🇧',
    badge: 'British Native Oxford 🇬🇧',
    desc: 'Aksen British London/Oxford pria yang otentik dan berkelas',
  },
  {
    id: 'en-GB-SoniaNeural',
    name: 'Sonia',
    locale: 'en-GB',
    gender: 'Female',
    flag: '🇬🇧',
    badge: 'British Native London 🇬🇧',
    desc: 'Aksen British wanita yang sopan, anggun & artikulasi tajam',
  },
  {
    id: 'en-GB-LibbyNeural',
    name: 'Libby',
    locale: 'en-GB',
    gender: 'Female',
    flag: '🇬🇧',
    badge: 'British Ceria 🇬🇧',
    desc: 'Suara anak muda Inggris yang cerah dan bersahabat',
  },
  {
    id: 'en-AU-NatashaNeural',
    name: 'Natasha',
    locale: 'en-AU',
    gender: 'Female',
    flag: '🇦🇺',
    badge: 'Aussie Warmth 🇦🇺',
    desc: 'Aksen Australia penutur asli Sydney yang hangat dan santai',
  },
  {
    id: 'en-AU-WilliamMultilingualNeural',
    name: 'William',
    locale: 'en-AU',
    gender: 'Male',
    flag: '🇦🇺',
    badge: 'Aussie Clear 🇦🇺',
    desc: 'Aksen Australia pria yang jelas dan artikulatif',
  },
];

// For backwards compatibility across legacy imports
export const KOKORO_VOICES = EDGE_AZURE_VOICES;

const LEGACY_VOICE_MAP = {
  af_heart: 'en-US-JennyNeural',
  af_bella: 'en-US-AriaNeural',
  af_nicole: 'en-US-EmmaNeural',
  am_michael: 'en-US-GuyNeural',
  am_fenrir: 'en-US-ChristopherNeural',
  bf_emma: 'en-GB-SoniaNeural',
  bm_george: 'en-GB-RyanNeural',
};

class TTSService {
  constructor() {
    this.status = 'ready'; // 'ready' | 'generating' | 'speaking' | 'error'
    this.currentAudio = null;
    this.listeners = new Set();
    this.preferredVoice = this._loadPreferredVoice();
    this.preferredSpeed = this._loadPreferredSpeed();
  }

  _loadPreferredVoice() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('mylala_tts_voice') || 'en-US-JennyNeural';
      return LEGACY_VOICE_MAP[saved] || saved;
    }
    return 'en-US-JennyNeural';
  }

  _loadPreferredSpeed() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('mylala_tts_speed');
      if (saved) return parseFloat(saved) || 1.0;
    }
    return 1.0;
  }

  setPreferredVoice(voiceId) {
    const finalVoice = LEGACY_VOICE_MAP[voiceId] || voiceId;
    this.preferredVoice = finalVoice;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('mylala_tts_voice', finalVoice);
    }
    this._notifyListeners();
  }

  setPreferredSpeed(speed) {
    this.preferredSpeed = speed;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('mylala_tts_speed', String(speed));
    }
    this._notifyListeners();
  }

  getPreferredVoice() {
    return this.preferredVoice;
  }

  getPreferredSpeed() {
    return this.preferredSpeed;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener({
      status: this.status,
      preferredVoice: this.preferredVoice,
      preferredSpeed: this.preferredSpeed,
      isKokoroReady: true, // Always ready with 0 MB download
      isAzureReady: true,
    });
    return () => this.listeners.delete(listener);
  }

  _notifyListeners() {
    const state = {
      status: this.status,
      preferredVoice: this.preferredVoice,
      preferredSpeed: this.preferredSpeed,
      isKokoroReady: true,
      isAzureReady: true,
    };
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (e) {
        console.error('[TTSService] Listener error:', e);
      }
    });
  }

  _setStatus(status) {
    this.status = status;
    this._notifyListeners();
  }

  /**
   * Clean text for high-fidelity speech synthesis
   */
  cleanTextForSpeech(text = '') {
    if (!text) return '';
    return text
      .replace(/_+/g, ' ... ') // replace fill-in-the-blank underscores with brief pause
      .replace(/[*_#`~>]/g, '') // strip markdown symbols
      .replace(/\(Pilihan:.*?\)/gi, '') // strip choices hint
      .replace(/\[.*?\]/g, '') // strip bracket tags
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Convert speed multiplier (e.g. 0.9, 1.0, 1.1) to Azure SSML rate (+0%, -10%, etc.)
   */
  _formatRate(speed = 1.0) {
    const percent = Math.round((speed - 1) * 100);
    return percent >= 0 ? `+${percent}%` : `${percent}%`;
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
   * Smart Neural Web Speech API fallback if offline or server is temporarily unreachable
   */
  _playNeuralBrowserFallback(text, voiceId = 'en-US-JennyNeural', speed = 0.95) {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const isBritish = voiceId.includes('GB');
      const isMale = voiceId.includes('Guy') || voiceId.includes('Ryan') || voiceId.includes('Christopher') || voiceId.includes('William');

      utterance.lang = isBritish ? 'en-GB' : 'en-US';
      utterance.rate = speed;

      const voices = window.speechSynthesis.getVoices() || [];
      let matchedVoice = null;

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
   * Main speech synthesis method:
   * 1. Checks local IndexedDB cache (0 ms playback if already cached).
   * 2. Synthesizes via Microsoft Edge / Azure Neural API (/api/tts) -> ~150 ms fast response.
   * 3. Saves audio blob to IndexedDB cache for permanent offline replay.
   * 4. Seamlessly falls back to Neural Web Speech if offline.
   */
  async speak(text, options = {}) {
    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) return;

    let targetVoice = options.voice || this.preferredVoice;
    targetVoice = LEGACY_VOICE_MAP[targetVoice] || targetVoice;

    const speed = options.speed || this.preferredSpeed;
    const rate = this._formatRate(speed);

    // 1. Check local IndexedDB Cache
    const cacheKey = await generateCacheKey(`${targetVoice}_${rate}`, cleanText);
    const cachedBlob = await getCachedAudio(cacheKey);

    if (cachedBlob) {
      try {
        await this._playAudioBlob(cachedBlob);
        return;
      } catch (err) {
        console.warn('[TTSService] Cached audio playback error, fetching fresh:', err);
      }
    }

    // 2. Fetch fresh synthesis from Microsoft Edge / Azure Neural API
    try {
      this._setStatus('generating');
      const response = await fetch(
        `/api/tts?text=${encodeURIComponent(cleanText)}&voice=${encodeURIComponent(targetVoice)}&rate=${encodeURIComponent(rate)}`
      );

      if (!response.ok) {
        throw new Error(`TTS API returned status ${response.status}`);
      }

      const audioBlob = await response.blob();

      // Save to IndexedDB cache asynchronously
      saveCachedAudio(cacheKey, audioBlob, { voice: targetVoice, text: cleanText }).catch(() => {});

      await this._playAudioBlob(audioBlob);
      return;
    } catch (apiErr) {
      console.warn('[TTSService] Edge TTS API fetch failed, falling back to browser neural voice:', apiErr);
    }

    // 3. Fallback: Neural Web Speech API
    await this._playNeuralBrowserFallback(cleanText, targetVoice, speed);
  }

  /**
   * Pre-warm / pre-cache an array of sentences in the background
   */
  async prefetchSentences(sentences = [], voice = null) {
    const targetVoice = LEGACY_VOICE_MAP[voice || this.preferredVoice] || (voice || this.preferredVoice);
    const rate = this._formatRate(this.preferredSpeed);

    for (const text of sentences) {
      const clean = this.cleanTextForSpeech(text);
      if (!clean) continue;

      const cacheKey = await generateCacheKey(`${targetVoice}_${rate}`, clean);
      const existing = await getCachedAudio(cacheKey);
      if (existing) continue;

      try {
        const res = await fetch(
          `/api/tts?text=${encodeURIComponent(clean)}&voice=${encodeURIComponent(targetVoice)}&rate=${encodeURIComponent(rate)}`
        );
        if (res.ok) {
          const blob = await res.blob();
          await saveCachedAudio(cacheKey, blob, { voice: targetVoice, text: clean });
        }
      } catch {}
    }
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

    this._setStatus('ready');
  }

  /**
   * Check if engine is ready
   */
  isReady() {
    return true;
  }
}

export const ttsService = new TTSService();
export default ttsService;
