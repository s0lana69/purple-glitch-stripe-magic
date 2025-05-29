'use client';

import React from 'react';
import PricingContent from '@/components/PricingContent';
import { useAuth } from '@/context/FirebaseAuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthAwarePricing() {
  const { user } = useAuth();
  const { hasServiceAccess, loading, status, trial, startTrial } = useSubscription();
  const router = useRouter();
  const [isStartingTrial, setIsStartingTrial] = React.useState(false);

  // Handle trial start for new users
  const handleStartTrial = async () => {
    setIsStartingTrial(true);
    const success = await startTrial();
    setIsStartingTrial(false);
    
    if (success) {
      // Trial started successfully, redirect to dashboard
      router.push('/dashboard');
    } else {
      console.error('Failed to start trial');
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If user has access, show success message with link to dashboard (no auto-redirect)
  if (user && hasServiceAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mb-16">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-green-500">You're all set!</h2>
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
          <Button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </div>
        {/* Still show pricing for reference */}
        <PricingContent />
      </div>
    );
  }

  // If user is logged in but no access and is new user, show trial option
  if (user && status === null && !trial.startDate) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mb-16">
        <div className="max-w-md mx-auto space-y-6 mb-16">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome to TrueViral!</h2>
            <p className="text-muted-foreground">
              Start your free 2-day trial to access all dashboard features.
            </p>
          </div>
          
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
        {/* Show pricing plans below */}
        <PricingContent />
      </div>
    );
  }

  // For all other cases (no user, expired trial, etc.), just show pricing
  return <PricingContent />;
}