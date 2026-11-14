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
// 2. KESALAHAN UMUM (GRAMMAR DETECTIVE) - 10 QUESTIONS POOL
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
  {
    id: 'gd-6',
    level: 'B1',
    sentence: 'The list of qualified scholarship candidates were published on the university portal.',
    options: ['The list', 'qualified scholarship', 'were published', 'on the portal'],
    correct: 'were published',
    explanation: 'Subjek sejati adalah "The list" (tunggal), bukan "candidates". Maka kata kerja pasif yang benar adalah "was published", bukan "were".',
  },
  {
    id: 'gd-7',
    level: 'A2',
    sentence: 'He catched the early morning express bus to catch his scheduled flight.',
    options: ['He catched', 'the early', 'express bus', 'scheduled flight'],
    correct: 'He catched',
    explanation: 'Kata kerja "catch" adalah irregular verb. Bentuk lampau (V2) yang benar adalah "caught", bukan "catched".',
  },
  {
    id: 'gd-8',
    level: 'B2',
    sentence: 'During her leisure time, she enjoys swimming, reading classic novels, and to cook gourmet meals.',
    options: ['During her', 'enjoys swimming', 'classic novels', 'to cook'],
    correct: 'to cook',
    explanation: 'Hukum Paralelisme: Rangkaian aktivitas setelah "enjoys" harus seragam menggunakan gerund (-ing): swimming, reading, and "cooking".',
  },
  {
    id: 'gd-9',
    level: 'A1',
    sentence: 'There are five childs playing soccer happily on the school playground.',
    options: ['There are', 'five childs', 'playing soccer', 'happily on'],
    correct: 'five childs',
    explanation: 'Bentuk jamak dari "child" adalah bentuk irregular "children", bukan "childs".',
  },
  {
    id: 'gd-10',
    level: 'C1',
    sentence: 'The academic advisor strongly recommended that she takes the advanced statistics seminar.',
    options: ['strongly recommended', 'that she', 'takes the', 'advanced statistics'],
    correct: 'takes the',
    explanation: 'Mandative Subjunctive: Setelah kata kerja "recommended that", kata kerja wajib berupa bare infinitive murni ("take", bukan "takes").',
  },
];

// ==========================================
// 3. KONJUNGSI (BRIDGE BUILDER) - 10 QUESTIONS POOL
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
  {
    id: 'bb-6',
    level: 'A1',
    context: 'Sarah bought a new laptop bag ____ an ergonomic mouse for her remote work setup.',
    options: ['and', 'but', 'so', 'although'],
    correct: 'and',
    explanation: '"And" adalah konjungsi koordinatif paling mendasar untuk menggabungkan dua benda yang setara.',
  },
  {
    id: 'bb-7',
    level: 'A2',
    context: 'We plan to have a family barbecue at the park tomorrow ____ the weather remains sunny.',
    options: ['if', 'because of', 'despite', 'unless'],
    correct: 'if',
    explanation: '"If" (jika) mengawali kondisi kondisional positif yang memungkinkan acara piknik berlangsung.',
  },
  {
    id: 'bb-8',
    level: 'B1',
    context: 'He prepared extensively for the job interview; ____, he did not get the position.',
    options: ['nevertheless', 'therefore', 'in addition', 'moreover'],
    correct: 'nevertheless',
    explanation: '"Nevertheless" (namun demikian) berfungsi menghubungkan kontras formal setelah tanda titik koma.',
  },
  {
    id: 'bb-9',
    level: 'B2',
    context: '____ the severe unexpected supply chain disruption, the product launch date was postponed.',
    options: ['Due to', 'Because', 'Even though', 'Whereas'],
    correct: 'Due to',
    explanation: '"Due to" diikuti oleh frasa nomina ("the severe unexpected supply chain disruption") untuk menyatakan alasan/penyebab.',
  },
  {
    id: 'bb-10',
    level: 'C1',
    context: '____ difficult the international negotiation may appear, both parties must seek common ground.',
    options: ['However', 'Whatever', 'Although', 'Despite'],
    correct: 'However',
    explanation: '"However + Adjective" (However difficult...) berarti "seberapa pun sulitnya" dalam register bahasa Inggris formal.',
  },
];

// ==========================================
// 4. DIKTE (EAR MASTER - LISTENING & TYPING) - 10 CHALLENGES POOL
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
  {
    id: 'dt-6',
    level: 'A1',
    targetSentence: 'They usually eat dinner together at seven o clock in the dining room.',
    hint: 'Kebiasaan makan malam keluarga',
    wordsCount: 13,
  },
  {
    id: 'dt-7',
    level: 'A2',
    targetSentence: 'My younger brother is looking for a comfortable apartment near his university.',
    hint: 'Pencarian tempat tinggal mahasiswa',
    wordsCount: 11,
  },
  {
    id: 'dt-8',
    level: 'B1',
    targetSentence: 'The customer service representative resolved my billing inquiry within ten minutes.',
    hint: 'Pelayanan konsumen yang cepat tanggap',
    wordsCount: 10,
  },
  {
    id: 'dt-9',
    level: 'B2',
    targetSentence: 'Had we received the official confirmation earlier, we would have booked cheaper tickets.',
    hint: 'Pengandaian penyesalan tiket perjalanan',
    wordsCount: 13,
  },
  {
    id: 'dt-10',
    level: 'C1',
    targetSentence: 'Only by embracing continuous innovation can organizations sustain competitive advantage.',
    hint: 'Kunci inovasi bisnis jangka panjang',
    wordsCount: 9,
  },
];

// ==========================================
// 5. DIALOG (ROLEPLAY LOUNGE - 5 SCENARIOS)
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
  {
    id: 'rp-hotel',
    title: 'Hotel Check-In in New York',
    role: 'David (Front Desk Host)',
    avatar: '🛎️',
    level: 'A2 - B1',
    turns: [
      {
        npcLine: "Welcome to The Manhattan Central! Are you checking in with us today?",
        options: [
          {
            text: "Yes, good afternoon! I have a reservation under the name Alex Johnson.",
            score: 100,
            feedback: "Sangat sopan dan langsung ke poin penting! Pengucapan 'under the name...' adalah frasa standar reservasi hotel.",
            npcReply: "Found your booking, Mr. Johnson! Three nights in our Deluxe King Room. Could I please see your passport and a credit card for the deposit?",
          },
          {
            text: "Yes, I sleep here today for three days.",
            score: 50,
            feedback: "Gunakan kata 'reservation' atau 'booking' agar terdengar lebih tepat dalam konteks perhotelan.",
            npcReply: "Sure, let me check the system. May I have your full name and identification?",
          },
        ],
      },
      {
        npcLine: "All set! Is there any special preference you have for your room during your stay?",
        options: [
          {
            text: "If possible, could I please get a quiet room on a higher floor with a city view?",
            score: 100,
            feedback: "Formula permintaan sopan yang sempurna: 'If possible, could I please get...'.",
            npcReply: "I just upgraded you to room 2408 on our executive floor with a fantastic view! Here is your keycard and breakfast voucher. Enjoy New York!",
          },
          {
            text: "Give me the best top floor without noise.",
            score: 60,
            feedback: "Terkesan menuntut. Gunakan 'Could I request' atau 'If available' untuk meminta upgrade secara ramah.",
            npcReply: "I'll see what we have available. Here is your keycard for floor 12. Have a nice stay.",
          },
        ],
      },
    ],
  },
  {
    id: 'rp-support',
    title: 'Tech Support & VPN Troubleshooting',
    role: 'Liam (Senior IT Support)',
    avatar: '💻',
    level: 'B1 - B2',
    turns: [
      {
        npcLine: "Hello, this is IT Helpdesk. I understand you're experiencing issues accessing the internal company portal remotely?",
        options: [
          {
            text: "Yes, hi Liam. I keep getting a 'Network Timeout' error whenever I attempt to authenticate via our corporate VPN.",
            score: 100,
            feedback: "Penyampaian masalah teknis yang sangat jelas dan akurat: 'authenticate via our corporate VPN'.",
            npcReply: "Got it. That sounds like a certificate sync issue. Have you tried flushing your local DNS cache and restarting the authenticator app?",
          },
          {
            text: "The internet website is broken and nothing works on my computer.",
            score: 50,
            feedback: "Terlalu umum. Sebutkan pesan error atau aplikasi spesifik yang bermasalah agar teknisi cepat mendiagnosis.",
            npcReply: "I see. Let's walk through it step by step. Can you tell me what specific error message appears on your screen?",
          },
        ],
      },
      {
        npcLine: "I just refreshed your security token on the server. Could you please attempt to log in once more now?",
        options: [
          {
            text: "It worked! The VPN connected immediately and I can access the dashboard. Thank you so much for your swift help!",
            score: 100,
            feedback: "Apresiasi profesional yang ramah: 'Thank you so much for your swift help!'.",
            npcReply: "You're most welcome! Glad we got that sorted out quickly. Don't hesitate to ping us if you need anything else. Have a productive day!",
          },
          {
            text: "Okay it works bye.",
            score: 60,
            feedback: "Sedikit terlalu singkat di lingkungan kerja formal. Tambahkan ucapan terima kasih singkat.",
            npcReply: "Glad it's working. Have a good day.",
          },
        ],
      },
    ],
  },
  {
    id: 'rp-dining',
    title: 'Fine Dining & Dietary Preferences in Sydney',
    role: 'Claire (Restaurant Waitstaff)',
    avatar: '🍷',
    level: 'B1 - B2',
    turns: [
      {
        npcLine: "Good evening and welcome to Harbor View! Would you like to start with some sparkling water while looking over the menu?",
        options: [
          {
            text: "Good evening! Still water with a slice of lemon would be lovely, thank you.",
            score: 100,
            feedback: "Respon santun berkelas: '...would be lovely, thank you'.",
            npcReply: "Right away! Tonight's chef special is pan-seared Tasmanian salmon with asparagus. Do you or your guests have any dietary restrictions we should be mindful of?",
          },
          {
            text: "No sparkling water, just give me regular tap water.",
            score: 60,
            feedback: "Bisa diterima, namun 'Still water please' terdengar jauh lebih anggun di restoran fine dining.",
            npcReply: "Certainly, tap water for the table. Are there any food allergies we should inform the kitchen about?",
          },
        ],
      },
      {
        npcLine: "Are there any food allergies or ingredients you would like to substitute?",
        options: [
          {
            text: "Yes, I am lactose intolerant, so could you please ensure the salmon is prepared without butter or dairy sauces?",
            score: 100,
            feedback: "Pemberitahuan alergi yang sangat jelas dan sopan: 'lactose intolerant' dan 'prepared without butter'.",
            npcReply: "Absolutely! I will personally inform the head chef to use extra virgin olive oil instead. Your starter will arrive shortly!",
          },
          {
            text: "Don't put milk or cheese in my food because my stomach hurts.",
            score: 60,
            feedback: "Gunakan istilah medis/kuliner standar seperti 'lactose intolerant' atau 'dairy-free option'.",
            npcReply: "Understood, dairy-free it is. I will notify the kitchen. Thank you!",
          },
        ],
      },
    ],
  },
];

// ==========================================
// 6. LATIHAN MENULIS (SENTENCE BUILDER) - 8 CHALLENGES POOL
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
  {
    id: 'sb-5',
    level: 'A1',
    indonesianMeaning: 'Dia selalu minum secangkir teh hangat setiap pagi.',
    targetTokens: ['She', 'always', 'drinks', 'a', 'warm', 'cup', 'of', 'tea.'],
    scrambled: ['of', 'She', 'drinks', 'warm', 'tea.', 'always', 'a', 'cup'],
    explanation: 'Pola Present Simple: Subjek (She) + Adverb (always) + Verb-s (drinks) + Objek (a warm cup of tea).',
  },
  {
    id: 'sb-6',
    level: 'A2',
    indonesianMeaning: 'Mereka memutuskan untuk pergi ke pantai karena cuacanya cerah.',
    targetTokens: ['They', 'decided', 'to', 'go', 'to', 'the', 'beach', 'because', 'it', 'was', 'sunny.'],
    scrambled: ['beach', 'because', 'They', 'to', 'it', 'decided', 'go', 'the', 'was', 'to', 'sunny.'],
    explanation: '"Decided to go" (to-infinitive) diikuti alasan klausual "because it was sunny".',
  },
  {
    id: 'sb-7',
    level: 'B1',
    indonesianMeaning: 'Saya akan membantumu jika kamu memberi tahu saya lebih awal.',
    targetTokens: ['I', 'would', 'have', 'helped', 'you', 'if', 'you', 'had', 'told', 'me', 'earlier.'],
    scrambled: ['told', 'if', 'helped', 'earlier.', 'have', 'had', 'I', 'me', 'you', 'would', 'you'],
    explanation: 'Conditional Type 3: Induk kalimat "would have + V3" dan anak kalimat "if + had + V3".',
  },
  {
    id: 'sb-8',
    level: 'C1',
    indonesianMeaning: 'Tidak hanya dia lulus ujian, tetapi dia juga meraih skor tertinggi.',
    targetTokens: ['Not', 'only', 'did', 'she', 'pass,', 'but', 'she', 'also', 'won', 'the', 'top', 'score.'],
    scrambled: ['pass,', 'Not', 'also', 'she', 'did', 'the', 'score.', 'won', 'only', 'she', 'top', 'but'],
    explanation: 'Negative Inversion Correlative: "Not only + did + S + V1 ..., but S also ...".',
  },
];
