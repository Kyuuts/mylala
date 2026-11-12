import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import BottomNav from '../components/common/BottomNav';
import SyncToast from '../components/common/SyncToast';
import InstallPrompt from '../components/common/InstallPrompt';
import { useAppStore } from '../store/useAppStore';

export default function RootLayout() {
  const setOnline = useAppStore((state) => state.setOnline);
  const user = useAppStore((state) => state.user);
  const fetchUserStatsFromSupabase = useAppStore((state) => state.fetchUserStatsFromSupabase);
  const fetchUserProgressFromSupabase = useAppStore((state) => state.fetchUserProgressFromSupabase);

  // Sync cloud stats and progress from Supabase on mount
  useEffect(() => {
    if (user) {
      if (fetchUserStatsFromSupabase) fetchUserStatsFromSupabase(user.id, user.username);
      if (fetchUserProgressFromSupabase) fetchUserProgressFromSupabase(user.id);
    }
  }, [user?.id, user?.username]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500 mb-16 md:mb-0">
        MyLala &bull; Multi-Language Micro-Learning PWA &bull; Active Recall &amp; Spaced Repetition
      </footer>
      <BottomNav />
      <SyncToast />
      <InstallPrompt />
    </div>
  );
}
