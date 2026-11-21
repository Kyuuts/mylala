import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { getModuleLevel, getModuleJourneyStatus } from '../../utils/moduleLevel';
import { useAppStore } from '../../store/useAppStore';

export default function ModuleCard({ module, onOpenSoftLock }) {
  const navigate = useNavigate();
  const { completedModules, cefrLevel, user } = useAppStore();
  const userCefr = cefrLevel || user?.cefrLevel || 'A1';

  const levelInfo = getModuleLevel(module);
  const journey = getModuleJourneyStatus(levelInfo.code, userCefr);
  const isCompleted = completedModules?.includes(module.id);

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Grammar':
        return 'bg-[#70D6FF] text-black border-2 border-black shadow-[1px_1px_0px_#000]';
      case 'Kosakata':
      case 'Vocab':
      case 'Templates':
        return 'bg-[#B388FF] text-black border-2 border-black shadow-[1px_1px_0px_#000]';
      case 'Konjungsi':
        return 'bg-[#FFD166] text-black border-2 border-black shadow-[1px_1px_0px_#000]';
      default:
        return 'bg-white text-black border-2 border-black shadow-[1px_1px_0px_#000]';
    }
  };

  const getCategoryIconColor = (category) => {
    switch (category) {
      case 'Grammar':
        return 'bg-[#70D6FF]';
      case 'Kosakata':
      case 'Vocab':
      case 'Templates':
        return 'bg-[#FF85C0]';
      case 'Konjungsi':
        return 'bg-[#FFD166]';
      default:
        return 'bg-[#D4F63D]';
    }
  };

  // Extract a brief text summary from markdown
  const previewText = module.content_markdown
    ? module.content_markdown
        .replace(/^#+.*$/gm, '')
        .replace(/[*_`$]/g, '')
        .trim()
        .slice(0, 135) + '...'
    : 'Materi ringkas cheat sheet 1 halaman.';

  const handleReadTheoryClick = (e) => {
    if (journey.softLock && onOpenSoftLock) {
      e.preventDefault();
      onOpenSoftLock(module);
    } else {
      navigate(`/module/${module.id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl sm:rounded-3xl border-2 border-black shadow-[4px_4px_0px_#000] p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden hover:translate-x-0.5 hover:translate-y-0.5 transition"
    >
      <div className="space-y-2 sm:space-y-3">
        {/* Top Header: Category & Level Indicator */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${getCategoryBadge(
                module.category
              )}`}
            >
              {module.category === 'Vocab' || module.category === 'Templates' ? 'Kosakata' : module.category}
            </span>

            {/* Read Completion Badge */}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black bg-[#80ED99] text-black border-2 border-black shadow-[1px_1px_0px_#000]">
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                <span>Selesai</span>
              </span>
            )}
          </div>

          {/* CEFR Level Pill */}
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black border-2 border-black bg-white text-black shadow-[1px_1px_0px_#000]"
            title={`CEFR: ${levelInfo.code} - ${levelInfo.tagline}`}
          >
            <span>{levelInfo.badge}</span>
            <span>{levelInfo.code}</span>
          </span>
        </div>

        {/* Title & Preview with Neo-Brutalist Icon Box */}
        <div className="flex items-start gap-3 pt-1">
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${getCategoryIconColor(module.category)} border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0`}>
            <BookOpen className="w-5 h-5 text-black stroke-[2.5]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              onClick={handleReadTheoryClick}
              className="font-black text-black text-sm sm:text-base group-hover:underline transition leading-snug cursor-pointer line-clamp-2"
            >
              {module.title}
            </h3>
            <p className="text-xs text-black/70 mt-1 line-clamp-2 leading-relaxed font-medium">
              {previewText}
            </p>
          </div>
        </div>

        {/* Neo Progress Line */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full border-2 border-black overflow-hidden mt-1">
          <div
            className={`h-full ${isCompleted ? 'bg-[#80ED99] w-full' : 'bg-[#B388FF] w-1/3'}`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 sm:pt-4 mt-3 border-t-2 border-black/10 gap-2">
        <button
          onClick={handleReadTheoryClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-[#D4F63D] text-black text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Baca Teori</span>
        </button>

        <Link
          to={`/flashcards/${module.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-[#FF85C0] hover:bg-[#ff70a6] text-black text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition"
        >
          <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Flashcard</span>
        </Link>
      </div>
    </div>
  );
}
