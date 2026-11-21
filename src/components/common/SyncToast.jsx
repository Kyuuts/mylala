import React, { useEffect } from 'react';
import { CheckCircle2, X, WifiOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function SyncToast() {
  const { syncNotification, dismissNotification, offlineQueue, isOnline } = useAppStore();

  // Auto-dismiss notification after 3 seconds so it doesn't linger on screen
  useEffect(() => {
    if (syncNotification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [syncNotification, dismissNotification]);

  if (!syncNotification && (!offlineQueue || offlineQueue.length === 0 || isOnline)) {
    return null;
  }

  return (
    <aside
      aria-label="Notifikasi status"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] transition-all duration-300 pointer-events-auto animate-fade-in"
    >
      {syncNotification ? (
        <div className="bg-[#80ED99] text-black px-4 py-2.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3 text-xs sm:text-sm font-black">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span className="truncate">{syncNotification}</span>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-lg hover:bg-black/10 text-black transition shrink-0 cursor-pointer"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      ) : !isOnline && offlineQueue.length > 0 ? (
        <div className="bg-[#FF85C0] text-black px-4 py-2.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-3 text-xs sm:text-sm font-black">
          <div className="flex items-center gap-2 min-w-0">
            <WifiOff className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span className="truncate">
              {offlineQueue.length} progres offline (akan sinkron saat online)
            </span>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-lg hover:bg-black/10 text-black transition shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
