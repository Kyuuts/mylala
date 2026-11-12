import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, ExternalLink, Check, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function ReviewerAgreementModal() {
  const { isAuthenticated, user, hasAcceptedTerms, setHasAcceptedTerms } = useAppStore();
  const [agreed, setAgreed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = mounted && isAuthenticated && !hasAcceptedTerms;

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!agreed) return;
    setHasAcceptedTerms(true);
  };

  const displayName = user?.name || user?.username || 'Teman Belajar';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-in">
        {/* Header Bersahabat */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Selamat Datang</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Halo, {displayName}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 leading-relaxed">
            Senang kamu bergabung di MyLala. Di sini kamu bisa belajar bahasa Inggris lebih aktif lewat kartu hafalan cerdas, aneka latihan seru, dan bacaan ber-audio.
          </p>
        </div>

        {/* Body Ringkas */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Card Panduan Singkat */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Panduan &amp; Cara Penggunaan
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Penjelasan fitur lengkap dan cara pakainya sudah kami rangkum di dokumen PDF berikut:
              </p>
              <div className="mt-2.5">
                <a
                  href="/Panduan_Penggunaan_MyLala.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Buka Panduan (PDF)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Centang Persetujuan Santai */}
          <div
            onClick={() => setAgreed(!agreed)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              agreed
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                agreed
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-400'
              }`}
            >
              {agreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <label className="text-xs sm:text-sm text-slate-700 leading-snug cursor-pointer font-medium">
              Saya setuju dan siap mencoba aplikasi MyLala
            </label>
          </div>

          {/* Tombol Mulai */}
          <button
            type="button"
            disabled={!agreed}
            onClick={handleConfirm}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
              agreed
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-indigo-600/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Mulai Eksplorasi 🚀</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
