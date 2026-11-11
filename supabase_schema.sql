-- ==============================================================================
-- MYLALA - SUPABASE DATABASE SCHEMA & MASTER CURRICULUM SEED DATA
-- Target: TOEFL 600+ & High-Impact English Conversation Mastery
-- ==============================================================================

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- 3. Create 'modules' table
CREATE TABLE modules (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Grammar', 'Vocab', 'Templates')),
    title VARCHAR(255) NOT NULL,
    content_markdown TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create 'flashcards' table
CREATE TABLE flashcards (
    id VARCHAR(100) PRIMARY KEY,
    module_id VARCHAR(100) NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    front_text VARCHAR(500) NOT NULL,
    back_text VARCHAR(500) NOT NULL,
    example_sentence TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create 'user_progress' table (Spaced Repetition tracking)
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    flashcard_id VARCHAR(100) NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Learning' CHECK (status IN ('Learning', 'Review', 'Mastered')),
    repetitions INT NOT NULL DEFAULT 0,
    ease_factor NUMERIC(3, 2) NOT NULL DEFAULT 2.50,
    interval NUMERIC(6, 2) NOT NULL DEFAULT 1.00,
    next_review_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_flashcard UNIQUE (user_id, flashcard_id)
);

-- Indexes for lightning-fast queries
CREATE INDEX idx_flashcards_module_id ON flashcards(module_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_next_review ON user_progress(next_review_date);

-- Enable Row Level Security (RLS)
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Permissive Read Policies for Modules and Flashcards (Public Access)
CREATE POLICY "Allow public read access to modules" ON modules
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to flashcards" ON flashcards
    FOR SELECT USING (true);

-- User Progress Policies
CREATE POLICY "Allow public read for user_progress" ON user_progress
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update for user_progress" ON user_progress
    FOR ALL USING (true) WITH CHECK (true);

-- 6. Create 'user_weekly_stats' table (Weekly Ranked Leaderboard)
CREATE TABLE IF NOT EXISTS user_weekly_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    year_week VARCHAR(20) NOT NULL,
    weekly_xp INT NOT NULL DEFAULT 0,
    cards_reviewed INT NOT NULL DEFAULT 0,
    streak INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_week UNIQUE (user_id, year_week)
);

CREATE INDEX IF NOT EXISTS idx_weekly_stats_rank ON user_weekly_stats(year_week, weekly_xp DESC);

ALTER TABLE user_weekly_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for user_weekly_stats" ON user_weekly_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update for user_weekly_stats" ON user_weekly_stats
    FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_weekly_stats;

-- ==============================================================================
-- SEED DATA: STARTER FOUNDATION & TOEFL/CONVERSATION CURRICULUM
-- ==============================================================================

-- STARTER MODULE 1: STRUCTURE S-V
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-starter-svo',
    'Grammar',
    'Starter Grammar: Rahasia Struktur Kalimat & Jebakan Preposisi',
    '# Starter Grammar: Fondasi Struktur Kalimat (S + V)

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
'
);

INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-svo-1', 'mod-starter-svo', 'With his closest friends, ______ to the new cinema downtown yesterday.', 'Brian went', 'Kunci: "With his closest friends" adalah frasa preposisi (keterangan), bukan subjek! Kalimat masih membutuhkan Subjek (Brian) dan Verb (went).'),
('card-svo-2', 'mod-starter-svo', 'The chief architect ______ the complex blueprint for the hospital project.', 'designed', 'Kunci: Kata kerja berakhiran -ing (designing) TIDAK BISA berdiri sendiri sebagai Verb tanpa bantuan to be (is/was). Gunakan "designed".'),
('card-svo-3', 'mod-starter-svo', 'Sarah, a brilliant young researcher, ______ several prestigious awards this year.', 'has received', 'Kunci: Frasa di antara dua koma ("a brilliant young researcher") adalah penjelas (Appositive). Subjek utamanya "Sarah" membutuhkan Verb "has received".'),
('card-svo-4', 'mod-starter-svo', 'During the heavy storm, ______ sought shelter under the pavilion.', 'the pedestrians', 'Kunci: "During the heavy storm" hanyalah keterangan waktu. Kalimat tetap membutuhkan Subjek mandiri (the pedestrians) sebelum verb "sought".');

-- STARTER MODULE 2: 3 TENSES
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-starter-tenses',
    'Grammar',
    'Starter Grammar: 3 Tenses Wajib Tanpa Pusing (Present, Past, Perfect)',
    '# Starter Grammar: 3 Tenses Wajib Tanpa Pusing

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
* *Salah:* "I have met him yesterday." *(Ada penanda waktu lampau spesifik ''yesterday'', jangan pakai Present Perfect!)*
* *Benar:* "I **met** him yesterday." *(Gunakan Simple Past).*
* *Benar:* "I **have met** him twice." *(Fokus pada pengalaman, bukan kapan terjadinya).*
'
);

INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-tns-1', 'mod-starter-tenses', 'She ______ at this technology company in Yogyakarta since 2022.', 'has worked', 'Kunci: Kata "since" (sejak) menandakan aksi dimulai di masa lalu dan masih berlangsung sampai sekarang (Present Perfect: has worked).'),
('card-tns-2', 'mod-starter-tenses', 'We ______ our quarterly marketing presentation two days ago.', 'finished', 'Kunci: Ada keterangan waktu lampau yang spesifik dan tuntas ("two days ago"). Wajib menggunakan Simple Past (V2: finished).'),
('card-tns-3', 'mod-starter-tenses', 'Water ______ at 100 degrees Celsius under normal atmospheric pressure.', 'boils', 'Kunci: Fakta ilmiah / kebenaran umum selalu menggunakan Simple Present (V1 + s/es untuk subjek tunggal: boils).'),
('card-tns-4', 'mod-starter-tenses', '______ you submit your project assignment yesterday evening?', 'Did', 'Kunci: Keterangan waktu lampau spesifik "yesterday evening" mewajibkan auxiliary "Did" untuk pertanyaan Simple Past.');

-- STARTER MODULE 3: CONVERSATION ZERO GAGAP
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-starter-conversation',
    'Templates',
    'Starter Speaking: 5 Template Perkenalan & Small Talk Zero-Gagap',
    '# Starter Speaking: Template Perkenalan & Small Talk Zero-Gagap

## 1. Keluar dari Perkenalan Kaku
Kebanyakan orang cuma bisa mengucapkan: *"My name is... I am 21 years old... I live in..."* lalu suasana menjadi canggung (*awkward silence*).

Untuk terlihat natural dan percaya diri, gunakan formula **Hook 3 Langkah**:
$$\\mathbf{Nama} + \\mathbf{Aktivitas/Ketertarikan\\ Terkini} + \\mathbf{Pertanyaan\\ Balik}$$

---

## 2. 5 Template Penyelamat Percakapan

### A. Perkenalan Santai & Menarik (Networking / Temu Teman Baru)
> *"Hi, I''m [Nama]! I''m currently studying [Jurusan] at [Kampus], and lately I''ve been really into [Hobi/Minat]. What about yourself?"*

### B. Meminta Lawan Bicara Mengulang (Tanpa Bilang "What?!")
> *"Sorry, I didn''t quite catch that. Could you repeat that for me, please?"*

### C. Membeli Waktu 3 Detik untuk Berpikir (Anti-Gagap)
> Daripada bergumam *"Ummm... errr..."*, gunakan:
> *"That''s a really interesting question, let me think about that for a second..."*

### D. Mengapresiasi & Memberi Respon Antusias
> *"That sounds amazing! How did you get into that?"*

### E. Pamit Mengakhiri Obrolan Secara Elegan
> *"It was truly great chatting with you! I have to head out now, but let''s definitely stay in touch."*
'
);

INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-sc-1', 'mod-starter-conversation', 'Template perkenalan diri profesional & santai saat networking atau bertemu teman baru:', 'Hi, I''m [Name]! I''m currently studying/working in [Field], and lately I''ve been really into [Interest]. What about yourself?', 'Tips: Selalu akhiri perkenalan dengan "What about yourself?" agar lawan bicara merasa dihargai dan obrolan terus mengalir.'),
('card-sc-2', 'mod-starter-conversation', 'Cara sopan meminta lawan bicara mengulang kalimatnya saat kamu tidak mendengar jelas (tanpa bilang "What?!"):', 'Sorry, I didn''t quite catch that. Could you repeat that for me, please?', 'Tips: Jauh lebih ramah, natural, dan profesional dibandingkan kata kasar "What?".'),
('card-sc-3', 'mod-starter-conversation', 'Template membeli waktu 3-5 detik untuk berpikir saat diajak bicara tanpa terdengar gugup:', 'That''s an interesting question, let me think about that for a second...', 'Tips: Kalimat penyelamat daripada bergumam "Ummm..." atau terdiam kaku.'),
('card-sc-4', 'mod-starter-conversation', 'Cara mengakhiri obrolan santai secara sopan dan meninggalkan kesan positif:', 'It was really great chatting with you! I have to head out now, but let''s definitely stay in touch.', 'Tips: Penutup percakapan elegan dengan memberi apresiasi sebelum berpamitan.');

-- MODULE 1: TOEFL INVERSION
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-toefl-inversion',
    'Grammar',
    'TOEFL Mastery: Negative Inversion & Conditionals',
    '# TOEFL Mastery: Inversion Rules

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
'
);

-- FLASHCARDS FOR MODULE 1
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-inv-1', 'mod-toefl-inversion', 'Hardly ______ the station when the torrential rain started.', 'had we reached', 'Kunci TOEFL: Negative adverb "Hardly" di awal mewajibkan inversi (had + S + V3). Pasangan katanya adalah "when".'),
('card-inv-2', 'mod-toefl-inversion', 'Not only ______ outstanding results, but she also won the scholarship.', 'did she achieve', 'Kunci TOEFL: "Not only" di awal kalimat butuh auxiliary (did) sebelum subjek (she) dan V1 murni (achieve).'),
('card-inv-3', 'mod-toefl-inversion', '______ received the warning earlier, they would have evacuated.', 'Had they', 'Kunci TOEFL: Bentuk inversi Conditional Type 3 pengganti "If they had received" adalah "Had they received".'),
('card-inv-4', 'mod-toefl-inversion', 'Under no circumstances ______ reveal this security code.', 'should you', 'Kunci TOEFL: "Under no circumstances" berarti larangan keras; auxiliary "should" mendahului subjek "you".');


-- MODULE 2: TOEFL REDUCED CLAUSES
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-toefl-reduced-clauses',
    'Grammar',
    'TOEFL Mastery: Reduced Clauses & Participles',
    '# TOEFL Mastery: Reduced Relative & Adverbial Clauses

## 1. Mengapa Materi Ini Krusial untuk Skor 600?
Soal TOEFL Written Expression sering memotong *relative pronoun* (\`who, which, that\`) dan *to be* untuk menguji apakah Anda memahami penggunaan Participle aktif (-ing) vs pasif (-ed/V3).

---

## 2. Reduksi Relative Clauses (Adjective Clauses)

### A. Pola Aktif (Present Participle -> \`-ing\`)
Bila subjek klausa melakukan aksi sendiri:
* *Klausa Utuh*: "The scientist **who conducts** the experiment..."
* *Bentuk Reduksi*: "The scientist **conducting** the experiment..."

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
'
);

-- FLASHCARDS FOR MODULE 2
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-red-1', 'mod-toefl-reduced-clauses', 'The archaeological artifacts ______ in the tomb date back to 300 BC.', 'discovered', 'Kunci TOEFL: Bentuk reduksi pasif dari "which were discovered" -> cukup "discovered" (V3 tanpa to be).'),
('card-red-2', 'mod-toefl-reduced-clauses', 'Anyone ______ to join the research committee must submit a proposal.', 'wishing', 'Kunci TOEFL: Bentuk reduksi aktif dari "who wishes" adalah Present Participle "wishing" (-ing).'),
('card-red-3', 'mod-toefl-reduced-clauses', 'Although ______ by severe storms, the spacecraft landed safely.', 'battered', 'Kunci TOEFL: Reduksi klausa adverbial pasif "Although it was battered" -> "Although battered".'),
('card-red-4', 'mod-toefl-reduced-clauses', 'Apa kesalahan kalimat: "Walking down the street, a falling branch hit Sarah"?', 'Dangling Modifier (Dahan pohon tidak sedang berjalan kaki).', 'Perbaikan benar: "Walking down the street, Sarah was hit by a falling branch."');


-- MODULE 3: TOEFL SUBJUNCTIVE
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-toefl-subjunctive',
    'Grammar',
    'TOEFL Mastery: Subjunctive Mood & Mandative Verbs',
    '# TOEFL Mastery: Mandative Subjunctive Mood

## 1. Pengertian
Dalam bahasa Inggris formal, klausa yang diawali kata kerja berunsur **perintah, desakan, atau anjuran** wajib menggunakan kata kerja dasar (*bare infinitive / V1 tanpa akhiran -s/-es/-ed*) dan *to be* menjadi **"be"**, terlepas dari apakah subjeknya tunggal (*he/she/it*) atau jamak.

---

## 2. Kata Kerja Mandatif Populer
* **Verbs:** *demand, insist, recommend, suggest, urge, require, request, propose, order*.
* **Adjectives:** *essential, vital, mandatory, imperative, crucial, important*.

---

## 3. Rumus & Contoh Kalimat
$$\text{Subject} + \text{Verb Mandatif} + \text{that} + \text{Subject} + \mathbf{V1\text{ (Bare Infinitive)}}$$

* *Contoh 1:* "The professor insisted that the student **be** on time for the exam."
* *Contoh 2:* "The dean recommends that every candidate **submit** their thesis by Friday."
* *Contoh 3 (Bentuk Negatif):* "The supervisor requested that she **not disclose** the confidential findings."
'
);

-- FLASHCARDS FOR MODULE 3
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-sub-1', 'mod-toefl-subjunctive', 'The committee insisted that the candidate ______ present during the review.', 'be', 'Kunci TOEFL: Mandative verb "insisted that" mewajibkan bare infinitive "be", bukan "was" atau "is".'),
('card-sub-2', 'mod-toefl-subjunctive', 'It is essential that each student ______ their assignment before midnight.', 'submit', 'Kunci TOEFL: "It is essential that" menuntut V1 murni tanpa akhiran -s, terlepas dari subjek tunggal "each student".'),
('card-sub-3', 'mod-toefl-subjunctive', 'The doctor urged that the patient ______ any heavy lifting for a month.', 'not attempt', 'Kunci TOEFL: Bentuk negatif subjunctive langsung "not + V1", tanpa menggunakan auxiliary "does not".');


-- MODULE 4: TOEFL SUBJECT-VERB AGREEMENT
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-toefl-sv-agreement',
    'Grammar',
    'TOEFL Mastery: Complex Subject-Verb Agreement',
    '# TOEFL Mastery: Complex Subject-Verb Agreement

## 1. Pemisah Subjek (Interrupters)
Di tes TOEFL, subjek dan verb sering dipisahkan oleh frasa panjang agar peserta tes terkecoh. 
Abaikan frasa di antara tanda koma atau preposisi:

* Frasa penyela: \`together with\`, \`along with\`, \`accompanied by\`, \`as well as\`, \`in addition to\`.
> *Contoh*: "The **lead researcher**, *along with ten graduate assistants*, **is** conducting the trial."  
> *(Subjek utama adalah ''The lead researcher'' [tunggal], bukan ''assistants'').*

---

## 2. Aturan Either/Neither & Correlative Conjunctions
* \`Either A or B\` dan \`Neither A nor B\` &rarr; Verb mengikuti subjek terdekat (**B**).
  * "Neither the professor nor the **students were** satisfied with the result."
  * "Neither the students nor the **professor was** satisfied with the result."
'
);

-- FLASHCARDS FOR MODULE 4
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-sva-1', 'mod-toefl-sv-agreement', 'The professor, accompanied by her graduate research fellows, ______ the conference.', 'is attending (atau attends)', 'Kunci TOEFL: Frasa penyela "accompanied by..." diabaikan. Subjek sejati adalah "The professor" (tunggal).'),
('card-sva-2', 'mod-toefl-sv-agreement', 'Neither the administrative staff nor the chief director ______ available.', 'was (atau is)', 'Kunci TOEFL: Pada "Neither... nor...", kata kerja mengikuti subjek terdekat yaitu "the chief director" (tunggal).'),
('card-sva-3', 'mod-toefl-sv-agreement', 'Fifty thousand dollars ______ allocated for the lab renovation.', 'was', 'Kunci TOEFL: Besaran nominal uang dihitung sebagai kesatuan tunggal (singular subject).');


-- MODULE 5: ACADEMIC WORD LIST (AWL)
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-toefl-awl',
    'Vocab',
    'Academic Word List (AWL): High-Yield Scientific Verbs',
    '# Academic Word List (AWL) - Tier 1

## 1. Mengapa Kosakata Akademik Menentukan Skor 600?
Bagian TOEFL Reading & Listening menuntut pemahaman istilah konseptual yang padat makna:

| Kosakata | Definisi / Makna | Kolokasi Lazim | Contoh Penggunaan |
| :--- | :--- | :--- | :--- |
| **Corroborate** *(v)* | Menguatkan bukti / memvalidasi | *corroborate evidence / findings* | *The new archaeological data corroborates the initial hypothesis.* |
| **Delineate** *(v)* | Menggambarkan secara detail | *delineate boundaries / steps* | *The article delineates the environmental impact of deforestation.* |
| **Synthesize** *(v)* | Memadukan berbagai sumber/ide | *synthesize perspectives* | *Students must synthesize theoretical models with empirical data.* |
| **Discrepancy** *(n)* | Ketidaksesuaian / perbedaan angka | *discrepancy between A and B* | *There was a marked discrepancy between the two survey reports.* |
'
);

-- FLASHCARDS FOR MODULE 5
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-awl-1', 'mod-toefl-awl', 'Corroborate', 'Mengonfirmasi / Memperkuat bukti (Confirm / Substantiate)', 'The witness provided forensic evidence to corroborate the timeline.'),
('card-awl-2', 'mod-toefl-awl', 'Delineate', 'Menggambarkan / Memerinci garis batas atau tahapan', 'The regulation clearly delineates the safety responsibilities of each engineer.'),
('card-awl-3', 'mod-toefl-awl', 'Discrepancy', 'Ketidaksesuaian / Perbedaan mencolok (Inconsistency)', 'Auditors discovered an inexplicable discrepancy in the quarterly financial ledger.'),
('card-awl-4', 'mod-toefl-awl', 'Synthesize', 'Memadukan beragam ide/sumber menjadi satu kesatuan utuh', 'The research paper synthesizes biological data with meteorological findings.');


-- MODULE 6: CONVERSATION IDIOMS
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-conv-idioms',
    'Vocab',
    'Everyday Native Idioms & Natural Collocations',
    '# Natural Everyday Idioms for Fluent Speaking

## 1. 6 Idiom Paling Berguna dalam Kehidupan Sehari-hari
1. **Hit the nail on the head**: Mengatakan hal yang persis tepat / akurat.
2. **Snowed under**: Sangat sibuk dengan tumpukan tugas/pekerjaan.
3. **Bite the bullet**: Menghadapi situasi sulit yang tak terelakkan dengan tegar.
4. **Call it a day**: Mengakhiri kegiatan/bekerja untuk hari ini.
5. **Off the top of my head**: Perkiraan spontan tanpa memeriksa catatan terlebih dahulu.
6. **On the same page**: Memiliki pemahaman dan kesepakatan yang sama.
'
);

-- FLASHCARDS FOR MODULE 6
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-idm-1', 'mod-conv-idioms', 'Hit the nail on the head', 'Menyatakan hal yang persis tepat dan akurat', 'You hit the nail on the head when you identified communication as our bottleneck.'),
('card-idm-2', 'mod-conv-idioms', 'Snowed under', 'Kewalahan dengan beban pekerjaan yang sangat banyak', 'I would love to join you for dinner, but I am completely snowed under with grading.'),
('card-idm-3', 'mod-conv-idioms', 'Bite the bullet', 'Menghadapi kenyataan/kesulitan yang tak terelakkan dengan berani', 'I had to bite the bullet and fix the slide deck before the client call.'),
('card-idm-4', 'mod-conv-idioms', 'Call it a day', 'Menyudahi / Menutup pekerjaan hari ini', 'We have ironed out the biggest bug; let us call it a day and get some rest.');


-- MODULE 7: CONVERSATION OPINIONS
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-conv-opinions',
    'Templates',
    'Natural Conversation: Stating Opinions & Polite Disagreement',
    '# Formulas for Stating Opinions & Diplomatic Disagreements

## 1. Memberikan Pendapat (Expressing Nuanced Opinions)
* *"I am firmly convinced that..."*
* *"From where I stand, it seems that..."*
* *"As far as I am concerned, ..."*

## 2. Menyanggah Secara Diplomatik (Polite Disagreement)
* *"I take your point, but have you considered...?"*
* *"I hear what you are saying, however, we should also keep in mind that..."*
* *"I am not entirely convinced that this is the best course of action."*
'
);

-- FLASHCARDS FOR MODULE 7
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-op-1', 'mod-conv-opinions', 'Ungkapan sopan: "Saya paham maksud Anda, tapi coba pertimbangkan..."', 'I take your point, but have you considered...?', 'Template diplomatis untuk menyanggah pendapat tanpa memicu tensi emosional.'),
('card-op-2', 'mod-conv-opinions', 'Ungkapan percaya diri: "Saya sangat meyakini bahwa..."', 'I am firmly convinced that...', 'I am firmly convinced that investing in continuous learning yields the highest ROI.'),
('card-op-3', 'mod-conv-opinions', 'Ungkapan keraguan halus: "Saya tidak sepenuhnya yakin ini langkah terbaik."', 'I am not entirely convinced that this is our best course of action.', 'Sangat natural dipakai dalam forum diskusi kerja dan rapat strategis.');


-- MODULE 8: CONVERSATION MEETINGS
INSERT INTO modules (id, category, title, content_markdown) VALUES (
    'mod-conv-meetings',
    'Templates',
    'Professional Signposting for Meetings & Discussions',
    '# Professional Signposting in English Meetings

## Tahapan Pertemuan & Rambu Kalimatnya
* **Membuka:** *"The primary objective of today''s meeting is to..."*
* **Menyelip Sopan:** *"Could I jump in here for a second?"*
* **Mengembalikan Topik:** *"Let''s circle back to our primary focus..."*
* **Menunda Sementara:** *"Let''s park that discussion for our next session."*
* **Mengunci Kesimpulan:** *"To wrap things up, our main takeaways are..."*
'
);

-- FLASHCARDS FOR MODULE 8
INSERT INTO flashcards (id, module_id, front_text, back_text, example_sentence) VALUES
('card-mt-1', 'mod-conv-meetings', 'Ungkapan interupsi sopan saat rapat: "Bolehkah saya menyela sebentar?"', 'Could I jump in here for a second?', 'Frasa standar profesional untuk menyampaikan komentar sebelum topik beralih.'),
('card-mt-2', 'mod-conv-meetings', 'Ungkapan kembali ke topik: "Mari kita kembali ke fokus utama kita..."', 'Let us circle back to our primary focus...', 'Efektif untuk mengendalikan pembicaraan yang mulai melebar keluar agenda.'),
('card-mt-3', 'mod-conv-meetings', 'Ungkapan menunda topik sementara: "Mari kita simpan dulu poin itu untuk nanti."', 'Let us park that topic for our next session.', 'Istilah bisnis populer "to park an idea" berarti menunda pembahasan ke lain waktu.');
