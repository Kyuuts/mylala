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
            className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="sm:hidden">{cat.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
