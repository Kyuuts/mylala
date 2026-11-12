import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Zap, Newspaper, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function BottomNav() {
  const { weeklyXp } = useAppStore();

  const navItems = [
    { to: '/dashboard', label: 'Belajar', icon: BookOpen },
    { to: '/practice', label: 'Latihan', icon: Zap },
    { to: '/reading', label: 'Bacaan', icon: Newspaper },
    {
      to: '/leaderboard',
      label: 'Liga',
      icon: Trophy,
      badge: `${weeklyXp || 0} XP`,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-lg md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[64px] transition-all relative cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[8px] font-extrabold shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
