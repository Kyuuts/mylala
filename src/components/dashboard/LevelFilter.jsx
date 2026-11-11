import React from 'react';

const LEVELS = [
  { id: 'All', label: 'Semua Level', dot: null },
  { id: 'Starter', label: 'Starter (Pemula)', dot: 'bg-emerald-500' },
  { id: 'Intermediate', label: 'Intermediate (Menengah)', dot: 'bg-amber-500' },
  { id: 'Advanced', label: 'Advanced (TOEFL 600+)', dot: 'bg-purple-500' },
];

export default function LevelFilter({ activeLevel = 'All', onSelectLevel, counts = {} }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {LEVELS.map((lvl) => {
        const isActive = activeLevel === lvl.id;
        const count = counts[lvl.id];

        return (
          <button
            key={lvl.id}
            onClick={() => onSelectLevel(lvl.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {lvl.dot && <span className={`w-2 h-2 rounded-full ${lvl.dot}`} />}
            <span>{lvl.label}</span>
            {typeof count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

