import React from 'react';
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
  if (!isOpen || !targetModule) return null;

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                Peringatan Level • Soft Lock Guide
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Materi di Luar Jalur Aktif
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5 text-center">
          {/* Level Comparison Badges */}
          <div className="flex items-center justify-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-600 uppercase block">Levelmu Sekarang</span>
              <span className="text-sm font-extrabold text-emerald-800 flex items-center justify-center gap-1 mt-0.5">
                <span>{userLevelInfo.badge}</span>
                <span>{userLevelInfo.code} • {userLevelInfo.role}</span>
              </span>
            </div>

            <div className="text-slate-300 font-extrabold text-base">&rarr;</div>

            <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Level Materi Ini</span>
              <span className="text-sm font-extrabold text-amber-900 flex items-center justify-center gap-1 mt-0.5">
                <span>{targetLevelInfo.badge}</span>
                <span>{targetLevelInfo.code} • {targetLevelInfo.role}</span>
              </span>
            </div>
          </div>

          {/* Module Target Title */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Modul yang ingin Anda buka:
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
              {targetModule.title}
            </h4>
          </div>

          {/* Advisory Explanation */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left">
            Materi ini diperuntukkan bagi pembelajar di <strong>Level {targetLevelCode}</strong>. Karena kamu sedang berfokus di <strong>Level {userLevelCode}</strong>, materi ini mungkin terasa lebih sulit atau memiliki asumsi tata bahasa yang belum kamu pelajari.
          </p>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-left flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
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
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Fokus Jalur {userLevelCode} (Disarankan)</span>
            </button>

            <button
              onClick={() => {
                if (onContinue) onContinue();
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Tetap Lanjut Baca</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
