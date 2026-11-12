# 🗺️ Roadmap Eksekusi MyLala PWA
> Dokumen pelacakan resmi roadmap pengembangan berdasarkan **Laporan Analisis Produk Digital MyLala PWA** (Universitas Muhammadiyah Yogyakarta).

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

- [ ] **6. Campus Launch (Grassroots UMY)**
  - Peluncuran beta ke grup WhatsApp mahasiswa Universitas Muhammadiyah Yogyakarta (UMY).
  - Target awal: 50 *early adopters* mahasiswa pejuang TOEFL syarat kelulusan / CPNS / BUMN.

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
- [ ] Speech Recognition / Voice Shadowing (Pengecekan pelafalan dengan Web Speech API gratis)
- [x] Export grafis estetik untuk Instagram/WhatsApp (Viral Share Loop terintegrasi)
- [ ] Push notification reminder belajar harian (Notifikasi browser/PWA)

---

### 🟣 FASE 4 — Monetisasi & Ekspansi: Community & Revenue
- [ ] Katalog modul kontribusi komunitas (Creator marketplace)
- [ ] Integrasi QRIS / Midtrans / Duitku untuk pembelian modul spesialis (Rp19k - Rp39k)
- [ ] Dashboard kelas untuk dosen / lembaga bahasa kampus memantau progres mahasiswa kolektif
- [ ] Riset kemitraan resmi dengan lembaga bahasa kampus (B2B UMY Language Center)

---

## 🔍 Temuan Tambahan (Prioritas Sedang - Sprint Berikutnya)
- [ ] **Unit Tests**: Tambahkan unit test untuk SM-2 edge cases (interval saat EF=1.3, weekly reset logic, kalkulasi XP).
- [ ] **PWA UX Polish**: Tambahkan prompt "Tambah ke Layar Utama" khusus pengguna iOS Safari. Uji target skor Lighthouse PWA ≥ 90.
- [ ] **Supabase RLS Policy Audit**: Penyesuaian aturan Row Level Security di Supabase untuk query publik vs personal.

---
*Terakhir diperbarui: 12 November 2026*
