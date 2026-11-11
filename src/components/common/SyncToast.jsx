import React from 'react';
import { CheckCircle2, X, WifiOff } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function SyncToast() {
  const { syncNotification, dismissNotification, offlineQueue, isOnline } = useAppStore();

  if (!syncNotification && (!offlineQueue || offlineQueue.length === 0 || isOnline)) {
    return null;
  }

  return (
    <aside
      aria-label="Notifikasi sinkronisasi status"
      className="fixed bottom-4 right-4 z-50 max-w-sm w-full transition-all"
    >
      {syncNotification ? (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />
            <span className="font-medium">{syncNotification}</span>
          </div>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-lg hover:bg-emerald-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : !isOnline && offlineQueue.length > 0 ? (
        <div className="bg-slate-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="font-medium">
              {offlineQueue.length} progres disimpan lokal (akan sinkron saat online).
            </span>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
