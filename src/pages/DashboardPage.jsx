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
    checkWeeklyReset,
  } = useAppStore();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (checkWeeklyReset) checkWeeklyReset();
  }, [checkWeeklyReset]);
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

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header & Greeting Bar (Styled like the top row in the Neo-Brutalism photo) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar / Initial Box */}
          <div className="w-12 h-12 rounded-2xl bg-[#FF85C0] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-black text-xl text-black shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || user.username || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{(user?.name || user?.username || 'K').charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div>
            <span className="block text-xs font-black uppercase tracking-wider text-black/70">
              {todayFormatted}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase">
              HALO, {user?.name || user?.username || 'KIA'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="w-11 h-11 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center text-black cursor-pointer transition"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-5 h-5 stroke-[2.5] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Primary Hero Card (Lavender/Lilac Neo-Brutalism card like in photo) */}
      <div className="bg-[#B388FF] rounded-3xl border-2 border-black shadow-[5px_5px_0px_#000] p-5 sm:p-7 text-black space-y-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-black block">
            KARTU PERLU DIREVIEW HARI INI
          </span>
          <div className="flex items-baseline gap-2.5 mt-1 flex-wrap">
            <span className="text-4xl sm:text-6xl font-black text-black tracking-tight">
              {metrics.dueCount}
            </span>
            <span className="text-xl sm:text-2xl font-black text-black uppercase">
              KARTU
            </span>
            <span className={`text-xs font-black px-2.5 py-1 rounded-md border-2 border-black shadow-[1px_1px_0px_#000] uppercase ${
              metrics.dueCount > 0 ? 'bg-black text-white' : 'bg-[#80ED99] text-black'
            }`}>
              {metrics.dueCount > 0 ? `${metrics.dueCount} Kartu Jatuh Tempo SRS` : 'Semua Kartu Aman'}
            </span>
          </div>
        </div>

        {/* Progress Bar with Labels */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-black text-black">
            <span>
              {metrics.dueCount > 0
                ? `${metrics.dueCount} kartu SRS dijadwalkan ulang hari ini`
                : 'Target review hari ini telah tercapai'}
            </span>
            <span className="uppercase">Level {selectedLevel}</span>
          </div>
          <div className="w-full bg-white/50 h-4 rounded-full border-2 border-black p-0.5 overflow-hidden">
            <div
              className="bg-black h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(15, Math.round(((metrics.masteredCount || 1) / (metrics.totalCards || 20)) * 100)))}%`,
              }}
            />
          </div>
        </div>

        {/* Action Button & Sub-stats */}
        <div className="pt-2 border-t-2 border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-black">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-black/70">Total Modul: </span>
              <span>{modules.length} Materi</span>
            </div>
            <div>
              <span className="text-black/70">Liga XP: </span>
              <span>{weeklyXp || 0} XP</span>
            </div>
          </div>

          <Link
            to={metrics.dueCount > 0 ? '/flashcards/due' : '/flashcards/all'}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm font-black border-2 border-black shadow-[2px_2px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0 transition"
          >
            <PlayCircle className="w-4 h-4 stroke-[2.5]" />
            <span>
              {metrics.dueCount > 0
                ? `Mulai Review (${metrics.dueCount} Kartu)`
                : 'Latihan Bebas (Semua Modul)'}
            </span>
          </Link>
        </div>
      </div>

      {/* 3. The 4 Iconic Neo-Brutalism Action Buttons Row (From the screenshot) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        {/* Button 1: Pink (+ / Flashcard Review) */}
        <Link
          to={metrics.dueCount > 0 ? '/flashcards/due' : '/flashcards/all'}
          className="bg-[#FF85C0] border-2 border-black shadow-[3px_3px_0px_#000] rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition group text-black"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-tight text-center">
            {metrics.dueCount > 0 ? `Review (${metrics.dueCount})` : 'Flashcard'}
          </span>
        </Link>

        {/* Button 2: White (Scan Level) */}
        <button
          onClick={() => setScannerOpen(true)}
          className="bg-white border-2 border-black shadow-[3px_3px_0px_#000] rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition group text-black cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#D4F63D] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-tight text-center">
            Scan Level
          </span>
        </button>

        {/* Button 3: Sky Blue (Latihan / Practice) */}
        <Link
          to="/practice"
          className="bg-[#70D6FF] border-2 border-black shadow-[3px_3px_0px_#000] rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition group text-black"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-tight text-center">
            Latihan
          </span>
        </Link>

        {/* Button 4: Sun Yellow (Liga / Leaderboard) */}
        <Link
          to="/leaderboard"
          className="bg-[#FFD166] border-2 border-black shadow-[3px_3px_0px_#000] rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center gap-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition group text-black"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-tight text-center">
            Liga
          </span>
        </Link>
      </div>

      {/* 4. Compact Metrics Overview Strip */}
      <MetricsOverview metrics={metrics} totalModules={modules.length} />

      {/* 5. LANGKAH 1: PILIH BAHASA */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-black font-black text-xs sm:text-sm uppercase tracking-wide">
            <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black">1</span>
            <span>PILIH BAHASA PEMBELAJARAN</span>
          </div>
          <span className="text-[10px] font-black uppercase text-black bg-[#D4F63D] px-2 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000]">
            Inggris Siap
          </span>
        </div>
        <LanguageSelector
          activeLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      </section>

      {/* Jika bahasa selain Inggris dipilih, tampilkan coming soon */}
      {selectedLanguage !== 'en' ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] p-8 text-center space-y-3">
          <span className="text-4xl">🚀</span>
          <h3 className="text-base sm:text-lg font-black text-black uppercase">
            Kurikulum Sedang Dalam Tahap Kurasi
          </h3>
          <p className="text-xs sm:text-sm text-black/70 max-w-md mx-auto font-medium">
            Saat ini kurikulum <strong>Bahasa Inggris</strong> dari level A1 hingga C1 sudah lengkap dan siap dipelajari!
          </p>
          <button
            onClick={() => setSelectedLanguage('en')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-black font-black text-xs sm:text-sm cursor-pointer"
          >
            Kembali ke Bahasa Inggris 🇬🇧
          </button>
        </div>
      ) : (
        /* Jika Bahasa Inggris dipilih: LANGKAH 2 & 3 */
        <div className="space-y-4 sm:space-y-5">
          {/* LANGKAH 2: PILIH LEVEL CEFR */}
          <section className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-black font-black text-xs sm:text-sm uppercase tracking-wide">
                <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black">2</span>
                <span>PILIH LEVEL CEFR</span>
              </div>
              <span className="text-[10px] font-black text-black/60 hidden sm:inline uppercase">
                Filter Level Kurikulum
              </span>
            </div>

            {/* Level Selector Pills */}
            <LevelFilter
              activeLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              counts={levelCounts}
            />
          </section>

          {/* LANGKAH 3: KANTONG MODUL & PROGRESS LEVEL TERPILIH */}
          <section className="space-y-4">
            {/* Progress Level Card & Exit Exam */}
            <LevelProgressCard
              activeLevel={selectedLevel}
              modules={modules}
              onOpenExam={(lvl) => setActiveExamLevel(lvl)}
            />

            {/* Header Modul Level & Filter Topik (Matches "KANTONG" from screenshot) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-black uppercase tracking-tight">
                    KANTONG MATERI • LEVEL {selectedLevel}
                  </h3>
                  <p className="text-xs text-black/70 font-semibold">
                    {filteredModules.length} modul ringkas siap dipelajari
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-[#FFD166] hover:bg-[#facc15] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] text-black text-xs font-black transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>+ Modul</span>
                  </Link>
                </div>
              </div>

              {/* Filter Topik Kategori */}
              <div className="pt-2 border-t-2 border-black/10 flex items-center gap-2">
                <span className="text-[11px] font-black text-black/60 uppercase tracking-wider shrink-0 hidden sm:inline">
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
