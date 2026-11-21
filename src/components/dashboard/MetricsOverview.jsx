import React from 'react';
import { BookOpen, Clock, Layers, CheckCircle2 } from 'lucide-react';

export default function MetricsOverview({ metrics, totalModules }) {
  const {
    learningCount = 0,
    reviewCount = 0,
    masteredCount = 0,
    dueCount = 0,
    totalCards = 0,
  } = metrics || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Active Modules */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black">Modul Aktif</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#D4F63D] border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <p className="text-2xl sm:text-4xl font-black text-black">{totalModules || 0}</p>
        <p className="text-[11px] sm:text-xs text-black/70 mt-1 font-extrabold truncate">Kurikulum CEFR Siap</p>
      </div>

      {/* 2. Due for Review Today (SRS Due) */}
      <div className="bg-[#FF85C0] p-3.5 sm:p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black">Perlu Review</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <p className="text-2xl sm:text-4xl font-black text-black">{dueCount}</p>
        <p className="text-[11px] sm:text-xs text-black mt-1 font-extrabold truncate">
          {dueCount > 0 ? `${dueCount} kartu hari ini` : 'Semua kartu aman!'}
        </p>
      </div>

      {/* 3. In Progress (Learning + Review) */}
      <div className="bg-[#70D6FF] p-3.5 sm:p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black">Proses Belajar</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <p className="text-2xl sm:text-4xl font-black text-black">{learningCount + reviewCount}</p>
        <p className="text-[11px] sm:text-xs text-black mt-1 font-extrabold truncate">
          {learningCount + reviewCount > 0
            ? `${learningCount} baru • ${reviewCount} tahap`
            : `${totalCards} kartu siap`}
        </p>
      </div>

      {/* 4. Mastered */}
      <div className="bg-[#80ED99] p-3.5 sm:p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black">Telah Dikuasai</span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_#000] text-black flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <p className="text-2xl sm:text-4xl font-black text-black">{masteredCount}</p>
        <p className="text-[11px] sm:text-xs text-black mt-1 font-extrabold truncate">
          {masteredCount > 0 ? 'Memori permanen' : '0 kartu dikuasai'}
        </p>
      </div>
    </div>
  );
}
