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
  const { isAuthenticated, user, streak, weeklyXp, checkWeeklyReset } = useAppStore();

  React.useEffect(() => {
    if (checkWeeklyReset) {
      checkWeeklyReset();
    }
  }, [checkWeeklyReset]);

  return (
    <div className="space-y-10 py-2 sm:py-4">
      {/* 1. HERO SECTION */}
      {isAuthenticated && user ? (
        // Authenticated Returning User Banner (Neo-Brutalism Lilac Hero)
        <section className="bg-[#B388FF] text-black rounded-3xl p-6 sm:p-10 border-3 border-black shadow-[6px_6px_0px_#000] relative overflow-hidden space-y-5">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-black uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sesi Belajar Aktif</span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#FF85C0] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-black text-2xl text-black shrink-0 overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.username || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(user.name || user.username || 'K').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-black/70">Selamat Datang Kembali</span>
                <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
                  HALO, {user.name || user.username || 'SISWA'}! 👋
                </h1>
              </div>
            </div>

            <p className="text-black text-sm sm:text-base leading-relaxed font-bold">
              Siap melanjutkan target belajarmu hari ini? Pertahankan ritme latihan dan capai level CEFR berikutnya!
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black">
                <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
                Level: {user.cefrLevel || 'A1'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black">
                <Flame className="w-3.5 h-3.5 fill-black stroke-[2.5]" />
                {streak || 0} Hari Streak
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFD166] border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black">
                <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                {weeklyXp || 0} Weekly XP
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#c9ee2b] text-black font-black px-6 py-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition"
              >
                <span>Buka Dashboard Belajar</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-black font-black px-5 py-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition"
              >
                <Zap className="w-4 h-4 stroke-[2.5]" />
                <span>Arena Latihan</span>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        // Public Guest Hero Section
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4 sm:pt-6">
          <div className="flex justify-center mb-2">
            <Logo size="xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>MyLala &bull; Neo-Brutalism Micro-Learning PWA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-black leading-tight uppercase">
            Kuasai Bahasa Asing Lebih Cepat dengan{' '}
            <span className="bg-[#B388FF] px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000] rounded-xl inline-block mt-1">
              Active Recall
            </span>
          </h1>

          <p className="text-sm sm:text-base text-black/80 font-bold leading-relaxed max-w-2xl mx-auto">
            Platform belajar modular berbasis kurikulum CEFR (A1&ndash;C1). Dilengkapi flashcard spaced repetition ilmiah, pembaca cerita interaktif, dan 100% siap digunakan secara offline.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 bg-[#FF85C0] hover:bg-[#ff70a6] active:translate-x-0.5 active:translate-y-0.5 text-black font-black px-7 py-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] transition text-sm sm:text-base cursor-pointer"
            >
              <span>Mulai Belajar Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 text-black font-black px-6 py-3.5 rounded-2xl border-2 border-black transition shadow-[4px_4px_0px_#000] text-sm sm:text-base cursor-pointer"
            >
              <span>Sudah Punya Akun? Masuk</span>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 pt-3 text-xs text-black font-black">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> 100% Gratis Selamanya
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Bebas Iklan
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> PWA Offline-First
            </span>
          </div>
        </section>
      )}

      {/* 2. THE 3 CORE LEARNING PILLARS */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-black uppercase tracking-wider px-2 py-0.5 bg-white border border-black rounded-md shadow-[1px_1px_0px_#000]">
            <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
            METODOLOGI EFEKTIF
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            EKOSISTEM BELAJAR 3 PILAR
          </h2>
          <p className="text-xs sm:text-sm text-black/70 font-bold">
            Teori 1-halaman ringkas, arena latihan intensif, dan bacaan kontekstual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pilar 1 */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="bg-white p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#B388FF] border-2 border-black shadow-[2px_2px_0px_#000] text-black flex items-center justify-center">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-black text-lg group-hover:underline transition">
                1. Belajar (Teori CEFR)
              </h3>
              <ChevronRight className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-semibold">
              Materi 1-halaman ringkas Grammar, Kosakata tematik, &amp; Konjungsi berjenjang dari A1 s/d C1 tanpa cognitive overload.
            </p>
          </Link>

          {/* Pilar 2 */}
          <Link
            to={isAuthenticated ? '/practice' : '/login'}
            className="bg-white p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] text-black flex items-center justify-center">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-black text-lg group-hover:underline transition">
                2. Latihan (6 Mode)
              </h3>
              <ChevronRight className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-semibold">
              Asah kemampuan lewat Flashcard SRS, Identifikasi Kesalahan Grammar, Dikte Audio, Dialog Realistis, Menulis, dan Pola Kalimat.
            </p>
          </Link>

          {/* Pilar 3 */}
          <Link
            to={isAuthenticated ? '/reading' : '/login'}
            className="bg-white p-6 rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#70D6FF] border-2 border-black shadow-[2px_2px_0px_#000] text-black flex items-center justify-center">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-black text-lg group-hover:underline transition">
                3. Bacaan (Graded Readers)
              </h3>
              <ChevronRight className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <p className="text-xs sm:text-sm text-black/75 leading-relaxed font-semibold">
              Artikel kontekstual sesuai level CEFR. Ketuk kata sulit untuk melihat arti instan dan menyimpannya langsung ke kartu hafalan Anda.
            </p>
          </Link>
        </div>
      </section>

      {/* 3. KEY DIFFERENTIATORS GRID */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            KENAPA MEMILIH MYLALA?
          </h2>
          <p className="text-xs sm:text-sm text-black/70 font-bold">
            Didesain khusus untuk pembelajar mandiri yang menginginkan hasil nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#B388FF] border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
              <Brain className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-black text-base">Algoritma SRS Ilmiah</h3>
            <p className="text-xs text-black/70 font-medium leading-relaxed">
              Jadwal pengulangan kartu dihitung otomatis berdasarkan kurva memori agar kosakata masuk ke memori jangka panjang.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-black text-base">100% PWA Offline-First</h3>
            <p className="text-xs text-black/70 font-medium leading-relaxed">
              Instal di HP atau Laptop tanpa lewat app store. Belajar tetap lancar di mana saja tanpa kuota.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFD166] border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-black text-base">Scanner &amp; Ujian CEFR</h3>
            <p className="text-xs text-black/70 font-medium leading-relaxed">
              Tes penempatan diagnostik untuk mengukur level awal, serta ujian kelulusan resmi tiap level.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#80ED99] border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="font-black text-black text-base">Liga Mingguan &amp; Streak</h3>
            <p className="text-xs text-black/70 font-medium leading-relaxed">
              Bangun kebiasaan harian dengan penghitung streak kalender UTC dan bersaing di klasemen liga mingguan.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CONVERSION CTA BANNER */}
      {!isAuthenticated && (
        <section className="bg-[#B388FF] text-black rounded-3xl p-8 sm:p-12 text-center space-y-4 border-3 border-black shadow-[6px_6px_0px_#000]">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase">
              SIAP MENINGKATKAN KEFASIHAN BAHASA?
            </h2>
            <p className="text-black text-xs sm:text-sm font-bold leading-relaxed">
              Mulai perjalanan micro-learning Anda hari ini. Gratis, dapat diakses dari browser mana saja, dan tersimpan aman di perangkat Anda.
            </p>
            <div className="pt-2">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 bg-[#D4F63D] hover:bg-[#cbf130] text-black font-black px-7 py-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition text-sm sm:text-base cursor-pointer"
              >
                <span>Daftar Akun Gratis Sekarang</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
