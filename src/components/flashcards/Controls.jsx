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
          className="w-full py-4 px-6 rounded-2xl bg-[#FF85C0] hover:bg-[#ff70a6] text-black font-black text-sm sm:text-base border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer flex items-center justify-center gap-2.5 transition"
        >
          <RotateCw className="w-4 h-4 stroke-[2.5]" />
          <span>Balik Kartu (Lihat Jawaban)</span>
          <span className="hidden sm:inline text-xs bg-white text-black px-2 py-0.5 rounded-lg border border-black font-mono font-bold">Spasi</span>
        </button>
        <p className="text-xs font-bold text-black/60 text-center mt-2">
          Ingat jawaban di pikiranmu terlebih dahulu sebelum melihat sisi belakang kartu.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-3 animate-fade-in">
      <div className="flex items-center justify-between text-xs font-black text-black px-1">
        <span>Tingkat Kemudahan Mengingat:</span>
        <span className="hidden sm:inline text-black/60 font-bold">Shortcuts: [1] [2] [3]</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* HARD BUTTON */}
        <button
          onClick={() => onRate('Hard')}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FF85A1] hover:bg-[#ff6e8f] text-black border-2 border-black font-black transition shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base mb-1">
            <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Hard</span>
          </div>
          <span className="text-[11px] font-bold">Review Segera</span>
          <span className="hidden sm:inline text-[10px] text-black/60 mt-1 font-mono font-bold">[1]</span>
        </button>

        {/* GOOD BUTTON */}
        <button
          onClick={() => onRate('Good')}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FFD166] hover:bg-[#ffc947] text-black border-2 border-black font-black transition shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base mb-1">
            <ThumbsUp className="w-4 h-4 stroke-[2.5]" />
            <span>Good</span>
          </div>
          <span className="text-[11px] font-bold">+1 sd 3 Hari</span>
          <span className="hidden sm:inline text-[10px] text-black/60 mt-1 font-mono font-bold">[2]</span>
        </button>

        {/* EASY BUTTON */}
        <button
          onClick={() => onRate('Easy')}
          disabled={disabled}
          className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#80ED99] hover:bg-[#6ee7b7] text-black border-2 border-black font-black transition shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base mb-1">
            <Sparkles className="w-4 h-4 fill-black text-black stroke-[2.5]" />
            <span>Easy</span>
          </div>
          <span className="text-[11px] font-bold">+7 Hari (Master)</span>
          <span className="hidden sm:inline text-[10px] text-black/60 mt-1 font-mono font-bold">[3]</span>
        </button>
      </div>
    </div>
  );
}

