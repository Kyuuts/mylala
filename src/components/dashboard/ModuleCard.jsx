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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Kosakata':
      case 'Vocab':
      case 'Templates':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Konjungsi':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
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
      className={`bg-white rounded-3xl border transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group relative overflow-hidden ${
        journey.isCurrentLevel
          ? 'border-emerald-300 ring-1 ring-emerald-400/30 shadow-xs'
          : journey.isNextLevel
          ? 'border-amber-200/90 hover:border-amber-300'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: Category & Level Indicator */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${getCategoryBadge(
                module.category
              )}`}
            >
              {module.category === 'Vocab' || module.category === 'Templates' ? 'Kosakata' : module.category}
            </span>

            {/* Read Completion Badge */}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Selesai</span>
              </span>
            )}
          </div>

          {/* CEFR Level Pill */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${levelInfo.badgeClass}`}
            title={`CEFR: ${levelInfo.code} - ${levelInfo.tagline}`}
          >
            <span>{levelInfo.badge}</span>
            <span>{levelInfo.code}</span>
          </span>
        </div>

        {/* Journey Advisory Badge */}
        <div className="pt-0.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${journey.badgeClass}`}
          >
            {journey.badgeText}
          </span>
        </div>

        <div>
          <h3
            onClick={handleReadTheoryClick}
            className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition leading-snug cursor-pointer"
          >
            {module.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {previewText}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
        <button
          onClick={handleReadTheoryClick}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Baca Teori</span>
        </button>

        <Link
          to={`/flashcards/${module.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold border border-slate-200 transition"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Latihan Kartu</span>
        </Link>
      </div>
    </div>
  );
}
