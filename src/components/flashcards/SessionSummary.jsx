import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, RotateCcw, LayoutDashboard, CheckCircle } from 'lucide-react';

export default function SessionSummary({ stats, totalCards, onRestart }) {
  const { hard = 0, good = 0, easy = 0 } = stats;

  return (
    <div className="bg-white rounded-3xl p-8 max-w-md mx-auto text-center border border-slate-200 shadow-lg space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
        <Trophy className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900">Sesi Latihan Selesai!</h2>
        <p className="text-sm text-slate-600">
          Hebat! Anda telah menyelesaikan <strong>{totalCards}</strong> kartu flashcard aktif.
        </p>
      </div>

      {/* Outcome Breakdown */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="text-center">
          <span className="text-xs text-rose-600 font-semibold uppercase">Hard</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{hard}</p>
        </div>
        <div className="text-center border-x border-slate-200">
          <span className="text-xs text-amber-600 font-semibold uppercase">Good</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{good}</p>
        </div>
        <div className="text-center">
          <span className="text-xs text-emerald-600 font-semibold uppercase">Easy</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{easy}</p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" /> Ulangi Sesi Ini
        </button>

        <Link
          to="/dashboard"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm transition"
        >
          <LayoutDashboard className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}

