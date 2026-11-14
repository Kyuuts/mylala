import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Zap,
  Sparkles,
  Smartphone,
  Award,
  CheckCircle2,
  Compass,
  Flame,
  Brain,
  Wifi,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import Logo from '../components/common/Logo';
import { useAppStore } from '../store/useAppStore';

export default function HomePage() {
  const { isAuthenticated, user, streak, weeklyXp } = useAppStore();

  return (
    <div className="space-y-12 py-2 sm:py-4">
      {/* 1. HERO SECTION */}
      {isAuthenticated && user ? (
        // Authenticated Returning User Banner
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Sesi Belajar Aktif</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Halo, <span className="text-amber-300">{user.name || user.username || 'Siswa'}</span>! 👋
            </h1>

            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Siap melanjutkan target belajarmu hari ini? Pertahankan ritme latihan dan capai level CEFR berikutnya!
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-indigo-200" />
                Level: {user.cefrLevel || 'A1'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                {streak || 0} Hari Streak
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                {weeklyXp || 0} Weekly XP
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold px-6 py-3.5 rounded-2xl shadow-md transition active:scale-95"
              >
                <span>Buka Dashboard Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3.5 rounded-2xl border border-white/20 transition active:scale-95"
              >
                <Zap className="w-4 h-4 text-orange-300" />
                <span>Arena Latihan</span>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        // Public Guest Hero Section
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4 sm:pt-8">
          <div className="flex justify-center mb-2">
            <Logo size="xl" className="shadow-lg hover:scale-105 transition-transform" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>MyLala &bull; Micro-Learning &amp; Spaced Repetition PWA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Kuasai Bahasa Asing Lebih Cepat dengan{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Active Recall
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Platform belajar modular berbasis kurikulum CEFR (A1&ndash;C1). Dilengkapi flashcard spaced repetition ilmiah, pembaca cerita interaktif, dan 100% siap digunakan secara offline tanpa kuota.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition text-sm sm:text-base cursor-pointer"
            >
              <span>Mulai Belajar Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-bold px-6 py-3.5 rounded-2xl border border-slate-300 transition shadow-2xs text-sm sm:text-base cursor-pointer"
            >
              <span>Sudah Punya Akun? Masuk</span>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 pt-3 text-xs text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Gratis Selamanya
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bebas Iklan Mengganggu
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PWA Offline-First
            </span>
          </div>
        </section>
      )}

      {/* 2. THE 3 CORE LEARNING PILLARS */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Metodologi Efektif
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ekosistem Belajar 3 Pilar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Kombinasi teori 1-halaman yang ringkas, arena latihan intensif, dan bacaan kontekstual berjenjang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Pilar 1 */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition">
                1. Belajar (Teori CEFR)
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Materi 1-halaman ringkas Grammar, Kosakata tematik, &amp; Konjungsi berjenjang dari A1 s/d C1 tanpa cognitive overload.
            </p>
          </Link>

          {/* Pilar 2 */}
          <Link
            to={isAuthenticated ? '/practice' : '/login'}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-orange-600 transition">
                2. Latihan (6 Mode)
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Asah kemampuan lewat Flashcard SRS, Identifikasi Kesalahan Grammar, Dikte Audio, Dialog Realistis, Menulis, dan Pola Kalimat.
            </p>
          </Link>

          {/* Pilar 3 */}
          <Link
            to={isAuthenticated ? '/reading' : '/login'}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-sky-600 transition">
                3. Bacaan (Graded Readers)
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Artikel kontekstual sesuai level CEFR. Ketuk kata sulit untuk melihat arti instan dan menyimpannya langsung ke kartu hafalan Anda.
            </p>
          </Link>
        </div>
      </section>

      {/* 3. KEY DIFFERENTIATORS GRID */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kenapa Memilih MyLala?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Didesain khusus untuk pembelajar mandiri yang menginginkan hasil nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Algoritma SRS SuperMemo</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jadwal pengulangan kartu dihitung otomatis berdasarkan kurva memori agar kosakata masuk ke memori jangka panjang.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% PWA Offline-First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instal di HP atau Laptop tanpa lewat app store. Belajar tetap lancar di pesawat atau saat tanpa koneksi internet.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Scanner &amp; Ujian Kelulusan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tes penempatan diagnostik untuk mengukur level awal, serta ujian 10 menit untuk syarat resmi naik ke level berikutnya.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Liga Mingguan &amp; Streak</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bangun kebiasaan harian dengan penghitung streak kalender UTC dan bersaing di klasemen liga mingguan yang adil.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CONVERSION CTA BANNER (Visible to all, focused on guest conversion) */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Siap Meningkatkan Kefasihan Bahasa Anda?
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Mulai perjalanan micro-learning Anda hari ini. Gratis, dapat diakses dari browser mana saja, dan tersimpan aman di perangkat Anda.
            </p>
            <div className="pt-3">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold px-7 py-3.5 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <span>Daftar Akun Gratis Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
