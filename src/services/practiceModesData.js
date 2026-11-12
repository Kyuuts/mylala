/**
 * Interactive Arena Practice Datasets for MyLala's 6 Practice Modes:
 * 1. Kartu Hafalan (Flashcard SRS) -> Powered by flashcards dataset
 * 2. Kesalahan Umum (Grammar Detective)
 * 3. Konjungsi (Bridge Builder)
 * 4. Dikte (Ear Master)
 * 5. Dialog (Roleplay Lounge)
 * 6. Latihan Menulis (Sentence Builder)
 */

// ==========================================
// 2. KESALAHAN UMUM (GRAMMAR DETECTIVE)
// ==========================================
export const GRAMMAR_DETECTIVE_QUESTIONS = [
  {
    id: 'gd-1',
    level: 'A2',
    sentence: 'Although she was extremely tired, but she finished the entire assignment on time.',
    options: ['Although', 'extremely tired', 'but', 'finished'],
    correct: 'but',
    explanation: 'Dalam bahasa Inggris, jangan pasangkan "Although" dengan "but" secara bersamaan (Double Conjunction Error). Coret salah satunya!',
  },
  {
    id: 'gd-2',
    level: 'A1',
    sentence: 'With his closest university friends, went to the cinema last Saturday evening.',
    options: ['With his', 'friends,', 'went to', 'last Saturday'],
    correct: 'went to',
    explanation: '"With his closest university friends" adalah pelengkap preposisi, BUKAN subjek. Kalimat ini kehilangan subjek utama sebelum "went".',
  },
  {
    id: 'gd-3',
    level: 'B1',
    sentence: 'I am totally agreeing with your proposal regarding the new marketing strategy.',
    options: ['am totally', 'agreeing', 'with your', 'regarding'],
    correct: 'agreeing',
    explanation: 'Kata kerja "agree" adalah stative verb (menyatakan sikap/keadaan pikiran), sehingga tidak digunakan dalam bentuk Continuous. Gunakan "I totally agree".',
  },
  {
    id: 'gd-4',
    level: 'B2',
    sentence: 'The senior professor speaks English very good during the international conference.',
    options: ['The senior', 'speaks', 'very good', 'during'],
    correct: 'very good',
    explanation: 'Untuk menerangkan kata kerja "speaks", gunakan kata keterangan cara (Adverb of manner) yaitu "very well", bukan kata sifat "good".',
  },
  {
    id: 'gd-5',
    level: 'C1',
    sentence: 'Under no circumstances you should leave the examination hall before the bell rings.',
    options: ['Under no circumstances', 'you should', 'leave the', 'before the bell'],
    correct: 'you should',
    explanation: 'Frasa negatif di awal kalimat "Under no circumstances" mewajibkan pola inversi: kata bantu harus mendahului subjek ("should you", bukan "you should").',
  },
];

// ==========================================
// 3. KONJUNGSI (BRIDGE BUILDER)
// ==========================================
export const BRIDGE_BUILDER_QUESTIONS = [
  {
    id: 'bb-1',
    level: 'B1',
    context: 'The economic forecast looked grim. ____, tech companies reported record-breaking quarterly profits.',
    options: ['However', 'Because', 'Therefore', 'Although'],
    correct: 'However',
    explanation: '"However" dengan tanda koma mengawali kalimat kedua untuk menunjukkan kontras langsung dengan situasi suram di kalimat pertama.',
  },
  {
    id: 'bb-2',
    level: 'A2',
    context: '____ the heavy monsoon rain, the marathon runners completed the full course.',
    options: ['Despite', 'Although', 'Because of', 'Therefore'],
    correct: 'Despite',
    explanation: '"Despite" langsung diikuti oleh noun phrase ("the heavy monsoon rain") untuk menyatakan pertentangan tanpa kata kerja klausa.',
  },
  {
    id: 'bb-3',
    level: 'B1',
    context: 'The company achieved its highest revenue this year. ____, all employees will receive a performance bonus.',
    options: ['Therefore', 'However', 'Even though', 'In spite of'],
    correct: 'Therefore',
    explanation: '"Therefore" (Oleh karena itu) menghubungkan sebab keberhasilan finansial dengan akibat pemberian bonus bagi karyawan.',
  },
  {
    id: 'bb-4',
    level: 'B2',
    context: 'The apartment is located in a quiet neighborhood. ____, the monthly rent is remarkably affordable.',
    options: ['Furthermore', 'Nevertheless', 'Whereas', 'Unless'],
    correct: 'Furthermore',
    explanation: '"Furthermore" (Lagipula / Terlebih lagi) digunakan untuk menambahkan poin positif penguat yang sejalan.',
  },
  {
    id: 'bb-5',
    level: 'C1',
    context: '____ he was well aware of the strict company policy, he decided to take a calculated risk.',
    options: ['Although', 'Despite', 'However', 'Consequently'],
    correct: 'Although',
    explanation: '"Although" mengawali anak kalimat (dependent clause) yang memiliki subjek dan predikat lengkap ("he was well aware").',
  },
];

// ==========================================
// 4. DIKTE (EAR MASTER - LISTENING & TYPING)
// ==========================================
export const DICTATION_CHALLENGES = [
  {
    id: 'dt-1',
    level: 'A2',
    targetSentence: 'She drinks warm tea every morning before going to work.',
    hint: 'Rutinitas pagi hari seorang wanita',
    wordsCount: 9,
  },
  {
    id: 'dt-2',
    level: 'B1',
    targetSentence: 'Could you please send me the updated project report by Friday?',
    hint: 'Permintaan email formal di tempat kerja',
    wordsCount: 11,
  },
  {
    id: 'dt-3',
    level: 'B1',
    targetSentence: 'We decided to postpone the team meeting because the director was sick.',
    hint: 'Penundaan jadwal rapat',
    wordsCount: 12,
  },
  {
    id: 'dt-4',
    level: 'B2',
    targetSentence: 'Despite the unexpected flight delay, the delegates arrived on schedule.',
    hint: 'Perjalanan dinas delegasi internasional',
    wordsCount: 10,
  },
  {
    id: 'dt-5',
    level: 'C1',
    targetSentence: 'Hardly had they submitted the proposal when the client approved the contract.',
    hint: 'Pola inversi formal persetujuan kontrak',
    wordsCount: 12,
  },
];

// ==========================================
// 5. DIALOG (ROLEPLAY LOUNGE - SCENARIOS)
// ==========================================
export const ROLEPLAY_SCENARIOS = [
  {
    id: 'rp-coffee',
    title: 'Ordering Coffee in London',
    role: 'Alex (The Friendly Barista)',
    avatar: '☕',
    level: 'A1 - A2',
    turns: [
      {
        npcLine: "Good morning! Welcome to Soho Brews. What can I get started for you today?",
        options: [
          {
            text: "Hi! Could I please have a medium oat latte to go?",
            score: 100,
            feedback: "Sangat natural dan sopan! Menggunakan 'Could I please have' adalah cara terbaik memesan.",
            npcReply: "Certainly! One medium oat latte to go. Would you like an extra shot of espresso or any pastry with that?",
          },
          {
            text: "I want coffee latte medium with oat milk now.",
            score: 60,
            feedback: "Dapat dipahami, tapi 'I want' terdengar agak kaku dan mendikte di kafe Barat. Lebih baik gunakan 'Could I get' atau 'I'd like'.",
            npcReply: "Sure thing, one medium oat latte coming right up. Anything else for you?",
          },
          {
            text: "Give me oat latte quickly please.",
            score: 40,
            feedback: "Terlalu mendesak. Penutur asli lebih menyukai ungkapan santai dan ramah.",
            npcReply: "Alright, one moment please. Here is your medium oat latte.",
          },
        ],
      },
      {
        npcLine: "That will be four pounds fifty. Will you be paying by card or contactless today?",
        options: [
          {
            text: "Contactless with my phone, please. Here you go!",
            score: 100,
            feedback: "Tepat sekali! 'Contactless with my phone' adalah ungkapan paling umum saat ini.",
            npcReply: "Beep! Payment successful. Take a seat near the counter, and I'll call your name in two minutes. Have a wonderful day!",
          },
          {
            text: "I pay with my mobile digital wallet system.",
            score: 70,
            feedback: "Terlalu formal dan kaku. Cukup katakan 'By card' atau 'Contactless'.",
            npcReply: "No worries! Tap your phone right on the reader. There you go! Enjoy your coffee!",
          },
        ],
      },
    ],
  },
  {
    id: 'rp-interview',
    title: 'Job Interview: Handling Pressure',
    role: 'Ms. Henderson (Hiring Director)',
    avatar: '💼',
    level: 'B1 - B2',
    turns: [
      {
        npcLine: "Thank you for joining our interview today. Can you tell me how you typically handle tight deadlines and high-pressure situations?",
        options: [
          {
            text: "When facing tight deadlines, I prioritize core deliverables, break tasks into daily milestones, and maintain transparent communication with my team.",
            score: 100,
            feedback: "Jawaban bintang lima! Menggunakan kolokasi profesional seperti 'prioritize core deliverables' dan 'daily milestones'.",
            npcReply: "That demonstrates solid project ownership. Could you share a specific instance where this structured approach successfully prevented a delay?",
          },
          {
            text: "I just work overtime every day and drink coffee until the work is finished.",
            score: 50,
            feedback: "Kurang profesional. Pewawancara ingin melihat manajemen waktu dan kepemimpinan sistematis, bukan sekadar begadang.",
            npcReply: "Dedication is admirable, but sustainable workflow management is what we value most here. Let's look at your team collaboration skills.",
          },
        ],
      },
      {
        npcLine: "Lastly, where do you see your primary contribution to our international product team within the next year?",
        options: [
          {
            text: "I aim to bridge the communication gap across cross-functional teams and drive user-centric feature execution.",
            score: 100,
            feedback: "Sangat mengesankan! Menunjukkan visi strategis dan kolaborasi lintas tim.",
            npcReply: "Splendid answer. We have been looking for someone with that exact collaborative mindset. Our HR team will reach out with next steps!",
          },
          {
            text: "I just want to get paid well and learn some new things.",
            score: 40,
            feedback: "Terlalu fokus pada keuntungan pribadi. Tunjukkan nilai tambah yang kamu bawa untuk perusahaan.",
            npcReply: "Fair enough. We will take your profile into consideration among all candidates. Thank you for your time today.",
          },
        ],
      },
    ],
  },
];

// ==========================================
// 6. LATIHAN MENULIS (SENTENCE BUILDER)
// ==========================================
export const SENTENCE_BUILDER_CHALLENGES = [
  {
    id: 'sb-1',
    level: 'A2',
    indonesianMeaning: 'Meskipun hujan deras, mereka tetap menikmati konser musik.',
    targetTokens: ['Despite', 'the', 'heavy', 'rain,', 'they', 'enjoyed', 'the', 'concert.'],
    scrambled: ['the', 'Despite', 'enjoyed', 'heavy', 'concert.', 'rain,', 'they', 'the'],
    explanation: '"Despite + Noun phrase (the heavy rain)", dilanjutkan induk kalimat "they enjoyed the concert".',
  },
  {
    id: 'sb-2',
    level: 'B1',
    indonesianMeaning: 'Manajer menuntut agar semua laporan diserahkan sebelum hari Jumat.',
    targetTokens: ['The', 'manager', 'insisted', 'that', 'all', 'reports', 'be', 'submitted', 'by', 'Friday.'],
    scrambled: ['submitted', 'all', 'The', 'insisted', 'Friday.', 'by', 'reports', 'be', 'manager', 'that'],
    explanation: 'Aturan Mandative Subjunctive: setelah "insisted that", kata kerja pasif menggunakan bare infinitive "be submitted", bukan "are submitted".',
  },
  {
    id: 'sb-3',
    level: 'B2',
    indonesianMeaning: 'Buku yang ditulis oleh ilmuwan tersebut memenangkan penghargaan internasional.',
    targetTokens: ['The', 'book', 'written', 'by', 'the', 'scientist', 'won', 'an', 'international', 'award.'],
    scrambled: ['award.', 'written', 'book', 'by', 'won', 'The', 'international', 'the', 'an', 'scientist'],
    explanation: 'Pola Reduced Relative Clause pasif: "The book (which was) written by..." disingkat menjadi "The book written by...".',
  },
  {
    id: 'sb-4',
    level: 'C1',
    indonesianMeaning: 'Jarang sekali saya menyaksikan pidato yang begitu menginspirasi.',
    targetTokens: ['Rarely', 'have', 'I', 'witnessed', 'such', 'an', 'inspiring', 'speech.'],
    scrambled: ['witnessed', 'I', 'inspiring', 'Rarely', 'speech.', 'such', 'have', 'an'],
    explanation: 'Inversi kata penanda negatif: "Rarely + Auxiliary (have) + Subject (I) + V3 (witnessed)".',
  },
];

