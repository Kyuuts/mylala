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
  const fetchAiConfigFromSupabase = useAppStore((state) => state.fetchAiConfigFromSupabase);
  const checkWeeklyReset = useAppStore((state) => state.checkWeeklyReset);

  // Check and enforce weekly league reset on startup
  useEffect(() => {
    if (checkWeeklyReset) {
      checkWeeklyReset();
    }
  }, [checkWeeklyReset]);

  // Sync global AI config from Supabase Cloud on initial mount
  useEffect(() => {
    if (fetchAiConfigFromSupabase) {
      fetchAiConfigFromSupabase();
    }
  }, [fetchAiConfigFromSupabase]);

  // Sync cloud stats and progress from Supabase on mount and tab focus/visibility
  useEffect(() => {
    if (user) {
      if (fetchUserStatsFromSupabase) fetchUserStatsFromSupabase(user.id, user.username);
      if (fetchUserProgressFromSupabase) fetchUserProgressFromSupabase(user.id);
    }
  }, [user?.id, user?.username, fetchUserStatsFromSupabase, fetchUserProgressFromSupabase]);

  useEffect(() => {
    const handleSyncOnVisible = () => {
      if (document.visibilityState === 'visible' && user) {
        if (fetchUserStatsFromSupabase) fetchUserStatsFromSupabase(user.id, user.username);
      }
    };

    window.addEventListener('visibilitychange', handleSyncOnVisible);
    window.addEventListener('focus', handleSyncOnVisible);

    return () => {
      window.removeEventListener('visibilitychange', handleSyncOnVisible);
      window.removeEventListener('focus', handleSyncOnVisible);
    };
  }, [user?.id, user?.username, fetchUserStatsFromSupabase]);

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
    <div className="min-h-screen flex flex-col bg-[#D4F63D] text-black w-full max-w-full overflow-x-hidden selection:bg-black selection:text-[#D4F63D]">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 md:pb-10 overflow-x-hidden">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-xs font-extrabold text-black mb-16 md:mb-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
          <span>⚡ MyLala</span>
          <span>•</span>
          <span>Made with ❤️ by Kyuut</span>
        </div>
      </footer>
      <BottomNav />
      <SyncToast />
      <InstallPrompt />
    </div>
  );
}
