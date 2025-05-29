'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { firebaseAuth, userProfileService, UserProfile, AuthStateManager } from '@/lib/firebaseAuth';
import { signInWithGooglePopup, handleGoogleRedirectResult } from '@/lib/googleAuth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSubscription: (subscription: UserProfile['subscription']) => Promise<void>;
  updateYouTubeConnection: (youtube: UserProfile['youtube']) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authManager = AuthStateManager.getInstance();
    
    // Handle Google redirect result on page load
    const handleRedirect = async () => {
      try {
        await handleGoogleRedirectResult();
      } catch (error) {
        console.error('Error handling Google redirect:', error);
      }
    };
    
    handleRedirect();
    
    const unsubscribe = authManager.addListener(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch user profile from Firestore
          const profile = await userProfileService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      authManager.removeListener(unsubscribe);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await firebaseAuth.signIn(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      await firebaseAuth.signUp(email, password, displayName);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithGooglePopup();
      console.log('[FirebaseAuth] Google sign-in successful:', result.user.email);
    } catch (error: any) {
      console.error('[FirebaseAuth] Google sign-in error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await firebaseAuth.resetPassword(email);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await firebaseAuth.updatePassword(currentPassword, newPassword);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No authenticated user');
    
    await userProfileService.updateUserProfile(user.uid, updates);
    
    // Refresh profile
    await refreshProfile();
  };

  const updateSubscription = async (subscription: UserProfile['subscription']) => {
    if (!user) throw new Error('No authenticated user');
    
    await userProfileService.updateSubscription(user.uid, subscription);
    
    // Refresh profile
    await refreshProfile();
  };

  const updateYouTubeConnection = async (youtube: UserProfile['youtube']) => {
    if (!user) throw new Error('No authenticated user');
    
    await userProfileService.updateYouTubeConnection(user.uid, youtube);
    
    // Refresh profile
    await refreshProfile();
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await userProfileService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    updateSubscription,
    updateYouTubeConnection,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}

// Export for backward compatibility
export const useAuth = useFirebaseAuth;
export default useFirebaseAuth;
