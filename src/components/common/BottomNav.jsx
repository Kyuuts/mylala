import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Zap, Newspaper, Trophy, ArrowRight, Play, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function BottomNav() {
  const { isAuthenticated, weeklyXp, getMetrics } = useAppStore();
  const [showBadge, setShowBadge] = useState(true);
  const { dueCount = 0 } = getMetrics ? getMetrics() : {};

  // Skor hanya muncul beberapa detik (4 detik) saat user pertama kali buka aplikasi
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBadge(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[2.5px] border-black shadow-[0px_-4px_0px_#000] px-4 py-2.5 flex items-center justify-between md:hidden">
        <div>
          <span className="block text-xs font-black uppercase tracking-wider text-black">MyLala Neo Lab</span>
          <span className="block text-[10px] font-bold text-slate-700">100% Gratis &bull; PWA Offline Ready</span>
        </div>
        <NavLink
          to="/login?mode=register"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#FF85C0] text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]"
        >
          <span>Mulai Gratis</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[2.5px] border-black shadow-[0px_-4px_0px_#000] px-3 py-1.5 flex items-center justify-between md:hidden">
      {/* 1. Belajar / Dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[54px] ${
            isActive ? 'text-black' : 'text-slate-600 hover:text-black'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#D4F63D] border-2 border-black shadow-[2px_2px_0px_#000]' : ''}`}>
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-black' : 'font-bold'}`}>
              Belajar
            </span>
          </>
        )}
      </NavLink>

      {/* 2. Latihan */}
      <NavLink
        to="/practice"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[54px] ${
            isActive ? 'text-black' : 'text-slate-600 hover:text-black'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#70D6FF] border-2 border-black shadow-[2px_2px_0px_#000]' : ''}`}>
              <Zap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-black' : 'font-bold'}`}>
              Latihan
            </span>
          </>
        )}
      </NavLink>

      {/* 3. Center Highlight: Flashcard Quick Play (Matches the Pink Button in user photo) */}
      <NavLink
        to={dueCount > 0 ? '/flashcards/due' : '/flashcards/all'}
        className="flex flex-col items-center justify-center -mt-5 transition-all cursor-pointer group"
      >
        <div className="relative w-13 h-13 rounded-2xl bg-[#FF85C0] border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center text-black">
          <Layers className="w-6 h-6 stroke-[2.5]" />
          {dueCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-md bg-black text-white text-[9px] font-black border border-white shadow-xs">
              {dueCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 tracking-tight font-black text-black uppercase">
          {dueCount > 0 ? 'Review' : 'Flashcard'}
        </span>
      </NavLink>

      {/* 4. Bacaan */}
      <NavLink
        to="/reading"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[54px] ${
            isActive ? 'text-black' : 'text-slate-600 hover:text-black'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#FFD166] border-2 border-black shadow-[2px_2px_0px_#000]' : ''}`}>
              <Newspaper className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-black' : 'font-bold'}`}>
              Bacaan
            </span>
          </>
        )}
      </NavLink>

      {/* 5. Liga */}
      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer min-w-[54px] ${
            isActive ? 'text-black' : 'text-slate-600 hover:text-black'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`relative p-1 rounded-lg ${isActive ? 'bg-[#80ED99] border-2 border-black shadow-[2px_2px_0px_#000]' : ''}`}>
              <Trophy className="w-5 h-5 stroke-[2.5]" />
              {weeklyXp && showBadge && (
                <span className="absolute -top-2 -right-3 px-1.5 py-0.2 rounded-md bg-black text-white text-[8px] font-black shadow-xs">
                  {weeklyXp} XP
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-black' : 'font-bold'}`}>
              Liga
            </span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
