/**
 * The Language Scanner - Adaptive CEFR Diagnostic Placement Test Dataset
 * Calibrated across CEFR standards: A1 (Breakthrough) to C1 (Operational Proficiency).
 */

export const SCANNER_QUESTIONS = [
  {
    id: 'q1',
    targetLevel: 'A1',
    levelLabel: '🌱 A1 • Survival & Fondasi',
    prompt: 'Pilihlah kalimat yang paling tepat untuk memperkenalkan diri dan hobi Anda:',
    context: null,
    options: [
      { text: 'Hello! My name is Sarah and I enjoy reading books.', isCorrect: true },
      { text: 'Hello! My name Sarah is and I reading books.', isCorrect: false },
      { text: 'Hello! Me name Sarah and enjoy read books.', isCorrect: false },
      { text: 'Hello! I am Sarah name and I am enjoy read book.', isCorrect: false },
    ],
    explanation: 'Kalimat standar bahasa Inggris membutuhkan Subjek ("I") dan Present Simple Verb ("enjoy") untuk menyatakan kebiasaan/hobi.',
  },
  {
    id: 'q2',
    targetLevel: 'A2',
    levelLabel: '🧭 A2 • Daily Routines & Tenses',
    prompt: 'Lengkapilah kalimat rutinitas lampau berikut dengan pasangan kata kerja yang benar:',
    context: '"Yesterday, Brian _____ to the supermarket, but he _____ any fresh milk."',
    options: [
      { text: 'went / didn\'t buy', isCorrect: true },
      { text: 'has gone / hadn\'t bought', isCorrect: false },
      { text: 'goes / doesn\'t buy', isCorrect: false },
      { text: 'was going / wasn\'t buying', isCorrect: false },
    ],
    explanation: 'Penanda waktu spesifik "Yesterday" mewajibkan Simple Past (went) dan bentuk negatif lampau (didn\'t buy + V1).',
  },
  {
    id: 'q3',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Logical Connectors',
    prompt: 'Pilihlah konjungsi yang tepat untuk menghubungkan hubungan sebab-akibat antar dua kalimat:',
    context: '"The weather forecast predicted a violent thunderstorm. _____, the committee decided to postpone the outdoor festival."',
    options: [
      { text: 'Therefore', isCorrect: true },
      { text: 'Although', isCorrect: false },
      { text: 'However', isCorrect: false },
      { text: 'Despite', isCorrect: false },
    ],
    explanation: '"Therefore" (oleh karena itu) mengawali kalimat kedua untuk menunjukkan akibat logis dari peristiwa di kalimat pertama.',
  },
  {
    id: 'q4',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Phrasal Verbs & Workplace Context',
    prompt: 'Pilihlah phrasal verb yang bermakna "menunda rapat ke hari lain":',
    context: '"Since the client is currently traveling abroad, we have to _____ the project presentation until next Tuesday."',
    options: [
      { text: 'put off', isCorrect: true },
      { text: 'break down', isCorrect: false },
      { text: 'take after', isCorrect: false },
      { text: 'give up', isCorrect: false },
    ],
    explanation: '"Put off" adalah phrasal verb lazim yang berarti menunda (to postpone).',
  },
  {
    id: 'q5',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Subject-Verb Agreement with Interrupters',
    prompt: 'Tentukan kata kerja bantu (auxiliary) yang benar untuk kalimat dengan frasa penyela ini:',
    context: '"The lead researcher, accompanied by twelve graduate assistants, _____ currently conducting clinical experiments in the laboratory."',
    options: [
      { text: 'is', isCorrect: true },
      { text: 'are', isCorrect: false },
      { text: 'were', isCorrect: false },
      { text: 'have been', isCorrect: false },
    ],
    explanation: 'Frasa penyela "accompanied by..." diabaikan. Subjek sejati adalah "The lead researcher" (tunggal), sehingga kata kerjanya adalah "is".',
  },
  {
    id: 'q6',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Advanced Conditionals',
    prompt: 'Lengkapilah pengandaian situasi lampau (Conditional Type 3) berikut:',
    context: '"If the company _____ the market trends earlier, they _____ such severe financial losses."',
    options: [
      { text: 'had analyzed / would not have suffered', isCorrect: true },
      { text: 'analyzed / will not suffer', isCorrect: false },
      { text: 'has analyzed / would not suffer', isCorrect: false },
      { text: 'would analyze / did not suffer', isCorrect: false },
    ],
    explanation: 'Rumus Conditional Type 3 (penyesalan masa lalu): If + Past Perfect (had analyzed), Subject + would have + V3 (would not have suffered).',
  },
  {
    id: 'q7',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Mandative Subjunctive Mood',
    prompt: 'Pilihlah bentuk kata kerja yang tepat setelah ekspresi desakan formal (mandative verb):',
    context: '"The ethics board urgently demanded that the CEO _____ immediately from public communication until the audit is finalized."',
    options: [
      { text: 'refrain', isCorrect: true },
      { text: 'refrains', isCorrect: false },
      { text: 'refrained', isCorrect: false },
      { text: 'is refraining', isCorrect: false },
    ],
    explanation: 'Kata kerja mandatif "demanded that" mewajibkan bentuk dasar murni (bare infinitive: refrain) tanpa akhiran -s terlepas dari subjek tunggal "the CEO".',
  },
  {
    id: 'q8',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Negative Inversion & TOEFL Mastery',
    prompt: 'Pilihlah struktur kalimat inversi yang tepat setelah negative adverbial:',
    context: '"Hardly _____ the conference room when the keynote speaker initiated the presentation."',
    options: [
      { text: 'had the delegates entered', isCorrect: true },
      { text: 'the delegates had entered', isCorrect: false },
      { text: 'did the delegates enter', isCorrect: false },
      { text: 'have the delegates entered', isCorrect: false },
    ],
    explanation: 'Aturan inversi dengan kata "Hardly" mewajibkan susunan auxiliary mendahului subjek: "Hardly + had + Subject + V3 ... when".',
  },
];

/**
 * Resolves placement test result based on total correct answers
 */
export const resolvePlacementResult = (correctCount) => {
  if (correctCount <= 2) {
    return {
      levelCode: 'A1',
      title: 'The Explorer',
      role: 'Penjelajah Pemula',
      badge: '🌱',
      color: 'emerald',
      accuracyPercent: Math.round((correctCount / 8) * 100),
      summary: 'Fondasi awal yang bersih! Kamu siap menguasai pola kalimat esensial (S + V) dan perkenalan sehari-hari tanpa takut salah.',
      recommendedModuleId: 'mod-starter-svo',
      recommendedModuleTitle: 'Starter Grammar: Rahasia Struktur Kalimat & Jebakan Preposisi',
      recommendedArticleId: 'art-a1-morning-coffee',
      recommendedArticleTitle: 'A Quiet Morning in the City',
    };
  }

  if (correctCount <= 4) {
    return {
      levelCode: 'A2',
      title: 'The Voyager',
      role: 'Pengelana Mandiri',
      badge: '🧭',
      color: 'teal',
      accuracyPercent: Math.round((correctCount / 8) * 100),
      summary: 'Dasar komunikasimu mantap! Langkah berikutnya adalah memperlancar variasi 3 tenses utama dan ungkapan percakapan rutin harian.',
      recommendedModuleId: 'mod-starter-tenses',
      recommendedModuleTitle: 'Starter Grammar: 3 Tenses Wajib Tanpa Pusing (Present, Past, Perfect)',
      recommendedArticleId: 'art-a2-traveling-solo',
      recommendedArticleTitle: 'The Magic of Traveling Alone',
    };
  }

  if (correctCount <= 6) {
    return {
      levelCode: 'B1',
      title: 'The Global Citizen',
      role: 'Warga Global',
      badge: '🌍',
      color: 'sky',
      accuracyPercent: Math.round((correctCount / 8) * 100),
      summary: 'Kemampuan menengah yang kokoh! Kamu sudah siap berdiskusi, menyampaikan opini terstruktur, dan menyambung ide dengan konjungsi alami.',
      recommendedModuleId: 'mod-conjunctions',
      recommendedModuleTitle: 'Mastering Conjunctions: Jembatan Logika & Transisi Antar Kalimat',
      recommendedArticleId: 'art-b1-digital-nomads',
      recommendedArticleTitle: 'How Remote Work Redefined Freedom',
    };
  }

  if (correctCount === 7) {
    return {
      levelCode: 'B2',
      title: 'The Diplomat',
      role: 'Negosiator Lihai',
      badge: '💼',
      color: 'indigo',
      accuracyPercent: Math.round((correctCount / 8) * 100),
      summary: 'Level profesional mandiri! Kamu menguasai tata bahasa kompleks dan siap untuk wawancara kerja multinasional serta diskusi mendalam.',
      recommendedModuleId: 'mod-toefl-sv-agreement',
      recommendedModuleTitle: 'TOEFL Mastery: Complex Subject-Verb Agreement',
      recommendedArticleId: 'art-b2-brain-spaced-repetition',
      recommendedArticleTitle: 'The Forgetting Curve & The Science of Memory Retention',
    };
  }

  // 8 Correct
  return {
    levelCode: 'C1',
    title: 'The Mastermind',
    role: 'Pakar Bahasa',
    badge: '👑',
    color: 'purple',
    accuracyPercent: 100,
    summary: 'Penguasaan tingkat tinggi! Kamu menguasai nuansa inversi formal, mandative subjunctive, dan siap menaklukkan skor TOEFL 600+ serta teks jurnal ilmiah.',
    recommendedModuleId: 'mod-toefl-inversion',
    recommendedModuleTitle: 'TOEFL Mastery: Negative Inversion & Conditionals',
    recommendedArticleId: 'art-c1-ai-linguistics',
    recommendedArticleTitle: 'Neural Networks and the Evolution of Modern Syntax',
  };
};
