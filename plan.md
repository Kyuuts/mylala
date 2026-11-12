# 🗺️ Roadmap Eksekusi MyLala PWA
> Dokumen pelacakan resmi roadmap pengembangan berdasarkan **Laporan Analisis Produk Digital MyLala PWA**.

---

## 🎯 Prioritas Kritis Sebelum Go-Live (Verdict Halaman 11 & 12)

Dua fix kritis yang disyaratkan dalam laporan sebelum rilis publik:

- [x] **1. Keamanan Auth (Kritis)**
  - Migrasi autentikasi ke Supabase Auth (`supabase.auth.signUp()` dan `supabase.auth.signInWithPassword()`).
  - Implementasi kriptografi *Web Crypto API* (SHA-256 + random salt 16-byte) untuk akun offline.
  - Hapus seluruh penyimpanan password *plain-text* di `localStorage` dan file kode sumber.
  - Tambah input Email Aktif pada form pendaftaran dan dukungan login dengan Username/Email.
  - Hapus tampilan kredensial demo untuk melindungi privasi akun.

- [x] **2. Bug Dashboard Metrics (Kritis)**
  - Fix metrik akun baru yang menampilkan 34 kartu usang/due dari akun lain.
  - Isolasi progres per akun dengan partisi state `userProgressByUserId[userId]`.
  - Partisi penyimpanan lokal per user: `pl_user_progress_${userId}`.
  - Hapus formula *fallback* artifisial `dueCount || Math.min(cards.length, 5)` di `flashcardService.js`.
  - Akun baru dijamin mulai dari **0 kartu due / 0 reviewed (Clean Slate)**.

- [x] **3. Deploy ke Vercel**
  - Hubungkan repository GitHub (`https://github.com/Kyuuts/mylala.git`) ke Vercel.
  - Konfigurasi credentials fallback Supabase agar aplikasi otomatis terhubung ke cloud backend.
  - Live URL: `https://mylala.vercel.app`.

- [x] **4. Leaderboard Live Realtime**
  - Hubungkan data ranking ke tabel `user_weekly_stats` Supabase.
  - Sinkronisasi otomatis XP mingguan saat latihan kartu dan membaca modul.
  - Listener realtime Supabase WebSocket (`realtime_leaderboard_changes`).

- [x] **5. Viral Share Card Generator**
  - Pembuat kartu grafis pencapaian belajar estetik (format 9:16 untuk Instagram Story & 1:1 untuk WhatsApp Status / LinkedIn).
  - Menggunakan native HTML5 Canvas API ultra-HD (1080x1920 & 1080x1080) dengan gradien dinamis sesuai Liga (Bronze, Silver, Gold, Platinum, Diamond).
  - Menampilkan nama pengguna, XP mingguan, streak hari berturut-turut, peringkat liga, dan kartu yang dikuasai.
  - Tombol 1-klik unduh gambar PNG resolusi tinggi, Web Share API langsung ke media sosial, dan salin teks status.
  - Terintegrasi di Dashboard, Leaderboard, dan dialog akhir sesi Flashcard (`SessionSummary`).

- [ ] **6. Grassroots Community Launch**
  - Peluncuran beta ke komunitas pembelajar bahasa & mahasiswa aktif.
  - Target awal: 50 *early adopters* pembelajar bahasa asing aktif.

---

## 🚀 4 Fase Roadmap Eksekusi (Halaman 10 Laporan Analisis)

### ✅ FASE 1 — Current Sprint: Peluncuran Publik & Perbaikan Dashboard
- [x] Core engine PWA & Service Worker offline support (Workbox, caching precache)
- [x] Integrasi database Supabase (Modul master + puluhan flashcard terintegrasi)
- [x] Sistem autentikasi multi-user (Admin Imam + Member terenkripsi)
- [x] Build production dist siap deploy ke Vercel
- [x] Fix bug: akun baru tampilkan 34 kartu usang (Terisolasi per user ID)
- [x] Deploy publik ke Vercel (`https://mylala.vercel.app`)
- [ ] Uji PWA install di Android Chrome & iOS Safari langsung pada perangkat fisik

---

### 🔵 FASE 2 — Implementasi Gamifikasi: Sistem Poin & Ranked Leaderboard Mingguan
- [x] Buat tabel `user_weekly_stats` di Supabase
- [x] Kalkulasi XP otomatis saat kartu di-review (+5 Hard, +10 Good, +15 Easy, streak multiplier)
- [x] Populate leaderboard dengan data real Supabase (Sarah Kirana, Budi Santoso, Nadia Pratama, Rizky Dwi, Farhan Azhar)
- [x] Avatar, medali ranking, dan hitung mundur reset mingguan (Minggu 23:59 WIB) di Navbar & Leaderboard

---

### 🟡 FASE 3 — Advanced Learning: Peningkatan Fitur Pembelajaran
- [ ] Mode *"Rapid Error Hunter"* (Timer 5 detik per soal untuk latihan kilat TOEFL Structure)
- [x] Speech Recognition / Voice Shadowing (Pengecekan pelafalan real-time dengan Web Speech API, evaluasi akurasi kata-per-kata Levenshtein, dan bonus XP latihan bicara)
- [x] Export grafis estetik untuk Instagram/WhatsApp (Viral Share Loop terintegrasi)
- [ ] Push notification reminder belajar harian (Notifikasi browser/PWA)

---

### 🟣 FASE 4 — Monetisasi & Ekspansi: Community & Revenue
- [ ] Katalog modul kontribusi komunitas (Creator marketplace)
- [ ] Integrasi QRIS / Midtrans / Duitku untuk pembelian modul spesialis (Rp19k - Rp39k)
- [ ] Dashboard kelas untuk dosen / lembaga bahasa kampus memantau progres mahasiswa kolektif
- [ ] Riset kemitraan resmi dengan lembaga pelatihan bahasa (B2B Language Centers)

---

## 🏛️ Arsitektur Baru Kurikulum 3 Pilar (Revisi Besar)

Penyelarasan ekosistem kurikulum MyLala ke dalam 3 Pilar Utama:

### ✅ TAHAP 1 — Restrukturisasi Navigasi & Data Schema (Pondasi) [SELESAI]
- [x] Standarisasi CEFR A1 s/d C1 di `src/utils/moduleLevel.js` (A1 Explorer, A2 Voyager, B1 Citizen, B2 Diplomat, C1 Mastermind).
- [x] Restrukturisasi modul belajar: Pemisahan Grammar, Kosakata, dan Konjungsi di `src/services/mockData.js`.
- [x] Penambahan modul & kartu latihan khusus **Konjungsi (Connectors & Transitions)**.
- [x] Pembuatan dataset Graded Readers (`src/services/readingArticlesData.js`) untuk pilar Bacaan.
- [x] Pembuatan halaman pilar **Bacaan** (`src/pages/ReadingPage.jsx`) dengan filter CEFR dan fitur *Tap-to-Save* kosakata ke kartu flashcard.
- [x] Pembuatan halaman arena **Latihan** (`src/pages/PracticePage.jsx`) dengan hub 6 mode: Flashcard, Grammar Detective, Bridge Builder, Dikte, Dialog, Menulis.
- [x] Restrukturisasi Bottom Navigation (Mobile) & Navbar (Desktop): 4 tab konsisten (**Belajar**, **Latihan**, **Bacaan**, **Liga**).
- [x] Banner kreatif *The Language Scanner (Tes Penempatan Level CEFR)* di dashboard belajar.

### ✅ TAHAP 2 — Tes Penempatan Level Adaptif & Graded Reader Enhancement [SELESAI]
- [x] Mesin kuis diagnostik adaptif 8 soal (The Language Scanner) untuk auto-deteksi level pengguna (A1 - C1).
- [x] Auto-rekomendasi kurikulum & bacaan awal berdasarkan skor scanner.
- [x] Pembacaan audio native lengkap per paragraf pada pilar Bacaan (Audio player bar + speed toggle 0.85x, 1.0x, 1.15x).
- [x] Lencana CEFR otomatis tersemat di profil pengguna dan navbar setelah tes (+50 bonus XP).

### 🔵 TAHAP 3 — Implementasi Penuh 6 Mode Arena Latihan
- [x] Mode 1: Kartu Hafalan (Active Recall SRS SM-2 + Voice Shadowing)
- [x] Mode 2: Kesalahan Umum (Grammar Detective) - Mini-game aktif
- [x] Mode 3: Konjungsi (Bridge Builder) - Mini-game aktif
- [ ] Mode 4: Dikte (Ear Master) - Audio typing engine dengan fuzzy grading
- [ ] Mode 5: Dialog (Roleplay Lounge) - Chatbot NPC percakapan situasional
- [ ] Mode 6: Latihan Menulis (Sentence Builder) - Drag/tap scrambled word blocks

---

## 🔍 Temuan Tambahan (Prioritas Sedang - Sprint Berikutnya)
- [ ] **Unit Tests**: Tambahkan unit test untuk SM-2 edge cases (interval saat EF=1.3, weekly reset logic, kalkulasi XP).
- [ ] **PWA UX Polish**: Tambahkan prompt "Tambah ke Layar Utama" khusus pengguna iOS Safari. Uji target skor Lighthouse PWA ≥ 90.
- [ ] **Supabase RLS Policy Audit**: Penyesuaian aturan Row Level Security di Supabase untuk query publik vs personal.

---
*Terakhir diperbarui: 12 November 2026*
