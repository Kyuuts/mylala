import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import Logo from './Logo';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Pemberitahuan instalasi aplikasi"
      className="fixed bottom-20 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-auto sm:max-w-sm z-50 animate-fade-in"
    >
      <div className="bg-white rounded-2xl p-4 shadow-2xl border border-indigo-100 flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <Logo size="md" className="shrink-0" />
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              Pasang MyLala
            </h4>
            <p className="text-[11px] text-slate-600 leading-tight">
              Akses cepat langsung dari layar utama &amp; nikmati latihan offline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 cursor-pointer min-h-[36px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pasang</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Tutup pemberitahuan instalasi"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

