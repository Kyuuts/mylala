import React from 'react';
import { CEFR_LEVEL_LIST } from '../../utils/moduleLevel';
import { useAppStore } from '../../store/useAppStore';

export default function LevelFilter({ activeLevel = 'All', onSelectLevel, counts = {} }) {
  const { cefrLevel, user } = useAppStore();
  const userCefr = (cefrLevel || user?.cefrLevel || 'A1').toUpperCase();

  const allLevels = CEFR_LEVEL_LIST.map((lvl) => ({
    id: lvl.code,
    code: lvl.code,
    badge: lvl.badge,
    label: `${lvl.badge} ${lvl.code} • ${lvl.title}`,
    shortLabel: `${lvl.badge} ${lvl.code}`,
    dot: lvl.dotClass,
  }));

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
            className={`shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 border-black cursor-pointer ${
              isActive
                ? 'bg-[#D4F63D] text-black shadow-[2px_2px_0px_#000]'
                : isUserLevel
                ? 'bg-[#80ED99] text-black shadow-[2px_2px_0px_#000] hover:bg-[#6ee7b7]'
                : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100'
            } active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]`}
          >
            {lvl.dot && <span className={`w-2 h-2 rounded-full ${lvl.dot} border border-black shrink-0`} />}
            <span className="hidden sm:inline">{lvl.label}</span>
            <span className="sm:hidden">{lvl.shortLabel}</span>

            {isUserLevel && (
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md tracking-wider uppercase bg-black text-white">
                Jalurmu
              </span>
            )}

            {typeof count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-black border border-black ${
                  isActive ? 'bg-black text-white' : 'bg-white text-black'
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
