import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Lock, Sparkles, CheckCircle2, X } from 'lucide-react';

const LANGUAGES = [
  {
    id: 'en',
    name: 'Bahasa Inggris',
    nativeName: 'English (TOEFL & Conv)',
    flag: '🇬🇧',
    status: 'active',
    modulesCount: 50,
    tag: 'Kurikulum Lengkap A1–C1',
    accentColor: '#D4F63D',
  },
  {
    id: 'ja',
    name: 'Bahasa Jepang',
    nativeName: '日本語 (JLPT N5–N3)',
    flag: '🇯🇵',
    status: 'coming_soon',
    modulesCount: 0,
    tag: 'Dalam Kurasi',
    accentColor: '#FF85C0',
  },
  {
    id: 'ko',
    name: 'Bahasa Korea',
    nativeName: '한국어 (TOPIK I–II)',
    flag: '🇰🇷',
    status: 'coming_soon',
    modulesCount: 0,
    tag: 'Dalam Kurasi',
    accentColor: '#70D6FF',
  },
  {
    id: 'de',
    name: 'Bahasa Jerman',
    nativeName: 'Deutsch (Goethe A1–B2)',
    flag: '🇩🇪',
    status: 'coming_soon',
    modulesCount: 0,
    tag: 'Dalam Kurasi',
    accentColor: '#FFD166',
  },
];

export default function LanguageSelectorModal({
  isOpen,
  onClose,
  activeLanguage = 'en',
  onSelectLanguage,
}) {
  const [comingSoonToast, setComingSoonToast] = useState(null);

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

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSelect = (lang) => {
    if (lang.status === 'active') {
      if (onSelectLanguage) onSelectLanguage(lang.id);
      onClose();
    } else {
      setComingSoonToast(lang.name);
      setTimeout(() => setComingSoonToast(null), 3000);
    }
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
        <div className="px-5 sm:px-6 py-4 border-b-2.5 border-black flex items-center justify-between bg-[#D4F63D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black">
              <Globe className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                Target Bahasa • Kurikulum MyLala
              </span>
              <h3 className="text-base sm:text-lg font-black text-black">
                Pilih Bahasa Pembelajaran
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
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-black/75 font-bold leading-relaxed">
            Pilih bahasa target yang ingin kamu pelajari. Sistem active recall dan spaced repetition akan menyesuaikan kurikulum secara otomatis.
          </p>

          {/* Languages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {LANGUAGES.map((lang) => {
              const isActive = lang.id === activeLanguage && lang.status === 'active';
              const isComingSoon = lang.status === 'coming_soon';

              return (
                <button
                  key={lang.id}
                  onClick={() => handleSelect(lang)}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border-2 border-black transition-all flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#D4F63D] text-black shadow-[4px_4px_0px_#000]'
                      : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-slate-50'
                  } active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl sm:text-3xl select-none">{lang.flag}</span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-black text-white">
                        <CheckCircle2 className="w-2.5 h-2.5 stroke-[2.5]" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 border border-black text-black">
                        <Lock className="w-2.5 h-2.5" /> Soon
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-black text-black text-sm sm:text-base leading-tight">
                      {lang.name}
                    </h4>
                    <p className="text-[11px] text-black/70 font-bold mt-0.5">
                      {lang.nativeName}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t-2 border-black/10 flex items-center justify-between text-[11px]">
                    <span className="font-black text-black">
                      {isActive ? `${lang.modulesCount} Materi Siap` : 'Dalam Kurasi'}
                    </span>
                    {isActive && <Sparkles className="w-3.5 h-3.5 fill-black text-black" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Floating Toast Notification */}
          {comingSoonToast && (
            <div className="p-3 rounded-xl bg-[#FF85C0] border-2 border-black text-black text-xs font-black shadow-[3px_3px_0px_#000] flex items-center justify-between animate-fade-in">
              <span>
                🚀 Kurikulum <strong>{comingSoonToast}</strong> sedang disiapkan. Bahasa Inggris sudah siap dipelajari!
              </span>
              <button
                onClick={() => setComingSoonToast(null)}
                className="text-black hover:opacity-75 font-black ml-2 px-1.5 py-0.5 border border-black rounded bg-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-2 text-center text-xs text-black/60 font-bold">
            Ingin usulkan bahasa baru? Sampaikan lewat menu masukan komunitas.
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
