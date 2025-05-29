import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';

interface UserData {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  trial_start_date: string;
  trial_expires_at: string;
  trial_used: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // TODO: Replace with Firebase implementation
    // Mock user data for now
    const userData: UserData = {
      id: userId,
      email: 'user@example.com',
      stripe_customer_id: null,
      trial_start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      trial_expires_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      trial_used: false
    };
    
    console.log('TODO: Get user data from Firebase:', userId);

    // Check if trial has actually expired
    const now = new Date();
    const trialExpiry = userData.trial_expires_at ? new Date(userData.trial_expires_at) : null;
    
    if (!trialExpiry || now < trialExpiry) {
      return res.status(400).json({ error: 'Trial has not expired yet' });
    }

    // Check if user already has a Stripe customer
    let customerId: string;

    if (!userData.stripe_customer_id) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          userId: userData.id,
          source: 'auto_subscribe_after_trial'
        }
      });
      customerId = customer.id;

      // TODO: Replace with Firebase implementation
      console.log('TODO: Update user with Stripe customer ID in Firebase:', {
        userId,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString()
      });
    } else {
      customerId = userData.stripe_customer_id;
    }

    // Create Stripe checkout session for basic plan
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_BASIC_PRICE_ID, // You'll need to set this
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      metadata: {
        userId: userData.id,
        source: 'auto_subscribe_after_trial'
      },
      subscription_data: {
        metadata: {
          userId: userData.id,
          source: 'auto_subscribe_after_trial'
        }
      }
    });

    // TODO: Replace with Firebase implementation
    console.log('TODO: Mark trial as used in Firebase:', {
      userId,
      trial_used: true,
      updated_at: new Date().toISOString()
    });

    return res.status(200).json({ 
      success: true, 
      checkoutUrl: session.url,
      message: 'Trial expired. Please complete subscription setup.'
    });

  } catch (error) {
    console.error('Error in auto-subscribe:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
