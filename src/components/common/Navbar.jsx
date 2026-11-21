import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Newspaper, PlusCircle, WifiOff, Cloud, RefreshCw, LogOut, User, Trophy, Settings, Sparkles, Volume2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Logo from './Logo';
import EditProfileModal from '../profile/EditProfileModal';
import AiSettingsModal from '../ai/AiSettingsModal';
import VoiceSelectorModal from './VoiceSelectorModal';

export default function Navbar() {
  const navigate = useNavigate();
  const { isOnline, isSupabaseReady, syncStatus, offlineQueue, user, logout, weeklyXp, isAuthenticated, aiConfig } = useAppStore();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-[2.5px] border-black shadow-[0px_3px_0px_#000] w-full max-w-full overflow-hidden">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          <Link to="/" className="flex items-center gap-2 font-black text-lg sm:text-xl text-black hover:opacity-90 transition shrink-0">
            <Logo size="md" className="shrink-0" />
            <span className="tracking-tight font-black text-black text-xl uppercase">
              MyLala
            </span>
          </Link>

          {!isOnline ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-black border-2 border-black bg-rose-300 text-black shadow-[2px_2px_0px_#000]">
              <WifiOff className="w-3 h-3" /> Offline
              {offlineQueue.length > 0 && ` (${offlineQueue.length})`}
            </span>
          ) : syncStatus === 'syncing' ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-black border-2 border-black bg-[#70D6FF] text-black shadow-[2px_2px_0px_#000]">
              <RefreshCw className="w-3 h-3 animate-spin" /> Syncing...
            </span>
          ) : isSupabaseReady ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-black border-2 border-black bg-[#80ED99] text-black shadow-[2px_2px_0px_#000]">
              <Cloud className="w-3 h-3" /> Cloud Synced
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-black border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000]">
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
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border-2 border-black ${
                    isActive
                      ? 'bg-[#B388FF] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-black hover:bg-slate-100 shadow-[1px_1px_0px_#000]'
                  }`
                }
              >
                <BookOpen className="w-4 h-4 stroke-[2.5]" />
                <span>Belajar</span>
              </NavLink>

              <NavLink
                to="/practice"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border-2 border-black ${
                    isActive
                      ? 'bg-[#FF85C0] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-black hover:bg-slate-100 shadow-[1px_1px_0px_#000]'
                  }`
                }
              >
                <Zap className="w-4 h-4 stroke-[2.5]" />
                <span>Latihan</span>
              </NavLink>

              <NavLink
                to="/reading"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border-2 border-black ${
                    isActive
                      ? 'bg-[#70D6FF] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-black hover:bg-slate-100 shadow-[1px_1px_0px_#000]'
                  }`
                }
              >
                <Newspaper className="w-4 h-4 stroke-[2.5]" />
                <span>Bacaan</span>
              </NavLink>

              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition border-2 border-black ${
                    isActive
                      ? 'bg-[#FFD166] text-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-black hover:bg-slate-100 shadow-[1px_1px_0px_#000]'
                  }`
                }
              >
                <Trophy className="w-4 h-4 stroke-[2.5]" />
                <span>Liga</span>
                <span className="px-1.5 py-0.2 rounded-md bg-black text-white text-[10px] font-black">
                  {weeklyXp || 0} XP
                </span>
              </NavLink>

              <NavLink
                to="/create"
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] ${
                    isActive
                      ? 'bg-[#D4F63D] text-black'
                      : 'bg-white hover:bg-[#D4F63D] text-black'
                  }`
                }
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>+ Modul</span>
              </NavLink>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-extrabold text-black hover:underline px-3 py-1.5 rounded-lg transition"
              >
                Pilihan Bahasa &bull; CEFR
              </Link>
            </nav>
          )}

          {/* Mobile + Modul Shortcut Button (Only if authenticated on sm screens) */}
          {isAuthenticated && (
            <NavLink
              to="/create"
              title="Buat Modul Baru"
              className="hidden sm:flex md:hidden items-center justify-center p-1.5 rounded-xl bg-[#D4F63D] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] text-black transition w-8 h-8 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            </NavLink>
          )}

          {/* Neural AI Voice Quick Settings Button */}
          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            title="Pengaturan Suara AI (Microsoft Azure Neural)"
            className="inline-flex items-center justify-center gap-1 w-8 sm:w-auto px-0 sm:px-2.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer h-8 sm:min-h-[38px] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] bg-[#FF85C0] text-black shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 stroke-[2.5] text-black shrink-0" />
            <span className="hidden sm:inline font-black tracking-tight uppercase">Suara</span>
          </button>

          {/* Lala AI Quick Settings Button */}
          <button
            type="button"
            onClick={() => setAiSettingsOpen(true)}
            title="Pengaturan Lala AI (Model LLM Gratis)"
            className="inline-flex items-center justify-center gap-1 w-8 sm:w-auto px-0 sm:px-2.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer h-8 sm:min-h-[38px] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] bg-[#FFD166] text-black shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black text-black shrink-0" />
            <span className="hidden sm:inline font-black tracking-tight uppercase">AI</span>
            <span className="w-2 h-2 rounded-full bg-[#80ED99] border border-black shrink-0 animate-pulse hidden sm:inline-block"></span>
          </button>

          {/* User Profile & Auth Trigger */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l-2 border-black shrink-0">
              <button
                type="button"
                onClick={() => setEditProfileOpen(true)}
                title="Edit Profil & Avatar"
                className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-black text-black bg-[#FF85C0] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] px-1.5 sm:px-3 py-1 h-8 sm:min-h-[38px] rounded-xl transition cursor-pointer shrink-0"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white border border-black">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-3 h-3 text-black stroke-[2.5]" />
                  )}
                </div>
                <span className="hidden sm:inline font-black max-w-[80px] md:max-w-none truncate">{user?.name || user?.username || 'Siswa'}</span>
                {user?.cefrLevel && (
                  <span className="px-1.5 py-0.2 rounded-md bg-black text-white text-[9px] font-black shrink-0">
                    {user.cefrLevel}
                  </span>
                )}
              </button>

              {/* Standalone Logout on Tablet / Desktop */}
              <button
                onClick={handleLogout}
                title="Keluar dari Akun"
                className="hidden sm:flex p-1 sm:p-2 h-8 w-8 sm:min-h-[38px] sm:min-w-[38px] rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] hover:bg-rose-300 text-black transition cursor-pointer items-center justify-center shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-[#B388FF] text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition h-8 sm:min-h-[38px]"
              >
                <User className="w-3.5 h-3.5 stroke-[2.5]" />
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

      {/* Kokoro AI Voice Settings Modal */}
      <VoiceSelectorModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </header>
  );
}
