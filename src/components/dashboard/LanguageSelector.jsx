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
              className={`shrink-0 min-w-[130px] sm:min-w-0 text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                  : isComingSoon
                  ? 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 cursor-pointer opacity-85'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xl sm:text-3xl select-none">{lang.flag}</span>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600">
                    <Lock className="w-2.5 h-2.5 text-slate-500" /> Soon
                  </span>
                )}
              </div>

              <div className="mt-1.5 sm:mt-2.5">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-base leading-tight truncate">
                  {lang.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate hidden sm:block">
                  {lang.nativeName}
                </p>
              </div>

              <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className={isActive ? 'font-bold text-indigo-700' : 'text-slate-400'}>
                  {isActive ? `${lang.modulesCount} Modul` : 'Dalam Kurasi'}
                </span>
                {isActive && <Sparkles className="w-3 h-3 text-indigo-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Info Notification for Coming Soon Languages */}
      {comingSoonToast && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>
            🚀 Modul <strong>{comingSoonToast}</strong> sedang dalam tahap kurasi kurikulum. Saat ini kurikulum <strong>Bahasa Inggris</strong> sudah lengkap dan siap dipelajari!
          </span>
          <button
            onClick={() => setComingSoonToast(null)}
            className="text-indigo-600 hover:text-indigo-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

