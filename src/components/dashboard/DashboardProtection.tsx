'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Client-side protection for dashboard routes
 */
export default function DashboardProtection({ children }: { children: React.ReactNode }) {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for Firebase auth to initialize
    if (!loading) {
      if (!user) {
        // If no user is found after auth has loaded, redirect to auth
        router.push('/auth?initialMode=signup&redirectedFrom=' + encodeURIComponent(window.location.pathname));
      } else {
        setIsChecking(false);
      }
    }
  }, [user, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
