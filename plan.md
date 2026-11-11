# 🚀 Master Business, Product & Gamification Plan: MyLala PWA

> **Visi Produk:** Menjadi *The Anti-Overwhelm English Learning Engine* bagi anak muda Indonesia—mengubah materi rumit TOEFL dan percakapan karir menjadi *1-page cheat sheet* ringkas dan *flashcard active recall* otomatis yang dapat diakses di mana saja, bahkan tanpa kuota internet.

---

## 1. Problem-Solution Fit (Validasi Masalah Pasar)

### Masalah Nyata Anak Muda (Gen Z, Mahasiswa, Job Seekers)
1. **Information Overload & Burnout:**
   - Buku persiapan TOEFL/IELTS tebalnya 400–600 halaman (Longman, Barron's) dan video materi di internet memakan waktu berjam-jam. 
   - Kebanyakan anak muda berhenti belajar di bab pertama karena merasa kewalahan (*cognitive overload*).
2. **Illusion of Competence (Tahu Rumus, Tapi Blank Saat Ujian/Bicara):**
   - Membaca materi atau mendengarkan penjelasan adalah aktivitas **pasif**. Otak merasa sudah paham, tetapi saat dihadapkan pada soal TOEFL berwaktu atau interview kerja, memori tidak bisa ditarik (*retrieval failure*).
3. **Hambatan Kuota, Sinyal, dan Kapasitas Memori HP:**
   - Aplikasi belajar konvensional berukuran besar (100MB–250MB), membebani memori ponsel menengah ke bawah, dan mewajibkan koneksi internet aktif setiap saat.

### Solusi Nyata MyLala
- **1-Page Visual Cheat Sheets:** Menyaring topik berat (misal: *Inversion*, *Reduced Clauses*) menjadi intisari pola berpikir yang dapat dibaca dalam waktu kurang dari 2 menit.
- **Active Recall + SuperMemo SM-2 (Spaced Repetition):** Memaksa otak menguji daya ingat secara aktif dan menjadwalkan kartu untuk diulang tepat pada kurva lupa (*forgetting curve*).
- **Offline-First PWA:** Berukuran di bawah 2MB, dapat dipasang instan via browser tanpa Play Store/App Store, dan tetap dapat dipakai berlatih secara offline (misal: di KRL, busway, atau daerah minim sinyal).

---

## 2. Unique Value Proposition (UVP) & Matriks Kompetisi

### Matriks Perbandingan Pasar

| Dimensi Fitur | **Duolingo** | **Anki** | **Quizlet** | **MyLala** |
| :--- | :--- | :--- | :--- | :--- |
| **Fokus Sasaran** | Santai / Pemula (*"The cat drinks milk"*) | Mahasiswa kedokteran / Umum | Pelajar sekolah umum | **Target Jelas & Bernilai Tinggi:** TOEFL 600, BUMN, CPNS, LPDP & Interview Karir |
| **Integrasi Teori** | Nyaris tanpa rangkuman teori | Tidak ada materi bawaan (wajib buat/impor sendiri) | Hanya definisi kata acak | **Sinergi 1-Page Cheat Sheet + Flashcard Terpandu** |
| **Algoritma Memori** | Gamifikasi streak harian | Sangat kuat (SM-2), namun UI kompleks era 90-an | Spaced repetition kini berbayar | **SM-2 Otomatis, UI Modern, Ringan, 100% Terbuka** |
| **Aksesibilitas & Bobot** | Wajib instal aplikasi (berat & boros kuota) | Desktop rumit, aplikasi iOS berbayar (\$25) | Web & Mobile berbayar | **PWA Super Cepat, Sekali Klik Jadi App, 100% Offline Ready** |
| **Konteks Bahasa** | Standar global, kurang peka ujian lokal | Tergantung deck buatan komunitas | Tergantung deck buatan pengguna | **Disesuaikan untuk orang Indonesia (ID ⇄ EN) menghadapi tes & karir lokal** |

### Pernyataan Nilai Utama (UVP Hook)
> *"Bukan sekadar menghafal kata, MyLala melatih refleks bahasa Inggris Anda dengan metode 1-Page Cheat Sheet dan pengingat memori otomatis berbasis sains—bisa digunakan di mana saja, bahkan tanpa kuota internet."*

---

## 3. Sistem & Metodologi Pembelajaran Inovatif

### A. Metode "Cheat-Sheet to Muscle-Memory"
Alur belajar dirancang dalam 2 tahap terintegrasi:
1. **Mental Model Formation:** Membaca *1-Page Sheet* untuk memahami aturan utama (*rule of thumb*), logika grammar, dan formula praktis.
2. **Reflex Conditioning:** Langsung melanjutkan dengan *Active Recall Flashcard* (10–15 kartu) untuk mengunci memori jangka panjang sebelum otak lupa.

### B. "Rapid Error Hunter" (Khusus TOEFL Written Expression)
- Format kartu dirancang khusus untuk soal *Section 2 TOEFL* (mencari kata yang salah).
- Sistem menantang pengguna mendeteksi kata/frasa yang keliru dalam waktu 5 detik sebelum membalik kartu.

### C. "Pragmatic Conversation Scenarios" (Template Respon Situasional)
- Menggantikan hafalan kosakata acak dengan respon situasi nyata:
  - *Skenario:* Menegosiasikan deadline dengan atasan secara profesional.
  - *Skenario:* Menjawab pertanyaan kelemahan diri saat interview kerja bahasa Inggris tanpa terlihat minder.

### D. Native Browser Speech & Audio Shadowing
- Memanfaatkan **Web Speech API** bawaan peramban (tanpa biaya API pihak ketiga) untuk mendengarkan pelafalan asli (*Native TTS*) dan melatih pengucapan mandiri (*Shadowing*).

---

## 4. Konsep Gamifikasi: Weekly Ranked Arena (Liga Mingguan Ala Game)

Untuk menciptakan kebiasaan belajar harian (*daily habit loop*) yang menyenangkan, MyLala menghadirkan sistem kompetisi ranking mingguan ala game kompetitif (seperti Mobile Legends / Duolingo Leagues).

```
   [ 👑 DIAMOND / MASTER LEAGUE ]  -> Top 1-5% pejuang TOEFL & Karir
              ▲ Promosi
   [ 💎 PLATINUM DIVISION ]       -> Pengguna rutin intensif
              ▲ Promosi
   [ 🥇 GOLD DIVISION ]           -> Pengguna konsisten harian
              ▲ Promosi
   [ 🥈 SILVER DIVISION ]         -> Mulai aktif belajar
              ▲ Promosi
   [ 🥉 BRONZE DIVISION ]         -> Pemula / Pendaftar Baru
```

### A. Mekanisme Perolehan Learning Points (XP)
Pengguna mendapatkan XP dari setiap aktivitas belajar nyata:
* **Membaca Selesai 1 Modul Cheat Sheet:** `+20 XP`
* **Menjawab Flashcard 'Hard':** `+5 XP`
* **Menjawab Flashcard 'Good':** `+10 XP`
* **Menjawab Flashcard 'Easy':** `+15 XP`
* **Sesi Sempurna (Review 10+ kartu tanpa gagal):** `+25 XP Bonus`
* **Daily Streak Multiplier:** Bonus `+5 XP` per hari berturut-turut (maksimal bonus +50 XP/hari).
* **Membuat Modul / Flashcard Mandiri:** `+30 XP` (mendorong kontribusi konten).

### B. Divisi & Struktur Liga Mingguan

| Divisi | Target XP Mingguan | Status & Aturan |
| :--- | :--- | :--- |
| 🥉 **Bronze** | 0 – 250 XP | Divisi awal untuk semua pengguna baru. |
| 🥈 **Silver** | 251 – 650 XP | Mulai membangun kebiasaan belajar (2–3 sesi/minggu). |
| 🥇 **Gold** | 651 – 1,300 XP | Konsisten belajar harian (minimal 10 kartu/hari). |
| 💎 **Platinum** | 1,301 – 2,500 XP | Pejuang intensif persiapan tes/interview. |
| 👑 **Diamond / Master** | 2,501+ XP | Elit peringkat teratas kampus/komunitas. |

### C. Siklus Reset Mingguan (Weekly Reset Cycle)
1. **Waktu Reset:** Setiap hari **Minggu pukul 23:59 WIB**.
2. **Promosi & Degradasi (Leaderboard Lobby 20–30 orang):**
   - **Top 5:** Naik ke divisi berikutnya + mendapatkan lencana digital profil (*Division Promotion Badge*).
   - **Peringkat Tengah:** Bertahan di divisi saat ini.
   - **Bottom 3 (khusus Silver ke atas):** Turun 1 divisi jika tidak ada aktivitas belajar selama 7 hari.
3. **Reward Mingguan:**
   - Gelar kehormatan di profil: *"Weekly Champion"*, *"Speed Learner"*, *"Retention King"*.
   - Rekap mingguan personal: total kartu yang dipelajari, akurasi retensi, dan peningkatan estimasi skor TOEFL.

### D. Arsitektur Data Supabase untuk Ranked System
```sql
-- Tabel statistik poin mingguan pengguna
CREATE TABLE user_weekly_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    year_week TEXT NOT NULL, -- Format: '2026-W45'
    weekly_xp INT DEFAULT 0,
    cards_reviewed INT DEFAULT 0,
    modules_completed INT DEFAULT 0,
    current_tier TEXT DEFAULT 'Bronze',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, year_week)
);

-- Indeks untuk query leaderboard yang sangat cepat
CREATE INDEX idx_weekly_leaderboard ON user_weekly_stats(year_week, weekly_xp DESC);
```

---

## 5. Strategi Go-to-Market (GTM) & Model Bisnis

### Tahap 1: Grassroots Campus Launch (UMY & Jaringan Mahasiswa)
- Mulai dari target terdekat: teman seangkatan, pejuang skripsi yang butuh syarat kelulusan TOEFL 450–500, dan pencari magang/kerja.
- Distribusi instan: Cukup bagikan tautan URL web aplikasi ke grup WhatsApp kampus. Teman-teman dapat langsung login dan klik tombol "Install App".

### Tahap 2: Viral Loop (Shareable Social Proof)
- Menghadirkan tombol **"Bagikan Pencapaian"**:
  - Kartu grafis minimalis elegan berisi rekap: *"Imam telah menguasai 40 Flashcard Inversion & mempertahankan 7 hari Streak di MyLala"*.
  - Desain optimal untuk Instagram Story, LinkedIn, dan status WhatsApp.

### Tahap 3: Model Monetisasi Masa Depan
1. **Freemium Core (Selamanya Gratis):**
   - Akses penuh modul dasar TOEFL Structure dan percakapan harian.
   - PWA gratis dan fitur offline tetap terbuka untuk semua orang.
2. **Paket Modul Spesialis (Micro-transactions Rp 19.000 – Rp 39.000 sekali beli):**
   - Paket: *50 Pola Soal Asli BUMN & CPNS Structure*.
   - Paket: *High-Scoring Academic Vocabulary for IELTS/LPDP*.
   - Paket: *STAR Method Interview Answer Templates*.
3. **B2B / Campus Partnership:**
   - Menyediakan dasbor kelas untuk dosen atau lembaga bahasa kampus guna memantau kepatuhan belajar mandiri mahasiswa.

---

## 6. Checklist Eksekusi Bertahap (Execution Roadmap)

### Fase 1: Peluncuran Publik & Perbaikan Dashboard (Current Sprint)
- [x] Selesaikan core engine PWA & Service Worker offline support.
- [x] Integrasi database Cloud Supabase (8 modul kurikulum + puluhan flashcard).
- [x] Sistem autentikasi multi-user (Admin Imam + akun instan teman).
- [ ] **Fix Metrik Tampilan Dashboard:** Pastikan akun baru tidak menampilkan 34 kartu usang/due.
- [ ] **Deploy Publik ke Vercel:** Hubungkan proyek ke hosting publik agar dapat diakses via tautan internet.
- [ ] Uji coba instalasi PWA di smartphone teman-teman (Android Chrome & iOS Safari).

### Fase 2: Implementasi Sistem Poin & Ranked Leaderboard Mingguan
- [ ] Buat tabel `user_weekly_stats` dan helper kalkulasi XP di Supabase.
- [ ] Tambahkan kalkulasi perolehan XP otomatis di `useAppStore.js` setiap kali kartu selesai di-review atau modul dibaca.
- [ ] Buat halaman / komponen UI `LeaderboardPage.jsx` dengan visualisasi Tier (Bronze s/d Diamond).
- [ ] Tambahkan penanda avatar dan medali peringkat mingguan di Navbar & Profil.

### Fase 3: Peningkatan Fitur Pembelajaran (Advanced Learning Modes)
- [ ] Tambahkan mode latihan interaktif **"Rapid Error Hunter"** (timer 5 detik per soal structure).
- [ ] Integrasikan fitur **Speech Recognition (Voice Shadowing)** dengan Web Speech API gratis.
- [ ] Sediakan template ekspor/share grafis estetik untuk Instagram Story & WhatsApp.

### Fase 4: Monetisasi & Ekspansi Komunitas
- [ ] Buat katalog modul kontribusi komunitas (pengguna bisa membuat dan membagikan pack kartu).
- [ ] Siapkan integrasi pembayaran mikro lokal (QRIS / Midtrans / Duitku) untuk paket modul lanjutan.
- [ ] Lakukan riset kemitraan dengan lembaga pelatihan bahasa atau komunitas mahasiswa kampus.

