import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';
import Stripe from 'stripe';
import { SubscriptionService } from '../../../services/subscriptionService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, tierId, amount, currency, isCustomAmount } = req.body;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: { message: 'User not found' } });
      }

      let customerId = user.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.name || undefined,
          metadata: {
            userId: user.id,
          },
        });

        customerId = customer.id;

        // Update user with Stripe customer ID
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      }

      // For custom amounts, we need to create a product and price
      let priceId: string;
      
      if (isCustomAmount) {
        // Create product for custom subscription
        const product = await stripe.products.create({
          name: `Custom Subscription for ${user.name || user.email}`,
          description: 'Custom monthly subscription',
        });

        // Create price for custom amount
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: amount, // amount is already in cents
          currency: currency || 'usd',
          recurring: { interval: 'month' },
        });

        priceId = price.id;
      } else {
        // Use predefined tier price ID
        const tier = SubscriptionService.getTier(tierId);
        if (!tier) {
          return res.status(400).json({ error: { message: 'Invalid subscription tier' } });
        }
        priceId = tier.stripePriceId;
      }

      // Create Stripe subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // If subscription was created successfully, save to database
      if (subscription.latest_invoice && (subscription.latest_invoice as any).payment_intent) {
        const paymentIntent = (subscription.latest_invoice as any).payment_intent;
        
        // Create subscription in our database
        const userSubscription = await SubscriptionService.createSubscription(
          userId,
          isCustomAmount ? 'custom' : tierId,
          customerId
        );

        return res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          subscriptionId: userSubscription.id,
        });
      } else {
        return res.status(500).json({ error: { message: 'Failed to create subscription' } });
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return res.status(500).json({ error: { message: errorMessage } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}