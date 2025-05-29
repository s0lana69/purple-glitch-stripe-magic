'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/FirebaseAuthContext';

export function OAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const code = searchParams?.get('code');
    const error = searchParams?.get('error');
    
    if (error) {
      console.error('[OAuthHandler] OAuth error:', error);
      router.push('/auth?error=' + encodeURIComponent(error));
      return;
    }

    if (code) {
      console.log('[OAuthHandler] OAuth code received:', code);
      // TODO: Handle OAuth callback with Firebase
      // For now, redirect to callback API endpoint
      window.location.href = `/api/auth/callback?code=${code}`;
      return;
    }

    // If user is authenticated via Firebase, redirect appropriately
    if (!loading && user) {
      console.log('[OAuthHandler] User authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [searchParams, user, loading, router]);

  // This component doesn't render anything
  return null;
}
