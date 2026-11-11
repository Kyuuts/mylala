import React, { createContext, useContext, useState, useEffect } from 'react';
import { flashcardService } from '../services/flashcardService';
import { isSupabaseConfigured } from '../services/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced'

  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false);
      if (isSupabaseConfigured()) {
        setSyncStatus('syncing');
        const { syncedCount } = await flashcardService.syncOfflineQueue();
        if (syncedCount > 0) {
          console.info(`✅ Berhasil menyinkronkan ${syncedCount} item offline ke Supabase.`);
        }
        setSyncStatus('synced');
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isOffline,
        syncStatus,
        isSupabaseReady: isSupabaseConfigured(),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
