import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, RotateCcw, LayoutDashboard, Share2, Sparkles } from 'lucide-react';
import ShareCardModal from '../common/ShareCardModal';

export default function SessionSummary({ stats, totalCards, onRestart }) {
  const { hard = 0, good = 0, easy = 0 } = stats;
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md mx-auto text-center border-3 border-black shadow-[8px_8px_0px_#000] space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-[#FFD166] text-black border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">Sesi Latihan Selesai! 🎉</h2>
          <p className="text-xs sm:text-sm text-black/70 font-bold">
            Hebat! Kamu telah menuntaskan <strong>{totalCards}</strong> kartu flashcard aktif.
          </p>
        </div>

        {/* Outcome Breakdown */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-[#F8FAFC] border-2 border-black shadow-[2px_2px_0px_#000]">
          <div className="text-center p-2 rounded-xl bg-white border border-black">
            <span className="text-[10px] text-rose-600 font-black uppercase">Hard</span>
            <p className="text-xl font-black text-black mt-0.5">{hard}</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white border border-black">
            <span className="text-[10px] text-amber-600 font-black uppercase">Good</span>
            <p className="text-xl font-black text-black mt-0.5">{good}</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white border border-black">
            <span className="text-[10px] text-emerald-600 font-black uppercase">Easy</span>
            <p className="text-xl font-black text-black mt-0.5">{easy}</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          {/* Viral Share Button */}
          <button
            onClick={() => setShareModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#D4F63D] hover:bg-[#c2e42e] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>Bagikan Hasil Belajar (Story / Status)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FF85C0] hover:bg-[#ff6fae] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Ulangi Sesi Ini</span>
          </button>

          <Link
            to="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-black border-2 border-black shadow-[3px_3px_0px_#000] font-black text-xs sm:text-sm active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Social Viral Share Card Modal */}
      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
}
