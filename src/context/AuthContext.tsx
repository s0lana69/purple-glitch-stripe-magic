'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser(auth.currentUser);
        console.log('AuthContext: User data refreshed successfully');
      }
    } catch (error) {
      console.error('AuthContext: Failed to refresh user data:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Auth state change:', firebaseUser?.uid);
      
      setUser(firebaseUser);
      setLoading(false);

      // Set/clear the auth cookie
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; secure; samesite=strict`;
          console.log('AuthContext: User signed in, auth cookie set');
          
          // Check if there's a stored redirect destination
          let redirectTo = '/dashboard'; // Default destination
          
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectedFrom = urlParams.get('redirectedFrom');
            
            if (redirectedFrom) {
              redirectTo = decodeURIComponent(redirectedFrom);
              console.log('AuthContext: Found redirect destination:', redirectTo);
              
              // Clear the redirect parameter from URL
              urlParams.delete('redirectedFrom');
              const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
              window.history.replaceState({}, '', newUrl);
            }
          }
          
          // Only redirect if we're on the auth page
          const currentPath = window.location.pathname;
          if (currentPath === '/auth') {
            console.log('AuthContext: Redirecting to:', redirectTo);
            router.push(redirectTo);
          }
        } catch (error) {
          console.error('AuthContext: Error setting auth cookie:', error);
        }
      } else {
        // Clear the auth cookie
        document.cookie = 'firebase-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        console.log('AuthContext: User signed out, auth cookie cleared');
        
        // Only redirect to auth if we're on a protected route
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/dashboard')) {
          router.push('/auth?initialMode=login');
        }
      }
    });

    return () => unsubscribe();
  }, [router, refreshUser]);

  // Handle URL parameters for linking completion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkForLinkingCompletion = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const authCompleted = urlParams.get('auth_completed');
        const flowType = urlParams.get('flow_type');

        if (authCompleted === 'true' && flowType === 'linking') {
          console.log('AuthContext: Detected successful linking, refreshing user data');
          
          // Clear URL parameters
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, '', newUrl);
          
          // Use multiple refresh attempts to ensure we get the updated metadata
          const attemptRefresh = async (attempt: number = 1) => {
            console.log(`AuthContext: User refresh attempt ${attempt} after linking`);
            await refreshUser();
            
            // Notify other components about the YouTube status change
            localStorage.setItem('youtube-status-changed', Date.now().toString());
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('youtube-connection-updated'));
            
            // If we still don't have YouTube access and haven't exhausted attempts, try again
            if (attempt < 3) {
              setTimeout(() => attemptRefresh(attempt + 1), attempt * 1500);
            }
          };
          
          // Start the refresh process immediately and then with delays
          setTimeout(() => attemptRefresh(), 500);
        }
      };

      // Check immediately
      checkForLinkingCompletion();

      // Also listen for navigation changes in case user navigates with params
      const handlePopState = () => {
        checkForLinkingCompletion();
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []); // Empty dependency array to only run once on mount

  const signOut = async () => {
    try {
      // Use Firebase sign out
      await firebaseSignOut(auth);

      // Clear additional cookies and local storage
      await fetch('/api/auth/clear-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(err => console.warn('Failed to clear cookies:', err));

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Force router refresh and redirect
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Logout error:', error.message);
      // Still try to redirect even if logout fails
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
