import React from 'react';
import { CEFR_LEVEL_LIST } from '../../utils/moduleLevel';

export default function LevelFilter({ activeLevel = 'All', onSelectLevel, counts = {} }) {
  const allLevels = [
    { id: 'All', code: 'All', badge: '🌟', label: 'Semua Level', shortLabel: 'Semua', dot: null },
    ...CEFR_LEVEL_LIST.map((lvl) => ({
      id: lvl.code,
      code: lvl.code,
      badge: lvl.badge,
      label: `${lvl.badge} ${lvl.code} ${lvl.title}`,
      shortLabel: `${lvl.badge} ${lvl.code}`,
      dot: lvl.dotClass,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {allLevels.map((lvl) => {
        const isActive = activeLevel === lvl.id;
        const count = counts[lvl.id];

        return (
          <button
            key={lvl.id}
            onClick={() => onSelectLevel(lvl.id)}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {lvl.dot && <span className={`w-2 h-2 rounded-full ${lvl.dot} shrink-0`} />}
            <span className="hidden sm:inline">{lvl.label}</span>
            <span className="sm:hidden">{lvl.shortLabel}</span>
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
