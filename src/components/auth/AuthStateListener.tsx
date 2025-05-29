'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useFirebaseAuth } from '@/context/FirebaseAuthContext'
import { toast } from 'sonner'

export default function AuthStateListener() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useFirebaseAuth()
  
  const authError = searchParams ? searchParams.get('error') : null;
  const authCompleted = searchParams ? searchParams.get('auth_completed') : null;
  const flowType = searchParams ? searchParams.get('flow_type') : null;

  useEffect(() => {
    if (authError) {
      toast.error(`Authentication Error: ${authError}`)
      router.replace('/auth') // Clean URL after showing error
    }
  }, [authError, router])

  // Handle OAuth callback completion
  useEffect(() => {
    const handleOAuthCompletion = async () => {
      if (authCompleted === 'true') {
        console.log('AuthStateListener: OAuth completion detected, flow type:', flowType);
        
        if (user) {
          console.log('AuthStateListener: Valid user found after OAuth completion');
          
          // Wait a bit for authentication to stabilize
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Determine redirect destination
          const redirectedFrom = searchParams?.get('redirectedFrom');
          const returnTo = searchParams?.get('returnTo');
          const destination = redirectedFrom || returnTo || '/dashboard';
          
          console.log('AuthStateListener: Redirecting to:', destination);
          
          // Clean URL and redirect
          router.replace(destination);
        } else if (!loading) {
          console.log('AuthStateListener: No user found after OAuth completion');
          toast.error('Authentication failed. Please try again.');
          router.push('/auth');
        }
      }
    };

    handleOAuthCompletion();
  }, [authCompleted, flowType, router, searchParams, user, loading]);

  // Handle authentication state changes
  useEffect(() => {
    if (loading) return; // Wait for auth state to be determined
    
    console.log('AuthStateListener: Auth state change:', { user: !!user, loading });
    
    if (user) {
      console.log('AuthStateListener: User authenticated');
      
      // Check if we're on the auth page and should redirect
      const currentPath = window.location.pathname;
      if (currentPath === '/auth' || currentPath === '/') {
        const redirectedFrom = searchParams?.get('redirectedFrom');
        const authCompleted = searchParams?.get('auth_completed');
        const returnTo = searchParams?.get('returnTo');
        
        // Determine destination
        let destination = '/dashboard';
        if (redirectedFrom && redirectedFrom !== '/auth') {
          destination = redirectedFrom;
        } else if (returnTo && returnTo !== '/auth') {
          destination = returnTo;
        }
        
        console.log('AuthStateListener: Redirecting authenticated user to:', destination);
        
        // Use replace to avoid back button issues
        router.replace(destination);
        return;
      }
      
      // Refresh the page to update auth state
      // Removed router.refresh() to prevent infinite refresh loop
    } else {
      console.log('AuthStateListener: User not authenticated');
      
      // Check if we're on a protected route
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/dashboard')) {
        console.log('AuthStateListener: Redirecting unauthenticated user from protected route');
        const redirectUrl = `/auth?initialMode=login${searchParams && searchParams.has('redirectedFrom')
          ? `&redirectedFrom=${encodeURIComponent(searchParams.get('redirectedFrom') || '')}`
          : ''}`;
        router.push(redirectUrl);
      }
    }
  }, [user, loading, router, searchParams]);

  return null
}
