import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Newspaper, PlusCircle, WifiOff, Cloud, RefreshCw, LogOut, User, Trophy, Settings, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Logo from './Logo';
import EditProfileModal from '../profile/EditProfileModal';
import AiSettingsModal from '../ai/AiSettingsModal';

export default function Navbar() {
  const navigate = useNavigate();
  const { isOnline, isSupabaseReady, syncStatus, offlineQueue, user, logout, weeklyXp, isAuthenticated, aiConfig } = useAppStore();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-extrabold text-lg sm:text-xl text-slate-900 hover:opacity-90 transition shrink-0">
            <Logo size="sm" />
            <span className="tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MyLala
            </span>
          </Link>

          {!isOnline ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
              <WifiOff className="w-3 h-3" /> Offline
              {offlineQueue.length > 0 && ` (${offlineQueue.length} queued)`}
            </span>
          ) : syncStatus === 'syncing' ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
              <RefreshCw className="w-3 h-3 animate-spin" /> Menyinkronkan...
            </span>
          ) : isSupabaseReady ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
              <Cloud className="w-3 h-3" /> Cloud Synced
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
              Offline Ready
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Desktop Navigation for Logged In Users */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <BookOpen className="w-4 h-4" />
                <span>Belajar</span>
              </NavLink>

              <NavLink
                to="/practice"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Latihan</span>
              </NavLink>

              <NavLink
                to="/reading"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Newspaper className="w-4 h-4 text-sky-500" />
                <span>Bacaan</span>
              </NavLink>

              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Liga Rank</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {weeklyXp || 0} XP
                </span>
              </NavLink>

              <NavLink
                to="/create"
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                  }`
                }
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Modul</span>
              </NavLink>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition"
              >
                Pilihan Bahasa &bull; CEFR
              </Link>
            </nav>
          )}

          {/* Mobile + Modul Shortcut Button (Only if authenticated) */}
          {isAuthenticated && (
            <NavLink
              to="/create"
              title="Buat Modul Baru"
              className="md:hidden flex items-center justify-center p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 transition w-8 h-8 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
            </NavLink>
          )}

          {/* Lala AI Quick Settings Button */}
          <button
            type="button"
            onClick={() => setAiSettingsOpen(true)}
            title="Pengaturan Lala AI (Model LLM Gratis)"
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer h-8 sm:min-h-[38px] active:scale-95 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border border-indigo-200/90 shadow-2xs shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span className="hidden sm:inline font-extrabold tracking-tight">Lala AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white shrink-0 animate-pulse"></span>
          </button>

          {/* User Profile & Auth Trigger */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setEditProfileOpen(true)}
                title="Edit Profil & Avatar"
                className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 active:scale-95 px-2 sm:px-3 py-1 h-8 sm:min-h-[38px] rounded-full transition cursor-pointer max-w-[95px] sm:max-w-none shrink-0"
              >
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-indigo-100">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-2.5 h-2.5 text-indigo-600" />
                  )}
                </div>
                <span className="max-w-[42px] sm:max-w-[80px] md:max-w-none truncate">{user?.name || user?.username || 'Siswa'}</span>
                {user?.cefrLevel && (
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-black shrink-0">
                    {user.cefrLevel}
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                title="Keluar dari Akun"
                className="p-1 sm:p-2 h-8 w-8 sm:min-h-[38px] sm:min-w-[38px] rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer flex items-center justify-center shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition shadow-2xs h-8 sm:min-h-[38px]"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile & Avatar Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

      {/* Lala AI Settings Modal */}
      <AiSettingsModal
        isOpen={aiSettingsOpen}
        onClose={() => setAiSettingsOpen(false)}
      />
    </header>
  );
}
