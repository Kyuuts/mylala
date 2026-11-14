import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, isOnline, logout } = useAppStore();
  const location = useLocation();
  const [isSessionValid, setIsSessionValid] = useState(true);

  // Guard against expired Supabase sessions only for cloud-authenticated sessions
  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated && isOnline && isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!isMounted) return;
        // Only invalidate if the user was explicitly authenticated via Supabase cloud auth and token expired
        // Offline-first PWA users authenticated via local cryptographic hash MUST NOT be invalidated
        if (user?.authProvider === 'supabase' && !user?.isLocalOffline) {
          if (error || !session) {
            console.warn('Cloud Supabase session expired, invalidating state.');
            setIsSessionValid(false);
            logout();
          }
        }
      }).catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isOnline, user?.email, user?.authProvider, user?.isLocalOffline]);

  if (!isAuthenticated || !isSessionValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

