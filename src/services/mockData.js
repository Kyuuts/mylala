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
    cefr_level: 'A1',
    sub_pillar: 'Grammar',
    title: 'Starter Grammar: Rahasia Struktur Kalimat & Jebakan Preposisi',
    content_markdown: `# Starter Grammar: Fondasi Struktur Kalimat (S + V)

## 1. Aturan Emas Kalimat Bahasa Inggris
Setiap kalimat bahasa Inggris yang utuh **WAJIB** memiliki minimal:

> 📐 **Rumus Wajib:**  
> **Subject** + **Verb**

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
    cefr_level: 'A2',
    sub_pillar: 'Grammar',
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
    category: 'Kosakata',
    cefr_level: 'A1',
    sub_pillar: 'Kosakata',
    title: 'Starter Speaking: 5 Template Perkenalan & Small Talk Zero-Gagap',
    content_markdown: `# Starter Speaking: Template Perkenalan & Small Talk Zero-Gagap

## 1. Keluar dari Perkenalan Kaku
Kebanyakan orang cuma bisa mengucapkan: *"My name is... I am 21 years old... I live in..."* lalu suasana menjadi canggung (*awkward silence*).

Untuk terlihat natural dan percaya diri, gunakan formula **Hook 3 Langkah**:

> 💡 **Formula Hook 3 Langkah:**  
> **[Nama Lengkap]** + **[Aktivitas / Minat Terkini]** + **[Pertanyaan Balik]**

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
    cefr_level: 'C1',
    sub_pillar: 'Grammar',
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
    cefr_level: 'C1',
    sub_pillar: 'Grammar',
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
    cefr_level: 'C1',
    sub_pillar: 'Grammar',
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

> 📐 **Rumus Mandative Subjunctive:**  
> **Subject** + **Verb Mandatif** + **that** + **Subject** + **V1 (Bare Infinitive / Bentuk Asli)**

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
    cefr_level: 'B2',
    sub_pillar: 'Grammar',
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
    category: 'Kosakata',
    cefr_level: 'C1',
    sub_pillar: 'Kosakata',
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
    category: 'Kosakata',
    cefr_level: 'B1',
    sub_pillar: 'Kosakata',
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
    category: 'Kosakata',
    cefr_level: 'B1',
    sub_pillar: 'Kosakata',
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
    category: 'Kosakata',
    cefr_level: 'B2',
    sub_pillar: 'Kosakata',
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
  {
    id: 'mod-conjunctions',
    category: 'Konjungsi',
    cefr_level: 'B1',
    sub_pillar: 'Konjungsi',
    title: 'Mastering Conjunctions: Jembatan Logika & Transisi Antar Kalimat',
    content_markdown: `# Conjunctions & Connectors: Jembatan Logika Antar Kalimat

## 1. Mengapa Konjungsi Penentu Kefasihan?
Kalimat pemula cenderung terputus-putus (*choppy*). Konjungsi adalah perekat yang menghubungkan dua ide menjadi alur yang mengalir mulus (*cohesive flow*).

---

## 2. 3 Kelompok Utama Konjungsi

### A. Kontras & Pertentangan (Contrast)
* **However / Nevertheless**: Digunakan di awal kalimat baru, diikuti tanda koma.
  > *"The weather was terrible. However, the flight departed on schedule."*
* **Although / Even though**: Menempel di anak kalimat klausa bertentangan.
  > *"Although he lacked formal training, he delivered an exceptional presentation."*
* **Despite / In spite of**: Diikuti kata benda (Noun) atau Gerund (-ing), bukan subjek + kata kerja.
  > *"Despite the heavy rain, they continued the survey."*

---

### B. Sebab - Akibat (Cause & Effect)
* **Therefore / Consequently**: Akibat logis di kalimat berikutnya.
  > *"Sales dropped sharply. Therefore, the team revised their marketing strategy."*
* **Since / Because / As**: Menyatakan alasan atau latar belakang.
  > *"Since we have reached our quarterly target, all team members will receive a bonus."*

---

### C. Penambahan Ide (Addition)
* **Furthermore / Moreover / In addition**: Menambahkan argumen pendukung yang memperkuat.
  > *"The hotel is affordable. Furthermore, it is conveniently located near the metro."*
`,
    created_at: new Date('2026-01-09T00:00:00Z').toISOString(),
  },

  {
    id: 'mod-a1-daily-vocab',
    category: 'Kosakata',
    cefr_level: 'A1',
    sub_pillar: 'Kosakata',
    title: 'A1 Daily Vocab: 30 Kosakata Inti Aktivitas Harian & Jam Waktu',
    content_markdown: "# A1 Daily Vocab: Aktivitas Harian & Jam Waktu\n\n## 1. Menjalani Hari dengan Kosakata Alami\nDalam percakapan tingkat dasar (A1), menceritakan rutinitas harian (*daily routines*) adalah topik paling esensial. Hindari menghafal kata secara terpisah, hafalkan dalam bentuk **Collocation (Pasangan Kata)**:\n\n| Waktu | Frasa Rutinitas | Arti | Contoh Kalimat |\n| :--- | :--- | :--- | :--- |\n| **Pagi** | **wake up / get up** | Bangun tidur | \"I usually **wake up** at 6:00 AM.\" |\n| **Pagi** | **have breakfast** | Sarapan | \"She **has breakfast** with her brother.\" |\n| **Siang** | **head to work / campus** | Berangkat kerja/kuliah | \"They **head to work** by motorcycle.\" |\n| **Sore** | **get home / clock out** | Sampai rumah / pulang | \"I **get home** around 5:30 PM.\" |\n| **Malam** | **turn in / go to bed** | Pergi tidur | \"We **go to bed** before midnight.\" |\n\n---\n\n## 2. Aturan Emas Preposisi Waktu: AT vs ON vs IN\nIngat piramida waktu ini agar tidak pernah tertukar lagi:\n\n* 🎯 **AT** (Waktu Sangat Spesifik):  \n  Gunakan untuk **jam** dan **momen titik tertentu**.  \n  * *Contoh:* **at** 7:30 AM, **at** noon, **at** night, **at** midnight.\n* 📅 **ON** (Hari & Tanggal):  \n  Gunakan untuk **nama hari** dan **tanggal kalender**.  \n  * *Contoh:* **on** Monday, **on** my birthday, **on** October 15th.\n* 🗓️ **IN** (Periode Luas & Bagian Hari):  \n  Gunakan untuk **bulan, tahun, musim, & bagian hari**.  \n  * *Contoh:* **in** the morning, **in** July, **in** 2026, **in** summer.\n",
    created_at: new Date('2026-01-10T00:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a1-question-words',
    category: 'Grammar',
    cefr_level: 'A1',
    sub_pillar: 'Grammar',
    title: 'A1 Question Magic: Rumus 5W+1H & Tanya Jawab Spontan',
    content_markdown: "# A1 Question Magic: Rumus 5W+1H & Tanya Jawab Spontan\n\n## 1. Rumus Universal Membuat Pertanyaan\nJangan takut membuat pertanyaan bahasa Inggris! Hampir 90% kalimat tanya di dunia menggunakan rumus pasti ini:\n\n> 📐 **Rumus 4 Blok:**  \n> **[Question Word]** + **[Auxiliary: Do/Does/Is/Are]** + **[Subject]** + **[Main Verb]?**\n\n* *Contoh:*  \n  * **Where** + **do** + **you** + **live?**  \n  * **What** + **does** + **he** + **study?**  \n  * **Why** + **are** + **they** + **laughing?**\n\n---\n\n## 2. Arti & Fungsi 5W + 1H\n* **What** = Menanyakan benda/hal/kegiatan (*\"What is your name?\"*)\n* **Where** = Menanyakan tempat/lokasi (*\"Where is the restroom?\"*)\n* **When** = Menanyakan waktu (*\"When does the train depart?\"*)\n* **Who** = Menanyakan orang sebagai subjek (*\"Who is that woman?\"*)\n* **Why** = Menanyakan alasan/sebab (dijawab dengan *\"Because...\"*)\n* **How** = Menanyakan cara, kondisi, atau kuantitas (*\"How do you get to campus?\"*)\n\n---\n\n## 3. Pertanyaan Yes/No (Tanpa 5W1H)\nCukup buang blok pertama, dan langsung mulai dari kata bantu (*Auxiliary*):\n* *\"**Do you** like Indonesian coffee?\"* -> *\"Yes, I do / No, I don't.\"*\n* *\"**Is she** an international student?\"* -> *\"Yes, she is / No, she isn't.\"*\n",
    created_at: new Date('2026-01-10T01:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a1-pronouns-possessives',
    category: 'Grammar',
    cefr_level: 'A1',
    sub_pillar: 'Grammar',
    title: 'A1 Pronoun Mastery: Subject, Object, Possessive (I vs Me vs My vs Mine)',
    content_markdown: "# A1 Pronoun Mastery: Subject, Object, Possessive\n\n## 1. Tabel Lengkap Kata Ganti Orang\nBanyak pemula tertukar antara *\"give me\"* dan *\"give I\"*, atau *\"my bag\"* dan *\"the bag is mine\"*. Perhatikan perbedaannya:\n\n| Subjek (Pelaku) | Objek (Penerima) | Possessive Adj (+ Noun) | Possessive Pronoun (Mandiri) |\n| :--- | :--- | :--- | :--- |\n| **I** (Saya) | **Me** | **My** book | The book is **mine** |\n| **You** (Kamu) | **You** | **Your** laptop | The laptop is **yours** |\n| **He** (Dia lk) | **Him** | **His** car | The car is **his** |\n| **She** (Dia pr) | **Her** | **Her** phone | The phone is **hers** |\n| **We** (Kita) | **Us** | **Our** house | The house is **ours** |\n| **They** (Mereka) | **Them** | **Their** project | The project is **theirs** |\n| **It** (Benda/Hewan) | **It** | **Its** color | *(Jarang digunakan)* |\n\n---\n\n## 2. Jebakan Paling Sering: Its vs It's\n* **It's** (pakai apostrof) = Singkatan dari **It is** atau **It has**.  \n  * *Contoh:* \"It's raining outside.\" *(Hari ini sedang hujan).*\n* **Its** (tanpa apostrof) = Kata ganti **kepemilikan** milik hewan/perusahaan/benda.  \n  * *Contoh:* \"The company increased **its** annual revenue.\"\n",
    created_at: new Date('2026-01-10T02:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-comparatives',
    category: 'Grammar',
    cefr_level: 'A2',
    sub_pillar: 'Grammar',
    title: 'A2 Comparison: Rahasia Komparatif & Superlatif (Bigger, Better, The Best)',
    content_markdown: "# A2 Comparison: Rahasia Komparatif & Superlatif\n\n## 1. Membandingkan Dua Hal (Comparative)\nSaat membandingkan benda A dan B, perhatikan jumlah suku kata (*syllables*):\n\n* **1 Suku Kata:** Tambahkan akhiran **-er + than**.  \n  * Fast -> **faster than** (*\"A train is faster than a bus.\"*)  \n  * Cheap -> **cheaper than** (*\"Coffee here is cheaper than there.\"*)\n* **2+ Suku Kata:** Gunakan **more + adjective + than**.  \n  * Modern -> **more modern than**  \n  * Expensive -> **more expensive than**\n\n---\n\n## 2. Menyatakan \"Paling / Ter-\" (Superlative)\n* **1 Suku Kata:** Gunakan **the + adjective-est**.  \n  * The **fastest**, the **cheapest**, the **coldest**.\n* **2+ Suku Kata:** Gunakan **the most + adjective**.  \n  * The **most comfortable**, the **most popular**.\n\n---\n\n## 3. Bentuk Pengecualian (Wajib Dihafal!)\nKata-kata ini tidak mengikuti aturan di atas:\n* **Good** -> **Better** (lebih baik) -> **The Best** (terbaik)\n* **Bad** -> **Worse** (lebih buruk) -> **The Worst** (terburuk)\n* **Far** -> **Farther / Further** (lebih jauh) -> **The Farthest / Furthest**\n",
    created_at: new Date('2026-01-11T00:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-modal-verbs',
    category: 'Grammar',
    cefr_level: 'A2',
    sub_pillar: 'Grammar',
    title: 'A2 Modal Verbs: Cara Tepat Pakai Can, Could, Should, Must & Have To',
    content_markdown: "# A2 Modal Verbs: Cara Tepat Pakai Modalitas\n\n## 1. Aturan Emas Modal Verbs\nSemua kata kerja bantu modal (*can, could, should, must, may*) **SELALU** diikuti oleh **Verb 1 Polos** (bare infinitive).  \n* *Salah:* \"He can plays guitar.\" / \"You must to go.\"  \n* *Benar:* \"He **can play** guitar.\" / \"You **must go**.\"\n\n---\n\n## 2. Peta Fungsi Modal Verbs A2\n\n| Modal | Makna Utama | Nuansa / Situasi | Contoh Kalimat |\n| :--- | :--- | :--- | :--- |\n| **Can** | Kemampuan / Izin santai | Masa sekarang (*present*) | \"I **can speak** three languages.\" |\n| **Could** | Permintaan sopan | Lebih halus dari *can* | \"**Could you please** open the window?\" |\n| **Should** | Saran / Nasihat baik | Sebaiknya dilakukan | \"You look sick; you **should see** a doctor.\" |\n| **Must** | Kewajiban mutlak | Aturan tegas / urgensi | \"All drivers **must stop** at a red light.\" |\n| **Have to** | Keharusan eksternal | Tuntutan keadaan/hukum | \"I **have to finish** this report by 5 PM.\" |\n\n---\n\n## 3. Perbedaan Kritis: Must Not vs Don't Have To\n* **Must not** = **DILARANG KERAS** (*prohibition*).  \n  * *\"You **must not smoke** in the hospital.\"*\n* **Don't have to** = **TIDAK WAJIB** (boleh dilakukan, boleh tidak).  \n  * *\"Tomorrow is Sunday, so I **don't have to wake up** early.\"*\n",
    created_at: new Date('2026-01-11T01:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-directions-travel',
    category: 'Kosakata',
    cefr_level: 'A2',
    sub_pillar: 'Kosakata',
    title: 'A2 Travel & Navigation: Panduan Bertanya Arah, Transportasi & Reservasi',
    content_markdown: "# A2 Travel & Navigation: Tanya Arah & Transportasi\n\n## 1. Menanyakan Arah dengan Sopan\nKetika tersesat di luar negeri atau mencari lokasi, gunakan pembuka kalimat sopan ini:\n\n* *\"**Excuse me, could you tell me how to get to** the nearest MRT station?\"*\n* *\"**Is there a pharmacy around here?**\"*\n* *\"**How far is it to** the city center on foot?\"*\n\n---\n\n## 2. Memahami Petunjuk Jalan (Directions)\n* **Go straight** = Lurus terus (*\"Go straight for two blocks.\"*)\n* **Turn left / Turn right** = Belok kiri / kanan (*\"Turn right at the traffic lights.\"*)\n* **Cross the street** = Seberangi jalan (*\"Cross the street at the pedestrian crossing.\"*)\n* **Next to / Beside** = Tepat di samping (*\"The cafe is next to the bank.\"*)\n* **Across from / Opposite** = Berseberangan (*\"The library is across from the park.\"*)\n\n---\n\n## 3. Memesan Tiket & Makanan\n* *\"**I would like to book a table for two** at 7 PM tonight.\"*\n* *\"**A one-way ticket to** Bandung, please.\"*\n* *\"**How much does this cost?** Can I pay by card?\"*\n",
    created_at: new Date('2026-01-11T02:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-future-plans',
    category: 'Grammar',
    cefr_level: 'A2',
    sub_pillar: 'Grammar',
    title: 'A2 Future Time: Membedakan Will vs Be Going To vs Present Continuous',
    content_markdown: "# A2 Future Time: Rencana Masa Depan Tanpa Ragu\n\n## 1. Tiga Wajah Masa Depan dalam Bahasa Inggris\nBanyak pembelajar selalu memakai kata **will** untuk semua hal di masa depan. Padahal penutur asli (*native speakers*) membedakannya dengan sangat spesifik:\n\n---\n\n## 2. Kapan Menggunakan Masing-masing Pola?\n\n### A. Will + V1 (Keputusan Spontan & Janji)\nDipakai saat keputusan diambil **detik ini juga** atau saat berjanji.\n* *\"The doorbell is ringing. I **will get** it!\"* *(Spontan).*\n* *\"I promise I **will call** you as soon as I arrive.\"* *(Janji).*\n\n### B. Be Going To + V1 (Rencana & Bukti Nyata)\nDipakai saat Anda sudah punya **niat sebelumnya**, atau saat ada **tanda fisik nyata** di depan mata.\n* *\"I **am going to buy** a new laptop next month; I have been saving up.\"* *(Rencana).*\n* *\"Look at those dark storm clouds! It **is going to rain**.\"* *(Bukti fisik).*\n\n### C. Present Continuous (Jadwal Pasti dengan Waktu & Tempat)\nDipakai saat janji temu sudah **100% terkunci** (ada tiket, jadwal dokter, dsb).\n* *\"We **are flying** to Singapore next Friday morning.\"* *(Tiket sudah dibeli).*\n* *\"I **am seeing** the doctor at 3:00 PM tomorrow.\"*\n",
    created_at: new Date('2026-01-11T03:00:00.000Z').toISOString(),
  },

  // --- LEVEL A1 EXPANSION (6 to 10) ---
  {
    id: 'mod-a1-to-be',
    category: 'Grammar',
    cefr_level: 'A1',
    sub_pillar: 'Grammar',
    title: 'A1 Grammar: Penguasaan Mutlak To Be (Am, Is, Are) & Kalimat Nominal',
    content_markdown: `# A1 Grammar: Penguasaan Mutlak To Be & Kalimat Nominal

## 1. Kapan Menggunakan To Be?
To Be (*am, is, are*) digunakan ketika kalimat **TIDAK memiliki kata kerja aksi** (*no action verb*). To Be berfungsi sebagai jembatan penghubung antara subjek dengan:
1. **Profesi / Identitas:** *"She is an architect."*
2. **Sifat / Kondisi:** *"They are very happy today."*
3. **Lokasi:** *"We are at the library."*
4. **Usia:** *"I am 21 years old."* (Bukan *"I have 21 years"*).

---

## 2. Pasangan Subjek & Bentuk Singkat Alami

| Subjek | To Be (Positif) | Bentuk Singkat (*Contraction*) | Bentuk Negatif |
| :--- | :--- | :--- | :--- |
| **I** | am | **I'm** | I'm not |
| **You / We / They** | are | **You're / We're / They're** | aren't *(are not)* |
| **He / She / It** | is | **He's / She's / It's** | isn't *(is not)* |

---

## 3. Dua Jebakan Terbesar Pemula
* ❌ *Salah:* "I am agree with you."  
  ✅ *Benar:* "**I agree** with you."  
  *(Kata 'agree' sudah merupakan kata kerja aksi, jangan tambahkan 'am'!)*
* ❌ *Salah:* "He is play football."  
  ✅ *Benar:* "**He plays** football." (kebiasaan) ATAU "**He is playing** football." (sedang berlangsung).

---

## 4. Pola Tanya Cepat (Yes/No Question)
Tukar posisi To Be ke paling depan:
* *"**Are you** ready?"* -> *"Yes, I am / No, I'm not."*
* *"**Is this** your bag?"* -> *"Yes, it is / No, it isn't."*
`,
    created_at: new Date('2026-01-10T03:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a1-numbers-prices',
    category: 'Kosakata',
    cefr_level: 'A1',
    sub_pillar: 'Kosakata',
    title: 'A1 Survival: Angka, Harga, Uang & Template Belanja Praktis',
    content_markdown: `# A1 Survival: Angka, Harga & Belanja Tanpa Bingung

## 1. Membaca Angka Ratusan, Ribuan, & Desimal
* **100** = *One hundred* (atau *A hundred*)
* **350** = *Three hundred (and) fifty*
* **1,000** = *One thousand*
* **25,000** = *Twenty-five thousand*
* **$19.99** = *"Nineteen ninety-nine"* atau *"Nineteen dollars and ninety-nine cents"*

> ⚠️ **Aturan Emas:** Kata *hundred*, *thousand*, dan *million* **TIDAK PERNAH** diberi akhiran **-s** jika didahului angka pasti!  
> * *Salah:* "Three hundreds dollars"  
> * *Benar:* "**Three hundred** dollars"

---

## 2. Membedakan Pengucapan -TEEN vs -TY
Kesalahan mendengar harga paling sering terjadi pada angka belasan vs puluhan:
* **-TEEN (13-19):** Tekanan suara di suku kata **KEDUA / AKHIR** (*thir-TEEN, fif-TEEN*).
* **-TY (20-90):** Tekanan suara di suku kata **PERTAMA** (*THIR-ty, FIF-ty*).

---

## 3. Template Percakapan Belanja Otomatis
* *Tanya Harga:* "**How much is this?**" / "**How much does this cost?**"
* *Minta Ukuran/Warna Lain:* "**Do you have this in a larger size / in black?**"
* *Metode Pembayaran:* "**Can I pay by card, or cash only?**"
* *Memutuskan Membeli:* "**I'll take this one, please.**" *(Lebih alami dibanding "I want to buy this").*
`,
    created_at: new Date('2026-01-10T04:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a1-prepositions-place',
    category: 'Grammar',
    cefr_level: 'A1',
    sub_pillar: 'Grammar',
    title: 'A1 Grammar: Preposisi Posisi & Tempat (In, On, At, Under, Next to, Between)',
    content_markdown: `# A1 Grammar: Preposisi Ruang & Posisi Tempat

## 1. Piramida Emas Ruang Fisik: IN vs ON vs AT
* 📦 **IN (Di Dalam Wadah / Ruang Tertutup / Wilayah):**  
  *in the room, in my bag, in a box, in Jakarta, in Indonesia*.
* 📄 **ON (Menempel di Atas Permukaan / Lantai / Jalan):**  
  *on the table, on the wall, on the 2nd floor, on Sudirman Street*.
* 📍 **AT (Titik Lokasi / Tempat Tujuan Spesifik):**  
  *at the bus stop, at the entrance, at home, at the airport*.

---

## 2. Jebakan Spesial Kendaraan: ON vs IN
Ingat rumus kaki melangkah:
* Jika di dalam kendaraan Anda **bisa berdiri atau berjalan**, gunakan **ON**:  
  * **on** the bus, **on** the train, **on** the plane, **on** a ship.
* Jika di dalam kendaraan Anda **harus langsung duduk membungkuk**, gunakan **IN**:  
  * **in** the car, **in** a taxi, **in** a helicopter.

---

## 3. Preposisi Posisi Lain yang Sangat Sering Dipakai
* **Next to / Beside:** Tepat di sebelah (*"The bank is next to the cafe."*)
* **Between:** Di antara dua hal (*"I sat between Brian and Maya."*)
* **In front of vs Behind:** Di depan vs Di belakang (*"Wait for me in front of the lobby."*)
* **Under:** Di bawah permukaan tertutup (*"The cat is sleeping under the bed."*)
`,
    created_at: new Date('2026-01-10T05:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a1-food-cafe',
    category: 'Templates',
    cefr_level: 'A1',
    sub_pillar: 'Templates',
    title: 'A1 Speaking: Cara Memesan Makanan & Minuman di Kafe/Restoran Tanpa Grogi',
    content_markdown: `# A1 Speaking: Memesan Makanan & Minuman di Restoran

## 1. Keluar dari Kata Kasar "I Want..."
Di dunia nyata, mengatakan *"I want a coffee"* terdengar menuntut dan kurang sopan bagi penutur asli. Gunakan 2 formula sopan ini:

> ☕ **Formula Pemesanan Sopan:**  
> 1. **"Could I please get a/an [Menu]?"**  
> 2. **"I'd like [Menu], please."** *(I'd like = I would like)*

---

## 2. Alur Percakapan Standar di Kafe
1. **Pelayan:** *"Hi, what can I get started for you today?"*  
   **Anda:** *"Hi! Could I please get an iced latte with oat milk?"*
2. **Pelayan:** *"What size would you like? (Small, Medium, Large)?"*  
   **Anda:** *"Medium, please."*
3. **Pelayan:** *"For here or to go?"* *(Makan di sini atau dibawa pulang?)*  
   **Anda:** *"For here, please."* ATAU *"To go, please."*
4. **Pelayan:** *"Anything else for you today?"*  
   **Anda:** *"That'll be all, thank you."*

---

## 3. Template Meminta Bantuan & Bayar
* *Tanya Rekomendasi:* "**What do you recommend?**"
* *Cek Komposisi Alergi:* "**Is this vegetarian / dairy-free / spicy?**"
* *Minta Struk/Tagihan:* "**Could we have the bill/check, please?**"
`,
    created_at: new Date('2026-01-10T06:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a1-family-appearance',
    category: 'Kosakata',
    cefr_level: 'A1',
    sub_pillar: 'Kosakata',
    title: 'A1 Vocab: Mendeskripsikan Keluarga, Penampilan Fisik & Sifat Dasar',
    content_markdown: `# A1 Vocab: Deskripsi Keluarga, Penampilan & Karakter

## 1. Kosakata Anggota Keluarga
* **Orang Tua & Saudara:** *parents, father/mother, older brother, younger sister, only child (anak tunggal)*.
* **Keluarga Besar:** *grandparents, uncle, aunt, cousin (sepupu), nephew (keponakan lk), niece (keponakan pr)*.
* **Status:** *single, married, divorced*.

---

## 2. Aturan Tata Bahasa: IS vs HAS untuk Penampilan
Banyak pemula salah menggabungkan kata kerja saat menggambarkan fisik:

| Fitur | Pola Kalimat | Contoh Benar |
| :--- | :--- | :--- |
| **Postur Tubuh / Usia** | **Subject + IS/ARE + Adjective** | "He is **tall and slim**." |
| **Rambut & Mata** | **Subject + HAS/HAVE + Noun** | "She has **curly brown hair** and blue eyes." |

> ❌ *Salah:* "She is long hair."  
> ✅ *Benar:* "She **has** long hair." ATAU "Her hair **is** long."

---

## 3. Kata Sifat Kepribadian Positif & Ramah
* **Friendly:** Ramah dan mudah bergaul (*"My classmates are very friendly."*)
* **Hard-working:** Rajin dan gigih (*"He is a hard-working software engineer."*)
* **Polite:** Sopan santun (*"The receptionist was extremely polite."*)
* **Humorous / Funny:** Lucu dan punya selera humor (*"My uncle is always humorous."*)
`,
    created_at: new Date('2026-01-10T07:00:00.000Z').toISOString(),
  },

  // --- LEVEL A2 EXPANSION (6 to 10) ---
  {
    id: 'mod-a2-past-simple-irregulars',
    category: 'Grammar',
    cefr_level: 'A2',
    sub_pillar: 'Grammar',
    title: 'A2 Grammar: 50 Irregular Verbs Paling Populer & Pola Lampau',
    content_markdown: `# A2 Grammar: 50 Irregular Verbs Paling Sering Muncul

## 1. Rahasia Menghafal Tanpa Stres: Sistem Keluarga Suara
Jangan menghafal alfabetis dari A-Z! Hafalkan berdasarkan kesamaan pola bunyinya:

### A. Pola "i -> a -> u" (Vokal Berubah)
* **Sing -> Sang -> Sung** (Bernyanyi)
* **Swim -> Swam -> Swum** (Berenang)
* **Drink -> Drank -> Drunk** (Minum)
* **Begin -> Began -> Begun** (Memulai)

### B. Pola Akhiran "-ought / -aught"
* **Buy -> Bought** (Membeli)
* **Think -> Thought** (Berpikir)
* **Bring -> Brought** (Membawa)
* **Catch -> Caught** (Menangkap)

### C. Pola Sama Persis (Bentuk V1 = V2 = V3)
* **Cost -> Cost** (Berharga)
* **Cut -> Cut** (Memotong)
* **Put -> Put** (Meletakkan)
* **Let -> Let** (Membiarkan)

---

## 2. Jebakan Fatal: Menggunakan V2 Setelah DID / DIDN'T
Dalam kalimat tanya dan kalimat negatif masa lampau, kata kerja **WAJIB KEMBALI KE V1** karena sudah ada kata bantu *did/didn't*!
* ❌ *Salah:* "I didn't saw him yesterday."  
  ✅ *Benar:* "I didn't **see** him yesterday."
* ❌ *Salah:* "Did you went to the concert?"  
  ✅ *Benar:* "Did you **go** to the concert?"
`,
    created_at: new Date('2026-01-11T04:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-past-continuous',
    category: 'Grammar',
    cefr_level: 'A2',
    sub_pillar: 'Grammar',
    title: 'A2 Grammar: Past Continuous vs Past Simple (Kejadian Menyela di Masa Lalu)',
    content_markdown: `# A2 Grammar: Past Continuous vs Past Simple

## 1. Konsep "Sedang Berlangsung vs Menyela"
Gunakan kombinasi tenses ini saat ada satu aksi yang **sedang berjalan dengan durasi panjang**, lalu tiba-tiba terjadi **aksi singkat yang menyela**:

> 📐 **Dua Pola Baku:**  
> 1. **While / As** + **was/were + V-ing**, **Verb 2 (Past Simple)**  
> 2. **was/were + V-ing** + **when** + **Verb 2 (Past Simple)**

* *Contoh 1:*  
  "**While I was cooking** dinner, the telephone **rang**."  
  *(Memasak butuh waktu lama, dering telepon terjadi seketika).*
* *Contoh 2:*  
  "They **were driving** to Bandung **when** the tire **went flat**."

---

## 2. Dua Aksi Bersamaan di Masa Lalu (While ... While ...)
Jika dua aksi sama-sama berlangsung panjang pada waktu yang bersamaan, gunakan *Past Continuous* pada kedua klausa:
* *"While Brian **was studying**, his sister **was listening** to music."*

---

## 3. Peringatan: Stative Verbs Tidak Boleh Continuous!
Kata kerja perasaan, kepemilikan, dan pikiran tidak boleh berakhiran -ing:
* ❌ *Salah:* "I was knowing the answer."  
  ✅ *Benar:* "I **knew** the answer."
`,
    created_at: new Date('2026-01-11T05:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-connecting-words',
    category: 'Grammar',
    cefr_level: 'A2',
    sub_pillar: 'Grammar',
    title: 'A2 Grammar: Kata Hubung Alami (Because, Although, So, But, However)',
    content_markdown: `# A2 Grammar: Merangkai Kalimat Alami dengan Konjungsi

## 1. 4 Hubungan Logika Antar-Kalimat
Jangan biarkan kalimat Anda terputus-putus pendek. Gunakan kata penghubung sesuai fungsinya:

| Fungsi Logika | Kata Hubung | Letak & Pola | Contoh Kalimat |
| :--- | :--- | :--- | :--- |
| **Sebab (*Reason*)** | **Because** | Di tengah / di awal klausa | "I stayed home **because** it was raining." |
| **Akibat (*Result*)** | **So** | Didahului tanda koma | "It was raining heavily, **so** I stayed home." |
| **Kontras Langsung** | **But** | Menghubungkan 2 klausa pendek | "He studied diligently, **but** he didn't pass." |
| **Kontras Anak Kalimat** | **Although / Even though** | Di awal atau tengah kalimat | "**Although** he was exhausted, he completed the project." |
| **Transisi Formal** | **However** | Awal kalimat baru + koma | "The design is sleek. **However,** it is quite costly." |

---

## 2. Jebakan Paling Sering: Mendobel "Although" dan "But"
Dalam bahasa Indonesia, kita sering berkata: *"Meskipun hujan, tapi kami tetap berangkat"*. Di bahasa Inggris, hal ini **SALAH BESAR**:
* ❌ *Salah:* "**Although** it was raining, **but** we still went out."  
* ✅ *Benar:* "**Although** it was raining, we still went out." ATAU "It was raining, **but** we still went out." *(Pilih salah satu saja!)*
`,
    created_at: new Date('2026-01-11T06:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-health-feelings',
    category: 'Kosakata',
    cefr_level: 'A2',
    sub_pillar: 'Kosakata',
    title: 'A2 Vocab: Menjelaskan Gejala Sakit, Obat, & Perasaan Emosi',
    content_markdown: `# A2 Vocab: Komunikasi Kesehatan, Dokter & Emosi

## 1. Cara Menyatakan Rasa Sakit Fisik
Dalam bahasa Inggris, rasa sakit dinyatakan dengan 3 pola utama:

* **Have a + [Sakit]:**  
  * *have a headache* (sakit kepala), *have a toothache* (sakit gigi), *have a stomachache* (sakit perut), *have a sore throat* (radang tenggorokan), *have a fever* (demam).
* **Feel + [Kondisi]:**  
  * *feel dizzy* (pusing keliyengan), *feel nauseous* (mual), *feel weak* (lemas).
* **My [Bagian Tubuh] hurts:**  
  * *"My left knee hurts when I walk."*

---

## 2. Aturan Minum Obat & Petunjuk Dokter
* **Take medicine:** *"Take this pill twice a day after meals."* *(Gunakan 'take', jangan 'drink medicine').*
* **Prescription:** Resep dokter resmi (*"You need a doctor's prescription for this antibiotic."*)
* **Get some rest:** Istirahat cukup (*"You should drink plenty of fluids and get some rest."*)

---

## 3. Kosakata Emosi Sehari-hari
* **Relieved:** Merasa sangat lega (*"I was so relieved after submitting the final report."*)
* **Anxious / Nervous:** Cemas / gugup menghadapi ujian (*"She felt anxious before the interview."*)
* **Exhausted:** Lelah luar biasa (*"After working 10 hours straight, I am exhausted."*)
* **Disappointed:** Kecewa (*"We were disappointed with the test results."*)
`,
    created_at: new Date('2026-01-11T07:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-a2-making-plans',
    category: 'Templates',
    cefr_level: 'A2',
    sub_pillar: 'Templates',
    title: 'A2 Speaking: Mengajak, Menerima, & Menolak Ajakan dengan Sopan',
    content_markdown: `# A2 Speaking: Mengatur Rencana, Janji Temu & Menolak Halus

## 1. Tiga Pola Mengajak yang Natural
* Santai & Akrab: "**Are you free this weekend?**"
* Mengajak Melakukan Sesuatu: "**How about grabbing some lunch together?**" *(Setelah 'How about', gunakan V-ing).*
* Menawarkan Waktu: "**Would you like to meet up on Friday afternoon?**"

---

## 2. Merespon Ajakan
* **Menerima dengan Antusias:**  
  * *"I'd love to! What time should we meet?"*  
  * *"Sounds like a fantastic plan! Count me in."*
* **Menolak Secara Halus (Formula: Apresiasi + Maaf + Alasan + Alternatif):**  
  > *"I'd really love to, but I'm afraid I have another appointment. Could we take a rain check for next week?"*  
  > *(💡 'Take a rain check' adalah idiom populer yang berarti menunda/menjadwalkan ulang di lain waktu).*

---

## 3. Mengonfirmasi & Mengunci Janji
* *"Let's confirm the venue tomorrow morning."*
* *"See you at the coffee shop at 4 PM sharp!"*
`,
    created_at: new Date('2026-01-11T08:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-b1-passive-voice',
    category: 'Grammar',
    cefr_level: 'B1',
    sub_pillar: 'Grammar',
    title: 'B1 Passive Voice: Mengubah Sudut Pandang Kalimat di Laporan & Berita',
    content_markdown: "# B1 Passive Voice: Sudut Pandang Objektif di Berita & Laporan\n\n## 1. Mengapa Passive Voice Begitu Penting?\nDalam ragam formal (akademik, jurnalistik, dan laporan kantor), siapa pelakunya seringkali **tidak penting** atau **sudah jelas**. Yang paling penting adalah **apa yang terjadi pada objeknya**.\n\n* *Aktif:* \"The engineer tested the software yesterday.\" *(Fokus pada insinyurnya).*\n* *Pasif:* \"The software **was tested** yesterday.\" *(Fokus pada kemajuan software).*\n\n---\n\n## 2. Formula Universal Passive Voice\nSemua bentuk kalimat pasif selalu mematuhi satu pola mutlak:\n\n> 📐 **Rumus Inti Pasif:**  \n> **Subject** + **To Be** *(sesuai tenses)* + **Verb 3** *(Past Participle)* (+ **by Agent**)\n\n---\n\n## 3. Matriks Perubahan Tenses Populer\n\n| Tenses | Pola Kalimat Pasif | Contoh Nyata |\n| :--- | :--- | :--- |\n| **Simple Present** | **am/is/are + V3** | \"English **is spoken** worldwide.\" |\n| **Simple Past** | **was/were + V3** | \"The monument **was built** in 1910.\" |\n| **Present Continuous**| **am/is/are + being + V3** | \"The road **is being repaired** right now.\" |\n| **Present Perfect** | **have/has + been + V3** | \"The proposal **has been approved**.\" |\n| **Modal Verbs** | **modal + be + V3** | \"The password **must be changed** regularly.\" |\n",
    created_at: new Date('2026-01-12T00:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-b1-phrasal-verbs',
    category: 'Kosakata',
    cefr_level: 'B1',
    sub_pillar: 'Kosakata',
    title: 'B1 Phrasal Verbs: 25 Kombinasi Kata Kerja yang Paling Sering Dipakai Native',
    content_markdown: "# B1 Phrasal Verbs: Bikin Bahasa Inggrismu Terdengar Alami\n\n## 1. Kunci Utama Menaklukkan Phrasal Verbs\nPhrasal Verbs adalah gabungan **Verb + Preposition** yang maknanya berubah total dari kata aslinya. Jangan artikan kata per kata, pahami maknanya secara utuh:\n\n| Phrasal Verb | Makna Nyata | Contoh Kalimat |\n| :--- | :--- | :--- |\n| **Figure out** | Memecahkan / Menemukan solusi | \"We need to **figure out** what went wrong.\" |\n| **Give up** | Menyerah / Berhenti berusaha | \"Never **give up** on your aspirations.\" |\n| **Look forward to** | Sangat menantikan (antusias) | \"I am **looking forward to** our trip.\" |\n| **Carry out** | Melaksanakan / Menjalankan riset | \"The laboratory will **carry out** the tests.\" |\n| **Call off** | Membatalkan agenda (*cancel*) | \"The meeting was **called off** due to rain.\" |\n| **Put off** | Menunda pekerjaan (*postpone*) | \"Don't **put off** until tomorrow what you can do today.\" |\n| **Run out of** | Kehabisan stok / persediaan | \"Our car **ran out of** fuel on the highway.\" |\n| **Break down** | Mesin mogok / Runtuh emosional | \"The elevator **broke down** this morning.\" |\n\n---\n\n## 2. Jebakan Grammar: 'Look forward to' Diikuti V-ing!\nSetelah kata depan *to* pada *look forward to*, kata kerja berikutnya **WAJIB** berbentuk **Gerund (-ing)**:\n* *Salah:* \"I look forward to meet you.\"\n* *Benar:* \"I look forward to **meeting** you.\"\n",
    created_at: new Date('2026-01-12T01:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-b2-conditionals',
    category: 'Grammar',
    cefr_level: 'B2',
    sub_pillar: 'Grammar',
    title: 'B2 Conditionals Mastery: Type 2, Type 3, & Mixed Conditionals Lintas Waktu',
    content_markdown: "# B2 Conditionals Mastery: Hipotesis & Pengandaian Lintas Waktu\n\n## 1. Mengapa Level B2 Wajib Menguasai Mixed Conditionals?\nDi level B2, situasi kehidupan nyata jarang sekali terjadi di satu garis waktu saja. Seringkali keputusan di masa lampau mempengaruhi kenyataan kita **saat ini**, atau sifat permanen kita mempengaruhi tindakan di **masa lalu**.\n\n---\n\n## 2. Struktur Dua Tipe Mixed Conditionals\n\n### Tipe 1: Aksi Masa Lalu -> Hasil Masa Sekarang\n* *Kondisi:* Tindakan yang tidak terjadi di masa lampau (Past Perfect).  \n* *Hasil:* Dampak yang dirasakan saat ini (Would + Verb 1).  \n> 💡 **Formula:** **If + had + V3, Subject + would + V1 (today/now)**\n* *Contoh:*  \n  \"If she **had accepted** the scholarship to Oxford, she **would be working** in London today.\"  \n  *(Faktanya: Dulu dia menolak, jadi sekarang dia tidak bekerja di London).*\n\n---\n\n### Tipe 2: Karakter/Fakta Sekarang -> Tindakan Masa Lalu\n* *Kondisi:* Fakta atau kemampuan umum seseorang (Simple Past / Were).  \n* *Hasil:* Peristiwa di masa lampau (Would have + V3).  \n> 💡 **Formula:** **If + were / V2, Subject + would have + V3**\n* *Contoh:*  \n  \"If I **spoke** fluent Japanese, I **would have helped** the lost tourists yesterday.\"  \n  *(Faktanya: Saya sekarang memang tidak bisa bahasa Jepang, jadi kemarin saya tidak bisa bantu).*\n\n---\n\n## 3. Inversi Pengandaian (Ciri Khas TOEFL & Dokumen Resmi)\nHilangkan kata \"If\" dan tukar posisi Auxiliary ke depan:\n* *Biasa:* \"If they had arrived earlier...\"  \n* *Inversi:* \"**Had they arrived** earlier, the briefing would have started on time.\"\n",
    created_at: new Date('2026-01-13T00:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-b2-relative-clauses',
    category: 'Grammar',
    cefr_level: 'B2',
    sub_pillar: 'Grammar',
    title: 'B2 Complex Relative Clauses: Mengikat Ide Kompleks (Who, Which, Whose, Whom)',
    content_markdown: "# B2 Complex Relative Clauses: Merangkai Kalimat Kompleks\n\n## 1. Defining vs Non-Defining Clauses\nPerbedaan tanda koma (*comma*) mengubah makna kalimat secara drastis:\n\n### A. Defining Clause (Tanpa Koma)\nInformasi ini **sangat penting** untuk membedakan objek. Jika dihilangkan, kalimat menjadi tidak jelas.\n* *\"The travelers **who booked early** received a 30% discount.\"*  \n  *(Hanya pelancong yang pesan lebih awallah yang dapat diskon).*\n\n### B. Non-Defining Clause (Pakai Dua Koma)\nInformasi ini hanyalah **keterangan tambahan**. Jika dicoret, kalimat utama tetap utuh dan bermakna.  \n> ⚠️ **Aturan Emas:** Jangan pernah gunakan **\"that\"** di dalam non-defining clause! Gunakan **\"which\"** atau **\"who\"**.\n* *\"Mount Merapi, **which erupted in 2010**, remains one of the world's most active volcanoes.\"*\n\n---\n\n## 2. Relative Pronoun Spesifik: Whose & Preposition + Whom\n* **Whose** = Menyatakan kepemilikan.  \n  * *\"The architect **whose blueprint won the contract** will oversee construction.\"*\n* **Preposisi + Whom / Which** (Gaya Akademis Elegan):  \n  * *\"The executive **with whom** we negotiated the deal was highly cooperative.\"*  \n  * *\"The foundation **upon which** this economic theory rests is disputed.\"*\n",
    created_at: new Date('2026-01-13T01:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-b2-business-email',
    category: 'Percakapan',
    cefr_level: 'B2',
    sub_pillar: 'Percakapan',
    title: 'B2 Professional Email & Diplomacy: Seni Menulis Email & Negosiasi Halus',
    content_markdown: "# B2 Professional Email & Diplomacy: Korespondensi Formal\n\n## 1. Menghindari Bahasa yang Terlalu Kaku atau Terlalu Santai\nDi dunia kerja global, menulis email membutuhkan sentuhan **diplomasi dan kejelasan**. Hindari kalimat yang terdengar menuntut (*demanding*).\n\n---\n\n## 2. Template Frasa Diplomatik\n\n### A. Membuka Email & Menanyakan Status\n* Daripada: *\"Any updates on the project?\"* (terlalu santai)\n* Gunakan: *\"**I am writing to inquire regarding** the progress of the collaborative proposal.\"*\n* *\"**Following up on our discussion earlier this week**, I would like to confirm...\"*\n\n### B. Meminta Sesuatu dengan Sopan\n* Daripada: *\"Send me the report by Friday.\"* (kasar/memerintah)\n* Gunakan: *\"**I would be immensely grateful if you could** forward the report by Friday noon.\"*\n* *\"**Could you possibly clarify** the second clause regarding intellectual property?\"*\n\n### C. Menolak Permintaan Secara Elegan (*Polite Refusal*)\n* Daripada: *\"We cannot do that.\"*\n* Gunakan: *\"**While we fully appreciate your perspective**, we are **unable to accommodate** this adjustment at this current stage.\"*\n\n### D. Menutup dengan Citra Positif\n* *\"**Please feel free to reach out** should you require any additional information.\"*\n* *\"**Thank you for your continued cooperation and partnership**.\"*\n",
    created_at: new Date('2026-01-13T02:00:00.000Z').toISOString(),
  },
  {
    id: 'mod-c1-advanced-discourse',
    category: 'Grammar',
    cefr_level: 'C1',
    sub_pillar: 'Grammar',
    title: 'C1 Academic Discourse: Hedging, Stance, & Nuanced Arguments',
    content_markdown: "# C1 Academic Discourse: Hedging & Argumen Bernuansa\n\n## 1. Seni \"Academic Hedging\" (Kehati-hatian Ilmiah)\nDi level C1 dan publikasi jurnal internasional, penulis tidak pernah membuat klaim mutlak seperti *\"This proves that social media is bad\"*. Klaim mutlak dianggap tidak ilmiah dan rentan dibantah. Peneliti menggunakan **hedging** untuk menjaga keabsahan data:\n\n* *Klaim Kasar (Hindari):* \"This finding proves that our hypothesis is right.\"\n* *Hedging Elegan (C1):* \"The empirical evidence **tends to suggest** that...\" / \"The data **appears to indicate** a significant correlation...\"\n\n---\n\n## 2. Kosakata & Penanda Wacana Tingkat Tinggi\n\n| Kata / Frasa C1 | Fungsi Retorika | Contoh Pemakaian Nyata |\n| :--- | :--- | :--- |\n| **Arguably** | Menyatakan opini kuat berdasar | \"This paper is **arguably** the most comprehensive study to date.\" |\n| **Notwithstanding** | Sinonim formal dari *despite* | \"**Notwithstanding** the initial data latency, the neural model converged.\" |\n| **Albeit** | \"Meskipun\" (meringkas kontras) | \"The project succeeded, **albeit** at an extraordinarily steep budget.\" |\n| **Hitherto** | Sampai saat ini / Sebelumnya | \"It revealed patterns that had **hitherto** remained undetected.\" |\n| **Insofar as** | Sepanjang / Sejauh | \"The reform is beneficial **insofar as** it safeguards vulnerable citizens.\" |\n\n---\n\n## 3. Menghubungkan Kontras Tajam Tanpa Terlihat Kasar\nGunakan formula konsesi (*concession structure*):\n> *\"While it is readily acknowledged that [Argumen Lawan], it remains equally undeniable that [Posisi Kita].\"*\n",
    created_at: new Date('2026-01-14T00:00:00.000Z').toISOString(),
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

  // ==========================================
  // CARDS: CONJUNCTIONS & TRANSITIONS
  // ==========================================
  {
    id: 'card-conj-1',
    module_id: 'mod-conjunctions',
    front_text: 'Hubungkan kontras: "The team worked tirelessly. ____, they missed the final deadline."',
    back_text: 'However',
    example_sentence: 'Kunci: "However" mengawali kalimat kontras baru dan selalu diikuti koma.',
  },
  {
    id: 'card-conj-2',
    module_id: 'mod-conjunctions',
    front_text: 'Hubungkan klausa sebab-akibat: "____ we have reached the quarterly target, bonuses will be released."',
    back_text: 'Since',
    example_sentence: 'Kunci: "Since" di awal kalimat dapat berarti "karena / berhubung" (sinonim formal dari Because).',
  },
  {
    id: 'card-conj-3',
    module_id: 'mod-conjunctions',
    front_text: 'Hubungkan kontras dengan kata benda: "____ the severe thunderstorm, the flight landed safely."',
    back_text: 'Despite',
    example_sentence: 'Kunci: "Despite" (atau "In spite of") langsung diikuti noun phrase tanpa "of".',
  },
  {
    id: 'card-conj-4',
    module_id: 'mod-conjunctions',
    front_text: 'Hubungkan penambahan ide: "The course is practical. ____, the mentorship support is exceptional."',
    back_text: 'Furthermore',
    example_sentence: 'Kunci: "Furthermore" menambahkan poin penguat pada argumen sebelumnya.',
  },

  {
    id: 'card-a1-vocab-1',
    module_id: 'mod-a1-daily-vocab',
    front_text: "Lengkapi rutinitas pagi: \"I usually ______ up at 6:00 AM before the morning lecture.\"",
    back_text: "wake",
    example_sentence: "Kunci: \"Wake up\" adalah frasa umum untuk bangun tidur di pagi hari.",
  },
  {
    id: 'card-a1-vocab-2',
    module_id: 'mod-a1-daily-vocab',
    front_text: "Lengkapi frasa sarapan: \"She always ______ breakfast with hot tea before heading out.\"",
    back_text: "has / eats",
    example_sentence: "Kunci: Mengonsumsi sarapan diungkapkan dengan \"have breakfast\" atau \"eat breakfast\".",
  },
  {
    id: 'card-a1-vocab-3',
    module_id: 'mod-a1-daily-vocab',
    front_text: "Preposisi jam: \"The live webinar will begin promptly ______ 8 o'clock tonight.\"",
    back_text: "at",
    example_sentence: "Kunci: Gunakan preposisi \"at\" untuk waktu/jam yang spesifik (at 8 o'clock).",
  },
  {
    id: 'card-a1-vocab-4',
    module_id: 'mod-a1-daily-vocab',
    front_text: "Preposisi hari: \"Our team organizes the weekly evaluation meeting ______ Monday.\"",
    back_text: "on",
    example_sentence: "Kunci: Gunakan preposisi \"on\" untuk nama-nama hari (on Monday, on Friday).",
  },
  {
    id: 'card-a1-q-1',
    module_id: 'mod-a1-question-words',
    front_text: "Tanya tempat tinggal: \"______ do you live?\" — \"I live in South Jakarta.\"",
    back_text: "Where",
    example_sentence: "Kunci: \"Where\" digunakan untuk menanyakan lokasi atau tempat.",
  },
  {
    id: 'card-a1-q-2',
    module_id: 'mod-a1-question-words',
    front_text: "Tanya orang: \"______ is that distinguished professor standing by the podium?\"",
    back_text: "Who",
    example_sentence: "Kunci: \"Who\" digunakan untuk menanyakan identitas orang.",
  },
  {
    id: 'card-a1-q-3',
    module_id: 'mod-a1-question-words',
    front_text: "Bentuk tanya Simple Present (he): \"______ he commute to campus by commuter train?\"",
    back_text: "Does",
    example_sentence: "Kunci: Gunakan kata bantu \"Does\" untuk subjek orang ketiga tunggal (he/she/it).",
  },
  {
    id: 'card-a1-q-4',
    module_id: 'mod-a1-question-words',
    front_text: "Tanya alasan: \"______ are you studying English?\" — \"Because I plan to study abroad.\"",
    back_text: "Why",
    example_sentence: "Kunci: \"Why\" menanyakan alasan atau latar belakang penyebab.",
  },
  {
    id: 'card-a1-pro-1',
    module_id: 'mod-a1-pronouns-possessives',
    front_text: "Possessive pronoun: \"That blue umbrella on the chair is ______; I bought it yesterday.\"",
    back_text: "mine",
    example_sentence: "Kunci: \"Mine\" berdiri sendiri di akhir klausa menggantikan \"my umbrella\".",
  },
  {
    id: 'card-a1-pro-2',
    module_id: 'mod-a1-pronouns-possessives',
    front_text: "Object pronoun: \"Please send ______ the syllabus document via WhatsApp before 5 PM.\"",
    back_text: "me",
    example_sentence: "Kunci: Setelah kata kerja transitif (send), gunakan object pronoun \"me\" (bukan I).",
  },
  {
    id: 'card-a1-pro-3',
    module_id: 'mod-a1-pronouns-possessives',
    front_text: "Kepemilikan benda/perusahaan: \"The university celebrated ______ golden jubilee this month.\"",
    back_text: "its",
    example_sentence: "Kunci: \"Its\" (tanpa apostrof) menyatakan kepemilikan untuk benda/institusi.",
  },
  {
    id: 'card-a1-pro-4',
    module_id: 'mod-a1-pronouns-possessives',
    front_text: "Subjek jamak: \"My colleague and ______ attended the international summit together.\"",
    back_text: "I",
    example_sentence: "Kunci: Karena posisinya sebagai pelaku/subjek kalimat, gunakan \"I\" (bukan me).",
  },
  {
    id: 'card-a2-comp-1',
    module_id: 'mod-a2-comparatives',
    front_text: "Komparatif 1 suku kata: \"Traveling by high-speed train is much ______ than taking the bus.\"",
    back_text: "faster",
    example_sentence: "Kunci: Fast (1 suku kata) menjadi \"faster than\".",
  },
  {
    id: 'card-a2-comp-2',
    module_id: 'mod-a2-comparatives',
    front_text: "Komparatif multi suku kata: \"This flagship smartphone is visibly ______ expensive than last year's.\"",
    back_text: "more",
    example_sentence: "Kunci: Expensive (3 suku kata) membutuhkan kata bantu \"more expensive than\".",
  },
  {
    id: 'card-a2-comp-3',
    module_id: 'mod-a2-comparatives',
    front_text: "Superlatif alam: \"Mount Everest is ______ highest mountain peak on Earth.\"",
    back_text: "the",
    example_sentence: "Kunci: Bentuk superlatif selalu didahului oleh definite article \"the\" (the highest).",
  },
  {
    id: 'card-a2-comp-4',
    module_id: 'mod-a2-comparatives',
    front_text: "Pengecualian Good: \"Her presentation skills are visibly ______ than mine.\"",
    back_text: "better",
    example_sentence: "Kunci: Bentuk komparatif dari \"good\" adalah \"better\" (bukan gooder).",
  },
  {
    id: 'card-a2-mod-1',
    module_id: 'mod-a2-modal-verbs',
    front_text: "Memberi saran bersahabat: \"You have been coughing all day; you ______ rest and drink warm tea.\"",
    back_text: "should",
    example_sentence: "Kunci: \"Should\" digunakan untuk memberikan rekomendasi atau saran yang bijak.",
  },
  {
    id: 'card-a2-mod-2',
    module_id: 'mod-a2-modal-verbs',
    front_text: "Peraturan tegas: \"All airplane passengers ______ fasten their seatbelts during turbulence.\"",
    back_text: "must",
    example_sentence: "Kunci: \"Must\" menyatakan kewajiban mutlak dan aturan keselamatan resmi.",
  },
  {
    id: 'card-a2-mod-3',
    module_id: 'mod-a2-modal-verbs',
    front_text: "Permintaan sopan: \"Excuse me, sir, ______ you please direct me to Room 304?\"",
    back_text: "could",
    example_sentence: "Kunci: \"Could\" adalah bentuk permintaan bantuan yang sangat sopan (*polite request*).",
  },
  {
    id: 'card-a2-mod-4',
    module_id: 'mod-a2-modal-verbs',
    front_text: "Tidak wajib: \"Tomorrow is Sunday, so employees ______ come to the office.\"",
    back_text: "don't have to / do not have to",
    example_sentence: "Kunci: \"Don't have to\" berarti tidak wajib/tidak perlu (bukan dilarang keras).",
  },
  {
    id: 'card-a2-dir-1',
    module_id: 'mod-a2-directions-travel',
    front_text: "Tanya rute: \"Excuse me, could you tell me how to ______ to the central library?\"",
    back_text: "get",
    example_sentence: "Kunci: \"How to get to [place]\" adalah formula paling natural bertanya rute jalan.",
  },
  {
    id: 'card-a2-dir-2',
    module_id: 'mod-a2-directions-travel',
    front_text: "Instruksi belok: \"Walk straight for 200 meters, then ______ left at the bookstore.\"",
    back_text: "turn",
    example_sentence: "Kunci: \"Turn left\" / \"turn right\" = belok kiri / belok kanan.",
  },
  {
    id: 'card-a2-dir-3',
    module_id: 'mod-a2-directions-travel',
    front_text: "Lokasi bersebelahan: \"The 24-hour clinic is situated ______ to the gas station.\"",
    back_text: "next",
    example_sentence: "Kunci: \"Next to\" berarti tepat berdampingan di sebelahnya.",
  },
  {
    id: 'card-a2-dir-4',
    module_id: 'mod-a2-directions-travel',
    front_text: "Pemesanan meja restoran: \"I would like to ______ a table for four at 7 PM tonight.\"",
    back_text: "reserve / book",
    example_sentence: "Kunci: \"Reserve\" atau \"book\" a table = memesan meja makan.",
  },
  {
    id: 'card-a2-fut-1',
    module_id: 'mod-a2-future-plans',
    front_text: "Prediksi bukti fisik: \"Look at those dark storm clouds; it ______ rain heavily soon!\"",
    back_text: "is going to",
    example_sentence: "Kunci: \"Be going to\" digunakan saat ada bukti fisik jelas di depan mata.",
  },
  {
    id: 'card-a2-fut-2',
    module_id: 'mod-a2-future-plans',
    front_text: "Keputusan spontan: \"The office phone is ringing! I ______ pick it up.\"",
    back_text: "will",
    example_sentence: "Kunci: \"Will\" digunakan untuk keputusan kilat yang dibuat saat itu juga.",
  },
  {
    id: 'card-a2-fut-3',
    module_id: 'mod-a2-future-plans',
    front_text: "Jadwal terkunci (ada tiket): \"We ______ to Tokyo next Wednesday on flight NH836.\"",
    back_text: "are flying",
    example_sentence: "Kunci: Present Continuous (\"are flying\") digunakan untuk jadwal yang sudah pasti/teratur.",
  },
  {
    id: 'card-a2-fut-4',
    module_id: 'mod-a2-future-plans',
    front_text: "Membuat janji: \"I promise that I ______ never forget your kindness.\"",
    back_text: "will",
    example_sentence: "Kunci: Kalimat janji (*promises*) secara tata bahasa selalu dipasangkan dengan \"will\".",
  },

  // ==========================================
  // CARDS: A1 EXPANSION (Modules 6-10)
  // ==========================================
  // mod-a1-to-be
  {
    id: 'card-a1-tobe-1',
    module_id: 'mod-a1-to-be',
    front_text: 'Menyatakan usia: "I ______ 22 years old."',
    back_text: 'am',
    example_sentence: 'Kunci A1: Usia dalam bahasa Inggris dinyatakan dengan To Be (am/is/are), bukan "have".',
  },
  {
    id: 'card-a1-tobe-2',
    module_id: 'mod-a1-to-be',
    front_text: 'Perbaiki kalimat: "I am agree with your proposal."',
    back_text: 'I agree with your proposal.',
    example_sentence: 'Kunci A1: Kata "agree" adalah kata kerja aksi, jangan ditambahkan To Be ("am").',
  },
  {
    id: 'card-a1-tobe-3',
    module_id: 'mod-a1-to-be',
    front_text: 'To be subjek jamak: "The university students ______ currently at the library."',
    back_text: 'are',
    example_sentence: 'Kunci A1: Subjek jamak (students) selalu berpasangan dengan "are".',
  },
  {
    id: 'card-a1-tobe-4',
    module_id: 'mod-a1-to-be',
    front_text: 'Bentuk tanya: "______ you ready to start our English discussion?"',
    back_text: 'Are',
    example_sentence: 'Kunci A1: Kalimat tanya nominal memindahkan To Be ke awal kalimat (Are you ready?).',
  },

  // mod-a1-numbers-prices
  {
    id: 'card-a1-num-1',
    module_id: 'mod-a1-numbers-prices',
    front_text: 'Tanya harga barang: "Permisi, berapa harga kemeja ini?"',
    back_text: 'Excuse me, how much is this shirt? (atau how much does this cost?)',
    example_sentence: 'Template belanja paling natural untuk menanyakan harga barang.',
  },
  {
    id: 'card-a1-num-2',
    module_id: 'mod-a1-numbers-prices',
    front_text: 'Aturan ratusan: "The jacket costs three ______ (hundred / hundreds) dollars."',
    back_text: 'hundred',
    example_sentence: 'Kunci A1: Hundred/thousand/million tidak memakai akhiran -s jika ada angka pasti di depannya.',
  },
  {
    id: 'card-a1-num-3',
    module_id: 'mod-a1-numbers-prices',
    front_text: 'Tanya metode pembayaran: "Bisakah saya membayar dengan kartu kredit?"',
    back_text: 'Can I pay by credit card?',
    example_sentence: 'Gunakan preposisi "by" untuk metode pembayaran: by card, by transfer, atau "in cash".',
  },
  {
    id: 'card-a1-num-4',
    module_id: 'mod-a1-numbers-prices',
    front_text: 'Memutuskan membeli: "Saya mau ambil/beli yang ini."',
    back_text: "I'll take this one, please.",
    example_sentence: 'Ungkapan standar penutur asli saat memutuskan membeli barang di kasir.',
  },

  // mod-a1-prepositions-place
  {
    id: 'card-a1-prep-1',
    module_id: 'mod-a1-prepositions-place',
    front_text: 'Preposisi kendaraan besar: "I am currently ______ the commuter train to Jakarta."',
    back_text: 'on',
    example_sentence: 'Kunci A1: Kendaraan umum yang bisa berdiri/berjalan di dalamnya menggunakan preposisi "on".',
  },
  {
    id: 'card-a1-prep-2',
    module_id: 'mod-a1-prepositions-place',
    front_text: 'Preposisi mobil/taksi: "She left her umbrella ______ the taxi."',
    back_text: 'in',
    example_sentence: 'Kunci A1: Kendaraan kecil di mana penumpang langsung duduk membungkuk menggunakan "in".',
  },
  {
    id: 'card-a1-prep-3',
    module_id: 'mod-a1-prepositions-place',
    front_text: 'Posisi bersebelahan: "The modern pharmacy is situated right ______ to the supermarket."',
    back_text: 'next',
    example_sentence: 'Frasa posisi: "next to" berarti persis di samping / berdampingan.',
  },
  {
    id: 'card-a1-prep-4',
    module_id: 'mod-a1-prepositions-place',
    front_text: 'Posisi di antara 2 tempat: "The cafe is located ______ the bank and the bookstore."',
    back_text: 'between',
    example_sentence: 'Gunakan "between" untuk posisi di tengah-tengah dua benda/tempat.',
  },

  // mod-a1-food-cafe
  {
    id: 'card-a1-food-1',
    module_id: 'mod-a1-food-cafe',
    front_text: 'Pemesanan sopan di kafe: "Bisa tolong beri saya satu cangkir kopi panas?"',
    back_text: 'Could I please get a cup of hot coffee? (atau I would like a hot coffee, please)',
    example_sentence: 'Hindari mengatakan "I want...", gunakan "Could I please get..." atau "I would like...".',
  },
  {
    id: 'card-a1-food-2',
    module_id: 'mod-a1-food-cafe',
    front_text: 'Pertanyaan kasir: "For here or to go?" artinya ______',
    back_text: 'Makan di sini atau dibungkus untuk dibawa pulang?',
    example_sentence: 'Jawab dengan: "For here, please" atau "To go, please".',
  },
  {
    id: 'card-a1-food-3',
    module_id: 'mod-a1-food-cafe',
    front_text: 'Meminta struk/tagihan: "Bolehkah kami minta tagihannya?"',
    back_text: 'Could we have the bill, please? (US: check)',
    example_sentence: 'Di Inggris umum memakai "bill", di Amerika Serikat umum memakai "check".',
  },
  {
    id: 'card-a1-food-4',
    module_id: 'mod-a1-food-cafe',
    front_text: 'Tanya rekomendasi menu: "Apa menu yang Anda rekomendasikan?"',
    back_text: 'What do you recommend?',
    example_sentence: 'Frasa ringkas dan percaya diri untuk bertanya menu andalan pada staf restoran.',
  },

  // mod-a1-family-appearance
  {
    id: 'card-a1-fam-1',
    module_id: 'mod-a1-family-appearance',
    front_text: 'Deskripsi rambut: "My younger sister ______ curly black hair."',
    back_text: 'has',
    example_sentence: 'Kunci A1: Ciri fisik rambut dan mata menggunakan has/have (has curly hair).',
  },
  {
    id: 'card-a1-fam-2',
    module_id: 'mod-a1-family-appearance',
    front_text: 'Deskripsi postur: "My uncle is very tall and ______."',
    back_text: 'slim (atau well-built)',
    example_sentence: 'Kunci A1: Postur tubuh berpasangan dengan To Be (is tall and slim).',
  },
  {
    id: 'card-a1-fam-3',
    module_id: 'mod-a1-family-appearance',
    front_text: 'Karakter ramah: "The new manager is very polite and ______ (mudah bergaul/ramah)."',
    back_text: 'friendly',
    example_sentence: 'Friendly adalah kata sifat kepribadian paling umum untuk orang yang hangat.',
  },
  {
    id: 'card-a1-fam-4',
    module_id: 'mod-a1-family-appearance',
    front_text: 'Anak tunggal dalam bahasa Inggris: "I do not have siblings; I am an ______ child."',
    back_text: 'only',
    example_sentence: 'An only child = anak tunggal.',
  },

  // ==========================================
  // CARDS: A2 EXPANSION (Modules 6-10)
  // ==========================================
  // mod-a2-past-simple-irregulars
  {
    id: 'card-a2-irreg-1',
    module_id: 'mod-a2-past-simple-irregulars',
    front_text: 'V2 dari Buy: "She ______ a brand new laptop last weekend."',
    back_text: 'bought',
    example_sentence: 'Kunci A2: Bentuk lampau (V2) dari "buy" adalah "bought".',
  },
  {
    id: 'card-a2-irreg-2',
    module_id: 'mod-a2-past-simple-irregulars',
    front_text: 'Bentuk setelah didn\'t: "I didn\'t ______ (see) your message earlier."',
    back_text: 'see',
    example_sentence: 'Kunci A2: Setelah kata bantu "didn\'t", kata kerja wajib kembali ke bentuk V1 dasar.',
  },
  {
    id: 'card-a2-irreg-3',
    module_id: 'mod-a2-past-simple-irregulars',
    front_text: 'V2 dari Cost: "The train ticket to Surabaya ______ (cost) forty dollars yesterday."',
    back_text: 'cost',
    example_sentence: 'Kunci A2: Kata kerja "cost" memiliki bentuk V1, V2, dan V3 yang persis sama.',
  },
  {
    id: 'card-a2-irreg-4',
    module_id: 'mod-a2-past-simple-irregulars',
    front_text: 'V2 dari Think: "We ______ that the workshop was scheduled for Friday."',
    back_text: 'thought',
    example_sentence: 'Kunci A2: Bentuk lampau dari "think" adalah "thought".',
  },

  // mod-a2-past-continuous
  {
    id: 'card-a2-pastc-1',
    module_id: 'mod-a2-past-continuous',
    front_text: 'Kejadian berdurasi panjang: "While she ______ (cook), someone knocked on the front door."',
    back_text: 'was cooking',
    example_sentence: 'Kunci A2: Aksi masa lalu yang sedang berlangsung saat aksi lain menyela memakai was/were + V-ing.',
  },
  {
    id: 'card-a2-pastc-2',
    module_id: 'mod-a2-past-continuous',
    front_text: 'Kejadian menyela: "We were watching the movie when the electricity suddenly ______ (go) out."',
    back_text: 'went',
    example_sentence: 'Kunci A2: Aksi singkat yang menyela menggunakan Simple Past (V2: went).',
  },
  {
    id: 'card-a2-pastc-3',
    module_id: 'mod-a2-past-continuous',
    front_text: 'Tanya kegiatan lampau: "What ______ you ______ (do) at 9 PM yesterday?"',
    back_text: 'were you doing',
    example_sentence: 'Menanyakan kegiatan yang sedang berlangsung pada waktu spesifik di masa lampau.',
  },
  {
    id: 'card-a2-pastc-4',
    module_id: 'mod-a2-past-continuous',
    front_text: 'Dua aksi bersamaan: "While Brian was studying, his roommate ______ (play) guitar."',
    back_text: 'was playing',
    example_sentence: 'Dua aksi berdurasi panjang yang berlangsung bersamaan sama-sama menggunakan Past Continuous.',
  },

  // mod-a2-connecting-words
  {
    id: 'card-a2-conn-1',
    module_id: 'mod-a2-connecting-words',
    front_text: 'Konjungsi akibat: "He was thoroughly exhausted, ______ he went to bed early."',
    back_text: 'so',
    example_sentence: 'Kunci A2: "So" menyatakan akibat atau hasil logis dari klausa sebelumnya.',
  },
  {
    id: 'card-a2-conn-2',
    module_id: 'mod-a2-connecting-words',
    front_text: 'Konjungsi kontras: "______ it was raining heavily, the match continued."',
    back_text: 'Although (atau Even though)',
    example_sentence: 'Kunci A2: "Although" mengawali klausa pengandaian/pertentangan.',
  },
  {
    id: 'card-a2-conn-3',
    module_id: 'mod-a2-connecting-words',
    front_text: 'Perbaiki kesalahan: "Although she prepared well, but she felt nervous."',
    back_text: 'Although she prepared well, she felt nervous. (Hilangkan kata "but")',
    example_sentence: 'Jangan pernah menggabungkan "Although" dan "but" dalam satu kalimat!',
  },
  {
    id: 'card-a2-conn-4',
    module_id: 'mod-a2-connecting-words',
    front_text: 'Transisi formal: "The smartphone is expensive. ______, its camera is unparalleled."',
    back_text: 'However',
    example_sentence: '"However" digunakan sebagai kata transisi formal di awal kalimat untuk menunjukkan kontras.',
  },

  // mod-a2-health-feelings
  {
    id: 'card-a2-hlt-1',
    module_id: 'mod-a2-health-feelings',
    front_text: 'Menjelaskan gejala sakit: "Saya merasa pusing dan sakit kepala sejak pagi."',
    back_text: 'I feel dizzy and have a headache since this morning.',
    example_sentence: 'Gunakan "feel dizzy" untuk pusing dan "have a headache" untuk sakit kepala.',
  },
  {
    id: 'card-a2-hlt-2',
    module_id: 'mod-a2-health-feelings',
    front_text: 'Aturan obat: "______ this antibiotic twice a day after meals."',
    back_text: 'Take',
    example_sentence: 'Kunci A2: Mengonsumsi obat dalam bahasa Inggris menggunakan kata kerja "take", bukan "drink".',
  },
  {
    id: 'card-a2-hlt-3',
    module_id: 'mod-a2-health-feelings',
    front_text: 'Perasaan sangat lega: "We were immensely ______ when the medical test was negative."',
    back_text: 'relieved',
    example_sentence: 'Relieved = merasa lega setelah melewati kecemasan.',
  },
  {
    id: 'card-a2-hlt-4',
    module_id: 'mod-a2-health-feelings',
    front_text: 'Frasa flu: "I think I ______ (catch) a cold because of the heavy rain."',
    back_text: 'caught',
    example_sentence: 'Frasa baku terserang masuk angin/flu adalah "catch a cold" (V2: caught a cold).',
  },

  // mod-a2-making-plans
  {
    id: 'card-a2-plan-1',
    module_id: 'mod-a2-making-plans',
    front_text: 'Pola santai mengajak: "How about ______ (grab) a cup of coffee this afternoon?"',
    back_text: 'grabbing',
    example_sentence: 'Kunci A2: Setelah frasa ajakan "How about...", kata kerja wajib berbentuk V-ing.',
  },
  {
    id: 'card-a2-plan-2',
    module_id: 'mod-a2-making-plans',
    front_text: 'Respon antusias menerima janji: "Tentu, saya sangat mau! Jam berapa kita bertemu?"',
    back_text: "I'd love to! What time should we meet?",
    example_sentence: 'Respon paling alami dan ramah untuk menyambut ajakan teman atau kolega.',
  },
  {
    id: 'card-a2-plan-3',
    module_id: 'mod-a2-making-plans',
    front_text: 'Idiom menolak sopan: "Can we take a rain check?" maknanya adalah ______',
    back_text: 'Bolehkah kita tunda atau jadwalkan ulang di lain waktu?',
    example_sentence: '"Take a rain check" adalah idiom sopan untuk menolak ajakan hari ini tanpa menyinggung lawan bicara.',
  },
  {
    id: 'card-a2-plan-4',
    module_id: 'mod-a2-making-plans',
    front_text: 'Formula menolak halus: "I\'d really love to, but I\'m ______ I have another commitment."',
    back_text: 'afraid',
    example_sentence: '"I\'m afraid..." digunakan untuk menyampaikan permohonan maaf/penolakan dengan sopan.',
  },
  {
    id: 'card-b1-pass-1',
    module_id: 'mod-b1-passive-voice',
    front_text: "Pasif masa lampau: \"The iconic monument ______ erected in the heart of the city in 1928.\"",
    back_text: "was",
    example_sentence: "Kunci: Simple Past Passive tunggal: was + V3 (was erected).",
  },
  {
    id: 'card-b1-pass-2',
    module_id: 'mod-b1-passive-voice',
    front_text: "Pasif kebiasaan (Present): \"All financial transactions ______ processed via encrypted gateways.\"",
    back_text: "are",
    example_sentence: "Kunci: Simple Present Passive jamak: are + V3 (are processed).",
  },
  {
    id: 'card-b1-pass-3',
    module_id: 'mod-b1-passive-voice',
    front_text: "Pasif sedang berlangsung: \"The security protocol is currently ______ updated by the IT team.\"",
    back_text: "being",
    example_sentence: "Kunci: Continuous Passive menggunakan: is/are + being + V3.",
  },
  {
    id: 'card-b1-pass-4',
    module_id: 'mod-b1-passive-voice',
    front_text: "Pasif Present Perfect: \"The new academic curriculum has finally ______ approved by the dean.\"",
    back_text: "been",
    example_sentence: "Kunci: Present Perfect Passive menggunakan: has/have + been + V3.",
  },
  {
    id: 'card-b1-pv-1',
    module_id: 'mod-b1-phrasal-verbs',
    front_text: "Menyerah: \"Never ______ up on your dreams, even when difficulties arise.\"",
    back_text: "give",
    example_sentence: "Kunci: \"Give up\" = berhenti berjuang / menyerah.",
  },
  {
    id: 'card-b1-pv-2',
    module_id: 'mod-b1-phrasal-verbs',
    front_text: "Menemukan solusi: \"The engineers finally ______ out what caused the unexpected network outage.\"",
    back_text: "figured",
    example_sentence: "Kunci: \"Figure out\" = memahami penyebab atau memecahkan persoalan.",
  },
  {
    id: 'card-b1-pv-3',
    module_id: 'mod-b1-phrasal-verbs',
    front_text: "Membatalkan acara: \"Due to the torrential rain, the committee decided to ______ off the match.\"",
    back_text: "call",
    example_sentence: "Kunci: \"Call off\" adalah sinonim kasual dari kata cancel (membatalkan).",
  },
  {
    id: 'card-b1-pv-4',
    module_id: 'mod-b1-phrasal-verbs',
    front_text: "Menantikan antusias: \"We are genuinely looking ______ to collaborating with your university.\"",
    back_text: "forward",
    example_sentence: "Kunci: \"Look forward to\" = menantikan dengan penuh antusiasme.",
  },
  {
    id: 'card-b2-cond-1',
    module_id: 'mod-b2-conditionals',
    front_text: "Mixed Conditional: \"If she had accepted the job in Tokyo, she ______ living abroad today.\"",
    back_text: "would be",
    example_sentence: "Kunci: Pengandaian masa lalu (had accepted) berakibat pada kondisi masa kini (would be living).",
  },
  {
    id: 'card-b2-cond-2',
    module_id: 'mod-b2-conditionals',
    front_text: "Mixed Conditional: \"If I ______ fluent in French, I would have translated the dossier yesterday.\"",
    back_text: "were",
    example_sentence: "Kunci: Fakta masa kini menggunakan subjunctive \"were\" dipadukan dengan akibat masa lalu.",
  },
  {
    id: 'card-b2-cond-3',
    module_id: 'mod-b2-conditionals',
    front_text: "Inversi Conditional 3: \"______ they informed us earlier, we would have adjusted the timeline.\"",
    back_text: "Had",
    example_sentence: "Kunci: \"Had they informed\" adalah bentuk inversi formal dari \"If they had informed\".",
  },
  {
    id: 'card-b2-cond-4',
    module_id: 'mod-b2-conditionals',
    front_text: "Penyesalan masa lalu: \"I wish I ______ paid closer attention to the technical briefing.\"",
    back_text: "had",
    example_sentence: "Kunci: \"Wish\" untuk penyesalan di masa lampau menggunakan Past Perfect (had paid).",
  },
  {
    id: 'card-b2-rel-1',
    module_id: 'mod-b2-relative-clauses',
    front_text: "Relative kepemilikan: \"The visionary scientist ______ research revolutionized AI delivered a lecture.\"",
    back_text: "whose",
    example_sentence: "Kunci: \"Whose\" menghubungkan subjek dengan benda/hasil karyanya (whose research).",
  },
  {
    id: 'card-b2-rel-2',
    module_id: 'mod-b2-relative-clauses',
    front_text: "Non-defining benda: \"The Borobudur Temple, ______ was erected in the 9th century, attracts millions.\"",
    back_text: "which",
    example_sentence: "Kunci: Di dalam non-defining clause (diapit koma), gunakan \"which\" (bukan that).",
  },
  {
    id: 'card-b2-rel-3',
    module_id: 'mod-b2-relative-clauses',
    front_text: "Preposition + human: \"The ambassador with ______ the ministers negotiated was remarkably affable.\"",
    back_text: "whom",
    example_sentence: "Kunci: Gunakan \"whom\" setelah preposisi (with/to/from) saat merujuk pada manusia.",
  },
  {
    id: 'card-b2-rel-4',
    module_id: 'mod-b2-relative-clauses',
    front_text: "Preposisi teori: \"The scientific framework ______ which this theory is grounded remains intact.\"",
    back_text: "on / upon",
    example_sentence: "Kunci: Pasangan frasa kata kerja \"grounded on/upon\" -> on which this theory is grounded.",
  },
  {
    id: 'card-b2-email-1',
    module_id: 'mod-b2-business-email',
    front_text: "Membuka email formal: \"I am writing to ______ regarding the status of our MOU agreement.\"",
    back_text: "inquire",
    example_sentence: "Kunci: \"Inquire regarding\" adalah padanan formal untuk menanyakan informasi secara profesional.",
  },
  {
    id: 'card-b2-email-2',
    module_id: 'mod-b2-business-email',
    front_text: "Permintaan diplomatik: \"I would be immensely grateful if you ______ provide feedback by Friday.\"",
    back_text: "could",
    example_sentence: "Kunci: \"I would be grateful if you could...\" adalah formula baku kesopanan bisnis tingkat tinggi.",
  },
  {
    id: 'card-b2-email-3',
    module_id: 'mod-b2-business-email',
    front_text: "Melampirkan berkas: \"Please find ______ the audited balance sheet for your perusal.\"",
    back_text: "attached",
    example_sentence: "Kunci: \"Please find attached...\" digunakan saat menyertakan lampiran berkas.",
  },
  {
    id: 'card-b2-email-4',
    module_id: 'mod-b2-business-email',
    front_text: "Penolakan halus: \"While we appreciate the pitch, we are ______ to proceed at this stage.\"",
    back_text: "unable",
    example_sentence: "Kunci: \"Unable to proceed\" terdengar jauh lebih diplomatis dan santun dibanding kata can't.",
  },
  {
    id: 'card-c1-disc-1',
    module_id: 'mod-c1-advanced-discourse',
    front_text: "Hedging akademis: \"The statistical data ______ to support the hypothesis of cognitive resilience.\"",
    back_text: "tends / appears",
    example_sentence: "Kunci: \"Tends to support\" adalah bentuk kehati-hatian ilmiah (*academic hedging*) C1.",
  },
  {
    id: 'card-c1-disc-2',
    module_id: 'mod-c1-advanced-discourse',
    front_text: "Meringkas kontras (C1): \"The campaign succeeded, ______ at a notably higher fiscal expense.\"",
    back_text: "albeit",
    example_sentence: "Kunci: \"Albeit\" (sinonim formal dari although/even though) menghubungkan klausa kontras ringkas.",
  },
  {
    id: 'card-c1-disc-3',
    module_id: 'mod-c1-advanced-discourse',
    front_text: "Sinonim formal despite: \"______ the formidable economic headwinds, the venture broke even.\"",
    back_text: "Notwithstanding",
    example_sentence: "Kunci: \"Notwithstanding\" diikuti kata benda menyatakan pertentangan formal tingkat tinggi.",
  },
  {
    id: 'card-c1-disc-4',
    module_id: 'mod-c1-advanced-discourse',
    front_text: "Opini terkuat berdasar: \"This treatise is ______ the most authoritative critique published this year.\"",
    back_text: "arguably",
    example_sentence: "Kunci: \"Arguably\" digunakan untuk menyatakan klaim yang sangat kuat dan dapat dipertahankan.",
  },
];
