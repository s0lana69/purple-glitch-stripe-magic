import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe, getStripePriceId } from '@/lib/stripe';
import { adminAuth } from '@/lib/firebaseAdmin';
import type { DecodedIdToken, Auth } from 'firebase-admin/auth';

type ErrorResponse = {
  error: string;
  details?: string;
};

const MAX_RETRIES = 2;
const RETRY_DELAY_BASE = 2000; // 2 second base delay
const API_TIMEOUT = 25000; // 25 second timeout

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Set up timeout for the operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${API_TIMEOUT}ms`)), API_TIMEOUT);
      });
      
      // Race between the operation and the timeout
      return await Promise.race([
        operation(),
        timeoutPromise
      ]);
    } catch (error: any) {
      lastError = error;
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error.message);
      
      if (attempt === maxRetries) break;
      
      // Exponential backoff
      const delay = RETRY_DELAY_BASE * Math.pow(2, attempt);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ sessionId: string } | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get Firebase ID token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authentication Required',
      details: 'Please sign in to continue with your subscription.'
    });
  }

  try {
    // Verify Firebase token with retries
    const token = authHeader.split('Bearer ')[1];
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await retryOperation(async () => {
        return await adminAuth.verifyIdToken(token);
      });
    } catch (error: any) {
      console.error('Failed to verify Firebase token:', error);
      return res.status(401).json({
        error: 'Authentication Failed',
        details: error.code === 'auth/id-token-expired' 
          ? 'Your session has expired. Please sign in again.'
          : 'Please sign in again to continue.'
      });
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return res.status(400).json({
        error: 'Invalid User Profile',
        details: 'User email is required for subscription.'
      });
    }

    const { planName, billingCycle } = req.body;

    if (!planName || !billingCycle) {
      return res.status(400).json({ 
        error: 'Missing Required Fields',
        details: 'Plan name and billing cycle are required.'
      });
    }

    const priceId = getStripePriceId(planName, billingCycle);
    
    if (!priceId || priceId.includes('placeholder')) {
      console.error('Invalid price ID:', { priceId, planName, billingCycle });
      return res.status(400).json({ 
        error: 'Invalid Plan Configuration',
        details: 'The selected plan is not properly configured. Please contact support.'
      });
    }

    // Get or create Stripe customer with retries
    const customer = await retryOperation(async () => {
      const customers = await stripe.customers.list({ 
        email: userEmail,
        limit: 1 
      });
      
      if (customers.data.length > 0) {
        const existingCustomer = customers.data[0];
        // Update customer metadata if needed
        if (!existingCustomer.metadata?.firebaseUID || existingCustomer.metadata.firebaseUID !== userId) {
          return await stripe.customers.update(existingCustomer.id, {
            metadata: { firebaseUID: userId }
          });
        }
        return existingCustomer;
      }
      
      return await stripe.customers.create({
        email: userEmail,
        metadata: { firebaseUID: userId }
      });
    });

    // Get the base URL, ensuring it has the proper scheme
    const baseUrl = req.headers.origin || 
                   (req.headers.host ? `https://${req.headers.host}` : 'https://trueviral.ai');
    
    // Ensure the URL starts with https://
    const safeBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
    
    console.log('🔗 [STRIPE] Creating checkout session:', {
      customerId: customer.id,
      priceId,
      planName,
      billingCycle
    });

    // Create checkout session with retries
    const session = await retryOperation(async () => {
      return await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${safeBaseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${safeBaseUrl}/prices?canceled=true`,
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        metadata: {
          firebaseUID: userId,
          planName,
          billingCycle,
        },
        subscription_data: {
          metadata: {
            firebaseUID: userId
          },
          trial_period_days: 14 // 14-day free trial
        }
      });
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe checkout session creation error:', err);
    
    // Handle specific Stripe errors
    if (err.type?.startsWith('Stripe')) {
      const errorMap: Record<string, { status: number, message: string }> = {
        'StripeInvalidRequestError': {
          status: 400,
          message: 'The request to our payment processor was invalid.'
        },
        'StripeAuthenticationError': {
          status: 500,
          message: 'There was an issue with our payment processor configuration.'
        },
        'StripeAPIError': {
          status: 500,
          message: 'Our payment processor is experiencing issues.'
        },
        'StripeConnectionError': {
          status: 503,
          message: 'Could not connect to our payment processor.'
        },
        'StripeRateLimitError': {
          status: 429,
          message: 'Too many requests to our payment processor.'
        }
      };

      const errorInfo = errorMap[err.type] || {
        status: 500,
        message: 'An unexpected payment processor error occurred.'
      };

      return res.status(errorInfo.status).json({
        error: errorInfo.message,
        details: err.message
      });
    }
    
    // Handle Firebase auth errors
    if (err.code?.startsWith('auth/')) {
      const isExpiredToken = err.code === 'auth/id-token-expired';
      return res.status(401).json({
        error: 'Authentication Failed',
        details: isExpiredToken ? 
          'Your session has expired. Please sign in again.' :
          'Please sign in again to continue.'
      });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'Failed to create checkout session.',
      details: 'An unexpected error occurred. Please try again later.'
    });
  }
}
