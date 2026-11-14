/**
/**
 * Master Dataset: CEFR Level Exit Exams (Ujian Kelulusan Level)
 * Designed with authentic mixed TOEFL/IELTS format: Grammar, Vocabulary, Error Spotting, and Dialogues.
 * Passing Grade: 80% (Minimal 12 dari 15 soal benar).
 */

export const LEVEL_EXAMS = {
  A1: {
    levelCode: 'A1',
    title: 'Ujian Kelulusan Level A1 (The Explorer)',
    passingScore: 12, // 12 of 15 (80%)
    xpReward: 150,
    timeLimitSeconds: 600, // 10 minutes
    description: 'Ujian komprehensif 15 soal campuran mencakup 15 modul Starter & Fondasi Bahasa Inggris A1.',
    questions: [
      {
        id: 'a1-exam-1',
        category: 'Grammar',
        prompt: 'Pilihlah kalimat yang memiliki Subjek dan Verb yang lengkap dan benar:',
        context: null,
        options: [
          { text: 'With his best friend, went to the central cinema.', isCorrect: false },
          { text: 'Brian with his friends went to the central cinema.', isCorrect: true },
          { text: 'Brian went with to the cinema friend.', isCorrect: false },
          { text: 'To the cinema Brian with went his friends.', isCorrect: false },
        ],
        explanation: 'Aturan SVO: Kata setelah preposisi ("With his friend") bukan subjek. Kalimat wajib memiliki Subjek mandiri ("Brian") yang diikuti Verb ("went").',
      },
      {
        id: 'a1-exam-2',
        category: 'Conversation',
        prompt: 'Lawan bicaramu berbicara terlalu cepat dan kamu tidak mendengar dengan jelas. Ucapan paling sopan dan alami adalah:',
        context: null,
        options: [
          { text: 'What?! Say it again!', isCorrect: false },
          { text: 'Sorry, I didn\'t quite catch that. Could you repeat that for me, please?', isCorrect: true },
          { text: 'Repeat your words now, please.', isCorrect: false },
          { text: 'You speak too fast, I don\'t want to listen.', isCorrect: false },
        ],
        explanation: 'Template kesantunan: "Sorry, I didn\'t quite catch that. Could you repeat that for me, please?" adalah cara paling elegan meminta lawan bicara mengulang ucapan.',
      },
      {
        id: 'a1-exam-3',
        category: 'Kosakata',
        prompt: 'Pilihlah pasangan preposisi waktu (At, On, In) yang paling tepat untuk kalimat berikut:',
        context: '"The morning webinar will begin promptly _____ 08:30 AM _____ Monday."',
        options: [
          { text: 'at / on', isCorrect: true },
          { text: 'in / at', isCorrect: false },
          { text: 'on / in', isCorrect: false },
          { text: 'at / in', isCorrect: false },
        ],
        explanation: 'Piramida waktu: Gunakan AT untuk jam spesifik (at 08:30 AM), dan gunakan ON untuk nama hari kalender (on Monday).',
      },
      {
        id: 'a1-exam-4',
        category: 'Grammar',
        prompt: 'Lengkapilah kalimat tanya Simple Present berikut sesuai rumus 4 blok 5W+1H:',
        context: '"Where _____ your older brother work as a software engineer?"',
        options: [
          { text: 'do', isCorrect: false },
          { text: 'does', isCorrect: true },
          { text: 'is', isCorrect: false },
          { text: 'are', isCorrect: false },
        ],
        explanation: 'Subjek "your older brother" adalah orang ketiga tunggal (he), sehingga kata bantu tanya dalam Simple Present adalah "does".',
      },
      {
        id: 'a1-exam-5',
        category: 'Grammar',
        prompt: 'Pilihlah kata ganti kepemilikan mandiri (Possessive Pronoun) yang benar:',
        context: '"This black backpack is not mine; I believe it is _____."',
        options: [
          { text: 'hers', isCorrect: true },
          { text: 'her', isCorrect: false },
          { text: 'she', isCorrect: false },
          { text: 'her\'s', isCorrect: false },
        ],
        explanation: 'Possessive Pronoun mandiri (tanpa diikuti kata benda lagi) untuk "dia perempuan" adalah "hers" (bukan her, dan tidak memakai apostrof).',
      },
      {
        id: 'a1-exam-6',
        category: 'Grammar',
        prompt: 'Temukan satu kalimat yang BENAR penggunaan To Be-nya:',
        context: null,
        options: [
          { text: 'I am agree with your creative opinion.', isCorrect: false },
          { text: 'I agree with your creative opinion.', isCorrect: true },
          { text: 'She is have two younger sisters.', isCorrect: false },
          { text: 'They are play football every afternoon.', isCorrect: false },
        ],
        explanation: 'Kata "agree" adalah kata kerja aksi mandiri (Verb). Jangan tambahkan To Be ("am") di depan kata kerja aksi dalam kalimat Simple Present.',
      },
      {
        id: 'a1-exam-7',
        category: 'Kosakata',
        prompt: 'Manakah penulisan harga nominal ratusan yang benar dalam bahasa Inggris?',
        context: '"The premium leather jacket costs _____ dollars."',
        options: [
          { text: 'three hundreds and fifty', isCorrect: false },
          { text: 'three hundred and fifty', isCorrect: true },
          { text: 'three hundreds fifty', isCorrect: false },
          { text: 'three hundred of fifty', isCorrect: false },
        ],
        explanation: 'Kata hundred, thousand, dan million TIDAK PERNAH ditambah akhiran -s jika didahului angka pasti (three hundred).',
      },
      {
        id: 'a1-exam-8',
        category: 'Grammar',
        prompt: 'Lengkapilah kalimat posisi kendaraan umum berikut:',
        context: '"We are currently _____ the commuter train heading toward Jakarta Central."',
        options: [
          { text: 'on', isCorrect: true },
          { text: 'in', isCorrect: false },
          { text: 'at', isCorrect: false },
          { text: 'into', isCorrect: false },
        ],
        explanation: 'Kendaraan umum besar di mana penumpang bisa berdiri dan berjalan di lantainya menggunakan preposisi ON (on the bus, on the train, on the plane).',
      },
      {
        id: 'a1-exam-9',
        category: 'Conversation',
        prompt: 'Saat memesan kopi di kafe, kasir bertanya: "For here or to go?". Makna pertanyaan tersebut adalah:',
        context: null,
        options: [
          { text: 'Berapa cangkir kopi yang ingin Anda pesan?', isCorrect: false },
          { text: 'Apakah Anda ingin makan di sini atau dibungkus untuk dibawa pulang?', isCorrect: true },
          { text: 'Mau membayar dengan kartu debit atau uang tunai?', isCorrect: false },
          { text: 'Apakah Anda ingin menambahkan gula dan susu oat?', isCorrect: false },
        ],
        explanation: '"For here" = dinikmati di tempat (dine in); "to go" = dibungkus dibawa pulang (takeaway).',
      },
      {
        id: 'a1-exam-10',
        category: 'Kosakata',
        prompt: 'Pilihlah kalimat deskripsi fisik seseorang yang benar tata bahasanya:',
        context: null,
        options: [
          { text: 'My younger brother is short brown hair.', isCorrect: false },
          { text: 'My younger brother has short brown hair and is very friendly.', isCorrect: true },
          { text: 'My younger brother has tall and has friendly.', isCorrect: false },
          { text: 'My younger brother is curly eyes.', isCorrect: false },
        ],
        explanation: 'Ciri rambut/mata menggunakan "has/have" (has short brown hair), sedangkan postur/sifat menggunakan To Be "is" (is very friendly).',
      },
      {
        id: 'a1-exam-11',
        category: 'Kosakata',
        prompt: 'Pukul 08:15 dalam bahasa Inggris tradisional dibaca sebagai:',
        context: null,
        options: [
          { text: 'A quarter to eight', isCorrect: false },
          { text: 'A quarter past eight', isCorrect: true },
          { text: 'Half past eight', isCorrect: false },
          { text: 'Eight fifteen o\'clock', isCorrect: false },
        ],
        explanation: 'Lewat 15 menit menggunakan "a quarter past" (a quarter past eight = 08.15). Kurang 15 menit menggunakan "a quarter to".',
      },
      {
        id: 'a1-exam-12',
        category: 'Kosakata',
        prompt: 'Lengkapilah kalimat peringatan cuaca dingin menusuk berikut:',
        context: '"Please put on your heavy jacket; it is quite _____ outside this evening."',
        options: [
          { text: 'chilly', isCorrect: true },
          { text: 'sunny', isCorrect: false },
          { text: 'humid', isCorrect: false },
          { text: 'warm', isCorrect: false },
        ],
        explanation: '"Chilly" bermakna dingin sejuk menusuk tulang yang membutuhkan jaket atau pakaian hangat.',
      },
      {
        id: 'a1-exam-13',
        category: 'Grammar',
        prompt: 'Lengkapilah kalimat kemampuan dengan kata bantu "can":',
        context: '"He is exceptionally talented; he _____ four foreign languages fluently."',
        options: [
          { text: 'can speaks', isCorrect: false },
          { text: 'can speak', isCorrect: true },
          { text: 'can to speak', isCorrect: false },
          { text: 'cans speak', isCorrect: false },
        ],
        explanation: 'Setelah kata modal "can", kata kerja SELALU berbentuk V1 polos dasar tanpa tambahan -s/-es maupun to-infinitive.',
      },
      {
        id: 'a1-exam-14',
        category: 'Grammar',
        prompt: 'Manakah kelompok kata benda yang SELURUHNYA memiliki bentuk jamak tak beraturan (Irregular Plural)?',
        context: null,
        options: [
          { text: 'Children, Women, People, Feet', isCorrect: true },
          { text: 'Books, Pens, Cities, Cars', isCorrect: false },
          { text: 'Boys, Girls, Teachers, Students', isCorrect: false },
          { text: 'Watches, Boxes, Buses, Dishes', isCorrect: false },
        ],
        explanation: 'Child->children, woman->women, person->people, foot->feet adalah bentuk jamak tak beraturan yang tidak memakai akhiran -s.',
      },
      {
        id: 'a1-exam-15',
        category: 'Kosakata',
        prompt: 'Pilihlah preposisi yang tepat untuk tanggal kalender kemerdekaan Indonesia:',
        context: '"Indonesians celebrate Independence Day _____ August 17th every year."',
        options: [
          { text: 'on', isCorrect: true },
          { text: 'in', isCorrect: false },
          { text: 'at', isCorrect: false },
          { text: 'by', isCorrect: false },
        ],
        explanation: 'Tanggal kalender spesifik selalu menggunakan preposisi ON (on August 17th). Preposisi IN hanya digunakan jika menyebut bulan atau tahun saja.',
      },
    ],
  },

  A2: {
    levelCode: 'A2',
    title: 'Ujian Kelulusan Level A2 (The Voyager)',
    passingScore: 12, // 12 of 15 (80%)
    xpReward: 150,
    timeLimitSeconds: 600, // 10 minutes
    description: 'Ujian komprehensif 15 soal campuran mencakup 20 modul Elementary Bahasa Inggris A2.',
    questions: [
      {
        id: 'a2-exam-1',
        category: 'Grammar',
        prompt: 'Lengkapilah kalimat lampau tak beraturan (Irregular Past) berikut:',
        context: '"She _____ a brand new laptop last weekend, but she didn\'t _____ any wireless mouse."',
        options: [
          { text: 'bought / buy', isCorrect: true },
          { text: 'bought / bought', isCorrect: false },
          { text: 'buyed / buy', isCorrect: false },
          { text: 'buys / bought', isCorrect: false },
        ],
        explanation: 'Bentuk lampau (V2) dari buy adalah bought. Namun setelah kata bantu negatif "didn\'t", kata kerja wajib kembali ke bentuk V1 dasar (buy).',
      },
      {
        id: 'a2-exam-2',
        category: 'Grammar',
        prompt: 'Lengkapilah kombinasi Past Continuous & Past Simple (kejadian menyela):',
        context: '"While we _____ dinner at the hotel restaurant, the fire alarm suddenly _____."',
        options: [
          { text: 'were having / rang', isCorrect: true },
          { text: 'had / was ringing', isCorrect: false },
          { text: 'are having / rings', isCorrect: false },
          { text: 'have / rang', isCorrect: false },
        ],
        explanation: 'Aksi berdurasi panjang yang sedang berlangsung memakai Past Continuous (were having), aksi singkat yang menyela memakai Simple Past (rang).',
      },
      {
        id: 'a2-exam-3',
        category: 'Grammar',
        prompt: 'Pilihlah bentuk perbandingan komparatif kata sifat yang benar:',
        context: '"Traveling by bullet train is significantly _____ than traveling by bus."',
        options: [
          { text: 'more faster', isCorrect: false },
          { text: 'faster', isCorrect: true },
          { text: 'fastest', isCorrect: false },
          { text: 'most fast', isCorrect: false },
        ],
        explanation: 'Kata sifat 1 suku kata (fast) cukup ditambahkan akhiran -er menjadi faster than. Jangan gunakan "more faster".',
      },
      {
        id: 'a2-exam-4',
        category: 'Grammar',
        prompt: 'Manakah modal verb yang bermakna "DILARANG KERAS" (Prohibition)?',
        context: '"You _____ smoke inside the hospital intensive care unit."',
        options: [
          { text: 'must not', isCorrect: true },
          { text: 'don\'t have to', isCorrect: false },
          { text: 'should', isCorrect: false },
          { text: 'might not', isCorrect: false },
        ],
        explanation: '"Must not" bermakna larangan keras mutlak. Sedangkan "don\'t have to" bermakna tidak wajib (boleh dilakukan jika mau).',
      },
      {
        id: 'a2-exam-5',
        category: 'Grammar',
        prompt: 'Pilihlah bentuk waktu masa depan yang didasarkan pada tanda bukti fisik nyata di depan mata:',
        context: '"Look at those thick dark clouds in the sky! It _____ heavily in a few minutes."',
        options: [
          { text: 'is going to rain', isCorrect: true },
          { text: 'will rain', isCorrect: false },
          { text: 'rains', isCorrect: false },
          { text: 'rained', isCorrect: false },
        ],
        explanation: 'Gunakan "be going to" ketika ada bukti fisik nyata di depan mata saat ini (awan hitam tebal menandakan akan segera hujan).',
      },
      {
        id: 'a2-exam-6',
        category: 'Grammar',
        prompt: 'Pilihlah kalimat yang TIDAK mengandung kesalahan penggabungan konjungsi:',
        context: null,
        options: [
          { text: 'Although it was raining hard, but we still continued the marathon.', isCorrect: false },
          { text: 'Although it was raining hard, we still continued the marathon.', isCorrect: true },
          { text: 'Because of it was raining, so we stayed home.', isCorrect: false },
          { text: 'However it was raining, we stayed at home.', isCorrect: false },
        ],
        explanation: 'Jangan mendobel "Although" dan "but" dalam satu kalimat. Cukup pilih salah satu: "Although X, Y" ATAU "X, but Y".',
      },
      {
        id: 'a2-exam-7',
        category: 'Kosakata',
        prompt: 'Menjelaskan gejala sakit dan petunjuk konsumsi obat yang tepat:',
        context: '"I feel dizzy and have a headache. The doctor told me to _____ this medicine twice a day."',
        options: [
          { text: 'take', isCorrect: true },
          { text: 'drink', isCorrect: false },
          { text: 'eat', isCorrect: false },
          { text: 'use', isCorrect: false },
        ],
        explanation: 'Mengonsumsi obat dalam bahasa Inggris menggunakan kata kerja "take medicine", bukan "drink medicine".',
      },
      {
        id: 'a2-exam-8',
        category: 'Conversation',
        prompt: 'Temanmu mengajak ngopi, tapi kamu ada jadwal lain. Penolakan paling diplomatis dan ramah adalah:',
        context: null,
        options: [
          { text: 'No, I don\'t like hanging out with you.', isCorrect: false },
          { text: 'I\'d really love to, but I have another commitment. Can we take a rain check?', isCorrect: true },
          { text: 'Cancel your coffee, I am busy.', isCorrect: false },
          { text: 'Maybe never, I have work.', isCorrect: false },
        ],
        explanation: 'Idiom "take a rain check" adalah cara paling sopan menolak ajakan saat ini dengan harapan bisa dijadwalkan ulang di lain waktu.',
      },
      {
        id: 'a2-exam-9',
        category: 'Grammar',
        prompt: 'Lengkapilah kalimat pengalaman hidup (Present Perfect) berikut:',
        context: '"Have you _____ tried genuine Padang rendang during your stay in Indonesia?"',
        options: [
          { text: 'ever', isCorrect: true },
          { text: 'never', isCorrect: false },
          { text: 'yet', isCorrect: false },
          { text: 'just', isCorrect: false },
        ],
        explanation: 'Kata "ever" (pernahkah) digunakan dalam kalimat tanya Present Perfect untuk menanyakan riwayat pengalaman seumur hidup.',
      },
      {
        id: 'a2-exam-10',
        category: 'Grammar',
        prompt: 'Pilihlah posisi Adverb of Frequency yang tepat dalam kalimat dengan To Be:',
        context: null,
        options: [
          { text: 'Brian always is enthusiastic about learning new technologies.', isCorrect: false },
          { text: 'Brian is always enthusiastic about learning new technologies.', isCorrect: true },
          { text: 'Brian is enthusiastic always about learning new technologies.', isCorrect: false },
          { text: 'Always Brian is enthusiastic about learning new technologies.', isCorrect: false },
        ],
        explanation: 'Aturan posisi: Adverb of frequency (always, often, usually) diletakkan SETELAH To Be (is always enthusiastic).',
      },
      {
        id: 'a2-exam-11',
        category: 'Grammar',
        prompt: 'Lengkapilah pasangan kata kerja Gerund vs Infinitive berikut:',
        context: '"We decided _____ (travel) by train because she thoroughly enjoys _____ (look) at scenery."',
        options: [
          { text: 'to travel / looking', isCorrect: true },
          { text: 'traveling / to look', isCorrect: false },
          { text: 'to travel / to look', isCorrect: false },
          { text: 'traveling / looking', isCorrect: false },
        ],
        explanation: 'Kata kerja "decide" wajib berpasangan dengan To-Infinitive (decided to travel), sedangkan "enjoy" wajib diikuti Gerund (enjoys looking).',
      },
      {
        id: 'a2-exam-12',
        category: 'Conversation',
        prompt: 'Saat menukar kemeja yang ukurannya kekecilan di toko pakaian, kalimat yang tepat adalah:',
        context: null,
        options: [
          { text: 'Give me another shirt now!', isCorrect: false },
          { text: 'This size is a bit too tight; could I please exchange it for a size large?', isCorrect: true },
          { text: 'I don\'t like this tight shirt, throw it away.', isCorrect: false },
          { text: 'Exchange this shirt without receipt please.', isCorrect: false },
        ],
        explanation: '"Exchange [X] for [Y]" adalah ungkapan resmi menukar barang belanjaan secara sopan kepada staf kasir toko.',
      },
      {
        id: 'a2-exam-13',
        category: 'Kosakata',
        prompt: 'Saat berada di konter check-in bandara, petugas menanyakan preferensi tempat duduk lorong jalan vs dekat jendela:',
        context: '"Would you prefer an _____ seat or a _____ seat?"',
        options: [
          { text: 'aisle / window', isCorrect: true },
          { text: 'hall / glass', isCorrect: false },
          { text: 'corridor / view', isCorrect: false },
          { text: 'walkway / sky', isCorrect: false },
        ],
        explanation: 'Istilah standar aviasi penerbangan internasional adalah "aisle seat" (/aɪl/) dan "window seat".',
      },
      {
        id: 'a2-exam-14',
        category: 'Grammar',
        prompt: 'Pilihlah pasangan quantifier yang tepat untuk kata benda tak bisa dihitung (Uncountable):',
        context: '"How _____ money do we need to buy _____ fresh coffee beans?"',
        options: [
          { text: 'much / some', isCorrect: true },
          { text: 'many / any', isCorrect: false },
          { text: 'much / a few', isCorrect: false },
          { text: 'many / some', isCorrect: false },
        ],
        explanation: 'Uang (money) adalah uncountable noun sehingga menggunakan "much". Dalam kalimat penawaran/permintaan positif gunakan "some".',
      },
      {
        id: 'a2-exam-15',
        category: 'Grammar',
        prompt: 'Pilihlah kalimat First Conditional yang BENAR secara tata bahasa:',
        context: null,
        options: [
          { text: 'If it will rain tomorrow, we will cancel the outdoor picnic.', isCorrect: false },
          { text: 'If it rains tomorrow, we will cancel the outdoor picnic.', isCorrect: true },
          { text: 'If it rained tomorrow, we will cancel the outdoor picnic.', isCorrect: false },
          { text: 'If it rain tomorrow, we would cancel the outdoor picnic.', isCorrect: false },
        ],
        explanation: 'Aturan First Conditional: Klausa "if" SELALU menggunakan Simple Present (If it rains), dan klausa akibat memakai will + V1 (we will cancel).',
      },
    ],
  },
};

/**
 * Helper to fetch exam questions for any given CEFR level
 */
export const getLevelExam = (levelCode = 'A1') => {
  const code = (levelCode || 'A1').toUpperCase();
  if (LEVEL_EXAMS[code]) {
    return LEVEL_EXAMS[code];
  }
  // Fallback to A1 if level exam not crafted yet
  return LEVEL_EXAMS.A1;
};
