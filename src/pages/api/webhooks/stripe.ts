import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { prisma } from '../../../lib/prisma';
import { SubscriptionService } from '../../../services/subscriptionService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let event: Stripe.Event;

    try {
      const buf = await buffer(req);
      const sig = req.headers['stripe-signature']!;

      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          
          // Find existing subscription by Stripe subscription ID
          const existingSubscription = await prisma.userSubscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (existingSubscription) {
            // Update existing subscription
            await prisma.userSubscription.update({
              where: { id: existingSubscription.id },
              data: {
                status: subscription.status,
                currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
              },
            });
          } else if (event.type !== 'customer.subscription.deleted') {
            // For new subscriptions, we need to find the user by customer ID
            // Since User model doesn't have stripeCustomerId, we'll need to handle this differently
            // For now, we'll create a placeholder subscription that can be linked later
            const priceId = subscription.items.data[0]?.price.id;
            let tierId = 'custom';
            
            // Try to match price ID to known tiers
            const allTiers = SubscriptionService.getAllTiers();
            for (const tier of allTiers) {
              if (tier.stripePriceId === priceId) {
                tierId = tier.id;
                break;
              }
            }
            
            // Note: This will fail without a valid userId - the user needs to be linked first
            console.warn('New subscription created but no user linked. Customer ID:', subscription.customer);
          }
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          
          if ((invoice as any).subscription) {
            // Find subscription and update payment status
            const subscription = await prisma.userSubscription.findFirst({
              where: { stripeSubscriptionId: (invoice as any).subscription as string },
            });

            if (subscription) {
              // Update subscription status if needed
              await prisma.userSubscription.update({
                where: { id: subscription.id },
                data: {
                  status: 'active',
                },
              });
            }
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error('Error processing webhook:', err);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}