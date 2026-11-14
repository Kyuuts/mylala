/**
 * The Language Scanner - Adaptive CEFR Diagnostic Placement Test Dataset
 * Calibrated across CEFR standards: A1 (Breakthrough) to C1 (Operational Proficiency).
 * 
 * 5 GERBONG SOAL LENGKAP (5 Question Sets x 8 Questions = 40 Calibrated CEFR Questions):
 * Gerbong 1, 2, 3, 4, 5 masing-masing memiliki distribusi standar CEFR:
 * - Q1: A1 (Breakthrough / Basic syntax & introductions)
 * - Q2: A2 (Daily routines / Past tenses & prepositions)
 * - Q3: B1 (Logical connectors & transition words)
 * - Q4: B1 (Phrasal verbs & contextual usage)
 * - Q5: B2 (Subject-verb agreement & complex clauses)
 * - Q6: B2 (Advanced conditionals & unreal situations)
 * - Q7: C1 (Mandative subjunctive mood)
 * - Q8: C1 (Negative inversion & advanced formal syntax)
 */

// ==========================================
// GERBONG 1 (Paket Soal 1)
// ==========================================
export const SCANNER_GERBONG_1 = [
  {
    id: 'g1-q1',
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
    id: 'g1-q2',
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
    id: 'g1-q3',
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
    id: 'g1-q4',
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
    id: 'g1-q5',
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
    id: 'g1-q6',
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
    id: 'g1-q7',
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
    id: 'g1-q8',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Negative Inversion & Syntax Mastery',
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

// ==========================================
// GERBONG 2 (Paket Soal 2)
// ==========================================
export const SCANNER_GERBONG_2 = [
  {
    id: 'g2-q1',
    targetLevel: 'A1',
    levelLabel: '🌱 A1 • Survival & Fondasi',
    prompt: 'Pilihlah kalimat sapaan dan perkenalan asal negara yang tepat:',
    context: null,
    options: [
      { text: 'Hi! My name is David and I come from Indonesia.', isCorrect: true },
      { text: 'Hi! Me name David and I comes from Indonesia.', isCorrect: false },
      { text: 'Hi! I David is and I coming from Indonesia.', isCorrect: false },
      { text: 'Hi! I am David name and I come to Indonesia.', isCorrect: false },
    ],
    explanation: 'Dalam Simple Present, subjek "I" berpasangan dengan kata kerja dasar "come" tanpa akhiran -s untuk menyatakan fakta umum/asal negara.',
  },
  {
    id: 'g2-q2',
    targetLevel: 'A2',
    levelLabel: '🧭 A2 • Daily Routines & Tenses',
    prompt: 'Lengkapilah kalimat aktivitas lampau berikut dengan bentuk kata kerja (Past Simple) yang benar:',
    context: '"Last Saturday, Emily _____ her grandparents and _____ a delicious dinner together."',
    options: [
      { text: 'visited / cooked', isCorrect: true },
      { text: 'visits / cooks', isCorrect: false },
      { text: 'has visited / cook', isCorrect: false },
      { text: 'was visiting / has cooked', isCorrect: false },
    ],
    explanation: 'Keterangan waktu spesifik lampau "Last Saturday" mewajibkan bentuk Simple Past V2 (visited, cooked).',
  },
  {
    id: 'g2-q3',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Logical Connectors',
    prompt: 'Pilihlah kata transisi kontras (contrast transition) yang tepat untuk menghubungkan dua kalimat ini:',
    context: '"The engineering team faced severe technical obstacles during launch. _____, they delivered the product right on schedule."',
    options: [
      { text: 'Nevertheless', isCorrect: true },
      { text: 'Because', isCorrect: false },
      { text: 'Moreover', isCorrect: false },
      { text: 'Unless', isCorrect: false },
    ],
    explanation: '"Nevertheless" (meskipun demikian / kendati begitu) mengawali kalimat kedua untuk menunjukkan kontras terhadap tantangan di kalimat pertama.',
  },
  {
    id: 'g2-q4',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Phrasal Verbs & Workplace Context',
    prompt: 'Pilihlah phrasal verb yang bermakna "membatalkan acara atau perjanjian":',
    context: '"Due to unforeseen severe weather, the committee had to _____ the open-air festival."',
    options: [
      { text: 'call off', isCorrect: true },
      { text: 'look into', isCorrect: false },
      { text: 'carry on', isCorrect: false },
      { text: 'turn down', isCorrect: false },
    ],
    explanation: '"Call off" adalah phrasal verb yang bermakna membatalkan (to cancel).',
  },
  {
    id: 'g2-q5',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Subject-Verb Agreement with Correlative Conjunctions',
    prompt: 'Tentukan kata kerja yang tepat sesuai kaidah Subject-Verb Agreement untuk pola correlative conjunction ini:',
    context: '"Neither the project manager nor the software developers _____ satisfied with the recent app update."',
    options: [
      { text: 'were', isCorrect: true },
      { text: 'was', isCorrect: false },
      { text: 'is', isCorrect: false },
      { text: 'has been', isCorrect: false },
    ],
    explanation: 'Pada pola "Neither ... nor ...", kata kerja disesuaikan dengan subjek yang terdekat ("the software developers" jamak -> were).',
  },
  {
    id: 'g2-q6',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Advanced Conditionals',
    prompt: 'Lengkapilah pengandaian masa kini yang berlawanan dengan kenyataan (Conditional Type 2):',
    context: '"If I _____ more free time during the week, I _____ an intensive German course."',
    options: [
      { text: 'had / would take', isCorrect: true },
      { text: 'have / will take', isCorrect: false },
      { text: 'had had / would have taken', isCorrect: false },
      { text: 'would have / took', isCorrect: false },
    ],
    explanation: 'Conditional Type 2 untuk situasi imajiner masa kini: If + Past Simple (had), Subject + would + bare infinitive (would take).',
  },
  {
    id: 'g2-q7',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Mandative Subjunctive Mood',
    prompt: 'Pilihlah bentuk kata kerja yang tepat setelah ungkapan desakan penting (mandative subjunctive):',
    context: '"It is essential that every new team member _____ the security protocol before accessing server databases."',
    options: [
      { text: 'review', isCorrect: true },
      { text: 'reviews', isCorrect: false },
      { text: 'reviewed', isCorrect: false },
      { text: 'is reviewing', isCorrect: false },
    ],
    explanation: 'Pola "It is essential that + Subject + bare infinitive" (mandative subjunctive) mewajibkan kata kerja dasar tanpa -s (review).',
  },
  {
    id: 'g2-q8',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Negative Inversion & Syntax Mastery',
    prompt: 'Pilihlah struktur negative inversion yang benar untuk kalimat pembuka "Not only":',
    context: '"Not only _____ all sales targets this quarter, but they also expanded into European markets."',
    options: [
      { text: 'did the startup achieve', isCorrect: true },
      { text: 'the startup achieved', isCorrect: false },
      { text: 'the startup did achieve', isCorrect: false },
      { text: 'has achieved the startup', isCorrect: false },
    ],
    explanation: 'Ketika "Not only" mengawali kalimat, berlaku aturan inversi: "Not only + auxiliary (did) + subject (the startup) + bare verb (achieve)".',
  },
];

// ==========================================
// GERBONG 3 (Paket Soal 3)
// ==========================================
export const SCANNER_GERBONG_3 = [
  {
    id: 'g3-q1',
    targetLevel: 'A1',
    levelLabel: '🌱 A1 • Survival & Fondasi',
    prompt: 'Pilihlah kalimat tanya dasar yang tepat untuk menanyakan profesi atau pekerjaan seseorang:',
    context: null,
    options: [
      { text: 'What do you do for a living?', isCorrect: true },
      { text: 'What are you do for living?', isCorrect: false },
      { text: 'What does you do for living?', isCorrect: false },
      { text: 'What do you doing for living?', isCorrect: false },
    ],
    explanation: 'Pertanyaan rutinitas pekerjaan menggunakan auxiliary "do" dengan subjek "you" dan bare verb "do".',
  },
  {
    id: 'g3-q2',
    targetLevel: 'A2',
    levelLabel: '🧭 A2 • Daily Routines & Tenses',
    prompt: 'Pilihlah bentuk perbandingan bertingkat (comparative degree) yang tepat:',
    context: '"Traveling by high-speed bullet train is usually much _____ than driving through the winding mountain highway."',
    options: [
      { text: 'faster and safer', isCorrect: true },
      { text: 'more fast and safe', isCorrect: false },
      { text: 'fastest and safest', isCorrect: false },
      { text: 'more faster and safer', isCorrect: false },
    ],
    explanation: 'Adjective pendek satu suku kata (fast, safe) menambahkan akhiran -er (faster, safer).',
  },
  {
    id: 'g3-q3',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Logical Connectors',
    prompt: 'Pilihlah konjungsi konsesif yang tepat untuk menghubungkan klausa pertentangan ini:',
    context: '"_____ Julian lacked formal computer science degrees, he solved the cybersecurity breach in record time."',
    options: [
      { text: 'Although', isCorrect: true },
      { text: 'Despite', isCorrect: false },
      { text: 'Because', isCorrect: false },
      { text: 'Therefore', isCorrect: false },
    ],
    explanation: '"Although" diikuti klausa lengkap (Subject + Verb), sedangkan "Despite" membutuhkan noun phrase atau gerund.',
  },
  {
    id: 'g3-q4',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Phrasal Verbs & Workplace Context',
    prompt: 'Pilihlah phrasal verb yang bermakna "kehabisan persediaan sesuatu":',
    context: '"We must pull over at the nearest gas station immediately because the vehicle has completely _____ fuel."',
    options: [
      { text: 'run out of', isCorrect: true },
      { text: 'taken care of', isCorrect: false },
      { text: 'looked forward to', isCorrect: false },
      { text: 'given up on', isCorrect: false },
    ],
    explanation: '"Run out of" bermakna kehabisan persediaan (bensin, waktu, uang).',
  },
  {
    id: 'g3-q5',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Subject-Verb Agreement with Indefinite Quantifiers',
    prompt: 'Tentukan kata kerja bantu yang tepat untuk subjek tunggal "Every one of...":',
    context: '"Every one of the submitted academic research proposals _____ currently being reviewed by the evaluation committee."',
    options: [
      { text: 'is', isCorrect: true },
      { text: 'are', isCorrect: false },
      { text: 'were', isCorrect: false },
      { text: 'have been', isCorrect: false },
    ],
    explanation: 'Subjek sejati adalah "Every one" (tunggal), bukan "proposals" yang berada dalam frasa preposisi. Maka kata kerjanya adalah "is".',
  },
  {
    id: 'g3-q6',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Advanced Conditionals (Mixed Type)',
    prompt: 'Lengkapilah kalimat Mixed Conditional (pengandaian masa lampau yang berdampak pada situasi saat ini):',
    context: '"If Kevin _____ that international fellowship last year, he _____ studying at Oxford University right now."',
    options: [
      { text: 'had won / would be', isCorrect: true },
      { text: 'won / will be', isCorrect: false },
      { text: 'wins / would be', isCorrect: false },
      { text: 'would win / was', isCorrect: false },
    ],
    explanation: 'Mixed Conditional: Pengandaian lampau (had won) yang dampaknya masih terasa di masa sekarang ("right now") menggunakan "would + bare verb" (would be).',
  },
  {
    id: 'g3-q7',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Mandative Subjunctive Mood (Passive Voice)',
    prompt: 'Pilihlah bentuk pasif mandative subjunctive yang benar:',
    context: '"The municipal council recommended that the old historic library _____ restored rather than demolished."',
    options: [
      { text: 'be', isCorrect: true },
      { text: 'is', isCorrect: false },
      { text: 'was', isCorrect: false },
      { text: 'should to be', isCorrect: false },
    ],
    explanation: 'Dalam subjunctive pasif: "recommended that + Subject + be + V3" (be restored), menggunakan "be" murni.',
  },
  {
    id: 'g3-q8',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Negative Inversion & Inverted Conditionals',
    prompt: 'Pilihlah struktur inversi kondisional (Conditional Inversion Type 3 tanpa kata "If"):',
    context: '"_____ warned about the volcanic eruption earlier, the villagers would have evacuated the valley sooner."',
    options: [
      { text: 'Had the villagers been', isCorrect: true },
      { text: 'If had the villagers been', isCorrect: false },
      { text: 'Were the villagers', isCorrect: false },
      { text: 'Did the villagers have been', isCorrect: false },
    ],
    explanation: 'Inversi Conditional Type 3 menghilangkan kata "If" dan mengedepankan kata bantu Past Perfect: "Had + Subject + been + V3".',
  },
];

// ==========================================
// GERBONG 4 (Paket Soal 4)
// ==========================================
export const SCANNER_GERBONG_4 = [
  {
    id: 'g4-q1',
    targetLevel: 'A1',
    levelLabel: '🌱 A1 • Survival & Fondasi',
    prompt: 'Pilihlah kalimat yang menggunakan kata sifat kepemilikan (possessive adjective) secara tepat:',
    context: null,
    options: [
      { text: 'This is my laptop and that is her backpack.', isCorrect: true },
      { text: 'This is mine laptop and that is she backpack.', isCorrect: false },
      { text: 'This is me laptop and that is her backpack.', isCorrect: false },
      { text: 'This is my laptop and that is hers backpack.', isCorrect: false },
    ],
    explanation: 'Gunakan possessive adjective "my" dan "her" sebelum kata benda (laptop, backpack), bukan possessive pronoun (mine, hers).',
  },
  {
    id: 'g4-q2',
    targetLevel: 'A2',
    levelLabel: '🧭 A2 • Daily Routines & Tenses',
    prompt: 'Pilihlah bentuk kata kerja yang tepat untuk aktivitas yang sedang berlangsung sekarang (Present Continuous):',
    context: '"Please keep your voice down in the library because the students _____ an important mock examination right now."',
    options: [
      { text: 'are taking', isCorrect: true },
      { text: 'is taking', isCorrect: false },
      { text: 'took', isCorrect: false },
      { text: 'have taken', isCorrect: false },
    ],
    explanation: 'Subjek jamak "the students" dengan penanda waktu "right now" membutuhkan Present Continuous: "are taking".',
  },
  {
    id: 'g4-q3',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Logical Connectors',
    prompt: 'Pilihlah konjungsi penambahan ide (addition transition) formal yang paling tepat:',
    context: '"The new software drastically lowers operating expenses. _____, it boosts team productivity by thirty percent."',
    options: [
      { text: 'Furthermore', isCorrect: true },
      { text: 'Instead', isCorrect: false },
      { text: 'Unless', isCorrect: false },
      { text: 'Whereas', isCorrect: false },
    ],
    explanation: '"Furthermore" (terlebih lagi / selain itu) menghubungkan dua ide positif yang saling menguatkan secara formal.',
  },
  {
    id: 'g4-q4',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Phrasal Verbs & Workplace Context',
    prompt: 'Pilihlah phrasal verb yang bermakna "menemukan secara tidak sengaja":',
    context: '"While cleaning the basement archive, Maya _____ a rare collection of vintage photographs."',
    options: [
      { text: 'came across', isCorrect: true },
      { text: 'looked after', isCorrect: false },
      { text: 'turned down', isCorrect: false },
      { text: 'made up', isCorrect: false },
    ],
    explanation: '"Come across" berarti menjumpai atau menemukan sesuatu secara kebetulan (to find by chance).',
  },
  {
    id: 'g4-q5',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Subject-Verb Agreement with Interrupters',
    prompt: 'Tentukan kata kerja yang sesuai dengan subjek tunggal yang diikuti frasa penyela "together with":',
    context: '"The university rector, together with all faculty deans, _____ scheduled to inaugurate the academic year tomorrow."',
    options: [
      { text: 'is', isCorrect: true },
      { text: 'are', isCorrect: false },
      { text: 'were', isCorrect: false },
      { text: 'have been', isCorrect: false },
    ],
    explanation: 'Frasa "together with..." tidak mengubah jumlah subjek. Subjek sejati adalah "The university rector" (tunggal), maka kata kerjanya adalah "is".',
  },
  {
    id: 'g4-q6',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Advanced Conditionals',
    prompt: 'Lengkapilah pengandaian kondisi masa kini (Second Conditional):',
    context: '"If I _____ the administrator password, I _____ the automated backup script right away."',
    options: [
      { text: 'knew / would run', isCorrect: true },
      { text: 'know / will run', isCorrect: false },
      { text: 'had known / ran', isCorrect: false },
      { text: 'knows / would run', isCorrect: false },
    ],
    explanation: 'Second Conditional untuk situasi hipotetis saat ini: If + V2 (knew), Subject + would + bare infinitive (would run).',
  },
  {
    id: 'g4-q7',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Mandative Subjunctive Mood',
    prompt: 'Pilihlah kata kerja mandative subjunctive yang benar setelah kata kerja saran formal "propose":',
    context: '"The city planner proposed that the metropolitan railway network _____ expanded into the northern suburbs."',
    options: [
      { text: 'be', isCorrect: true },
      { text: 'is', isCorrect: false },
      { text: 'was', isCorrect: false },
      { text: 'will be', isCorrect: false },
    ],
    explanation: 'Kata kerja "proposed that" menuntut bentuk dasar subjunctive murni (be expanded).',
  },
  {
    id: 'g4-q8',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Negative Inversion & Syntax Mastery',
    prompt: 'Pilihlah struktur kalimat inversi yang tepat dengan pembuka "Rarely":',
    context: '"Rarely _____ such profound empathy and emotional intelligence in a novice leader."',
    options: [
      { text: 'have we observed', isCorrect: true },
      { text: 'we have observed', isCorrect: false },
      { text: 'did we observed', isCorrect: false },
      { text: 'we observed', isCorrect: false },
    ],
    explanation: '"Rarely" di posisi awal kalimat memicu negative inversion: "Rarely + auxiliary (have) + subject (we) + V3 (observed)".',
  },
];

// ==========================================
// GERBONG 5 (Paket Soal 5)
// ==========================================
export const SCANNER_GERBONG_5 = [
  {
    id: 'g5-q1',
    targetLevel: 'A1',
    levelLabel: '🌱 A1 • Survival & Fondasi',
    prompt: 'Pilihlah kalimat yang paling tepat dan sopan untuk memesan hidangan di kafe:',
    context: null,
    options: [
      { text: 'Could I please have a cup of black coffee and a croissant?', isCorrect: true },
      { text: 'Give me coffee and croissant now please.', isCorrect: false },
      { text: 'I want have coffee and croissant could.', isCorrect: false },
      { text: 'Me want drink coffee and eat croissant.', isCorrect: false },
    ],
    explanation: 'Pola kesantunan standar bahasa Inggris menggunakan modal verb: "Could I please have...".',
  },
  {
    id: 'g5-q2',
    targetLevel: 'A2',
    levelLabel: '🧭 A2 • Daily Routines & Tenses',
    prompt: 'Pilihlah pasangan preposisi waktu yang tepat untuk jam dan hari:',
    context: '"The international keynote webinar begins promptly _____ 2:00 PM _____ Thursday afternoon."',
    options: [
      { text: 'at / on', isCorrect: true },
      { text: 'in / at', isCorrect: false },
      { text: 'on / in', isCorrect: false },
      { text: 'at / in', isCorrect: false },
    ],
    explanation: 'Waktu spesifik (jam) menggunakan preposisi "at" (at 2:00 PM), sedangkan hari spesifik menggunakan "on" (on Thursday afternoon).',
  },
  {
    id: 'g5-q3',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Logical Connectors',
    prompt: 'Pilihlah konjungsi yang tepat untuk mengontraskan dua fakta yang berbeda dalam satu kalimat:',
    context: '"The first candidate possessed extensive corporate finance experience, _____ the second excelled at technological innovation."',
    options: [
      { text: 'whereas', isCorrect: true },
      { text: 'because', isCorrect: false },
      { text: 'so', isCorrect: false },
      { text: 'therefore', isCorrect: false },
    ],
    explanation: '"Whereas" (sedangkan / padahal) digunakan untuk memperbandingkan dua karakteristik yang bertolak belakang.',
  },
  {
    id: 'g5-q4',
    targetLevel: 'B1',
    levelLabel: '🌍 B1 • Phrasal Verbs & Workplace Context',
    prompt: 'Pilihlah phrasal verb yang bermakna "mentoleransi atau bersabar terhadap" perilaku buruk:',
    context: '"I genuinely respect how the customer support agent managed to _____ the angry client\'s continuous shouting."',
    options: [
      { text: 'put up with', isCorrect: true },
      { text: 'run out of', isCorrect: false },
      { text: 'look down on', isCorrect: false },
      { text: 'get along with', isCorrect: false },
    ],
    explanation: '"Put up with" bermakna bertahan atau mentoleransi situasi atau orang yang menyulitkan (to tolerate).',
  },
  {
    id: 'g5-q5',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Subject-Verb Agreement with Numerical Modifiers',
    prompt: 'Tentukan kata kerja lampau yang tepat untuk subjek berpola "One of the...":',
    context: '"One of the most influential scientific papers of the century _____ published in that prestigious medical journal."',
    options: [
      { text: 'was', isCorrect: true },
      { text: 'were', isCorrect: false },
      { text: 'are', isCorrect: false },
      { text: 'have been', isCorrect: false },
    ],
    explanation: 'Subjek utamanya adalah kata ganti tunggal "One" (bukan "papers"), sehingga membutuhkan kata kerja lampau tunggal "was".',
  },
  {
    id: 'g5-q6',
    targetLevel: 'B2',
    levelLabel: '💼 B2 • Advanced Conditionals',
    prompt: 'Lengkapilah kalimat Conditional Type 3 untuk peristiwa masa lampau yang tidak terjadi:',
    context: '"If you _____ your digital boarding pass beforehand, you _____ that chaotic airport delay."',
    options: [
      { text: 'had downloaded / would have avoided', isCorrect: true },
      { text: 'downloaded / will avoid', isCorrect: false },
      { text: 'have downloaded / would avoid', isCorrect: false },
      { text: 'had download / would have avoid', isCorrect: false },
    ],
    explanation: 'Conditional Type 3: If + Past Perfect (had downloaded), Subject + would have + V3 (would have avoided).',
  },
  {
    id: 'g5-q7',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Mandative Subjunctive Mood',
    prompt: 'Pilihlah bentuk kata kerja mandative subjunctive setelah ungkapan "It is imperative that":',
    context: '"It is imperative that each pilot _____ calm and alert under extreme turbulence conditions."',
    options: [
      { text: 'remain', isCorrect: true },
      { text: 'remains', isCorrect: false },
      { text: 'remained', isCorrect: false },
      { text: 'is remaining', isCorrect: false },
    ],
    explanation: 'Ungkapan "It is imperative that" mewajibkan subjunctive murni tanpa imbuhan -s: "remain".',
  },
  {
    id: 'g5-q8',
    targetLevel: 'C1',
    levelLabel: '👑 C1 • Negative Inversion & Strict Restriction',
    prompt: 'Pilihlah struktur negative inversion dengan frasa pembuka "Under no circumstances":',
    context: '"Under no circumstances _____ confidential financial records without board authorization."',
    options: [
      { text: 'should the finance manager release', isCorrect: true },
      { text: 'the finance manager should release', isCorrect: false },
      { text: 'the finance manager releases', isCorrect: false },
      { text: 'releases the finance manager', isCorrect: false },
    ],
    explanation: '"Under no circumstances" memicu negative inversion ketat: "Under no circumstances + modal auxiliary (should) + subject + bare infinitive (release)".',
  },
];

// ==========================================
// 5 GERBONG TEST REGISTRY (Total 40 Calibrated Questions)
// ==========================================
export const SCANNER_SETS = [
  { id: 1, name: 'Gerbong 1', badge: 'Paket Alfa', questions: SCANNER_GERBONG_1 },
  { id: 2, name: 'Gerbong 2', badge: 'Paket Beta', questions: SCANNER_GERBONG_2 },
  { id: 3, name: 'Gerbong 3', badge: 'Paket Gamma', questions: SCANNER_GERBONG_3 },
  { id: 4, name: 'Gerbong 4', badge: 'Paket Delta', questions: SCANNER_GERBONG_4 },
  { id: 5, name: 'Gerbong 5', badge: 'Paket Epsilon', questions: SCANNER_GERBONG_5 },
];

// Backward compatibility fallback export
export const SCANNER_QUESTIONS = SCANNER_GERBONG_1;

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
