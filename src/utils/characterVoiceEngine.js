/**
 * Natural Character Voice Engine for MyLala PWA
 * Intelligently maps roleplay characters to the highest-quality Natural & Neural voices available in Web Speech API.
 */

// Voice Profiles for Roleplay Characters
export const CHARACTER_VOICE_PROFILES = {
  cafe: {
    name: 'Oliver (London Barista)',
    gender: 'male',
    accent: 'en-GB',
    rate: 0.94,
    pitch: 0.98,
    preferredNames: [
      'Ryan Online (Natural)',
      'Libby Online (Natural)',
      'Google UK English Male',
      'Google UK English Female',
      'Daniel',
      'Oliver',
      'George',
      'en-GB',
      'en_GB',
    ],
  },
  interview: {
    name: 'Ms. Clara (HR Director)',
    gender: 'female',
    accent: 'en-US',
    rate: 0.92,
    pitch: 1.02,
    preferredNames: [
      'Jenny Online (Natural)',
      'Aria Online (Natural)',
      'Google US English',
      'Samantha',
      'Karen',
      'Victoria',
      'Zira',
      'en-US',
    ],
  },
  travel: {
    name: 'Daniel (Front Desk)',
    gender: 'male',
    accent: 'en-US',
    rate: 0.94,
    pitch: 0.97,
    preferredNames: [
      'Guy Online (Natural)',
      'Christopher Online (Natural)',
      'Google US English',
      'David',
      'Alex',
      'en-US',
    ],
  },
  hangout: {
    name: 'Emma (Teman Native)',
    gender: 'female',
    accent: 'en-US',
    rate: 0.97,
    pitch: 1.05,
    preferredNames: [
      'Ana Online (Natural)',
      'Jenny Online (Natural)',
      'Google US English',
      'Samantha',
      'en-US',
    ],
  },
  health: {
    name: 'Alex (Apoteker)',
    gender: 'male',
    accent: 'en-US',
    rate: 0.92,
    pitch: 0.96,
    preferredNames: [
      'Guy Online (Natural)',
      'Google US English',
      'David',
      'en-US',
    ],
  },
  freetalk: {
    name: 'Lala (AI Tutor)',
    gender: 'female',
    accent: 'en-US',
    rate: 0.95,
    pitch: 1.06,
    preferredNames: [
      'Jenny Online (Natural)',
      'Aria Online (Natural)',
      'Google US English',
      'Samantha',
      'en-US',
    ],
  },
};

/**
 * Global cache of browser voices
 */
let CACHED_VOICES = [];

/**
 * Retrieve system voices with support for async onvoiceschanged
 */
export function getSystemVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    CACHED_VOICES = voices;
  }
  return CACHED_VOICES;
}

// Pre-warm voices on load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  getSystemVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    getSystemVoices();
  };
}

/**
 * Find the best natural voice matching a character's profile
 */
export function findBestVoiceForCharacter(scenarioId = 'cafe') {
  const profile = CHARACTER_VOICE_PROFILES[scenarioId] || CHARACTER_VOICE_PROFILES.cafe;
  const voices = getSystemVoices();

  if (!voices || voices.length === 0) {
    return { voice: null, profile };
  }

  // 1. First priority: Check preferred names in order (e.g. Natural / Neural voices)
  for (const preferred of profile.preferredNames) {
    const match = voices.find((v) =>
      v.name.toLowerCase().includes(preferred.toLowerCase())
    );
    if (match) {
      return { voice: match, profile };
    }
  }

  // 2. Second priority: Match by target accent (en-GB or en-US)
  const accentMatches = voices.filter(
    (v) =>
      v.lang.toLowerCase().replace('_', '-') ===
      profile.accent.toLowerCase().replace('_', '-')
  );

  if (accentMatches.length > 0) {
    // Prefer Natural if present
    const naturalVoice = accentMatches.find(
      (v) =>
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('google')
    );
    return { voice: naturalVoice || accentMatches[0], profile };
  }

  // 3. Fallback: Any English voice
  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  return { voice: anyEnglish || voices[0] || null, profile };
}

/**
 * Speaks text using the best natural voice for the character
 */
export function speakNaturalCharacterLine(text, scenarioId = 'cafe', voiceOverride = 'auto') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
    return;
  }

  window.speechSynthesis.cancel();

  // Strip brackets, markdown, and emojis for clean natural speaking
  const cleanText = text
    .replace(/[*_#`~]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const { voice, profile } = findBestVoiceForCharacter(scenarioId);

  // Apply voice override if user selected a custom voice preset
  if (voiceOverride !== 'auto') {
    const allVoices = getSystemVoices();
    if (voiceOverride === 'british') {
      const br = allVoices.find(
        (v) =>
          v.lang.toLowerCase().includes('gb') &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel'))
      ) || allVoices.find((v) => v.lang.toLowerCase().includes('gb'));
      if (br) utterance.voice = br;
    } else if (voiceOverride === 'us_female') {
      const usFem = allVoices.find(
        (v) =>
          v.lang.toLowerCase().includes('us') &&
          (v.name.includes('Jenny') || v.name.includes('Aria') || v.name.includes('Samantha') || v.name.includes('Zira'))
      );
      if (usFem) utterance.voice = usFem;
    } else if (voiceOverride === 'us_male') {
      const usMale = allVoices.find(
        (v) =>
          v.lang.toLowerCase().includes('us') &&
          (v.name.includes('Guy') || v.name.includes('David') || v.name.includes('Alex'))
      );
      if (usMale) utterance.voice = usMale;
    }
  } else if (voice) {
    utterance.voice = voice;
  }

  utterance.rate = profile.rate;
  utterance.pitch = profile.pitch;

  window.speechSynthesis.speak(utterance);
}
