import React from 'react';
import { CEFR_LEVEL_LIST } from '../../utils/moduleLevel';
import { useAppStore } from '../../store/useAppStore';

export default function LevelFilter({ activeLevel = 'All', onSelectLevel, counts = {} }) {
  const { cefrLevel, user } = useAppStore();
  const userCefr = (cefrLevel || user?.cefrLevel || 'A1').toUpperCase();

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
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 sm:flex-wrap w-full">
      {allLevels.map((lvl) => {
        const isActive = activeLevel === lvl.id;
        const isUserLevel = lvl.code === userCefr;
        const count = counts[lvl.id];

        return (
          <button
            key={lvl.id}
            onClick={() => onSelectLevel(lvl.id)}
            className={`shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs'
                : isUserLevel
                ? 'bg-emerald-50/70 text-emerald-900 border border-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-100'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {lvl.dot && <span className={`w-2 h-2 rounded-full ${lvl.dot} shrink-0`} />}
            <span className="hidden sm:inline">{lvl.label}</span>
            <span className="sm:hidden">{lvl.shortLabel}</span>

            {isUserLevel && (
              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md tracking-wider uppercase ${
                isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
              }`}>
                Jalurmu
              </span>
            )}

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
