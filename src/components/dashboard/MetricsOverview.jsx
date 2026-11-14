import React from 'react';
import { BookOpen, Clock, Layers, CheckCircle2 } from 'lucide-react';

export default function MetricsOverview({ metrics, totalModules }) {
  const {
    learningCount = 0,
    reviewCount = 0,
    masteredCount = 0,
    dueCount = 0,
    newCardsCount = 0,
    totalCards = 0,
  } = metrics || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Active Modules */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center justify-between text-slate-500 mb-1 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Modul Aktif</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-3xl font-extrabold text-slate-900">{totalModules || 0}</p>
        <p className="hidden sm:block text-xs text-slate-500 mt-1">3 Kategori Pembelajaran</p>
      </div>

      {/* 2. Due for Review Today (SRS Due) */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center justify-between text-amber-700 mb-1 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Perlu Review</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-3xl font-extrabold text-amber-600">{dueCount}</p>
        <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5 sm:mt-1 font-medium truncate">
          {dueCount > 0 ? `${dueCount} kartu hari ini` : 'Semua aman'}
        </p>
      </div>

      {/* 3. In Progress (Learning + Review) */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center justify-between text-slate-500 mb-1 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Proses Belajar</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-3xl font-extrabold text-blue-600">{learningCount + reviewCount}</p>
        <p className="hidden sm:block text-xs text-slate-500 mt-1">
          {learningCount + reviewCount > 0
            ? `${learningCount} baru • ${reviewCount} bertahap`
            : `${totalCards} kartu siap dimulai`}
        </p>
      </div>

      {/* 4. Mastered */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm transition">
        <div className="flex items-center justify-between text-slate-500 mb-1 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Telah Dikuasai</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-3xl font-extrabold text-emerald-600">{masteredCount}</p>
        <p className="hidden sm:block text-xs text-emerald-600 mt-1 font-medium">
          {masteredCount > 0 ? 'Memori jangka panjang' : '0 kartu dikuasai'}
        </p>
      </div>
    </div>
  );
}
