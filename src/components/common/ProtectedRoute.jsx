import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, isOnline, logout } = useAppStore();
  const location = useLocation();
  const [isSessionValid, setIsSessionValid] = useState(true);

  // VULN-07 Remediation: Guard against client-side LocalStorage tampering
  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated && isOnline && isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!isMounted) return;
        // If user claims to be logged in with a cloud account but no valid Supabase session exists
        if (error || !session) {
          if (user?.email && !user?.isLocalOffline) {
            console.warn('Session mismatch detected, invalidating forged or expired state.');
            setIsSessionValid(false);
            logout();
          }
        }
      }).catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isOnline, user?.email]);

  if (!isAuthenticated || !isSessionValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

