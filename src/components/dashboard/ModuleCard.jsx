import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers } from 'lucide-react';
import { getModuleLevel } from '../../utils/moduleLevel';

export default function ModuleCard({ module }) {
  const levelInfo = getModuleLevel(module);

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Grammar':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vocab':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Templates':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Extract a brief text summary from markdown (strip # and headers)
  const previewText = module.content_markdown
    ? module.content_markdown
        .replace(/^#+.*$/gm, '')
        .replace(/[*_`$]/g, '')
        .trim()
        .slice(0, 135) + '...'
    : 'Materi ringkas cheat sheet 1 halaman.';

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group ${levelInfo.borderCard}`}>
      <div className="space-y-3">
        {/* Top Header: Category on Left, Level on Right */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getCategoryBadge(
              module.category
            )}`}
          >
            {module.category}
          </span>

          {/* Level Indicator (Right Side) */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${levelInfo.badgeClass}`}
            title={`Tingkat kesulitan: ${levelInfo.display}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${levelInfo.dotClass} animate-pulse`} />
            {levelInfo.display}
          </span>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition leading-snug">
            {module.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {previewText}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
        <Link
          to={`/module/${module.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Buka Cheat Sheet</span>
        </Link>

        <Link
          to={`/flashcards/${module.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold border border-slate-200 transition"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Latihan Kartu</span>
        </Link>
      </div>
    </div>
  );
}
