import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { createAdminClient } from '../../../lib/supabaseAdmin';

// Disable Next.js body parsing for this route, as Stripe requires the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'POST').json({ error: 'Method Not Allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Webhook Error: Missing Stripe signature or webhook secret.');
    return res.status(400).json({ error: 'Webhook Error: Missing Stripe signature or webhook secret.' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (relevantEvents.has(event.type)) {
    const supabaseAdmin = createAdminClient();

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const subscriptionId = session.subscription;
          const customerId = session.customer;
          const supabaseUserId = session.metadata?.supabase_user_id;
          const planName = session.metadata?.plan_name;
          const billingCycle = session.metadata?.billing_cycle;

          if (!subscriptionId || !customerId || !supabaseUserId || !planName || !billingCycle) {
            console.error('Webhook Error: Missing metadata in checkout.session.completed', session);
            throw new Error('Missing metadata in checkout.session.completed');
          }

          // TODO: Replace with Firebase implementation
          // Update or insert user record in users table
          console.log('TODO: Store subscription in Firebase:', {
            id: supabaseUserId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_subscription_status: 'active',
            stripe_subscription_plan: planName,
            stripe_subscription_period: billingCycle,
            updated_at: new Date().toISOString(),
          });

          console.log(`User ${supabaseUserId} subscribed to ${planName} (${billingCycle}).`);
          break;
        }

        case 'customer.subscription.updated':
        case 'customer.subscription.created':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const status = subscription.status;

          // TODO: Replace with Firebase implementation
          // Find user by Stripe customer ID
          console.log('TODO: Find user in Firebase by customer ID:', customerId);
          
          // Mock user for now to prevent errors
          const user = {
            id: 'mock-user-id',
            stripe_subscription_plan: 'mock-plan',
            stripe_subscription_period: 'monthly'
          };

          // Update subscription status in users table
          const updateData: any = {
            stripe_subscription_id: subscription.id,
            stripe_subscription_status: status,
            updated_at: new Date().toISOString(),
          };

          // If subscription is deleted, clear subscription data
          if (event.type === 'customer.subscription.deleted') {
            updateData.stripe_subscription_id = null;
            updateData.stripe_subscription_plan = null;
            updateData.stripe_subscription_period = null;
          }

          // TODO: Replace with Firebase implementation
          console.log('TODO: Update user subscription in Firebase:', {
            userId: user.id,
            updateData: updateData
          });

          console.log(`Subscription ${subscription.id} for user ${user.id} updated to ${status}.`);
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;

          // TODO: Replace with Firebase implementation
          // Find user and update subscription status to active if it was past_due
          console.log('TODO: Find user in Firebase for invoice payment:', customerId);
          
          // Mock user for now
          const user = {
            id: 'mock-user-id',
            stripe_subscription_status: 'past_due'
          };
          if (user.stripe_subscription_status === 'past_due') {
            console.log('TODO: Update user subscription status to active in Firebase:', {
              userId: user.id,
              status: 'active',
              updated_at: new Date().toISOString()
            });
            
            console.log(`Payment succeeded for user ${user.id}, subscription reactivated.`);
          }

          console.log('Invoice payment succeeded:', invoice.id);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;

          // TODO: Replace with Firebase implementation
          // Find user and update subscription status to past_due
          console.log('TODO: Find user in Firebase by customer ID:', customerId);
          
          // Mock user for now
          const user = { id: 'mock-user-id' };
          
          console.log('TODO: Update user subscription status to past_due in Firebase:', {
            userId: user.id,
            status: 'past_due',
            updated_at: new Date().toISOString()
          });
          
          console.log(`Payment failed for user ${user.id}, subscription marked as past_due.`);

          console.log('Invoice payment failed:', invoice.id);
          break;
        }

        default:
          console.warn(`Unhandled relevant event type: ${event.type}`);
      }
    } catch (error: any) {
      console.error('Webhook handler error:', error.message, error);
      return res.status(500).json({ error: 'Webhook handler failed.', details: error.message });
    }
  }

  res.status(200).json({ received: true });
}
