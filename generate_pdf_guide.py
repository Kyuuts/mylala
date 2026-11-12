import os
from playwright.sync_api import sync_playwright

html_content = """<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Panduan Akses & Penggunaan Aplikasi MyLala</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4;
      margin: 20mm 18mm 22mm 18mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 9pt;
        color: #94a3b8;
      }
      @bottom-left {
        content: "MyLala PWA • Panduan Akses & Penggunaan Resmi";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8.5pt;
        color: #94a3b8;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 10pt;
      background: #ffffff;
    }

    /* Page Breaks */
    .page-break {
      page-break-before: always;
    }

    /* Cover Page */
    .cover {
      min-height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15mm 5mm 5mm 5mm;
    }

    .cover-top {
      text-align: left;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 9999px;
      font-size: 9pt;
      font-weight: 700;
      color: #4338ca;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 24px;
    }

    .brand-badge-dot {
      width: 8px;
      height: 8px;
      background: #4f46e5;
      border-radius: 50%;
    }

    .cover-title {
      font-size: 28pt;
      font-weight: 800;
      line-height: 1.15;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-bottom: 14px;
    }

    .cover-title span {
      color: #4f46e5;
    }

    .cover-subtitle {
      font-size: 12.5pt;
      color: #475569;
      line-height: 1.5;
      max-width: 90%;
      margin-bottom: 30px;
    }

    .cover-highlights {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 25px;
    }

    .highlight-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
    }

    .highlight-card h4 {
      font-size: 10pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .highlight-card p {
      font-size: 8.5pt;
      color: #64748b;
      line-height: 1.4;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8.5pt;
      color: #64748b;
    }

    .cover-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      font-weight: 600;
      color: #4f46e5;
    }

    /* Headings */
    h1 {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
      letter-spacing: -0.3px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
    }

    h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    h3 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #334155;
      margin-top: 12px;
      margin-bottom: 6px;
    }

    p {
      margin-bottom: 10px;
      color: #334155;
      text-align: justify;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    /* Callout Boxes */
    .callout {
      border-radius: 10px;
      padding: 12px 14px;
      margin: 12px 0;
      font-size: 9pt;
      line-height: 1.5;
    }

    .callout-info {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }

    .callout-success {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      color: #065f46;
    }

    .callout-tip {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }

    .callout-indigo {
      background: #eef2ff;
      border-left: 4px solid #6366f1;
      color: #3730a3;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 9pt;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }

    th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }

    tr:nth-child(even) {
      background: #f8fafc;
    }

    /* Code & Badges */
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      padding: 2px 5px;
      border-radius: 4px;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }

    .badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-indigo { background: #e0e7ff; color: #4338ca; }
    .badge-emerald { background: #d1fae5; color: #065f46; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .badge-sky { background: #e0f2fe; color: #0369a1; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }

    /* Step Grid */
    .step-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 10px;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }

    .step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #4f46e5;
      color: #ffffff;
      font-weight: 800;
      font-size: 8.5pt;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .step-title {
      font-weight: 700;
      font-size: 9.5pt;
      color: #0f172a;
    }

    .step-desc {
      font-size: 8.5pt;
      color: #475569;
      margin-left: 32px;
      margin-bottom: 0;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover">
    <div class="cover-top">
      <div class="brand-badge">
        <span class="brand-badge-dot"></span>
        Panduan Resmi Pengguna • Edisi November 2026
      </div>

      <h1 class="cover-title" style="border: none; padding: 0;">
        Panduan Akses &amp;<br>
        Cara Penggunaan<br>
        <span>MyLala PWA</span>
      </h1>

      <p class="cover-subtitle">
        Buku pedoman resmi penggunaan platform micro-learning bahasa interaktif dengan teknologi <strong>Active Recall</strong>, algoritma <strong>Spaced Repetition (SM-2)</strong>, <strong>Graded Readers dengan Native Audio</strong>, dan sistem <strong>Klasemen Liga Realtime</strong>.
      </p>

      <div class="cover-highlights">
        <div class="highlight-card">
          <h4>📱 Progressive Web App (PWA)</h4>
          <p>Dapat diakses instan melalui web browser atau diinstall langsung ke layar utama Android, iOS, dan Desktop tanpa melalui Play Store / App Store.</p>
        </div>
        <div class="highlight-card">
          <h4>⚡ Offline-First Architecture</h4>
          <p>Tetap dapat digunakan untuk belajar dan menghafal kartu flashcard saat koneksi internet terputus, otomatis tersinkronisasi saat kembali online.</p>
        </div>
        <div class="highlight-card">
          <h4>🎯 3 Pilar Kurikulum Terpadu</h4>
          <p>Mengintegrasikan <strong>Belajar</strong> (Grammar & Kosakata CEFR A1-C1), <strong>Latihan</strong> (6 Arena Interaktif), dan <strong>Bacaan</strong> (Graded Readers Audio).</p>
        </div>
        <div class="highlight-card">
          <h4>🏆 Realtime Weekly League</h4>
          <p>Kompetisi pembelajar mingguan berbasis XP dengan pembagian 5 divisi liga (Bronze hingga Diamond) bertenaga WebSocket Supabase.</p>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>
        <p style="margin: 0; font-weight: 700; color: #1e293b;">MyLala Micro-Learning Language Platform</p>
        <p style="margin: 0;">Versi Aplikasi: <strong>v2.0.0</strong> • Dokumentasi Lengkap</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-size: 8pt; color: #94a3b8;">Tautan Akses Aplikasi:</p>
        <p class="cover-url" style="margin: 0;">https://mylala.vercel.app</p>
      </div>
    </div>
  </div>

  <!-- ==================== PAGE 2: PENDAHULUAN & AKSES ==================== -->
  <div class="page-break"></div>

  <h1>Bab 1: Pendahuluan &amp; Cara Mengakses MyLala</h1>

  <h2>1.1 Tentang MyLala</h2>
  <p>
    <strong>MyLala</strong> adalah aplikasi pembelajaran bahasa inovatif yang dirancang untuk mengatasi kelemahan metode belajar tradisional yang pasif. Dengan menggabungkan teori kognitif <em>Active Recall</em> (mengingat aktif) dan algoritma <em>Spaced Repetition System (SM-2)</em>, MyLala membantu pembelajar memindahkan kosakata dan pola tata bahasa dari memori jangka pendek ke memori jangka panjang secara efisien.
  </p>

  <div class="callout callout-indigo">
    <strong>💡 Tiga Prinsip Utama MyLala:</strong>
    <ul style="margin-top: 6px; margin-bottom: 0;">
      <li><strong>Mikro-Belajar:</strong> Materi disajikan dalam format modular ringkas (3-5 menit per sesi) yang tidak membebani otak.</li>
      <li><strong>Pembelajaran Aktif:</strong> Melatih otak memproduksi bahasa (berbicara, mengetik, menyusun kalimat) bukan hanya membaca pasif.</li>
      <li><strong>Retensi Terjadwal:</strong> Kartu hafalan otomatis dijadwalkan ulang tepat sebelum Anda mulai melupakannya.</li>
    </ul>
  </div>

  <h2>1.2 Cara Mengakses Aplikasi Melalui Web Browser</h2>
  <p>
    MyLala dapat diakses secara langsung dari perangkat apa saja (Smartphone Android, iPhone, iPad, Tablet, Laptop, maupun PC Desktop) tanpa memerlukan spesifikasi khusus. Cukup buka browser favorit Anda (Google Chrome, Safari, Microsoft Edge, atau Mozilla Firefox) dan kunjungi alamat resmi:
  </p>
  <p style="text-align: center; margin: 12px 0;">
    <code style="font-size: 11pt; padding: 6px 16px; background: #eef2ff; color: #4338ca; border-color: #c7d2fe; font-weight: 700;">
      https://mylala.vercel.app
    </code>
  </p>

  <h2>1.3 Cara Menginstal MyLala sebagai Aplikasi Native (PWA)</h2>
  <p>
    MyLala dibangun dengan teknologi <strong>Progressive Web App (PWA)</strong>. Anda dapat menginstalnya langsung ke layar utama perangkat Anda sehingga memiliki ikon aplikasi tersendiri, berjalan layar penuh (fullscreen) tanpa bilah URL browser, dan bekerja secara offline.
  </p>

  <div class="step-box">
    <div class="step-header">
      <span class="step-num">A</span>
      <span class="step-title">Pengguna Smartphone Android (Google Chrome / Brave)</span>
    </div>
    <p class="step-desc">
      1. Buka <code>https://mylala.vercel.app</code> di Google Chrome.<br>
      2. Saat banner notifikasi di bagian bawah muncul, klik tombol <strong>"Install MyLala"</strong>.<br>
      3. Atau klik menu tiga titik (⋮) di pojok kanan atas Chrome, lalu pilih <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.<br>
      4. Ikon MyLala akan muncul di daftar aplikasi HP Anda layaknya aplikasi Play Store.
    </p>
  </div>

  <div class="step-box">
    <div class="step-header">
      <span class="step-num">B</span>
      <span class="step-title">Pengguna iPhone / iPad (Apple Safari di iOS)</span>
    </div>
    <p class="step-desc">
      1. Buka tautan di browser bawaan <strong>Safari</strong>.<br>
      2. Tekan tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah mengarah ke atas di bilah bawah).<br>
      3. Gulir ke bawah dan pilih menu <strong>"Add to Home Screen" (Tambahkan ke Layar Utama)</strong>.<br>
      4. Tekan "Add" di pojok kanan atas. Ikon MyLala siap dibuka langsung dari Home Screen iOS.
    </p>
  </div>

  <div class="step-box">
    <div class="step-header">
      <span class="step-num">C</span>
      <span class="step-title">Pengguna Laptop / PC Desktop (Chrome &amp; Edge)</span>
    </div>
    <p class="step-desc">
      1. Buka website di Google Chrome atau Microsoft Edge.<br>
      2. Klik ikon komputer kecil bertuliskan <strong>"Install MyLala"</strong> yang berada di ujung kanan bilah alamat (address bar).<br>
      3. Konfirmasi instalasi. MyLala akan terbuka di jendela tersendiri dan pintasannya tersedia di Desktop / Start Menu.
    </p>
  </div>

  <h2>1.4 Pendaftaran Akun &amp; Sistem Keamanan Autentikasi</h2>
  <p>
    Untuk mulai melacak poin XP, streak harian, dan posisi di klasemen liga, pengguna wajib masuk menggunakan akun pribadi:
  </p>
  <ul>
    <li><strong>Daftar Akun Baru:</strong> Buka tab <em>"Daftar Akun Baru"</em> pada halaman login. Masukkan Nama Lengkap, Username (huruf kecil & angka tanpa spasi), Alamat Email valid, dan Password (minimal 6 karakter).</li>
    <li><strong>Keamanan Kriptografi:</strong> Password dienkripsi menggunakan algoritma cryptographic salted-hash sebelum disimpan, menjamin kerahasiaan akun secara maksimal.</li>
    <li><strong>Masuk Akun (Login):</strong> Pengguna cukup memasukkan username atau email beserta kata sandi yang telah terdaftar.</li>
  </ul>

  <!-- ==================== PAGE 3: NAVIGASI & PILAR BELAJAR ==================== -->
  <div class="page-break"></div>

  <h1>Bab 2: Struktur Navigasi &amp; Pilar 1 — Belajar</h1>

  <h2>2.1 Struktur Navigasi Utama (4 Tab Inti)</h2>
  <p>
    MyLala mengadopsi navigasi modern yang ramah jempol (*thumb-friendly*), terletak di bagian bilah navigasi bawah (*Bottom Navigation*) pada HP dan di bilah atas (*Navbar*) pada desktop:
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 20%;">Tab Navigasi</th>
        <th style="width: 25%;">Fungsi Utama</th>
        <th>Deskripsi Konten</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Belajar</strong></td>
        <td>Modul Kurikulum</td>
        <td>Daftar materi terstruktur berdasarkan level CEFR, ringkasan konsep, cheat sheet, dan tes diagnostik Language Scanner.</td>
      </tr>
      <tr>
        <td><strong>2. Latihan</strong></td>
        <td>Arena Praktik Interaktif</td>
        <td>Hub pusat 6 mode latihan aktif: Flashcard SRS, Kesalahan Umum, Konjungsi, Dikte, Dialog NPC, dan Susun Kalimat.</td>
      </tr>
      <tr>
        <td><strong>3. Bacaan</strong></td>
        <td>Graded Readers</td>
        <td>Koleksi artikel berjenjang A1-C1 dilengkapi pemutar audio native per paragraf dan fitur tap-to-save kosakata.</td>
      </tr>
      <tr>
        <td><strong>4. Liga</strong></td>
        <td>Klasemen Kompetisi</td>
        <td>Peringkat mingguan pembelajar realtime, poin XP, multiplier streak, dan generator kartu pencapaian sosial.</td>
      </tr>
    </tbody>
  </table>

  <h2>2.2 Standarisasi Level Kemampuan Bahasa (CEFR)</h2>
  <p>
    Seluruh kurikulum MyLala dikelompokkan secara baku mengacu pada standar internasional <em>Common European Framework of Reference for Languages (CEFR)</em>:
  </p>

  <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 12px 0;">
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px; border-radius: 8px; text-align: center;">
      <span class="badge badge-emerald">A1</span>
      <p style="font-size: 7.5pt; font-weight: 700; margin: 4px 0 0 0; color: #166534;">The Explorer</p>
      <p style="font-size: 7pt; color: #64748b; margin: 0;">Pemula Dasar</p>
    </div>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 8px; border-radius: 8px; text-align: center;">
      <span class="badge badge-sky">A2</span>
      <p style="font-size: 7.5pt; font-weight: 700; margin: 4px 0 0 0; color: #1e40af;">The Voyager</p>
      <p style="font-size: 7pt; color: #64748b; margin: 0;">Pra-Menengah</p>
    </div>
    <div style="background: #fdf4ff; border: 1px solid #f5d0fe; padding: 8px; border-radius: 8px; text-align: center;">
      <span class="badge badge-purple">B1</span>
      <p style="font-size: 7.5pt; font-weight: 700; margin: 4px 0 0 0; color: #86198f;">Global Citizen</p>
      <p style="font-size: 7pt; color: #64748b; margin: 0;">Menengah Mandiri</p>
    </div>
    <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 8px; border-radius: 8px; text-align: center;">
      <span class="badge badge-amber">B2</span>
      <p style="font-size: 7.5pt; font-weight: 700; margin: 4px 0 0 0; color: #92400e;">The Diplomat</p>
      <p style="font-size: 7pt; color: #64748b; margin: 0;">Menengah Atas</p>
    </div>
    <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 8px; border-radius: 8px; text-align: center;">
      <span class="badge badge-indigo">C1</span>
      <p style="font-size: 7.5pt; font-weight: 700; margin: 4px 0 0 0; color: #3730a3;">The Mastermind</p>
      <p style="font-size: 7pt; color: #64748b; margin: 0;">Tingkat Mahir</p>
    </div>
  </div>

  <h2>2.3 Fitur Language Scanner (Tes Penempatan Level Adaptif)</h2>
  <p>
    Bagi pengguna baru atau mereka yang ingin mengukur kecakapan bahasa Inggris terkini, MyLala menyediakan fitur <strong>Language Scanner</strong>:
  </p>
  <ul>
    <li><strong>Akses Fitur:</strong> Klik kartu gradien <em>"Language Scanner: Temukan Level Bahasa Anda"</em> di bagian atas tab Belajar.</li>
    <li><strong>Sistem Diagnostik 8 Soal:</strong> Pertanyaan mencakup grammar akademis, collocation kosakata, preposisi, dan inversi kata kerja.</li>
    <li><strong>Hasil Instan:</strong> Setelah selesai, sistem memberikan analisis skor, menetapkan level CEFR (A1-C1), memberikan badge profil, serta merekomendasikan artikel bacaan dan modul spesifik yang cocok.</li>
    <li><strong>Bonus XP:</strong> Menyelesaikan Language Scanner langsung memberikan reward <strong>+50 XP</strong>.</li>
  </ul>

  <h2>2.4 Cheat Sheet Modul &amp; Filter Kategori</h2>
  <p>
    Pengguna dapat menyaring katalog modul berdasarkan:
  </p>
  <ul>
    <li><strong>Level Kesulitan:</strong> Semua, A1, A2, B1, B2, atau C1.</li>
    <li><strong>Sub-Pilar Materi:</strong>
      <ul>
        <li><strong>Grammar:</strong> Pola struktur kalimat (Negative Inversion, Reduced Clauses, Conditionals).</li>
        <li><strong>Kosakata (Vocab):</strong> Idiom akademis, frasa profesional, dan kolokasi penting.</li>
        <li><strong>Konjungsi:</strong> Kata sambung logis, transisi paragraf, dan konektor bertingkat.</li>
      </ul>
    </li>
    <li><strong>Poin Reward Membaca:</strong> Membaca dan menuntaskan satu modul Cheat Sheet memberikan reward <strong>+20 XP</strong>.</li>
  </ul>

  <!-- ==================== PAGE 4: PILAR LATIHAN (6 MODE) ==================== -->
  <div class="page-break"></div>

  <h1>Bab 3: Pilar 2 — Enam (6) Mode Arena Latihan Interaktif</h1>

  <p>
    Tab <strong>Latihan</strong> adalah ruang praktik aktif untuk memperkuat retensi memori. MyLala menyediakan enam mode latihan yang dirancang untuk mengasah seluruh aspek berbahasa:
  </p>

  <h2>3.1 Mode 1: Kartu Hafalan (Flashcard SRS &amp; Shadowing)</h2>
  <ul>
    <li><strong>Tujuan:</strong> Menguji daya ingat kosakata dan struktur kalimat dari dua arah (Inggris ➔ Indonesia atau sebaliknya).</li>
    <li><strong>Algoritma SM-2 Spaced Repetition:</strong> Setelah membalik kartu, pilih tingkat kesulitan:
      <ul>
        <li><strong>Again (Ulangi):</strong> Bila lupa sama sekali (+5 XP, kartu langsung diulang).</li>
        <li><strong>Hard (Sulit):</strong> Ingat dengan usaha keras (+5 XP, interval diperpendek).</li>
        <li><strong>Good (Bagus):</strong> Ingat dengan wajar (+10 XP, interval diperpanjang proporsional).</li>
        <li><strong>Easy (Mudah):</strong> Sangat hafal (+15 XP, kartu berstatus <em>Mastered</em>).</li>
      </ul>
    </li>
    <li><strong>Voice Shadowing (Pengenalan Suara):</strong> Tekan tombol mikrofon untuk melatih pelafalan target kalimat. Sistem speech recognition akan mencocokkan ucapan Anda secara instan.</li>
  </ul>

  <h2>3.2 Mode 2: Kesalahan Umum (Grammar Detective)</h2>
  <ul>
    <li><strong>Tujuan:</strong> Melatih ketelitian menemukan kesalahan tata bahasa (*error spotting*) yang paling sering mengecoh peserta TOEFL/IELTS.</li>
    <li><strong>Format Latihan:</strong> Disajikan kalimat lengkap dengan pilihan bagian yang salah. Pengguna harus menganalisis letak kekeliruan (misal: kesalahan parallelism, agreement, atau pemilihan tenses).</li>
    <li><strong>Reward:</strong> Setiap jawaban benar dihadiahi <strong>+15 XP</strong> disertai penjelasan kaidah tata bahasa yang mendalam.</li>
  </ul>

  <h2>3.3 Mode 3: Konjungsi (Bridge Builder)</h2>
  <ul>
    <li><strong>Tujuan:</strong> Menguasai penggunaan kata hubung transisi, klausa konsesif, dan kalimat majemuk bertingkat.</li>
    <li><strong>Format Latihan:</strong> Menghubungkan dua premis kalimat dengan konektor yang tepat (misal: <em>Nonetheless, Furthermore, Whereas, In spite of</em>).</li>
    <li><strong>Reward:</strong> Jawaban tepat diganjar <strong>+15 XP</strong>.</li>
  </ul>

  <h2>3.4 Mode 4: Dikte (Ear Master)</h2>
  <ul>
    <li><strong>Tujuan:</strong> Mempertajam pendengaran (*listening comprehension*) dan akurasi ejaan penulisan kata.</li>
    <li><strong>Fitur Audio Dual-Speed:</strong> Tersedia pemutar suara berkecepatan <strong>Normal (1.0x)</strong> dan <strong>Pelan (0.75x)</strong> untuk menyimak kata-kata yang tersambung (*connected speech*).</li>
    <li><strong>Penilaian Akurasi Cerdas:</strong> Sistem mengevaluasi persentase kemiripan kata yang diketik terhadap target audio asli secara real-time.</li>
    <li><strong>Reward:</strong> Dikte yang akurat dihadiahi <strong>+20 XP</strong>.</li>
  </ul>

  <h2>3.5 Mode 5: Dialog (Roleplay Lounge)</h2>
  <ul>
    <li><strong>Tujuan:</strong> Simulasi komunikasi situasional dua arah dalam skenario nyata (misal: wawancara kerja, diskusi akademis, check-in hotel).</li>
    <li><strong>Fitur Suara NPC:</strong> Lawan bicara virtual membacakan kalimat pembuka secara otomatis.</li>
    <li><strong>Analisis Politeness (Tingkat Kesopanan):</strong> Sistem mengevaluasi pilihan respons terbaik berdasarkan konteks formalitas dan etika percakapan.</li>
    <li><strong>Reward:</strong> Penyelesaian skenario dialog dihadiahi <strong>+25 XP</strong>.</li>
  </ul>

  <h2>3.6 Mode 6: Latihan Menulis (Sentence Builder)</h2>
  <ul>
    <li><strong>Tujuan:</strong> Membangun kebiasaan menyusun kalimat dengan struktur SPOK dan pola inversi formal yang benar.</li>
    <li><strong>Format Puzzle Blok Kata:</strong> Pengguna menyusun blok-blok kata acak menjadi satu kalimat utuh yang padu.</li>
    <li><strong>Reward:</strong> Kalimat yang tersusun sempurna dihadiahi <strong>+20 XP</strong>.</li>
  </ul>

  <!-- ==================== PAGE 5: PILAR BACAAN & LIGA ==================== -->
  <div class="page-break"></div>

  <h1>Bab 4: Pilar 3 — Artikel Bacaan (Graded Readers)</h1>

  <h2>4.1 Koleksi Artikel Berjenjang A1 s.d. C1</h2>
  <p>
    Tab <strong>Bacaan</strong> menyajikan artikel bacaan yang dikalibrasi sesuai rentang pemahaman pembelajar:
  </p>
  <ul>
    <li><strong>Level A1 - A2:</strong> Kalimat pendek, kosakata harian, topik kehidupan sehari-hari dan perjalanan santai.</li>
    <li><strong>Level B1 - B2:</strong> Topik teknologi, produktivitas, sains populer, dan opini terstruktur.</li>
    <li><strong>Level C1:</strong> Esai akademis, analisis linguistik, artikel ilmiah formal, dan argumen kompleks.</li>
  </ul>

  <h2>4.2 Fitur Pemutar Audio Narasi Paragraf Lengkap</h2>
  <p>
    Setiap artikel dilengkapi pemutar suara native yang dirancang untuk melatih kemampuan membaca sambil mendengarkan (*simultaneous reading &amp; listening*):
  </p>
  <ul>
    <li><strong>Putar Semua Paragraf (Play All):</strong> Membacakan artikel dari awal hingga akhir secara otomatis berurutan.</li>
    <li><strong>Sinkronisasi Sorotan Visual (Auto-Highlight):</strong> Paragraf yang sedang dibacakan akan otomatis menyala dengan warna latar lembut dan border indigo sehingga mata Anda mudah mengikuti bacaan.</li>
    <li><strong>Pemutar Paragraf Individual:</strong> Setiap paragraf memiliki ikon speaker kecil untuk memutar ulang paragraf tertentu saja.</li>
    <li><strong>Kontrol Kecepatan (Tempo):</strong> Tersedia 3 opsi tempo: <strong>0.85x</strong> (santai/belajar), <strong>1.0x</strong> (normal native), dan <strong>1.15x</strong> (latihan cepat).</li>
  </ul>

  <h2>4.3 Fitur Tap-to-Save Vocabulary (Simpan Kata Sekali Ketuk)</h2>
  <p>
    Setiap kata penting di dalam artikel dapat diketuk. Saat diketuk, kartu definisi dan terjemahan instan akan muncul, dan pengguna dapat menekan tombol <strong>"+ Simpan ke Flashcard"</strong> agar kata tersebut otomatis masuk ke antrean latihan Spaced Repetition harian Anda.
  </p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 18px 0;">

  <h1>Bab 5: Sistem Klasemen Liga &amp; Kartu Viral Sosial</h1>

  <h2>5.1 Divisi Liga Pembelajar Mingguan</h2>
  <p>
    Setiap XP yang Anda peroleh dari membaca modul, menghafal kartu, dan menyelesaikan arena latihan akan diakumulasikan ke dalam <strong>Liga Mingguan</strong>. Terdapat 5 tingkatan divisi:
  </p>

  <table>
    <thead>
      <tr>
        <th>Tingkat Liga</th>
        <th>Badge</th>
        <th>Syarat Poin XP</th>
        <th>Status Divisi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Bronze League</strong></td>
        <td>🥉</td>
        <td>0 - 299 XP</td>
        <td>Liga Permulaan bagi pembelajar baru.</td>
      </tr>
      <tr>
        <td><strong>Silver League</strong></td>
        <td>🥈</td>
        <td>300 - 599 XP</td>
        <td>Divisi Menengah dengan persaingan aktif.</td>
      </tr>
      <tr>
        <td><strong>Gold League</strong></td>
        <td>🥇</td>
        <td>600 - 999 XP</td>
        <td>Divisi Elit dengan komitmen belajar konsisten.</td>
      </tr>
      <tr>
        <td><strong>Platinum League</strong></td>
        <td>💎</td>
        <td>1.000 - 1.499 XP</td>
        <td>Divisi Master dengan pemahaman bahasa tinggi.</td>
      </tr>
      <tr>
        <td><strong>Diamond League</strong></td>
        <td>👑</td>
        <td>1.500+ XP</td>
        <td>Divisi Tertinggi / Puncak Prestasi MyLala.</td>
      </tr>
    </tbody>
  </table>

  <h2>5.2 Pembaruan Real-Time &amp; Reset Mingguan</h2>
  <ul>
    <li><strong>Live Realtime WebSocket:</strong> Klasemen disinkronkan langsung via Supabase Realtime. Setiap ada teman liga yang menambah XP di perangkat mereka, peringkat di layar Anda akan bergeser secara live tanpa perlu reload.</li>
    <li><strong>Jadwal Reset:</strong> Liga di-reset setiap hari <strong>Minggu pukul 23:59 WIB</strong>. Pengguna di <strong>Zona Top 5 Promosi</strong> akan naik ke liga berikutnya pada minggu baru.</li>
  </ul>

  <h2>5.3 Kartu Pencapaian Viral (Social Share Card)</h2>
  <p>
    Tekan tombol <strong>"Bagikan Peringkat"</strong> di halaman Liga untuk membuat kartu grafis definisi tinggi:
  </p>
  <ul>
    <li><strong>Pilihan Format:</strong> Format <strong>Story 9:16</strong> (untuk WhatsApp Status &amp; Instagram Stories) dan format <strong>Square 1:1</strong> (untuk Feed Instagram, Telegram, dan LinkedIn).</li>
    <li><strong>Grafis Otomatis:</strong> Menampilkan foto profil Anda, handle <code>@username</code>, nama liga, peringkat, total XP, dan hari streak secara elegan.</li>
    <li><strong>Download &amp; Share Langsung:</strong> Dapat diunduh sebagai gambar PNG jernih atau dibagikan langsung menggunakan Web Share API.</li>
  </ul>

  <!-- ==================== PAGE 6: PROFIL & FAQ ==================== -->
  <div class="page-break"></div>

  <h1>Bab 6: Kustomisasi Profil &amp; Tanya Jawab (FAQ)</h1>

  <h2>6.1 Cara Mengedit Profil &amp; Mengganti Foto / Avatar</h2>
  <p>
    MyLala menyediakan kustomisasi profil yang sangat mudah dan terpusat:
  </p>
  <div class="step-box">
    <div class="step-header">
      <span class="step-num">1</span>
      <span class="step-title">Buka Pop-up Edit Profil</span>
    </div>
    <p class="step-desc">
      Klik <strong>pill nama atau foto profil Anda di pojok kanan atas Navbar</strong>. Pop-up minimalis akan langsung muncul tepat di tengah layar.
    </p>
  </div>

  <div class="step-box">
    <div class="step-header">
      <span class="step-num">2</span>
      <span class="step-title">Opsi 1: Upload Foto Sendiri dari Galeri</span>
    </div>
    <p class="step-desc">
      Klik lingkaran foto atau teks <strong>"Upload Foto"</strong>. Pilih gambar dari galeri HP atau folder laptop Anda. Foto akan secara otomatis dikompresi ke resolusi 256x256 WebP (~15-25 KB) sehingga hemat penyimpanan dan aman secara offline.
    </p>
  </div>

  <div class="step-box">
    <div class="step-header">
      <span class="step-num">3</span>
      <span class="step-title">Opsi 2: Memilih 5 Avatar Karakter Eksklusif</span>
    </div>
    <p class="step-desc">
      Anda juga dapat memilih salah satu dari 5 avatar karakter yang tersedia:<br>
      🦊 <strong>Atlas Fox</strong> (The Smart Explorer) • 🦉 <strong>Athena Owl</strong> (The Mastermind Scholar) • 🚀 <strong>Aero Scout</strong> (The Cosmic Voyager) • 🦁 <strong>Leo Champion</strong> (The Bold Leader) • 🐼 <strong>Panda Zen</strong> (The Calm Polyglot).
    </p>
  </div>

  <div class="step-box">
    <div class="step-header">
      <span class="step-num">4</span>
      <span class="step-title">Ubah Nama &amp; Username, Lalu Simpan</span>
    </div>
    <p class="step-desc">
      Ketik nama tampilan Anda dan username unik (hanya huruf, angka, tanpa spasi). Tekan tombol <strong>"Simpan"</strong>. Perubahan akan langsung tercermin di Dashboard, Navbar, dan Klasemen Liga.
    </p>
  </div>

  <h2>6.2 Pertanyaan yang Sering Diajukan (FAQ)</h2>

  <div class="callout callout-info">
    <strong>Q1: Apakah data belajar saya tetap aman jika saya berganti perangkat atau membuka di Tab Samaran?</strong><br>
    <strong>Jawab:</strong> Ya, 100% aman! Seluruh skor XP mingguan, streak, riwayat kartu hafalan, dan foto profil Anda tersimpan di database cloud Supabase. Saat Anda membuka perangkat baru atau Tab Samaran, cukup masuk (*login*) dengan akun Anda, maka seluruh XP dan progres akan otomatis ditarik dari server.
  </div>

  <div class="callout callout-info">
    <strong>Q2: Apakah saya bisa belajar saat tidak ada koneksi internet (Offline)?</strong><br>
    <strong>Jawab:</strong> Tentu saja. MyLala dilengkapi teknologi <em>Service Worker</em> dan <em>Local Cache</em>. Anda tetap bisa membuka materi cheat sheet dan menghafal kartu flashcard saat offline. Saat perangkat Anda terhubung kembali ke internet, antrean jawaban akan otomatis disinkronkan ke cloud.
  </div>

  <div class="callout callout-info">
    <strong>Q3: Apa yang harus dilakukan jika suara audio di bacaan atau dikte tidak bersuara?</strong><br>
    <strong>Jawab:</strong> Pastikan volume media perangkat Anda aktif dan tidak dalam mode senyap (*Silent/Mute*). MyLala menggunakan Web Speech Synthesis bawaan browser yang mendukung suara jernih dalam bahasa Inggris.
  </div>

  <div class="callout callout-info">
    <strong>Q4: Kapan waktu riset klasemen liga mingguan?</strong><br>
    <strong>Jawab:</strong> Klasemen liga ditutup setiap hari Minggu pukul 23:59 WIB. Lima peserta dengan XP tertinggi di setiap liga akan dipromosikan ke divisi liga yang lebih tinggi pada hari Senin pukul 00:00 WIB.
  </div>

  <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; text-align: center;">
    <p style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">Selamat Belajar &amp; Raih Peringkat Tertinggi di MyLala!</p>
    <p style="font-size: 8.5pt; color: #64748b; margin: 0;">Untuk informasi dan bantuan lebih lanjut, silakan kunjungi portal aplikasi resmi di <strong>https://mylala.vercel.app</strong></p>
  </div>

</body>
</html>
"""

output_pdf = "Panduan_Penggunaan_MyLala.pdf"

print("Generating PDF from styled HTML...")
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.set_content(html_content, wait_until="networkidle")
    page.pdf(
        path=output_pdf,
        format="A4",
        print_background=True,
        margin={
            "top": "18mm",
            "bottom": "20mm",
            "left": "16mm",
            "right": "16mm"
        }
    )
    browser.close()

file_size_kb = os.path.getsize(output_pdf) / 1024
print(f"PDF successfully created: {output_pdf} ({file_size_kb:.1f} KB)")
