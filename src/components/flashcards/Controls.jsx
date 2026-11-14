import React from 'react';
import { AlertCircle, ThumbsUp, Sparkles, RotateCw } from 'lucide-react';

export default function Controls({ onRate, disabled, isFlipped, onFlip }) {
  if (!isFlipped) {
    return (
      <div className="w-full max-w-lg mx-auto py-1">
        <button
          type="button"
          onClick={onFlip}
          disabled={disabled}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2.5"
        >
          <RotateCw className="w-4 h-4" />
          <span>Balik Kartu (Lihat Jawaban)</span>
          <span className="hidden sm:inline text-xs bg-indigo-500/60 px-2 py-0.5 rounded-lg font-mono">Spasi</span>
        </button>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          Ingat jawaban di pikiranmu terlebih dahulu sebelum melihat sisi belakang kartu.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-3 animate-fade-in">
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Tingkat Kemudahan Mengingat:</span>
        <span className="hidden sm:inline text-slate-400">Shortcuts: [1] [2] [3]</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* HARD BUTTON */}
        <button
          onClick={() => onRate('Hard')}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-200 hover:border-rose-300 font-bold transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base mb-1">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Hard</span>
          </div>
          <span className="text-[11px] text-rose-500 font-normal">Review Segera</span>
          <span className="hidden sm:inline text-[10px] text-slate-400 mt-1 font-mono">[1]</span>
        </button>

        {/* GOOD BUTTON */}
        <button
          onClick={() => onRate('Good')}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-800 border-2 border-amber-200 hover:border-amber-300 font-bold transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base mb-1">
            <ThumbsUp className="w-4 h-4 text-amber-600" />
            <span>Good</span>
          </div>
          <span className="text-[11px] text-amber-600 font-normal">+1 sd 3 Hari</span>
          <span className="hidden sm:inline text-[10px] text-slate-400 mt-1 font-mono">[2]</span>
        </button>

        {/* EASY BUTTON */}
        <button
          onClick={() => onRate('Easy')}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-200 hover:border-emerald-300 font-bold transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Easy</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-normal">+7 Hari (Master)</span>
          <span className="hidden sm:inline text-[10px] text-slate-400 mt-1 font-mono">[3]</span>
        </button>
      </div>
    </div>
  );
}

