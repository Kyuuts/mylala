import React, { useState } from 'react';
import { Globe, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

const LANGUAGES = [
  {
    id: 'en',
    name: 'Bahasa Inggris',
    nativeName: 'English (TOEFL & Conv)',
    flag: '🇬🇧',
    status: 'active',
    modulesCount: 11,
    tag: 'Kurikulum Utama',
  },
  {
    id: 'ja',
    name: 'Bahasa Jepang',
    nativeName: '日本語 (JLPT N5–N3)',
    flag: '🇯🇵',
    status: 'coming_soon',
    modulesCount: 0,
    tag: 'Segera Hadir',
  },
  {
    id: 'ko',
    name: 'Bahasa Korea',
    nativeName: '한국어 (TOPIK I–II)',
    flag: '🇰🇷',
    status: 'coming_soon',
    modulesCount: 0,
    tag: 'Segera Hadir',
  },
  {
    id: 'de',
    name: 'Bahasa Jerman',
    nativeName: 'Deutsch (Goethe A1–B2)',
    flag: '🇩🇪',
    status: 'coming_soon',
    modulesCount: 0,
    tag: 'Segera Hadir',
  },
];

export default function LanguageSelector({ activeLanguage = 'en', onSelectLanguage }) {
  const [comingSoonToast, setComingSoonToast] = useState(null);

  const handleClick = (lang) => {
    if (lang.status === 'active') {
      if (onSelectLanguage) onSelectLanguage(lang.id);
    } else {
      setComingSoonToast(lang.name);
      setTimeout(() => setComingSoonToast(null), 3000);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span>Pilih Bahasa Pembelajaran</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          1 Bahasa Aktif • 3 Bahasa Mendatang
        </span>
      </div>

      {/* Language Grid: Mobile Horizontal Swipeable Pills / Desktop Full Grid */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 overflow-x-auto no-scrollbar py-1">
        {LANGUAGES.map((lang) => {
          const isActive = lang.id === activeLanguage && lang.status === 'active';
          const isComingSoon = lang.status === 'coming_soon';

          return (
            <button
              key={lang.id}
              onClick={() => handleClick(lang)}
              className={`shrink-0 min-w-[130px] sm:min-w-0 text-left p-3 sm:p-4 rounded-2xl border-2 border-black transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-[#D4F63D] text-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                  : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xl sm:text-3xl select-none">{lang.flag}</span>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md bg-black text-white">
                    <CheckCircle2 className="w-2.5 h-2.5 stroke-[2.5]" /> Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 border border-black/40 text-black">
                    <Lock className="w-2.5 h-2.5 text-black" /> Soon
                  </span>
                )}
              </div>

              <div className="mt-2 sm:mt-3">
                <h4 className="font-black text-black text-xs sm:text-base leading-tight truncate">
                  {lang.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-black/70 font-bold mt-0.5 truncate hidden sm:block">
                  {lang.nativeName}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t-2 border-black/10 flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="font-black text-black">
                  {isActive ? `${lang.modulesCount} Modul` : 'Dalam Kurasi'}
                </span>
                {isActive && <Sparkles className="w-3.5 h-3.5 fill-black text-black" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Info Notification for Coming Soon Languages */}
      {comingSoonToast && (
        <div className="p-3 rounded-xl bg-[#FF85C0] border-2 border-black text-black text-xs font-black shadow-[3px_3px_0px_#000] flex items-center justify-between animate-fade-in">
          <span>
            🚀 Modul <strong>{comingSoonToast}</strong> sedang dalam tahap kurasi. Kurikulum <strong>Bahasa Inggris</strong> sudah lengkap dan siap!
          </span>
          <button
            onClick={() => setComingSoonToast(null)}
            className="text-black hover:opacity-75 font-black ml-2 px-1.5 py-0.5 border border-black rounded bg-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

