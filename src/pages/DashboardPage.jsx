import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Sparkles, RefreshCw, AlertCircle, PlusCircle, Filter, Trophy, Flame } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MetricsOverview from '../components/dashboard/MetricsOverview';
import LanguageSelector from '../components/dashboard/LanguageSelector';
import LevelFilter from '../components/dashboard/LevelFilter';
import CategoryFilter from '../components/dashboard/CategoryFilter';
import ModuleCard from '../components/dashboard/ModuleCard';
import { getModuleLevel } from '../utils/moduleLevel';
import { getTierFromXP } from '../utils/rankSystem';

export default function DashboardPage() {
  const { fetchModules, getMetrics, user, weeklyXp, streak } = useAppStore();
  const [modules, setModules] = useState([]);
  const [metrics, setMetrics] = useState({
    learningCount: 0,
    reviewCount: 0,
    masteredCount: 0,
    dueCount: 0,
    totalCards: 0,
  });

  // Filter States
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedLevel, setSelectedLevel] = useState('All'); // 'All' | 'Starter' | 'Intermediate' | 'Advanced'
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' | 'Grammar' | 'Vocab' | 'Templates'

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await fetchModules('All');
      if (err) throw err;
      setModules(data || []);
      setMetrics(getMetrics());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Gagal memuat data modul.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute counts per difficulty level for badge numbers
  const levelCounts = useMemo(() => {
    const counts = { All: modules.length, Starter: 0, Intermediate: 0, Advanced: 0 };
    modules.forEach((m) => {
      const lvl = getModuleLevel(m).id;
      if (counts[lvl] !== undefined) counts[lvl]++;
    });
    return counts;
  }, [modules]);

  // Combined Filtering: Level & Category
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const levelInfo = getModuleLevel(m);
      const matchesLevel = selectedLevel === 'All' || levelInfo.id === selectedLevel;
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      return matchesLevel && matchesCategory;
    });
  }, [modules, selectedLevel, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Title & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Belajar
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Selamat datang, <span className="font-bold text-indigo-600">{user?.name || 'Imam'}</span>! Pantau kemajuan retensi memori dan modul bahasa Anda.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* Metrics Section */}
      <MetricsOverview metrics={metrics} totalModules={modules.length} />

      {/* Rank & Weekly League Banner Bar */}
      {(() => {
        const tier = getTierFromXP(weeklyXp || 0);
        return (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-2xl shrink-0">
                {tier.badge}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Liga Mingguan:</span>
                  <span className="font-extrabold text-sm sm:text-base text-white">{tier.name}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Kamu memiliki <span className="text-amber-300 font-bold">{weeklyXp || 0} XP</span> minggu ini. Belajar flashcard untuk promosi!
                </p>
              </div>
            </div>

            <Link
              to="/leaderboard"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition active:scale-95 self-start sm:self-auto shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Lihat Klasemen Liga</span>
            </Link>
          </div>
        );
      })()}

      {/* Spaced Repetition Call To Action Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {metrics.dueCount > 0 ? 'Sesi Spaced Repetition Siap' : 'Akun Baru: Siap Belajar!'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {metrics.dueCount > 0
                ? `Ada ${metrics.dueCount} Flashcard Perlu Diulang Hari Ini!`
                : `Selamat Datang, ${user?.name || 'Imam'}! Belum Ada Review Jatuh Tempo.`}
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              {metrics.dueCount > 0
                ? 'Teknik active recall menguji memori Anda secara langsung. Luangkan 3–5 menit untuk menyelesaikan latihan kartu review harian.'
                : 'Pilih modul dari tingkat Pemula atau Lanjutan di bawah untuk membaca Cheat Sheet 1 halaman, lalu uji memori Anda dengan flashcard.'}
            </p>
          </div>

          <Link
            to="/flashcards/all"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-md transition active:scale-95 shrink-0"
          >
            <PlayCircle className="w-5 h-5 text-indigo-600" />
            {metrics.dueCount > 0 ? 'Mulai Sesi Review' : 'Mulai Latihan Kartu Baru'}
          </Link>
        </div>
      </div>

      {/* REVISI 2: Pilihan Bahasa Pembelajaran */}
      <section className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <LanguageSelector
          activeLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      </section>

      {/* REVISI 1 & 2: Katalog Modul dengan Filter Level & Kategori */}
      <div className="space-y-5">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Katalog Modul Pembelajaran
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih tingkatan belajar (Pemula $\rightarrow$ Menengah $\rightarrow$ TOEFL 600+) dan jenis materi.
              </p>
            </div>

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Modul</span>
            </Link>
          </div>

          {/* Dual Filtering Bar: Level Pills & Category Pills */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            {/* 1. Filter Tingkat Kesulitan (Level) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[90px]">
                Level Materi:
              </span>
              <LevelFilter
                activeLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
                counts={levelCounts}
              />
            </div>

            {/* 2. Filter Topik / Kategori */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-slate-200/60">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[90px]">
                Topik Materi:
              </span>
              <CategoryFilter
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 h-48 animate-pulse space-y-4">
                <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-14 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <p className="font-bold text-slate-700 text-base">
              Tidak ada modul untuk kombinasi filter ini.
            </p>
            <p className="text-xs text-slate-500">
              Coba ganti pilihan Level atau Kategori di atas untuk melihat modul lainnya.
            </p>
            <button
              onClick={() => {
                setSelectedLevel('All');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
