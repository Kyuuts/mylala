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
 * Detects if a text string contains Indonesian explanatory keywords
 * rather than pure English to be spoken or shadowed.
 */
export const isIndonesianText = (text = '') => {
  if (!text) return false;
  const indoPattern = /\b(kunci|tips|arti|adalah|bukan|tidak|ungkapan|perbaikan|kalimat|kata|frasa|subjek|keterangan|sangat|dipakai|untuk|yang|dan|dalam|menandakan|pengganti|kewalahan|menghadapi|memperkuat|menggambarkan|memadukan|menyatakan|menyudahi|contoh|penjelasan|perhatikan)\b/i;
  return indoPattern.test(text);
};

/**
 * Extracts pure, natural English target sentence for Speech Recognition & Voice Shadowing.
 * Filters out Indonesian explanations ('Kunci:', 'Tips:', 'Arti:', etc.).
 */
export const getTargetSpeechSentence = (card) => {
  if (!card) return '';

  const { front_text = '', back_text = '', example_sentence = '' } = card;

  // 1. Fill-in-the-blank cards (front_text contains underscores '____')
  // The learner should speak the COMPLETE natural English sentence with the blank filled!
  if (front_text.includes('_')) {
    const cleanAnswer = (back_text || '')
      .replace(/\(atau.*?\)/gi, '')
      .replace(/\(.*?\)/g, '')
      .trim();

    return front_text
      .replace(/_+/g, cleanAnswer)
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 2. If back_text is English (e.g. Speaking Templates, Signposting phrases where front is Indonesian prompt)
  if (back_text && !isIndonesianText(back_text) && back_text.trim().split(/\s+/).length >= 2) {
    return back_text
      .replace(/\[Name\]/gi, 'Sarah')
      .replace(/\[Field\]/gi, 'Design')
      .replace(/\[Interest\]/gi, 'traveling')
      .replace(/\[Hobi\/Minat\]/gi, 'photography')
      .replace(/\[Kampus\]/gi, 'University')
      .replace(/\[Jurusan\]/gi, 'Engineering')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 3. If example_sentence is pure English and NOT an Indonesian explanation ('Kunci:', 'Tips:', etc.)
  if (example_sentence && !isIndonesianText(example_sentence)) {
    return example_sentence.replace(/[*_`#]/g, '').trim();
  }

  // 4. Check for English quote inside example_sentence (e.g. 'Perbaikan benar: "Walking down the street..."')
  if (example_sentence && example_sentence.includes('"')) {
    const quoteMatch = example_sentence.match(/"([^"]+)"/);
    if (quoteMatch && quoteMatch[1] && !isIndonesianText(quoteMatch[1])) {
      return quoteMatch[1].trim();
    }
  }

  // 5. If front_text is pure English (e.g. vocabulary word or idiom like "Hit the nail on the head")
  if (front_text && !isIndonesianText(front_text)) {
    return front_text.replace(/[*_`#]/g, '').trim();
  }

  // Fallback: clean back_text
  return (back_text || front_text).replace(/[*_`#]/g, '').trim();
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
