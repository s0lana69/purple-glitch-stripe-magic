'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './FirebaseAuthContext';
import { userProfileService } from '@/lib/firebaseAuth';
import { Timestamp } from 'firebase/firestore';

export type SubscriptionStatus = 
  | 'trialing'     // 2-day trial - full access
  | 'active'       // Paid subscription - full access  
  | 'past_due'     // Payment failed - immediate restriction
  | 'canceled'     // User canceled - immediate restriction
  | 'expired'      // Trial ended, no payment - immediate restriction
  | null;          // New user - needs trial setup

export interface TrialInfo {
  startDate: string | null;
  expiresAt: string | null;
  isActive: boolean;
  daysRemaining: number;
  used: boolean;
}

export interface SubscriptionData {
  status: SubscriptionStatus;
  planName: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  period: string | null;
  trial: TrialInfo;
  hasServiceAccess: boolean;
  loading: boolean;
}

interface SubscriptionContextType extends SubscriptionData {
  startTrial: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  checkTrialExpiration: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    status: null,
    planName: null,
    customerId: null,
    subscriptionId: null,
    period: null,
    trial: {
      startDate: null,
      expiresAt: null,
      isActive: false,
      daysRemaining: 0,
      used: false,
    },
    hasServiceAccess: false,
    loading: true,
  });

  // Calculate trial days remaining
  const calculateDaysRemaining = (expiresAt: string | null): number => {
    if (!expiresAt) return 0;
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diffInMs = expiry - now;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffInDays);
  };

  // Determine subscription status based on trial and Stripe data
  const determineStatus = (profile: any): SubscriptionStatus => {
    if (!profile) return null;

    // Check if user has active Stripe subscription
    if (profile.subscription?.status) {
      const status = profile.subscription.status;
      if (status === 'active') {
        return 'active';
      }
      if (status === 'trialing') {
        return 'trialing';
      }
      if (status === 'past_due') {
        return 'past_due';
      }
      if (status === 'canceled') {
        return 'canceled';
      }
    }

    // Check trial status
    if (profile.subscription?.trialEnd) {
      const now = new Date();
      const trialEnd = profile.subscription.trialEnd.toDate ? 
        profile.subscription.trialEnd.toDate() : 
        new Date(profile.subscription.trialEnd);
      
      if (now < trialEnd) {
        return 'trialing';
      } else {
        return 'expired';
      }
    }

    return null;
  };

  // Check if user has access to services
  const hasServiceAccess = (status: SubscriptionStatus): boolean => {
    return status === 'trialing' || status === 'active';
  };

  // Fetch subscription data from user profile
  const fetchSubscriptionData = async (): Promise<void> => {
    if (!user?.uid || !userProfile) {
      setSubscriptionData(prev => ({ 
        ...prev, 
        loading: false,
        hasServiceAccess: false,
        status: null 
      }));
      return;
    }

    try {
      const status = determineStatus(userProfile);
      const trialEnd = userProfile.subscription?.trialEnd;
      const trialEndDate = trialEnd ?
        (trialEnd instanceof Timestamp ? trialEnd.toDate() : new Date(trialEnd)) :
        null;
      const daysRemaining = trialEndDate ? calculateDaysRemaining(trialEndDate.toISOString()) : 0;
      const isTrialActive = status === 'trialing';

      // Helper function to convert Timestamp to ISO string
      const getISOString = (timestamp: any): string | null => {
        if (!timestamp) return null;
        if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
        if (timestamp.toDate) return timestamp.toDate().toISOString();
        return new Date(timestamp).toISOString();
      };

      setSubscriptionData({
        status,
        planName: userProfile.subscription?.plan || null,
        customerId: userProfile.subscription?.stripeCustomerId || null,
        subscriptionId: userProfile.subscription?.stripeSubscriptionId || null,
        period: null, // Not stored in Firebase schema
        trial: {
          startDate: getISOString(userProfile.createdAt),
          expiresAt: trialEndDate ? trialEndDate.toISOString() : null,
          isActive: isTrialActive,
          daysRemaining,
          used: false, // Not tracked in Firebase schema
        },
        hasServiceAccess: hasServiceAccess(status),
        loading: false,
      });
    } catch (error) {
      console.error('Error in fetchSubscriptionData:', error);
      setSubscriptionData(prev => ({ ...prev, loading: false }));
    }
  };

  // Start trial for new user
  const startTrial = async (): Promise<boolean> => {
    if (!user?.uid) return false;

    try {
      // For Firebase, we just update the trial end date
      const trialEndDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days trial
      
      await userProfileService.updateSubscription(user.uid, {
        plan: 'free',
        status: 'trialing',
        trialEnd: trialEndDate as any,
      });

      // Refresh subscription data after starting trial
      await fetchSubscriptionData();
      return true;
    } catch (error) {
      console.error('Error in startTrial:', error);
      return false;
    }
  };

  // Check if trial has expired and handle auto-subscription
  const checkTrialExpiration = async (): Promise<void> => {
    if (!user?.uid || subscriptionData.status !== 'trialing') return;

    const now = new Date();
    const expiresAt = subscriptionData.trial.expiresAt;
    
    if (expiresAt && now >= new Date(expiresAt)) {
      // Trial has expired - trigger auto-subscription
      try {
        const response = await fetch('/api/subscription/auto-subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.uid }),
        });

        if (response.ok) {
          // Refresh subscription data after auto-subscription
          await fetchSubscriptionData();
        } else {
          console.error('Failed to auto-subscribe user');
          // Mark trial as expired
          await fetchSubscriptionData();
        }
      } catch (error) {
        console.error('Error in checkTrialExpiration:', error);
        await fetchSubscriptionData();
      }
    }
  };

  // TEMPORARILY DISABLED: Handle redirects based on subscription status
  // This is causing the refresh loop on /prices
  const handleSubscriptionRedirects = (pathname: string) => {
    // Temporarily disabled to prevent refresh loops
    console.log('[SubscriptionContext] Redirects temporarily disabled to prevent refresh loops');
    return;
  };

  // Refresh subscription data
  const refreshSubscription = async (): Promise<void> => {
    await fetchSubscriptionData();
  };

  // Load subscription data when user profile changes
  useEffect(() => {
    if (!authLoading && userProfile) {
      fetchSubscriptionData();
    }
  }, [userProfile, authLoading]);

  // Auto-start trial for new users without trial data - TEMPORARILY DISABLED
  /*
  useEffect(() => {
    if (
      user?.uid && 
      userProfile &&
      !subscriptionData.loading && 
      subscriptionData.status === null &&
      !subscriptionData.trial.startDate &&
      !subscriptionData.customerId
    ) {
      startTrial();
    }
  }, [user?.uid, userProfile, subscriptionData.loading, subscriptionData.status]);
  */

  // Set up trial expiration checker
  useEffect(() => {
    if (subscriptionData.status === 'trialing') {
      const interval = setInterval(checkTrialExpiration, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [subscriptionData.status]);

  // TEMPORARILY DISABLED: Handle subscription-based redirects
  /*
  useEffect(() => {
    if (pathname) {
      handleSubscriptionRedirects(pathname);
    }
  }, [pathname, subscriptionData.loading, subscriptionData.hasServiceAccess, authLoading, user]);
  */

  const contextValue: SubscriptionContextType = {
    ...subscriptionData,
    startTrial,
    refreshSubscription,
    checkTrialExpiration,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}
