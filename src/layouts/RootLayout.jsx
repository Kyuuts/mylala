import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SyncToast from '../components/common/SyncToast';
import InstallPrompt from '../components/common/InstallPrompt';
import { useAppStore } from '../store/useAppStore';

export default function RootLayout() {
  const setOnline = useAppStore((state) => state.setOnline);

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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500">
        MyLala &bull; English Micro-Learning PWA &bull; Active Recall &amp; Spaced Repetition
      </footer>
      <SyncToast />
      <InstallPrompt />
    </div>
  );
}
