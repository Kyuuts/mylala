import React from 'react';
import { Trophy, CheckCircle2, Lock, Sparkles, Award, ArrowRight, BookOpen } from 'lucide-react';
import { CEFR_LEVELS, getModuleLevel } from '../../utils/moduleLevel';
import { useAppStore } from '../../store/useAppStore';

export default function LevelProgressCard({
  activeLevel = 'A1',
  modules = [],
  onOpenExam,
}) {
  const { completedModules, passedExams, cefrLevel, user } = useAppStore();
  const userCefr = (cefrLevel || user?.cefrLevel || 'A1').toUpperCase();

  // Filter modules belonging to activeLevel using accurate CEFR detector
  const levelModules = modules.filter((m) => {
    return getModuleLevel(m).code === activeLevel;
  });

  const totalModules = levelModules.length;
  if (totalModules === 0) return null;

  const completedCount = levelModules.filter((m) =>
    (completedModules || []).includes(m.id)
  ).length;

  const percent = Math.min(100, Math.round((completedCount / totalModules) * 100));
  const isEligible = completedCount >= totalModules;
  const isExamPassed = (passedExams || []).includes(activeLevel);

  const levelInfo = CEFR_LEVELS[activeLevel] || {
    code: activeLevel,
    title: activeLevel,
    role: 'Pencari Ilmu',
    badge: '🌱',
    tagline: 'Kurikulum CEFR Resmi',
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-indigo-500/20 relative overflow-hidden space-y-5">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header Level Info */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
              {activeLevel === userCefr ? '🟢 Jalur Aktifmu' : `Level ${activeLevel}`}
            </span>
            {isExamPassed && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-300" />
                <span>Lulus Ujian</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{levelInfo.badge}</span>
            <span>{levelInfo.code} • {levelInfo.title}</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-400">
              ({levelInfo.role})
            </span>
          </h3>
          <p className="text-xs text-slate-300">
            {levelInfo.tagline}
          </p>
        </div>

        {/* Milestone Indicator Pill */}
        <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Materi Dibaca
            </span>
            <p className="text-base font-extrabold text-white">
              <span className="text-emerald-400">{completedCount}</span> / {totalModules} Selesai
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/60 border border-indigo-400/40 flex items-center justify-center font-extrabold text-xs text-white">
            {percent}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 space-y-1.5">
        <div className="w-full bg-white/15 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isEligible
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 shadow-sm'
                : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Syarat Ujian: Tandai semua {totalModules} materi di level ini selesai dibaca.</span>
          <span className="font-bold text-slate-300">{completedCount} dari {totalModules} Modul</span>
        </div>
      </div>

      {/* Action Exam Bar */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          {isExamPassed ? (
            <p className="flex items-center gap-1.5 text-amber-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kamu sudah lulus ujian level ini dan mengantongi +150 XP!</span>
            </p>
          ) : isEligible ? (
            <p className="flex items-center gap-1.5 text-emerald-300 font-bold animate-pulse">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Semua modul selesai dibaca! Gerbang Ujian Kelulusan Level {activeLevel} terbuka.</span>
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Selesaikan {totalModules - completedCount} modul lagi untuk membuka Ujian Kelulusan.</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isEligible ? (
            <button
              onClick={() => onOpenExam(activeLevel)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4 text-yellow-200" />
              <span>{isExamPassed ? `Ulangi Ujian ${activeLevel}` : `⚔️ Ambil Ujian Kelulusan ${activeLevel} (+150 XP)`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-slate-400 font-bold text-xs cursor-not-allowed opacity-60"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Ujian Terkunci ({completedCount}/{totalModules})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
