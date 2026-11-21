import React from 'react';

const CATEGORIES = [
  { id: 'All', label: '🌟 Semua Materi', shortLabel: 'Semua' },
  { id: 'Grammar', label: '📐 Grammar (Tata Bahasa)', shortLabel: 'Grammar' },
  { id: 'Kosakata', label: '📚 Kosakata & Frasa', shortLabel: 'Kosakata' },
  { id: 'Konjungsi', label: '🌉 Konjungsi & Konektor', shortLabel: 'Konjungsi' },
];

export default function CategoryFilter({ activeCategory = 'All', onSelectCategory }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 sm:flex-wrap w-full">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 border-black cursor-pointer ${
              isActive
                ? 'bg-[#FF85C0] text-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]'
            } active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]`}
          >
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="sm:hidden">{cat.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
