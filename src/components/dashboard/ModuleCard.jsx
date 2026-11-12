import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers } from 'lucide-react';
import { getModuleLevel } from '../../utils/moduleLevel';

export default function ModuleCard({ module }) {
  const levelInfo = getModuleLevel(module);

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

  // Extract a brief text summary from markdown (strip # and headers)
  const previewText = module.content_markdown
    ? module.content_markdown
        .replace(/^#+.*$/gm, '')
        .replace(/[*_`$]/g, '')
        .trim()
        .slice(0, 135) + '...'
    : 'Materi ringkas cheat sheet 1 halaman.';

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group ${levelInfo.borderCard}`}>
      <div className="space-y-3">
        {/* Top Header: Category on Left, CEFR Level on Right */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${getCategoryBadge(
              module.category
            )}`}
          >
            {module.category === 'Vocab' || module.category === 'Templates' ? 'Kosakata' : module.category}
          </span>

          {/* Level Indicator (Right Side) */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${levelInfo.badgeClass}`}
            title={`CEFR: ${levelInfo.code} - ${levelInfo.tagline}`}
          >
            <span>{levelInfo.badge}</span>
            <span>{levelInfo.code} • {levelInfo.role}</span>
          </span>
        </div>

        <div>
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition leading-snug">
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Baca Teori</span>
        </Link>

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
