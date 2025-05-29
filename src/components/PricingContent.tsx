'use client';

import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { getAuth } from 'firebase/auth';

console.log('🔍 [STRIPE DEBUG] Environment check:', {
  key_exists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  key_length: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0,
  key_prefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) || 'MISSING'
});

let stripePromise: Promise<any> | null = null;

try {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'pk_test_your_stripe_publishable_key_here') {
    console.warn('⚠️ [STRIPE DEBUG] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing or placeholder');
    stripePromise = null;
  } else {
    console.log('✅ [STRIPE DEBUG] Initializing Stripe with key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 7) + '...');
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
} catch (error) {
  console.error('❌ [STRIPE DEBUG] Failed to initialize Stripe:', error);
  stripePromise = null;
}

const plansData = [
  {
    name: 'Creator Spark',
    priceMonthly: 15,
    priceYearly: 144, // (€12/mo)
    features: [
      'Basic YouTube SEO Analysis (10 videos/mo)',
      'Limited AI Content Idea Generation',
      'Basic Trend Spotting',
      'Standard Email Support',
    ],
    cta: 'Get Started Free',
    color: 'blue',
    isPopular: false,
  },
  {
    name: 'Viral Pro',
    priceMonthly: 40,
    priceYearly: 384, // (€32/mo)
    features: [
      'Advanced YouTube & Multi-Platform SEO (50 assets/mo)',
      'Full AI Content Generation Suite',
      'Predictive Virality Scoring',
      'In-depth Trend Analytics & Forecasting',
      'Priority Email & Chat Support',
      'Community Access',
    ],
    cta: 'Choose Pro Plan',
    color: 'teal',
    isPopular: true,
  },
  {
    name: 'Enterprise Scale',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'All Viral Pro Features, Unlimited Usage',
      'Custom LLM Model Training',
      'Dedicated Account Manager & AI Strategist',
      'API Access & Custom Integrations',
      'Advanced Security & Compliance Options',
      'Team Collaboration Tools',
      '24/7 Premium Support',
    ],
    cta: 'Contact Sales',
    color: 'magenta',
    isPopular: false,
  },
];

const PricingContent: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetStarted = async (planName: string) => {
    console.log('🚀 [STRIPE DEBUG] handleGetStarted called for plan:', planName);
    
    if (planName === 'Enterprise Scale') {
      window.location.href = '/contact?subject=Enterprise%20Inquiry';
      return;
    }

    if (!stripePromise) {
      console.error('❌ [STRIPE DEBUG] Stripe is not initialized');
      toast({
        title: 'Payment System Setup Required',
        description: 'Please configure your Stripe keys to enable payments. Check the console for setup instructions.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(planName);

    try {
      // Get the current user's ID token
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to subscribe to a plan.',
          variant: 'destructive',
        });
        window.location.href = '/auth?redirect=/prices';
        return;
      }

      const idToken = await currentUser.getIdToken();
      
      console.log('📡 [STRIPE DEBUG] Creating checkout session for:', { planName, billingCycle });
      
      // Add timeout for API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          planName,
          billingCycle,
        }),
        signal: controller.signal,
      });
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      const responseData = await response.json();
      console.log('📋 [STRIPE DEBUG] Checkout session response:', responseData);

      const { sessionId, error, details } = responseData;

      if (error) {
        console.error('❌ [STRIPE DEBUG] Error creating checkout session:', error, details);
        toast({
          title: 'Error',
          description: details || error || 'Could not create checkout session. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(null);
        return;
      }

      console.log('✅ [STRIPE DEBUG] Checkout session created, sessionId:', sessionId);
      console.log('🔄 [STRIPE DEBUG] Loading Stripe instance...');
      
      const stripe = await stripePromise;
      console.log('🎯 [STRIPE DEBUG] Stripe instance loaded:', !!stripe);
      
      if (stripe && sessionId) {
        console.log('↗️ [STRIPE DEBUG] Redirecting to checkout...');
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        if (stripeError) {
          console.error('❌ [STRIPE DEBUG] Stripe redirect error:', stripeError);
          toast({
            title: 'Stripe Error',
            description: stripeError.message || 'Could not redirect to Stripe. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
         console.error('❌ [STRIPE DEBUG] Missing requirements:', { stripe: !!stripe, sessionId });
         throw new Error('Stripe.js or session ID not available');
      }
    } catch (err: any) {
      console.error('❌ [STRIPE DEBUG] Failed to process payment:', err);
      toast({
        title: 'Payment Error',
        description: err.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  const getColorClasses = (color: string, popular: boolean) => {
    let baseBorder = 'border-border';
    let hoverBorder = 'hover:border-primary';
    let popularRing = popular ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '';
    let buttonBg = 'bg-primary hover:bg-primary/90';
    let buttonText = 'text-primary-foreground';
    let hoverGlow = 'hover:shadow-glow';

    if (popular) {
      hoverBorder = 'hover:border-primary';
      buttonBg = 'bg-primary hover:bg-primary/90';
      hoverGlow = 'hover:shadow-glow';
    } else {
      switch (color) {
        case 'blue':
          hoverBorder = 'hover:border-neonBlue-500';
          buttonBg = 'bg-neonBlue-500 hover:bg-neonBlue-500/90';
          hoverGlow = 'hover:shadow-glow-blue';
          break;
        case 'magenta':
          hoverBorder = 'hover:border-neonMagenta-500';
          buttonBg = 'bg-neonMagenta-500 hover:bg-neonMagenta-500/90';
          hoverGlow = 'hover:shadow-glow-magenta';
          break;
        default:
          hoverBorder = 'hover:border-neonTeal-500';
          buttonBg = 'bg-neonTeal-500 hover:bg-neonTeal-500/90';
          hoverGlow = 'hover:shadow-glow';
      }
    }
    return { baseBorder, hoverBorder, popularRing, buttonBg, buttonText, hoverGlow };
  };

  return (
    <div className="min-h-screen text-foreground pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Flexible Plans for <span className="text-primary">Viral Success</span>
          </h1>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg">
            Choose the TrueViral.ai plan that aligns with your content goals and budget. Unlock the power of AI today.
          </p>
          <div className="inline-flex rounded-md shadow-sm bg-secondary p-1 mb-0" role="group">
            <button
              className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${billingCycle === 'monthly' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-md transition-all duration-200
                ${billingCycle === 'yearly' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plansData.map((plan) => {
            const { baseBorder, hoverBorder, popularRing, buttonBg, buttonText, hoverGlow } = getColorClasses(plan.color, plan.isPopular);
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col bg-card ${baseBorder} rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 group ${hoverBorder} ${popularRing} ${plan.isPopular ? 'border-primary' : ''} ${hoverGlow}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground bg-primary rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className={`text-xl sm:text-2xl font-semibold mb-2 ${plan.isPopular ? 'text-primary' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-extrabold mb-4 flex items-baseline">
                    {plan.name === 'Enterprise Scale' ? (
                      <span className="text-foreground">Custom</span>
                    ) : (
                      <>
                        <span className="text-foreground">€{price}</span>
                        <span className="text-sm font-medium text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </>
                    )}
                  </div>
                  {plan.name !== 'Enterprise Scale' && billingCycle === 'yearly' && (
                     <p className="text-xs text-muted-foreground mb-4">
                       Billed as €{plan.priceYearly} per year.
                     </p>
                  )}
                  <ul className="mb-8 space-y-3 text-left text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-neonGreen-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 ${buttonBg} ${buttonText} hover:opacity-90 flex items-center justify-center`}
                  onClick={() => handleGetStarted(plan.name)}
                  disabled={isLoading === plan.name}
                >
                  {isLoading === plan.name ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
         <p className="text-right text-muted-foreground text-xs mt-12">
            All prices are in EUR. Yearly plans offer a 20% discount compared to monthly billing.
            <Link href="/contact" className="text-primary hover:underline ml-1">Contact us</Link> for custom enterprise solutions.
          </p>
      </div>
    </div>
  );
};

export default PricingContent;
