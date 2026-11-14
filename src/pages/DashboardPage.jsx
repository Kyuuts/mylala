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
  const [selectedLevel, setSelectedLevel] = useState(cefrLevel || user?.cefrLevel || 'A1'); // 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
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

  // Keep selected level aligned with user's CEFR level on initial load and updates
  useEffect(() => {
    const activeUserLevel = cefrLevel || user?.cefrLevel || 'A1';
    if (activeUserLevel && activeUserLevel !== 'A1') {
      setSelectedLevel(activeUserLevel);
    } else if (activeUserLevel && (!selectedLevel || selectedLevel === 'All')) {
      setSelectedLevel(activeUserLevel);
    }
  }, [cefrLevel, user?.cefrLevel]);

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

  // Scoped Filtering: Strictly matches selectedLevel (A1-C1) and optional Category
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const levelInfo = getModuleLevel(m);
      const matchesLevel = levelInfo.code === selectedLevel;

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
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header & Greeting Bar with Placement Test Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dashboard Belajar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
              🟢 Level Aktif: {cefrLevel || 'A1'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Halo, <strong className="text-indigo-600 font-bold">{user?.name || 'Imam'}</strong>! Kuasai bahasa secara bertahap &amp; terstruktur.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setScannerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-yellow-300" />
            <span>Scan Level (3 Menit)</span>
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Unified High-Impact Daily Action Hub (Hero: SRS Due + Liga Mingguan) */}
      {(() => {
        const tier = getTierFromXP(weeklyXp || 0);
        return (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border border-slate-800 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-2xl shrink-0">
                {tier.badge}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Liga {tier.name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-300 font-bold">{weeklyXp || 0} XP</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {metrics.dueCount > 0
                    ? `Ada ${metrics.dueCount} Flashcard Perlu Diulang Hari Ini!`
                    : `Semua Kartu Aman! Siap Belajar Materi Baru.`}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Link
                to="/flashcards/all"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-xs transition active:scale-95"
              >
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                <span>{metrics.dueCount > 0 ? 'Mulai Review' : 'Latihan Flashcard'}</span>
              </Link>

              <button
                onClick={() => setShareModalOpen(true)}
                className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition active:scale-95 cursor-pointer shrink-0"
                title="Bagikan Pencapaian"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <Link
                to="/leaderboard"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition active:scale-95 shrink-0"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Klasemen</span>
              </Link>
            </div>
          </div>
        );
      })()}

      {/* 3. Compact Metrics Overview Strip */}
      <MetricsOverview metrics={metrics} totalModules={modules.length} />

      {/* 4. LANGKAH 1: PILIH BAHASA */}
      <section className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs sm:text-sm">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
            <span>Pilih Bahasa Pembelajaran</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Bahasa aktif: <strong>Inggris (100% Siap)</strong>
          </span>
        </div>
        <LanguageSelector
          activeLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      </section>

      {/* Jika bahasa selain Inggris dipilih, tampilkan coming soon */}
      {selectedLanguage !== 'en' ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
          <span className="text-4xl">🚀</span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Kurikulum Sedang Dalam Tahap Kurasi
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Bahasa ini sedang disiapkan oleh tim kurator. Saat ini kurikulum <strong>Bahasa Inggris</strong> dari level A1 hingga C1 sudah lengkap dengan 50 modul dan siap dipelajari!
          </p>
          <button
            onClick={() => setSelectedLanguage('en')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
          >
            Kembali ke Bahasa Inggris 🇬🇧
          </button>
        </div>
      ) : (
        /* Jika Bahasa Inggris dipilih: LANGKAH 2 & 3 */
        <div className="space-y-4 sm:space-y-5">
          {/* LANGKAH 2: PILIH LEVEL CEFR */}
          <section className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs sm:text-sm">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                <span>Pilih Level CEFR Materi</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
                Pilih salah satu level di bawah untuk membuka modulnya
              </span>
            </div>

            {/* Level Selector Pills */}
            <LevelFilter
              activeLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              counts={levelCounts}
            />
          </section>

          {/* LANGKAH 3: AREA MODUL & PROGRESS LEVEL TERPILIH */}
          <section className="space-y-4">
            {/* Progress Level Card & Exit Exam */}
            <LevelProgressCard
              activeLevel={selectedLevel}
              modules={modules}
              onOpenExam={(lvl) => setActiveExamLevel(lvl)}
            />

            {/* Header Modul Level & Filter Topik */}
            <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Modul Pembelajaran Level {selectedLevel}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Menampilkan {filteredModules.length} modul belajar ringkas 1 halaman.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Buat Modul</span>
                  </Link>
                </div>
              </div>

              {/* Filter Topik Kategori */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
                  Topik:
                </span>
                <CategoryFilter
                  activeCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Grid of Modules */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 py-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 h-44 animate-pulse space-y-4">
                    <div className="h-5 w-24 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                    <div className="h-14 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredModules.length === 0 ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
                <p className="font-bold text-slate-700 text-sm">
                  Tidak ada modul untuk kategori "{selectedCategory}" di Level {selectedLevel}.
                </p>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  Tampilkan Semua Topik di Level {selectedLevel}
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
          </section>
        </div>
      )}

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
