import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// Define Stripe Price IDs from environment variables with validation
export const PRICE_IDS = {
  CREATOR_SPARK_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_MONTHLY || '',
  CREATOR_SPARK_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CREATOR_SPARK_YEARLY || '',
  VIRAL_PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_MONTHLY || '',
  VIRAL_PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_VIRAL_PRO_YEARLY || '',
} as const;

// Validate required price IDs are set
Object.entries(PRICE_IDS).forEach(([key, value]) => {
  if (!value || !value.startsWith('price_')) {
    throw new Error(`Invalid or missing Stripe price ID for ${key}`);
  }
});

// Helper function to get the Stripe Price ID based on plan name and billing cycle
export const getStripePriceId = (planName: string, billingCycle: 'monthly' | 'yearly'): string => {
  if (planName === 'Creator Spark') {
    return billingCycle === 'monthly' ? PRICE_IDS.CREATOR_SPARK_MONTHLY : PRICE_IDS.CREATOR_SPARK_YEARLY;
  }
  if (planName === 'Viral Pro') {
    return billingCycle === 'monthly' ? PRICE_IDS.VIRAL_PRO_MONTHLY : PRICE_IDS.VIRAL_PRO_YEARLY;
  }
  throw new Error(`Invalid plan name: ${planName}`);
};

// Helper function to format amounts (Stripe uses cents)
export const formatAmountForStripe = (amount: number, currency: string): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};
