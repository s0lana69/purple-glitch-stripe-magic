'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Loader2 } from 'lucide-react';

// A wrapper component to use useSearchParams because it needs to be under Suspense
function AuthPageContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = async () => {
      try {
        // Check for OAuth callback errors in URL
        const error = searchParams?.get('error');
        if (error) {
          console.error('OAuth callback error:', error);
          setIsCheckingAuth(false);
          setShowAuthModal(true);
          return;
        }

        // Wait for auth loading to complete
        if (loading) {
          return;
        }
        
        if (user) {
          console.log('Auth page: User already authenticated, redirecting...');
          const redirectedFrom = searchParams?.get('redirectedFrom') || '/prices';
          router.push(redirectedFrom);
          return;
        }
        
        // User is not authenticated, proceed with auth flow
        setIsCheckingAuth(false);
        
        if (searchParams) {
          const initialMode = searchParams.get('initialMode');
          if (initialMode === 'signup') {
            setAuthMode('signup');
          } else {
            setAuthMode('login');
          }
        }
        
        // Show the auth modal
        setShowAuthModal(true);
        
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsCheckingAuth(false);
        setShowAuthModal(true);
      }
    };

    checkAuthStatus();
  }, [searchParams, router, user, loading]);

  const redirectedFrom = searchParams ? searchParams.get('redirectedFrom') : null;

  if (isCheckingAuth || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white p-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white p-4">
      {redirectedFrom && (
        <p className="mb-4 text-center text-muted-foreground">
          Please log in or sign up to access <code>{redirectedFrom}</code>.
        </p>
      )}
      {!showAuthModal && (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading authentication...</span>
        </div>
      )}
      {/* The AuthLayout will be shown as a modal dialog */}
      <AuthLayout
        open={showAuthModal}
        onOpenChange={(open) => {
          setShowAuthModal(open);
          // If modal is closed, perhaps redirect to home or handle as needed
          // For now, just allows closing. User can navigate away.
        }}
        mode={authMode}
      />
      {/* Optionally, add a link to go back to the homepage if the modal is closed without action */}
      {/* <Link href="/" className="mt-8 text-sm text-purple-400 hover:text-purple-300">
        Go to Homepage
      </Link> */}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-dark text-white"><Loader2 className="h-8 w-8 animate-spin" /> Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
