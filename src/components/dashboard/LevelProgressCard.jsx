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
    <div className="bg-white text-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-black shadow-[5px_5px_0px_#000] space-y-4">
      {/* Header Level Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#80ED99] border-2 border-black text-black text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
              {activeLevel === userCefr ? '🟢 Jalur Aktifmu' : `Level ${activeLevel}`}
            </span>
            {isExamPassed && (
              <span className="px-2.5 py-0.5 rounded-lg bg-[#FFD166] border-2 border-black text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                <Trophy className="w-3 h-3 stroke-[2.5]" />
                <span>Lulus Ujian</span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-black flex items-center gap-2">
            <span>{levelInfo.badge}</span>
            <span>{levelInfo.code} • {levelInfo.title}</span>
            <span className="text-xs sm:text-sm font-extrabold text-black/60">
              ({levelInfo.role})
            </span>
          </h3>
          <p className="text-xs text-black/70 font-semibold hidden sm:block">
            {levelInfo.tagline}
          </p>
        </div>

        {/* Milestone Indicator Pill */}
        <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0 bg-[#D4F63D] px-3.5 py-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000]">
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-black block">
              Materi Dibaca
            </span>
            <p className="text-sm sm:text-base font-black text-black">
              {completedCount} / {totalModules} Selesai
            </p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center font-black text-xs text-black shadow-[1px_1px_0px_#000]">
            {percent}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border-2 border-black">
          <div
            className={`h-full rounded-full transition-all duration-500 border border-black ${
              isEligible ? 'bg-[#80ED99]' : 'bg-[#B388FF]'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold text-black/70">
          <span className="hidden sm:inline">Syarat Ujian: Tandai semua {totalModules} materi di level ini selesai dibaca.</span>
          <span className="sm:hidden">Syarat: Baca semua modul ({totalModules})</span>
          <span className="font-black text-black">{completedCount} dari {totalModules} Modul</span>
        </div>
      </div>

      {/* Action Exam Bar */}
      <div className="pt-3 border-t-2 border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-black font-extrabold">
          {isExamPassed ? (
            <p className="flex items-center gap-1.5 text-black">
              <CheckCircle2 className="w-4 h-4 text-[#80ED99] fill-black stroke-[2.5] shrink-0" />
              <span>Lulus ujian level ini (+150 XP)!</span>
            </p>
          ) : isEligible ? (
            <p className="flex items-center gap-1.5 text-black">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
              <span>Semua modul selesai! Ujian kelulusan level {activeLevel} terbuka.</span>
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-black/60">
              <Lock className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Selesaikan {totalModules - completedCount} modul lagi untuk ujian.</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div>
          {isEligible ? (
            <button
              onClick={() => onOpenExam(activeLevel)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF85C0] hover:bg-[#ff70a6] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition cursor-pointer"
            >
              <Award className="w-4 h-4 stroke-[2.5]" />
              <span>{isExamPassed ? `Ulangi Ujian ${activeLevel}` : `⚔️ Ambil Ujian Kelulusan (${activeLevel})`}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border-2 border-black/30 text-black/40 font-black text-xs cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Ujian Terkunci ({completedCount}/{totalModules})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
