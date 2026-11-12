/**
 * Web Speech Recognition & Pronunciation Comparison Engine
 * Powers Voice Shadowing & Real-Time Speaking Assessment for MyLala PWA
 * Uses native Web Speech API (en-US) with zero external API costs.
 */

export const isSpeechRecognitionSupported = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const getSpeechRecognitionInstance = () => {
  if (!isSpeechRecognitionSupported()) return null;
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  return recognition;
};

/**
 * Normalizes text for linguistic comparison (strips punctuation, extra spaces, and casing)
 */
export const normalizeSentence = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Computes Levenshtein Distance for close phonetic word matching
 */
export const levenshteinDistance = (a, b) => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Checks if two individual words match phonetically or strictly
 */
export const areWordsSimilar = (w1, w2) => {
  if (!w1 || !w2) return false;
  if (w1 === w2) return true;

  // Allow 1 edit distance for words longer than 4 chars
  if (w1.length > 4 && w2.length > 4) {
    return levenshteinDistance(w1, w2) <= 1;
  }
  return false;
};

/**
 * Compares target reference sentence against user's spoken transcript
 * Returns word-by-word diff, score (0-100), and feedback grade
 */
export const evaluatePronunciation = (targetSentence, spokenSentence) => {
  const cleanTarget = normalizeSentence(targetSentence);
  const cleanSpoken = normalizeSentence(spokenSentence);

  if (!cleanTarget) {
    return {
      score: 0,
      grade: 'empty',
      words: [],
      feedback: 'Teks referensi tidak ditemukan.',
    };
  }

  if (!cleanSpoken) {
    return {
      score: 0,
      grade: 'retry',
      words: cleanTarget.split(' ').map((w) => ({ word: w, isMatch: false })),
      feedback: 'Suara belum terdengar. Coba ucapkan lebih dekat ke mikrofon.',
    };
  }

  const targetTokens = cleanTarget.split(' ');
  const spokenTokens = cleanSpoken.split(' ');

  let matchCount = 0;
  const wordResults = [];

  // Match each target word against spoken tokens
  targetTokens.forEach((targetWord, index) => {
    // Check adjacent window in spoken words to handle slight pace variations
    const windowStart = Math.max(0, index - 2);
    const windowEnd = Math.min(spokenTokens.length, index + 3);
    const localSlice = spokenTokens.slice(windowStart, windowEnd);

    const isMatch = localSlice.some((spokenWord) => areWordsSimilar(targetWord, spokenWord)) ||
                    spokenTokens.includes(targetWord);

    if (isMatch) {
      matchCount++;
      wordResults.push({ word: targetWord, isMatch: true });
    } else {
      wordResults.push({ word: targetWord, isMatch: false });
    }
  });

  const accuracy = Math.round((matchCount / targetTokens.length) * 100);

  let grade = 'retry';
  let xpBonus = 0;
  let feedback = 'Tirukan pengucapan audio sekali lagi, lalu coba ulangi.';

  if (accuracy >= 85) {
    grade = 'perfect';
    xpBonus = 10;
    feedback = '🌟 Luar biasa! Artikulasi dan pengucapan sangat akurat!';
  } else if (accuracy >= 65) {
    grade = 'good';
    xpBonus = 5;
    feedback = '👍 Bagus! Sebagian besar kata tepat, perhatikan kata bertanda merah.';
  } else {
    grade = 'retry';
    xpBonus = 0;
    feedback = '💪 Tetap semangat! Dengarkan audio lalu ulangi pelan-pelan.';
  }

  return {
    score: accuracy,
    grade,
    xpBonus,
    feedback,
    words: wordResults,
    spokenTranscript: cleanSpoken,
  };
};
