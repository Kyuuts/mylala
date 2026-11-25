import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Compass, AlertTriangle, ArrowRight, ArrowLeft, BookOpen, X, ShieldAlert } from 'lucide-react';
import { CEFR_LEVELS } from '../../utils/moduleLevel';

export default function SoftLockModal({
  isOpen,
  onClose,
  targetModule,
  userCefrLevel = 'A1',
  onContinue,
  onSwitchToCurrentLevel,
}) {
  // Lock body scroll on mobile & desktop when open
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !targetModule || typeof document === 'undefined') return null;

  const targetLevelCode = (targetModule.cefr_level || 'A2').toUpperCase();
  const targetLevelInfo = CEFR_LEVELS[targetLevelCode] || {
    code: targetLevelCode,
    role: 'Tingkat Lanjut',
    badge: '🧭',
    title: targetLevelCode,
  };

  const userLevelCode = (userCefrLevel || 'A1').toUpperCase();
  const userLevelInfo = CEFR_LEVELS[userLevelCode] || {
    code: userLevelCode,
    role: 'Tingkat Aktif',
    badge: '🌱',
    title: userLevelCode,
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-[4px_4px_0px_#000] sm:shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col border-2 sm:border-3 border-black text-black max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b-2.5 border-black flex items-center justify-between bg-[#FFD166]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black">
              <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Peringatan Level • Soft Lock Guide
              </span>
              <h3 className="text-base font-black text-black">
                Materi di Luar Jalur Aktif
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black font-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-5 text-center">
          {/* Level Comparison Badges */}
          <div className="flex items-center justify-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-[#80ED99] border-2 border-black shadow-[2px_2px_0px_#000] text-center">
              <span className="text-[10px] font-black text-black uppercase block">Levelmu Sekarang</span>
              <span className="text-sm font-black text-black flex items-center justify-center gap-1 mt-0.5">
                <span>{userLevelInfo.badge}</span>
                <span>{userLevelInfo.code} • {userLevelInfo.role}</span>
              </span>
            </div>

            <div className="text-black font-black text-base">&rarr;</div>

            <div className="px-3.5 py-2 rounded-2xl bg-[#FFD166] border-2 border-black shadow-[2px_2px_0px_#000] text-center">
              <span className="text-[10px] font-black text-black uppercase block">Level Materi Ini</span>
              <span className="text-sm font-black text-black flex items-center justify-center gap-1 mt-0.5">
                <span>{targetLevelInfo.badge}</span>
                <span>{targetLevelInfo.code} • {targetLevelInfo.role}</span>
              </span>
            </div>
          </div>

          {/* Module Target Title */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-[#F8FAFC] border-2 border-black shadow-[2px_2px_0px_#000] text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-black/60">
              Modul yang ingin Anda buka:
            </span>
            <h4 className="text-sm font-black text-black leading-snug">
              {targetModule.title}
            </h4>
          </div>

          {/* Advisory Explanation */}
          <p className="text-xs sm:text-sm text-black/80 font-bold leading-relaxed text-left">
            Materi ini diperuntukkan bagi pembelajar di <strong>Level {targetLevelCode}</strong>. Karena kamu sedang berfokus di <strong>Level {userLevelCode}</strong>, materi ini mungkin terasa lebih sulit atau memiliki asumsi tata bahasa yang belum kamu pelajari.
          </p>

          <div className="p-3.5 rounded-2xl bg-[#FF85C0]/20 border-2 border-black text-left flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-black stroke-[2.5] shrink-0 mt-0.5" />
            <p className="text-xs text-black leading-relaxed font-bold">
              <strong>Saran Belajar:</strong> Kami menyarankan untuk menyelesaikan seluruh materi {userLevelCode} dan lulus <strong>Ujian Kelulusan {userLevelCode}</strong> terlebih dahulu agar fondasi belajarmu tidak bolong.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                if (onSwitchToCurrentLevel) onSwitchToCurrentLevel(userLevelCode);
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#D4F63D] hover:bg-[#c2e42e] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Fokus Jalur {userLevelCode} (Disarankan)</span>
            </button>

            <button
              onClick={() => {
                if (onContinue) onContinue();
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-black bg-white text-black hover:bg-slate-50 font-black text-xs sm:text-sm shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Tetap Lanjut Baca</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
