/**
 * MASTER CURRICULUM DATASET: TOEFL 600+ & ADVANCED CONVERSATION
 * Pre-populated for instant offline access and Supabase synchronization.
 */

export const MOCK_MODULES = [
  // ==========================================
  // STARTER FOUNDATION MODULES (KHUSUS PEMULA)
  // ==========================================
  {
    id: 'mod-starter-svo',
    category: 'Grammar',
    title: 'Starter Grammar: Rahasia Struktur Kalimat & Jebakan Preposisi',
    content_markdown: `# Starter Grammar: Fondasi Struktur Kalimat (S + V)

## 1. Aturan Emas Kalimat Bahasa Inggris
Setiap kalimat bahasa Inggris yang utuh **WAJIB** memiliki minimal:
$$\\mathbf{Subject} + \\mathbf{Verb}$$

Jika salah satu hilang, kalimat tersebut salah (*incomplete sentence*). Di tes TOEFL maupun komunikasi sehari-hari, kesalahan terbesar pemula adalah tertipu oleh kata-kata panjang yang menyamar seolah-olah subjek.

---

## 2. Jebakan Utama: Object of Preposition
Kata benda yang berada tepat setelah kata depan (*in, at, on, of, with, to, by, for*) **BUKANLAH SUBJEK**! Kata itu adalah pelengkap preposisi.

* *Contoh Jebakan:*  
  "With his friends, **went** to the cinema." *(SALAH! Kalimat ini belum punya Subjek).*  
* *Bentuk Benar:*  
  "With his friends, **Brian went** to the cinema." *(Brian adalah Subjek).*

---

## 3. Jebakan Verb Berakhiran "-ing"
Kata kerja berakhiran **-ing** (seperti *playing, studying, watching*) **TIDAK BISA** menjadi kata kerja utama tanpa didampingi *to be* (*is, am, are, was, were*).

* *Salah:* "The manager **discussing** the quarterly plan." *(discussing bukan verb mandiri).*
* *Benar:* "The manager **is discussing** the quarterly plan." ATAU "The manager **discussed** the quarterly plan."

---

## 4. Trik 3 Detik Menganalisis Kalimat
1. **Coret** semua frasa yang diawali preposisi (*in the morning, with friends, of the report*).
2. **Cari Kata Kerjanya (Verb)**.
3. Pastikan ada **Subjek** tunggal atau jamak sebelum kata kerja tersebut!
`,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 'mod-starter-tenses',
    category: 'Grammar',
    title: 'Starter Grammar: 3 Tenses Wajib Tanpa Pusing (Present, Past, Perfect)',
    content_markdown: `# Starter Grammar: 3 Tenses Wajib Tanpa Pusing

## 1. Lupakan 16 Rumus Rumit!
Dalam 90% percakapan nyata dan tes TOEFL, Anda hanya perlu menguasai perbedaan esensial dari **3 Tenses Utama** ini:

---

## 2. Peta Perbandingan 3 Tenses

| Tense | Fungsi Utama | Pola Kata Kerja | Kata Penanda Waktu | Contoh Kalimat |
| :--- | :--- | :--- | :--- | :--- |
| **Simple Present** | Fakta ilmiah, rutinitas, kebenaran umum | **V1** *(tambah -s/-es jika he/she/it)* | *always, usually, everyday, normally* | "She **works** at a tech startup in Jakarta." |
| **Simple Past** | Aksi di masa lalu yang **sudah tuntas 100%** | **V2 / Did** | *yesterday, in 2021, two days ago, last week* | "We **launched** the product last Monday." |
| **Present Perfect** | Aksi masa lalu yang **efek/hasilnya masih relevan** atau pengalaman hidup | **have / has + V3** | *since, for, already, yet, ever, just* | "I **have lived** in Yogyakarta since 2022." |

---

## 3. Jebakan Umum Pemula (Past vs Present Perfect)
* *Salah:* "I have met him yesterday." *(Ada penanda waktu lampau spesifik 'yesterday', jangan pakai Present Perfect!)*
* *Benar:* "I **met** him yesterday." *(Gunakan Simple Past).*
* *Benar:* "I **have met** him twice." *(Fokus pada pengalaman, bukan kapan terjadinya).*
`,
    created_at: new Date('2026-01-01T01:00:00Z').toISOString(),
  },
  {
    id: 'mod-starter-conversation',
    category: 'Templates',
    title: 'Starter Speaking: 5 Template Perkenalan & Small Talk Zero-Gagap',
    content_markdown: `# Starter Speaking: Template Perkenalan & Small Talk Zero-Gagap

## 1. Keluar dari Perkenalan Kaku
Kebanyakan orang cuma bisa mengucapkan: *"My name is... I am 21 years old... I live in..."* lalu suasana menjadi canggung (*awkward silence*).

Untuk terlihat natural dan percaya diri, gunakan formula **Hook 3 Langkah**:
$$\\mathbf{Nama} + \\mathbf{Aktivitas/Ketertarikan\\ Terkini} + \\mathbf{Pertanyaan\\ Balik}$$

---

## 2. 5 Template Penyelamat Percakapan

### A. Perkenalan Santai & Menarik (Networking / Temu Teman Baru)
> *"Hi, I'm [Nama]! I'm currently studying [Jurusan] at [Kampus], and lately I've been really into [Hobi/Minat]. What about yourself?"*

### B. Meminta Lawan Bicara Mengulang (Tanpa Bilang "What?!")
> *"Sorry, I didn't quite catch that. Could you repeat that for me, please?"*

### C. Membeli Waktu 3 Detik untuk Berpikir (Anti-Gagap)
> Daripada bergumam *"Ummm... errr..."*, gunakan:
> *"That's a really interesting question, let me think about that for a second..."*

### D. Mengapresiasi & Memberi Respon Antusias
> *"That sounds amazing! How did you get into that?"*

### E. Pamit Mengakhiri Obrolan Secara Elegan
> *"It was truly great chatting with you! I have to head out now, but let's definitely stay in touch."*
`,
    created_at: new Date('2026-01-01T02:00:00Z').toISOString(),
  },

  // ==========================================
  // TOEFL GRAMMAR MODULES (TARGET SKOR 600+)
  // ==========================================
  {
    id: 'mod-toefl-inversion',
    category: 'Grammar',
    title: 'TOEFL Mastery: Negative Inversion & Conditionals',
    content_markdown: `# TOEFL Mastery: Inversion Rules

## 1. Konsep Utama Inversion
Inversi adalah pembalikan posisi **Auxiliary (kata kerja bantu) mendahului Subjek** (\`Auxiliary + Subject + Main Verb\`). Di TOEFL ITP/iBT, pola ini muncul pada 2 kondisi paling sering:

---

## 2. Inversion Tipe 1: Negative Adverbials di Awal Kalimat
Bila kata keterangan bernada negatif atau restriktif diletakkan di awal kalimat untuk penekanan, kalimat tersebut **wajib** diinversi.

| Kata Penanda | Struktur Kalimat | Contoh Benar | Jebakan Umum (Salah) |
| :--- | :--- | :--- | :--- |
| **Not only** | \`Not only + Aux + S + V ... but also\` | *Not only **did she pass**, but she also won.* | *Not only she passed...* |
| **Hardly / Scarcely** | \`Hardly + had + S + V3 ... when\` | *Hardly **had we arrived** when it rained.* | *Hardly we had arrived...* |
| **Rarely / Seldom** | \`Rarely + Aux + S + V\` | *Rarely **have I witnessed** such beauty.* | *Rarely I have witnessed...* |
| **Under no circumstances**| \`Under no circumstances + Aux + S\`| *Under no circumstances **should you leave**.* | *Under no circumstances you should...* |

---

## 3. Inversion Tipe 2: Conditional Inversion (Tanpa "If")
Pada ragam formal/akademis TOEFL, kata "if" dihilangkan dengan menginversi auxiliary:

1. **Type 1 (Present Possibility):**
   * *Biasa*: If you should need any assistance...
   * *Inversi*: **Should you need** any assistance, please notify us.
2. **Type 2 (Hypothetical Present):**
   * *Biasa*: If he were here today...
   * *Inversi*: **Were he here** today, he would clarify the matter.
3. **Type 3 (Past Unreal - Paling Sering Muncul):**
   * *Biasa*: If they had received the data earlier...
   * *Inversi*: **Had they received** the data earlier, the report would have succeeded.
`,
    created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 'mod-toefl-reduced-clauses',
    category: 'Grammar',
    title: 'TOEFL Mastery: Reduced Clauses & Participles',
    content_markdown: `# TOEFL Mastery: Reduced Relative & Adverbial Clauses

## 1. Mengapa Materi Ini Krusial untuk Skor 600?
Soal TOEFL Written Expression sering memotong *relative pronoun* (\`who, which, that\`) dan *to be* untuk menguji apakah Anda memahami penggunaan Participle aktif (-ing) vs pasif (-ed/V3).

---

## 2. Reduksi Relative Clauses (Adjective Clauses)

### A. Pola Aktif (Present Participle -> \`-ing\`)
Bila subjek klausa melakukan aksi sendiri:
* *Klausa Utuh*: "The scientist **who conducts** the experiment..."
* *Bentuk Reduksi*: "The scientist **conducting** the experiment..."
> ⚠️ **Aturan Emas**: Jangan tambahkan *is/was* jika tidak ada *who/which*!

### B. Pola Pasif (Past Participle -> \`-ed / V3\`)
Bila subjek klausa menerima tindakan:
* *Klausa Utuh*: "The report **which was submitted** yesterday..."
* *Bentuk Reduksi*: "The report **submitted** yesterday..."

---

## 3. Reduksi Adverbial Clauses (Waktu & Sebab-Akibat)
Jika subjek di anak kalimat **sama persis** dengan subjek induk kalimat:
* *Biasa*: "While **he was walking** to the laboratory, Dr. Alan found the sample."
* *Reduksi*: "**While walking** to the laboratory, Dr. Alan found the sample."
* *Biasa (Pasif)*: "Although **it was constructed** decades ago, the bridge remains solid."
* *Reduksi (Pasif)*: "**Although constructed** decades ago, the bridge remains solid."

> 🚨 **Dangling Modifier Trap:**
> *Salah*: *Walking to the campus, the rain soaked Brian.* (Hujan tidak sedang berjalan kaki).  
> *Benar*: *Walking to the campus, Brian was soaked by the rain.*
`,
    created_at: new Date('2026-01-02T00:00:00Z').toISOString(),
  },
  {
    id: 'mod-toefl-subjunctive',
    category: 'Grammar',
    title: 'TOEFL Mastery: Subjunctive Mood & Mandative Verbs',
    content_markdown: `# TOEFL Mastery: Mandative Subjunctive Mood

## 1. Pengertian
Dalam bahasa Inggris formal, klausa yang diawali kata kerja berunsur **perintah, desakan, atau anjuran** wajib menggunakan kata kerja dasar (*bare infinitive / V1 tanpa akhiran -s/-es/-ed*) dan *to be* menjadi **"be"**, terlepas dari apakah subjeknya tunggal (*he/she/it*) atau jamak.

---

## 2. Kata Kerja Mandatif Populer
* **Verbs:** *demand, insist, recommend, suggest, urge, require, request, propose, order*.
* **Adjectives:** *essential, vital, mandatory, imperative, crucial, important*.

---

## 3. Rumus & Contoh Kalimat

$$\\text{Subject} + \\text{Verb Mandatif} + \\text{that} + \\text{Subject} + \\mathbf{V1\\text{ (Bare Infinitive)}}$$

* *Contoh 1 (Bukan "is/was"):*  
  "The professor insisted that the student **be** on time for the exam."
* *Contoh 2 (Bukan "submits"):*  
  "The dean recommends that every candidate **submit** their thesis by Friday."
* *Contoh 3 (Bentuk Negatif -> langsung "not + V1", tanpa "does not"):*  
  "The supervisor requested that she **not disclose** the confidential findings."
`,
    created_at: new Date('2026-01-03T00:00:00Z').toISOString(),
  },
  {
    id: 'mod-toefl-sv-agreement',
    category: 'Grammar',
    title: 'TOEFL Mastery: Complex Subject-Verb Agreement',
    content_markdown: `# TOEFL Mastery: Complex Subject-Verb Agreement

## 1. Pemisah Subjek (Interrupters)
Di tes TOEFL, subjek dan verb sering dipisahkan oleh frasa panjang agar peserta tes terkecoh. 
Abaikan frasa di antara tanda koma atau preposisi:

* Frasa penyela: \`together with\`, \`along with\`, \`accompanied by\`, \`as well as\`, \`in addition to\`.
> *Contoh*: "The **lead researcher**, *along with ten graduate assistants*, **is** conducting the trial."  
> *(Subjek utama adalah 'The lead researcher' [tunggal], bukan 'assistants').*

---

## 2. Aturan Either/Neither & Correlative Conjunctions
* \`Either A or B\` dan \`Neither A nor B\` &rarr; Verb mengikuti subjek terdekat (**B**).
  * "Neither the professor nor the **students were** satisfied with the result."
  * "Neither the students nor the **professor was** satisfied with the result."

---

## 3. Subjek Singular Tak Terduga
Kata-kata berikut selalu berpasangan dengan kata kerja tunggal (**Singular Verb**):
* *Each, every, everyone, everybody, nobody, someone, anyone*.
* Kata berakhiran -ics: *Economics, Physics, Statistics, Mathematics*.
* Besaran waktu/uang: *Ten thousand dollars **is** needed.* / *Five years **is** a long time.*
`,
    created_at: new Date('2026-01-04T00:00:00Z').toISOString(),
  },

  // ==========================================
  // TOEFL VOCABULARY (ACADEMIC WORD LIST)
  // ==========================================
  {
    id: 'mod-toefl-awl',
    category: 'Vocab',
    title: 'Academic Word List (AWL): High-Yield Scientific Verbs',
    content_markdown: `# Academic Word List (AWL) - Tier 1

## 1. Mengapa Kosakata Akademik Menentukan Skor 600?
Bagian TOEFL Reading & Listening menuntut pemahaman istilah konseptual yang padat makna. Berikut adalah kata-kata yang paling sering menentukan kebenaran jawaban:

| Kosakata | Definisi / Makna | Kolokasi Lazim | Contoh Penggunaan |
| :--- | :--- | :--- | :--- |
| **Corroborate** *(v)* | Menguatkan bukti / memvalidasi | *corroborate evidence / findings* | *The new archaeological data corroborates the initial hypothesis.* |
| **Delineate** *(v)* | Menggambarkan secara detail | *delineate boundaries / steps* | *The article delineates the environmental impact of deforestation.* |
| **Synthesize** *(v)* | Memadukan berbagai sumber/ide | *synthesize perspectives* | *Students must synthesize theoretical models with empirical data.* |
| **Discrepancy** *(n)* | Ketidaksesuaian / perbedaan angka | *discrepancy between A and B* | *There was a marked discrepancy between the two survey reports.* |
| **Substantiate** *(v)* | Membuktikan kebenaran klaim | *substantiate claims / theories* | *The author failed to substantiate his claims with hard facts.* |
| **Pervasive** *(adj)* | Menyebar luas / merata | *pervasive influence / trend* | *The pervasive influence of technology reshapes ancient traditions.* |
`,
    created_at: new Date('2026-01-05T00:00:00Z').toISOString(),
  },

  // ==========================================
  // CONVERSATION & SPEAKING MODULES
  // ==========================================
  {
    id: 'mod-conv-idioms',
    category: 'Vocab',
    title: 'Everyday Native Idioms & Natural Collocations',
    content_markdown: `# Natural Everyday Idioms for Fluent Speaking

## 1. Berhenti Menerjemahkan Kata per Kata
Penutur asli menggunakan idiom untuk menyampaikan emosi dan kondisi kompleks secara instan dan ramah.

## 2. 6 Idiom Paling Berguna dalam Kehidupan Sehari-hari
1. **Hit the nail on the head**: Mengatakan hal yang persis tepat / akurat.
   * *Contoh*: "When you mentioned work-life balance, you really **hit the nail on the head**."
2. **Snowed under**: Sangat sibuk dengan tumpukan tugas/pekerjaan.
   * *Contoh*: "I'd love to grab lunch, but I'm completely **snowed under** with reports today."
3. **Bite the bullet**: Menghadapi situasi sulit yang tak terelakkan dengan tegar.
   * *Contoh*: "I have to **bite the bullet** and tell my boss that the project is behind schedule."
4. **Call it a day**: Mengakhiri kegiatan/bekerja untuk hari ini.
   * *Contoh*: "We've made great progress. Let's **call it a day** and resume tomorrow morning."
5. **Off the top of my head**: Perkiraan spontan tanpa memeriksa catatan terlebih dahulu.
   * *Contoh*: "**Off the top of my head**, I think we have around forty active members."
6. **On the same page**: Memiliki pemahaman dan kesepakatan yang sama.
   * *Contoh*: "Let's align our goals to ensure everyone is **on the same page**."
`,
    created_at: new Date('2026-01-06T00:00:00Z').toISOString(),
  },
  {
    id: 'mod-conv-opinions',
    category: 'Templates',
    title: 'Natural Conversation: Stating Opinions & Polite Disagreement',
    content_markdown: `# Formulas for Stating Opinions & Diplomatic Disagreements

## 1. Menghindari Jawaban Kaku "I think..."
Variasikan pembuka kalimat agar percakapan terdengar luwes, percaya diri, dan sopan:

---

## 2. Memberikan Pendapat (Expressing Nuanced Opinions)
* **Kuat & Tegas:**  
  * *"I'm firmly convinced that..."*
  * *"There's no doubt in my mind that..."*
* **Netral & Seimbang:**  
  * *"From where I stand, it seems that..."*
  * *"The way I look at it is..."*
* **Hati-hati / Rendah Hati:**  
  * *"If you ask me, I'd say..."*
  * *"As far as I'm concerned, ..."*

---

## 3. Menyanggah Secara Diplomatik (Polite Disagreement)
Jangan gunakan *"You are wrong"*! Gunakan teknik *Agree-then-Pivot*:

1. **Teknik "Validasi lalu Alihkan":**
   * *"I take your point, but don't you think that..."*
   * *"I hear what you're saying, however, we should also keep in mind that..."*
2. **Teknik Keraguan Konstruktif:**
   * *"I'm not entirely convinced that this is the best course of action."*
   * *"I see things a bit differently on this particular issue."*
`,
    created_at: new Date('2026-01-07T00:00:00Z').toISOString(),
  },
  {
    id: 'mod-conv-meetings',
    category: 'Templates',
    title: 'Professional Signposting for Meetings & Discussions',
    content_markdown: `# Professional Signposting in English Meetings

## 1. Mengapa Signposting Penting?
*Signposting* adalah rambu-rambu verbal yang membantu lawan bicara mengikuti alur berpikir Anda dengan mudah.

---

## 2. Tahapan Pertemuan & Rambu Kalimatnya

### A. Membuka & Mengatur Agenda
* *"Thank you all for coming. The primary objective of today's meeting is to..."*
* *"We have three core agenda items to cover within the next forty minutes."*

### B. Menyelip / Menginterupsi Secara Sopan
* *"Could I jump in here for a second?"*
* *"Before we move on, I'd like to add a quick comment regarding..."*

### C. Mengembalikan Topik (Handling Digressions)
* *"Let's circle back to our primary focus, which is..."*
* *"That's a valid point, but let's park that discussion for our next session."*

### D. Mengunci Kesepakatan & Aksi Lanjutan
* *"To wrap things up, our main takeaways from today are..."*
* *"Who will take ownership of this action item before our next sync?"*
`,
    created_at: new Date('2026-01-08T00:00:00Z').toISOString(),
  },
];

export const MOCK_FLASHCARDS = [
  // ==========================================
  // CARDS: STARTER STRUCTURE & S-V
  // ==========================================
  {
    id: 'card-svo-1',
    module_id: 'mod-starter-svo',
    front_text: 'With his closest friends, ______ to the new cinema downtown yesterday.',
    back_text: 'Brian went',
    example_sentence: 'Kunci: "With his closest friends" adalah frasa preposisi (keterangan), bukan subjek! Kalimat masih membutuhkan Subjek (Brian) dan Verb (went).',
  },
  {
    id: 'card-svo-2',
    module_id: 'mod-starter-svo',
    front_text: 'The chief architect ______ the complex blueprint for the hospital project.',
    back_text: 'designed',
    example_sentence: 'Kunci: Kata kerja berakhiran -ing (designing) TIDAK BISA berdiri sendiri sebagai Verb tanpa bantuan to be (is/was). Gunakan "designed".',
  },
  {
    id: 'card-svo-3',
    module_id: 'mod-starter-svo',
    front_text: 'Sarah, a brilliant young researcher, ______ several prestigious awards this year.',
    back_text: 'has received',
    example_sentence: 'Kunci: Frasa di antara dua koma ("a brilliant young researcher") adalah penjelas (Appositive). Subjek utamanya "Sarah" membutuhkan Verb "has received".',
  },
  {
    id: 'card-svo-4',
    module_id: 'mod-starter-svo',
    front_text: 'During the heavy storm, ______ sought shelter under the pavilion.',
    back_text: 'the pedestrians',
    example_sentence: 'Kunci: "During the heavy storm" hanyalah keterangan waktu. Kalimat tetap membutuhkan Subjek mandiri (the pedestrians) sebelum verb "sought".',
  },

  // ==========================================
  // CARDS: STARTER 3 TENSES
  // ==========================================
  {
    id: 'card-tns-1',
    module_id: 'mod-starter-tenses',
    front_text: 'She ______ at this technology company in Yogyakarta since 2022.',
    back_text: 'has worked',
    example_sentence: 'Kunci: Kata "since" (sejak) menandakan aksi dimulai di masa lalu dan masih berlangsung sampai sekarang (Present Perfect: has worked).',
  },
  {
    id: 'card-tns-2',
    module_id: 'mod-starter-tenses',
    front_text: 'We ______ our quarterly marketing presentation two days ago.',
    back_text: 'finished',
    example_sentence: 'Kunci: Ada keterangan waktu lampau yang spesifik dan tuntas ("two days ago"). Wajib menggunakan Simple Past (V2: finished).',
  },
  {
    id: 'card-tns-3',
    module_id: 'mod-starter-tenses',
    front_text: 'Water ______ at 100 degrees Celsius under normal atmospheric pressure.',
    back_text: 'boils',
    example_sentence: 'Kunci: Fakta ilmiah / kebenaran umum selalu menggunakan Simple Present (V1 + s/es untuk subjek tunggal: boils).',
  },
  {
    id: 'card-tns-4',
    module_id: 'mod-starter-tenses',
    front_text: '______ you submit your project assignment yesterday evening?',
    back_text: 'Did',
    example_sentence: 'Kunci: Keterangan waktu lampau spesifik "yesterday evening" mewajibkan auxiliary "Did" untuk pertanyaan Simple Past.',
  },

  // ==========================================
  // CARDS: STARTER CONVERSATION & SMALL TALK
  // ==========================================
  {
    id: 'card-sc-1',
    module_id: 'mod-starter-conversation',
    front_text: 'Template perkenalan diri profesional & santai saat networking atau bertemu teman baru:',
    back_text: "Hi, I'm [Name]! I'm currently studying/working in [Field], and lately I've been really into [Interest]. What about yourself?",
    example_sentence: 'Tips: Selalu akhiri perkenalan dengan "What about yourself?" agar lawan bicara merasa dihargai dan obrolan terus mengalir.',
  },
  {
    id: 'card-sc-2',
    module_id: 'mod-starter-conversation',
    front_text: 'Cara sopan meminta lawan bicara mengulang kalimatnya saat kamu tidak mendengar jelas (tanpa bilang "What?!"):',
    back_text: "Sorry, I didn't quite catch that. Could you repeat that for me, please?",
    example_sentence: 'Tips: Jauh lebih ramah, natural, dan profesional dibandingkan kata kasar "What?".',
  },
  {
    id: 'card-sc-3',
    module_id: 'mod-starter-conversation',
    front_text: 'Template membeli waktu 3-5 detik untuk berpikir saat diajak bicara tanpa terdengar gugup:',
    back_text: "That's an interesting question, let me think about that for a second...",
    example_sentence: 'Tips: Kalimat penyelamat daripada bergumam "Ummm..." atau terdiam kaku.',
  },
  {
    id: 'card-sc-4',
    module_id: 'mod-starter-conversation',
    front_text: 'Cara mengakhiri obrolan santai secara sopan dan meninggalkan kesan positif:',
    back_text: "It was really great chatting with you! I have to head out now, but let's definitely stay in touch.",
    example_sentence: 'Tips: Penutup percakapan elegan dengan memberi apresiasi sebelum berpamitan.',
  },
  // ==========================================
  // CARDS: TOEFL INVERSION
  // ==========================================
  {
    id: 'card-inv-1',
    module_id: 'mod-toefl-inversion',
    front_text: 'Hardly ______ the station when the torrential rain started.',
    back_text: 'had we reached',
    example_sentence: 'Kunci TOEFL: Negative adverb "Hardly" di awal mewajibkan inversi (had + S + V3). Pasangan katanya adalah "when".',
  },
  {
    id: 'card-inv-2',
    module_id: 'mod-toefl-inversion',
    front_text: 'Not only ______ outstanding results, but she also won the scholarship.',
    back_text: 'did she achieve',
    example_sentence: 'Kunci TOEFL: "Not only" di awal kalimat butuh auxiliary (did) sebelum subjek (she) dan V1 murni (achieve).',
  },
  {
    id: 'card-inv-3',
    module_id: 'mod-toefl-inversion',
    front_text: '______ received the warning earlier, they would have evacuated.',
    back_text: 'Had they',
    example_sentence: 'Kunci TOEFL: Bentuk inversi Conditional Type 3 pengganti "If they had received" adalah "Had they received".',
  },
  {
    id: 'card-inv-4',
    module_id: 'mod-toefl-inversion',
    front_text: 'Under no circumstances ______ reveal this security code.',
    back_text: 'should you',
    example_sentence: 'Kunci TOEFL: "Under no circumstances" berarti larangan keras; auxiliary "should" mendahului subjek "you".',
  },

  // ==========================================
  // CARDS: TOEFL REDUCED CLAUSES
  // ==========================================
  {
    id: 'card-red-1',
    module_id: 'mod-toefl-reduced-clauses',
    front_text: 'The archaeological artifacts ______ in the tomb date back to 300 BC.',
    back_text: 'discovered',
    example_sentence: 'Kunci TOEFL: Bentuk reduksi pasif dari "which were discovered" -> cukup "discovered" (V3 tanpa to be).',
  },
  {
    id: 'card-red-2',
    module_id: 'mod-toefl-reduced-clauses',
    front_text: 'Anyone ______ to join the research committee must submit a proposal.',
    back_text: 'wishing',
    example_sentence: 'Kunci TOEFL: Bentuk reduksi aktif dari "who wishes" adalah Present Participle "wishing" (-ing).',
  },
  {
    id: 'card-red-3',
    module_id: 'mod-toefl-reduced-clauses',
    front_text: 'Although ______ by severe storms, the spacecraft landed safely.',
    back_text: 'battered',
    example_sentence: 'Kunci TOEFL: Reduksi klausa adverbial pasif "Although it was battered" -> "Although battered".',
  },
  {
    id: 'card-red-4',
    module_id: 'mod-toefl-reduced-clauses',
    front_text: 'Apa kesalahan kalimat: "Walking down the street, a falling branch hit Sarah"?',
    back_text: 'Dangling Modifier (Dahan pohon tidak sedang berjalan kaki).',
    example_sentence: 'Perbaikan benar: "Walking down the street, Sarah was hit by a falling branch."',
  },

  // ==========================================
  // CARDS: TOEFL SUBJUNCTIVE
  // ==========================================
  {
    id: 'card-sub-1',
    module_id: 'mod-toefl-subjunctive',
    front_text: 'The committee insisted that the candidate ______ present during the review.',
    back_text: 'be',
    example_sentence: 'Kunci TOEFL: Mandative verb "insisted that" mewajibkan bare infinitive "be", bukan "was" atau "is".',
  },
  {
    id: 'card-sub-2',
    module_id: 'mod-toefl-subjunctive',
    front_text: 'It is essential that each student ______ their assignment before midnight.',
    back_text: 'submit',
    example_sentence: 'Kunci TOEFL: "It is essential that" menuntut V1 murni tanpa akhiran -s, terlepas dari subjek tunggal "each student".',
  },
  {
    id: 'card-sub-3',
    module_id: 'mod-toefl-subjunctive',
    front_text: 'The doctor urged that the patient ______ any heavy lifting for a month.',
    back_text: 'not attempt',
    example_sentence: 'Kunci TOEFL: Bentuk negatif subjunctive langsung "not + V1", tanpa menggunakan auxiliary "does not".',
  },

  // ==========================================
  // CARDS: TOEFL SUBJECT-VERB AGREEMENT
  // ==========================================
  {
    id: 'card-sva-1',
    module_id: 'mod-toefl-sv-agreement',
    front_text: 'The professor, accompanied by her graduate research fellows, ______ the conference.',
    back_text: 'is attending (atau attends)',
    example_sentence: 'Kunci TOEFL: Frasa penyela "accompanied by..." diabaikan. Subjek sejati adalah "The professor" (tunggal).',
  },
  {
    id: 'card-sva-2',
    module_id: 'mod-toefl-sv-agreement',
    front_text: 'Neither the administrative staff nor the chief director ______ available.',
    back_text: 'was (atau is)',
    example_sentence: 'Kunci TOEFL: Pada "Neither... nor...", kata kerja mengikuti subjek terdekat yaitu "the chief director" (tunggal).',
  },
  {
    id: 'card-sva-3',
    module_id: 'mod-toefl-sv-agreement',
    front_text: 'Fifty thousand dollars ______ allocated for the lab renovation.',
    back_text: 'was',
    example_sentence: 'Kunci TOEFL: Besaran nominal uang dihitung sebagai kesatuan tunggal (singular subject).',
  },

  // ==========================================
  // CARDS: TOEFL ACADEMIC VOCAB (AWL)
  // ==========================================
  {
    id: 'card-awl-1',
    module_id: 'mod-toefl-awl',
    front_text: 'Corroborate',
    back_text: 'Mengonfirmasi / Memperkuat bukti (Confirm / Substantiate)',
    example_sentence: 'The witness provided forensic evidence to corroborate the timeline.',
  },
  {
    id: 'card-awl-2',
    module_id: 'mod-toefl-awl',
    front_text: 'Delineate',
    back_text: 'Menggambarkan / Memerinci garis batas atau tahapan (Describe accurately)',
    example_sentence: 'The regulation clearly delineates the safety responsibilities of each engineer.',
  },
  {
    id: 'card-awl-3',
    module_id: 'mod-toefl-awl',
    front_text: 'Discrepancy',
    back_text: 'Ketidaksesuaian / Perbedaan mencolok (Inconsistency / Divergence)',
    example_sentence: 'Auditors discovered an inexplicable discrepancy in the quarterly financial ledger.',
  },
  {
    id: 'card-awl-4',
    module_id: 'mod-toefl-awl',
    front_text: 'Synthesize',
    back_text: 'Memadukan beragam ide/sumber menjadi satu kesatuan utuh',
    example_sentence: 'The research paper synthesizes biological data with meteorological findings.',
  },

  // ==========================================
  // CARDS: CONVERSATION IDIOMS
  // ==========================================
  {
    id: 'card-idm-1',
    module_id: 'mod-conv-idioms',
    front_text: 'Hit the nail on the head',
    back_text: 'Menyatakan hal yang persis tepat dan akurat',
    example_sentence: 'You hit the nail on the head when you identified communication as our bottleneck.',
  },
  {
    id: 'card-idm-2',
    module_id: 'mod-conv-idioms',
    front_text: 'Snowed under',
    back_text: 'Kewalahan dengan beban pekerjaan yang sangat banyak',
    example_sentence: "I'd love to join you for dinner, but I'm completely snowed under with grading.",
  },
  {
    id: 'card-idm-3',
    module_id: 'mod-conv-idioms',
    front_text: 'Bite the bullet',
    back_text: 'Menghadapi kenyataan/kesulitan yang tak terelakkan dengan berani',
    example_sentence: "I didn't want to redo the presentation, but I had to bite the bullet and fix it.",
  },
  {
    id: 'card-idm-4',
    module_id: 'mod-conv-idioms',
    front_text: 'Call it a day',
    back_text: 'Menyudahi / Menutup pekerjaan hari ini',
    example_sentence: "We've ironed out the biggest bug; let's call it a day and get some rest.",
  },

  // ==========================================
  // CARDS: CONVERSATION OPINIONS & TEMPLATES
  // ==========================================
  {
    id: 'card-op-1',
    module_id: 'mod-conv-opinions',
    front_text: 'Ungkapan sopan: "Saya paham maksud Anda, tapi coba pertimbangkan..."',
    back_text: 'I take your point, but have you considered...?',
    example_sentence: 'Template diplomatis untuk menyanggah pendapat tanpa memicu tensi emosional.',
  },
  {
    id: 'card-op-2',
    module_id: 'mod-conv-opinions',
    front_text: 'Ungkapan percaya diri: "Saya sangat meyakini bahwa..."',
    back_text: "I'm firmly convinced that...",
    example_sentence: "I'm firmly convinced that investing in continuous learning yields the highest ROI.",
  },
  {
    id: 'card-op-3',
    module_id: 'mod-conv-opinions',
    front_text: 'Ungkapan keraguan halus: "Saya tidak sepenuhnya yakin ini langkah terbaik."',
    back_text: "I'm not entirely convinced that this is our best course of action.",
    example_sentence: 'Sangat natural dipakai dalam forum diskusi kerja dan rapat strategis.',
  },

  // ==========================================
  // CARDS: CONVERSATION MEETINGS
  // ==========================================
  {
    id: 'card-mt-1',
    module_id: 'mod-conv-meetings',
    front_text: 'Ungkapan interupsi sopan saat rapat: "Bolehkah saya menyela sebentar?"',
    back_text: 'Could I jump in here for a second?',
    example_sentence: 'Frasa standar profesional untuk menyampaikan komentar sebelum topik beralih.',
  },
  {
    id: 'card-mt-2',
    module_id: 'mod-conv-meetings',
    front_text: 'Ungkapan kembali ke topik: "Mari kita kembali ke fokus utama kita..."',
    back_text: "Let's circle back to our primary focus...",
    example_sentence: 'Efektif untuk mengendalikan pembicaraan yang mulai melebar keluar agenda.',
  },
  {
    id: 'card-mt-3',
    module_id: 'mod-conv-meetings',
    front_text: 'Ungkapan menunda topik sementara: "Mari kita simpan dulu poin itu untuk nanti."',
    back_text: "Let's park that topic for our next session.",
    example_sentence: 'Istilah bisnis populer "to park an idea" berarti menunda pembahasan ke lain waktu.',
  },
];
