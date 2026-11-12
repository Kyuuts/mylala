import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, FileText, ExternalLink, Check, Sparkles, BookOpen, Zap, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function ReviewerAgreementModal() {
  const { isAuthenticated, user, hasAcceptedTerms, setHasAcceptedTerms } = useAppStore();
  const [agreed, setAgreed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is active
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

  const displayName = user?.name || user?.username || 'Reviewer';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-in">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-6 py-5 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Fase Peninjauan &amp; Pengujian Resmi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Selamat Datang di MyLala!
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1">
            Halo, <span className="font-bold text-white">{displayName}</span> 👋 Terima kasih telah berkenan meninjau platform micro-learning pembelajaran bahasa aktif kami.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Ringkasan Aplikasi */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Tentang Pengujian MyLala (v2.0)
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              MyLala dirancang untuk melatih kemampuan bahasa secara aktif melalui metode <strong>Active Recall</strong>, algoritma <strong>Spaced Repetition (SM-2)</strong>, <strong>Graded Readers dengan Native Audio</strong>, serta sistem kompetisi <strong>Klasemen Liga Mingguan Realtime</strong>.
            </p>
          </div>

          {/* 3 Area Utama Pengujian */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-left">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pilar Belajar</span>
              </div>
              <p className="text-[11px] text-slate-600">
                12 modul CEFR (A1-C1) dan Language Scanner 15 soal adaptif.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 text-left">
              <div className="flex items-center gap-1.5 text-orange-700 font-bold text-xs mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>6 Arena Latihan</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Flashcard SRS, Kesalahan Umum, Dikte, Dialog NPC, &amp; Susun Kata.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-left">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Liga Realtime</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Sinkronisasi XP live cloud Supabase &amp; promosi 5 divisi liga.
              </p>
            </div>
          </div>

          {/* Callout Box Dokumen PDF */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Buku Panduan &amp; Cara Penggunaan Resmi (PDF)
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Dokumen 6 bab berformat A4 lengkap menjelaskan arsitektur PWA, standarisasi CEFR, 6 arena latihan, dan sinkronisasi cloud.
                </p>
                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <a
                    href="/Panduan_Penggunaan_MyLala.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Buka Dokumen PDF</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/Panduan_Penggunaan_MyLala.pdf"
                    download="Panduan_Penggunaan_MyLala.pdf"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition cursor-pointer active:scale-95"
                  >
                    <span>Unduh PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Checkbox Persetujuan Pengujian */}
          <div
            onClick={() => setAgreed(!agreed)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
              agreed
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-slate-50 border-slate-300 hover:border-slate-400'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                agreed
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-400'
              }`}
            >
              {agreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <label className="text-xs sm:text-sm text-slate-700 leading-snug cursor-pointer font-medium">
              Saya telah membaca ringkasan petunjuk penggunaan dan menyetujui ketentuan partisipasi pengujian/evaluasi sistem aplikasi MyLala.
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            *Persetujuan ini hanya diminta satu kali pada login pertama.
          </p>
          <button
            type="button"
            disabled={!agreed}
            onClick={handleConfirm}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
              agreed
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-indigo-600/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Mulai Uji &amp; Eksplorasi Aplikasi</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
