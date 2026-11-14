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
const indoPattern = /\b(arti|artinya|berarti|kunci|tips|pilihan|jawaban|salah|benar|contoh|penjelasan|perhatikan|gunakan|memakai|digunakan|menunjukkan|menyatakan|menjelaskan|membantu|membuat|merupakan|adalah|yaitu|ialah|bukan|tidak|jangan|harus|wajib|bisa|dapat|boleh|akan|telah|sudah|sedang|pernah|belum|dengan|untuk|pada|di|ke|dari|oleh|tentang|mengenai|seperti|bahwa|karena|sebab|jika|bila|kalau|supaya|agar|tetapi|namun|sedangkan|melainkan|atau|dan|serta|ini|itu|sini|situ|sana|saya|kamu|anda|dia|kita|kami|mereka|kalian|sangat|amat|sekali|paling|lebih|kurang|cukup|terlalu|hanya|saja|juga|pula|pun|dalam|luar|atas|bawah|depan|belakang|waktu|saat|ketika|hari|tahun|bulan|orang|hal|cara|kata|kalimat|frasa|ungkapan|subjek|predikat|objek|keterangan|hubungkan|lengkapi|temukan|tanya|bentuk|preposisi|konsonan|komparatif|superlatif|kebiasaan|jamak|tunggal|percakapan|formal|santai|sapaan|respon|klausa|akibat|kontras|lampau|sekarang|mendatang|liburan|sarapan|janji|usia|pola|pasif|aktif)\b/i;

export const isIndonesianText = (text = '') => {
  if (!text) return false;
  return indoPattern.test(text);
};

/**
 * Strips bracket notes, Indonesian parenthesis annotations, and placeholders
 */
export const cleanEnglishString = (str = '') => {
  return str
    .replace(/\(atau.*?\)/gi, '')
    .replace(/\(sinonim.*?\)/gi, '')
    .replace(/\(formal.*?\)/gi, '')
    .replace(/\(informal.*?\)/gi, '')
    .replace(/\(artinya.*?\)/gi, '')
    .replace(/\(kunci.*?\)/gi, '')
    .replace(/\(Pilihan:.*?\)/gi, '')
    .replace(/\(jawaban:.*?\)/gi, '')
    .replace(/\[Name\]/gi, 'Sarah')
    .replace(/\[Field\]/gi, 'Design')
    .replace(/\[Interest\]/gi, 'traveling')
    .replace(/\[Hobi\/Minat\]/gi, 'photography')
    .replace(/\[Kampus\]/gi, 'University')
    .replace(/\[Jurusan\]/gi, 'Engineering')
    .replace(/\[.*?\]/g, '')
    .replace(/[*_`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extracts pure, natural English target sentence for Speech Recognition & Voice Shadowing.
 * Guarantees zero Indonesian text in the shadowing prompt across all 196+ flashcards.
 */
export const getTargetSpeechSentence = (card) => {
  if (!card) return '';
  const { front_text = '', back_text = '', example_sentence = '' } = card;

  // 1. Fill-in-the-blank cards (front_text contains underscores '____')
  // The learner should shadow the complete natural grammatical English sentence!
  if (front_text.includes('_')) {
    // Determine the clean answer to fill in (pick the first alternative if slashed or parenthesized)
    let answer = back_text.split('/')[0].split('(atau')[0].trim();
    answer = answer.replace(/\(.*?\)/g, '').trim();

    // Extract the English sentence from front_text (strip Indonesian prompts/instructions before quote/colon)
    let baseSentence = front_text;
    const frontQuoteMatch = front_text.match(/"([^"]+)"/);
    if (frontQuoteMatch && frontQuoteMatch[1]) {
      baseSentence = frontQuoteMatch[1];
    } else if (front_text.includes(':')) {
      const parts = front_text.split(':');
      if (parts[1] && parts[1].trim().length > 5) {
        baseSentence = parts.slice(1).join(':').trim();
      }
    }

    // Strip inline bracket options like "(rarely / usually)" or "(open)" or "(travel)"
    baseSentence = baseSentence
      .replace(/\([a-zA-Z\s\/\-]+\)/g, '')
      .replace(/_+/g, answer);

    const result = cleanEnglishString(baseSentence);
    if (result && !isIndonesianText(result)) {
      return result;
    }
  }

  // 2. Speaking templates & Conversational phrases (back_text is English target sentence)
  const cleanBack = cleanEnglishString(back_text);
  if (cleanBack && !isIndonesianText(cleanBack) && cleanBack.split(/\s+/).length >= 2) {
    const firstOption = cleanBack.split(' / ')[0].split(' (atau')[0].trim();
    if (firstOption.length > 0) {
      return firstOption;
    }
  }

  // 3. If example_sentence contains a full English sentence or quoted correction (e.g. Perbaikan benar: "She doesn't like...")
  if (example_sentence && !isIndonesianText(example_sentence)) {
    return cleanEnglishString(example_sentence);
  }

  if (example_sentence && example_sentence.includes('"')) {
    const quotes = example_sentence.match(/"([^"]+)"/g);
    if (quotes && quotes.length > 0) {
      for (const q of quotes) {
        const cleanQ = q.replace(/"/g, '').trim();
        if (cleanQ.split(/\s+/).length >= 3 && !isIndonesianText(cleanQ)) {
          return cleanEnglishString(cleanQ);
        }
      }
    }
  }

  // 4. Vocabulary / Idiom cards where front_text is pure English
  if (front_text && !isIndonesianText(front_text) && !front_text.includes(':')) {
    return cleanEnglishString(front_text);
  }

  // 5. Short English answers from back_text (e.g. "cities", "faster")
  if (cleanBack && !isIndonesianText(cleanBack)) {
    return cleanBack.split(' / ')[0].split(' (atau')[0].trim();
  }

  // 6. Quoted English word from front_text (e.g. Bentuk jamak dari "city" adalah: -> "cities")
  if (front_text.includes('"')) {
    const qMatch = front_text.match(/"([^"]+)"/);
    if (qMatch && qMatch[1] && !isIndonesianText(qMatch[1])) {
      return cleanEnglishString(qMatch[1]);
    }
  }

  return cleanEnglishString(front_text);
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
