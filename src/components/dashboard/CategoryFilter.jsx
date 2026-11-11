import React from 'react';

const CATEGORIES = [
  { id: 'All', label: 'Semua Modul' },
  { id: 'Grammar', label: 'Grammar' },
  { id: 'Vocab', label: 'Vocab' },
  { id: 'Templates', label: 'Templates' },
];

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

