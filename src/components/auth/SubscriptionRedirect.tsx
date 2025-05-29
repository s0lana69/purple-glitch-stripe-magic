'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/FirebaseAuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Clock, CreditCard } from 'lucide-react';

interface SubscriptionRedirectProps {
  redirectTo?: string;
  showWelcomeMessage?: boolean;
}

export function SubscriptionRedirect({ 
  redirectTo = '/dashboard', 
  showWelcomeMessage = true 
}: SubscriptionRedirectProps) {
  const { user } = useAuth();
  const { status, hasServiceAccess, loading, trial, startTrial } = useSubscription();
  const router = useRouter();
  const [isStartingTrial, setIsStartingTrial] = useState(false);

  // Auto-redirect if user has access
  useEffect(() => {
    if (!loading && hasServiceAccess) {
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 2000); // Give user time to see the success message

      return () => clearTimeout(timer);
    }
  }, [loading, hasServiceAccess, router, redirectTo]);

  // Handle trial start for new users
  const handleStartTrial = async () => {
    setIsStartingTrial(true);
    const success = await startTrial();
    setIsStartingTrial(false);
    
    if (success) {
      // Trial started successfully, will auto-redirect via useEffect
      console.log('Trial started successfully');
    } else {
      console.error('Failed to start trial');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="text-muted-foreground">Checking your subscription status...</p>
      </div>
    );
  }

  // User has access - show success and redirect
  if (hasServiceAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-green-500">Welcome to TrueViral!</h2>
            <p className="text-muted-foreground mt-2">
              {status === 'trialing' 
                ? `You have ${trial.daysRemaining} days remaining in your trial.`
                : 'Your subscription is active.'
              }
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {status === 'trialing' ? 'Trial Active' : 'Subscription Active'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard in a moment...
        </p>
      </div>
    );
  }

  // New user without trial - show trial start option
  if (status === null && !trial.startDate) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        {showWelcomeMessage && (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome to TrueViral!</h2>
            <p className="text-muted-foreground">
              Start your free 2-day trial to access all dashboard features.
            </p>
          </div>
        )}
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <span>Free Trial Available</span>
            </CardTitle>
            <CardDescription>
              Get full access to all features for 2 days, completely free.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>AI-powered content analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>YouTube channel insights</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Performance analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Content optimization tools</span>
              </div>
            </div>
            
            <Button 
              onClick={handleStartTrial}
              disabled={isStartingTrial}
              className="w-full"
              size="lg"
            >
              {isStartingTrial ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting Trial...
                </>
              ) : (
                'Start Free Trial'
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              No credit card required. Cancel anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User needs subscription (trial expired or no access)
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Subscription Required</h2>
        <p className="text-muted-foreground">
          {status === 'expired' 
            ? 'Your trial has expired. Subscribe to continue accessing dashboard features.'
            : 'A subscription is required to access dashboard features.'
          }
        </p>
      </div>
      
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-500" />
            <span>Choose Your Plan</span>
          </CardTitle>
          <CardDescription>
            Select a subscription plan to unlock all features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Unlimited AI analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Advanced analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Export capabilities</span>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push('/prices')}
            className="w-full"
            size="lg"
          >
            View Pricing Plans
          </Button>
          
          {status === 'expired' && (
            <p className="text-xs text-muted-foreground text-center">
              Your trial data is safely stored and will be available after subscription.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}