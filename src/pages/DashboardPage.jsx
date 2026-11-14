import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Sparkles, RefreshCw, AlertCircle, PlusCircle, Filter, Trophy, Flame, Share2, Compass, X, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MetricsOverview from '../components/dashboard/MetricsOverview';
import LanguageSelector from '../components/dashboard/LanguageSelector';
import LevelFilter from '../components/dashboard/LevelFilter';
import CategoryFilter from '../components/dashboard/CategoryFilter';
import ModuleCard from '../components/dashboard/ModuleCard';
import ShareCardModal from '../components/common/ShareCardModal';
import LanguageScannerModal from '../components/scanner/LanguageScannerModal';
import SoftLockModal from '../components/common/SoftLockModal';
import LevelProgressCard from '../components/dashboard/LevelProgressCard';
import LevelExitExamModal from '../components/exam/LevelExitExamModal';
import { getModuleLevel } from '../utils/moduleLevel';
import { getTierFromXP } from '../utils/rankSystem';

export default function DashboardPage() {
  const {
    fetchModules,
    getMetrics,
    user,
    weeklyXp,
    streak,
    fetchUserStatsFromSupabase,
    dashboardSelectedLevel,
    setDashboardSelectedLevel,
    cefrLevel,
  } = useAppStore();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [metrics, setMetrics] = useState({
    learningCount: 0,
    reviewCount: 0,
    masteredCount: 0,
    dueCount: 0,
    totalCards: 0,
  });

  // Filter States
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedLevel, setSelectedLevel] = useState('All'); // 'All' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' | 'Grammar' | 'Kosakata' | 'Konjungsi'
  const [scannerOpen, setScannerOpen] = useState(false);
  const [softLockModule, setSoftLockModule] = useState(null);
  const [activeExamLevel, setActiveExamLevel] = useState(null);

  // Sync selected level if store triggers a one-shot level filter redirect (e.g. from placement test or exam)
  useEffect(() => {
    if (dashboardSelectedLevel) {
      setSelectedLevel(dashboardSelectedLevel);
      if (setDashboardSelectedLevel) {
        setDashboardSelectedLevel(null);
      }
    }
  }, [dashboardSelectedLevel, setDashboardSelectedLevel]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user && fetchUserStatsFromSupabase) {
        await fetchUserStatsFromSupabase(user.id, user.username);
      }
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

  // Compute counts per difficulty level for badge numbers (CEFR A1-C1)
  const levelCounts = useMemo(() => {
    const counts = { All: modules.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 };
    modules.forEach((m) => {
      const lvl = getModuleLevel(m).code;
      if (counts[lvl] !== undefined) counts[lvl]++;
    });
    return counts;
  }, [modules]);

  // Combined Filtering: Level & Category
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const levelInfo = getModuleLevel(m);
      const matchesLevel =
        selectedLevel === 'All' ||
        levelInfo.code === selectedLevel ||
        levelInfo.id === selectedLevel;

      const normalizedCat =
        m.category === 'Vocab' || m.category === 'Templates'
          ? 'Kosakata'
          : m.category;

      const matchesCategory =
        selectedCategory === 'All' ||
        normalizedCat === selectedCategory ||
        m.category === selectedCategory;

      return matchesLevel && matchesCategory;
    });
  }, [modules, selectedLevel, selectedCategory]);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Title & Greeting */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Belajar
          </h1>
          <div className="text-xs sm:text-sm text-slate-600 mt-0.5 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span>Halo,</span>
            <span className="font-extrabold text-indigo-600">{user?.name || 'Imam'}</span>
            {user?.cefrLevel && (
              <span className="px-2 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold shadow-2xs">
                {user.cefrLevel}
              </span>
            )}
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 hidden sm:inline">Pantau retensi memori dan modul bahasa Anda.</span>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Segarkan Data</span>
        </button>
      </div>

      {/* Metrics Section */}
      <MetricsOverview metrics={metrics} totalModules={modules.length} />

      {/* Rank & Weekly League Banner Bar */}
      {(() => {
        const tier = getTierFromXP(weeklyXp || 0);
        return (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white flex items-center justify-between gap-3 sm:gap-4 border border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                {tier.badge}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-wider">Liga:</span>
                  <span className="font-extrabold text-xs sm:text-base text-white">{tier.name}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  <span className="text-amber-300 font-bold">{weeklyXp || 0} XP</span> minggu ini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-400/30 transition active:scale-95 cursor-pointer"
                title="Bagikan Pencapaian Belajar"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bagikan</span>
              </button>

              <Link
                to="/leaderboard"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-bold border border-white/20 transition active:scale-95"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Klasemen</span>
              </Link>
            </div>
          </div>
        );
      })()}

      {/* Spaced Repetition Call To Action Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <div className="space-y-1 sm:space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/20 backdrop-blur-md text-white">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{metrics.dueCount > 0 ? 'Sesi Spaced Repetition Siap' : 'Flashcard Aktif'}</span>
            </span>
            <h2 className="text-base sm:text-2xl font-bold text-white leading-snug">
              {metrics.dueCount > 0
                ? `${metrics.dueCount} Flashcard Perlu Diulang Hari Ini!`
                : `Belum Ada Review Jatuh Tempo.`}
            </h2>
            <p className="hidden sm:block text-sm text-indigo-100 leading-relaxed">
              {metrics.dueCount > 0
                ? 'Teknik active recall menguji memori Anda secara langsung. Luangkan 3–5 menit untuk menyelesaikan latihan kartu review harian.'
                : 'Pilih modul dari tingkat Pemula atau Lanjutan di bawah untuk membaca Cheat Sheet 1 halaman, lalu uji memori Anda dengan flashcard.'}
            </p>
          </div>

          <Link
            to="/flashcards/all"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 shrink-0"
          >
            <PlayCircle className="w-4 h-4 text-indigo-600" />
            <span>{metrics.dueCount > 0 ? 'Mulai Sesi Review' : 'Latihan Flashcard'}</span>
          </Link>
        </div>
      </div>

      {/* REVISI 2: Pilihan Bahasa Pembelajaran */}
      <section className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
        <LanguageSelector
          activeLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      </section>

      {/* 4. Creative Banner: Placement Test (The Language Scanner) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-6 shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
          <div className="space-y-1 sm:space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-white/20 backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-yellow-300" />
              <span>Tes Penempatan Level CEFR</span>
            </span>
            <h3 className="text-sm sm:text-xl font-extrabold text-white leading-snug">
              Bingung Mulai dari Level Mana? Scan Posisi CEFR-mu!
            </h3>
            <p className="hidden sm:block text-xs sm:text-sm text-teal-100 leading-relaxed">
              Jawab pertanyaan diagnostik cepat untuk mendeteksi apakah kemampuanmu di tingkat <strong>A1 Explorer, A2 Voyager, B1 Citizen, B2 Diplomat</strong>, atau <strong>C1 Mastermind</strong>.
            </p>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Scan Level (3 Menit) 🚀</span>
          </button>
        </div>
      </div>

      {/* REVISI 1 & 2: Katalog Modul dengan Filter Level & Kategori */}
      <div className="space-y-3 sm:space-y-5">
        <div className="space-y-2.5 sm:space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Katalog Modul Pembelajaran
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                Pilih tingkatan belajar (Pemula → Menengah → Lanjutan) dan jenis materi.
              </p>
            </div>

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-95 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>+ Buat Modul</span>
            </Link>
          </div>

          {/* Dual Filtering Bar: Level Pills & Category Pills */}
          <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 sm:space-y-3">
            {/* 1. Filter Tingkat Kesulitan (Level) */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[90px]">
                Level Materi:
              </span>
              <LevelFilter
                activeLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
                counts={levelCounts}
              />
            </div>

            {/* 2. Filter Topik / Kategori */}
            <div className="flex items-center gap-2 pt-1.5 sm:pt-2 border-t border-slate-200/60">
              <span className="hidden sm:inline text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[90px]">
                Topik Materi:
              </span>
              <CategoryFilter
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
        </div>

        {/* Level Journey Progress & Exit Exam Trigger */}
        <LevelProgressCard
          activeLevel={selectedLevel === 'All' ? (cefrLevel || user?.cefrLevel || 'A1') : selectedLevel}
          modules={modules}
          onOpenExam={(lvl) => setActiveExamLevel(lvl)}
        />

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 h-48 animate-pulse space-y-4">
                <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-14 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500 space-y-3">
            <p className="font-bold text-slate-700 text-sm sm:text-base">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredModules.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                onOpenSoftLock={(m) => setSoftLockModule(m)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Social Viral Share Card Modal */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* The Language Scanner Diagnostic Modal (Adaptive 8-Question Engine) */}
      <LanguageScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onSelectLevel={(lvl) => setSelectedLevel(lvl)}
      />

      {/* Friendly Soft Lock Advisory Modal */}
      <SoftLockModal
        isOpen={!!softLockModule}
        onClose={() => setSoftLockModule(null)}
        targetModule={softLockModule}
        userCefrLevel={cefrLevel || user?.cefrLevel || 'A1'}
        onContinue={() => {
          if (softLockModule) {
            navigate(`/module/${softLockModule.id}`);
          }
        }}
        onSwitchToCurrentLevel={(userLvl) => {
          setSelectedLevel(userLvl);
        }}
      />

      {/* Level Exit Exam Modal (Comprehensive 15-Question Assessment) */}
      <LevelExitExamModal
        isOpen={!!activeExamLevel}
        onClose={() => setActiveExamLevel(null)}
        levelCode={activeExamLevel || 'A1'}
        onGraduate={(nextLvl) => {
          setSelectedLevel(nextLvl);
        }}
      />
    </div>
  );
}
