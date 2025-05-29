'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/FirebaseAuthContext';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthGuard component ensures that children are only rendered on the client side
 * and when authentication is available. This prevents "useAuth must be used within
 * an AuthProvider" errors during static site generation.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  // Only render on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show nothing during SSR
  if (!isMounted) {
    return fallback || null;
  }

  // Show loading state while auth is initializing
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push('/auth?redirectedFrom=' + encodeURIComponent(window.location.pathname));
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}