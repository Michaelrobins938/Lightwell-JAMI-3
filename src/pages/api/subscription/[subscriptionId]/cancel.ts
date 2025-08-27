import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { prisma } from '../../../../lib/prisma';
import Stripe from 'stripe';
import { SubscriptionService } from '../../../../services/subscriptionService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  if (req.method === 'POST') {
    try {
      const { subscriptionId } = req.query;

      // Get subscription from database
      const subscription = await prisma.userSubscription.findUnique({
        where: { id: subscriptionId as string },
      });

      if (!subscription) {
        return res.status(404).json({ error: { message: 'Subscription not found' } });
      }

      // Check if user owns this subscription
      if (subscription.userId !== session.user.id) {
        return res.status(403).json({ error: { message: 'Forbidden' } });
      }

      // Cancel subscription at period end
      const stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId!,
        {
          cancel_at_period_end: true,
        }
      );

      // Update subscription in database
      const updatedSubscription = await prisma.userSubscription.update({
        where: { id: subscriptionId as string },
        data: {
          status: stripeSubscription.status as any,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          updatedAt: new Date(),
        },
      });

      res.status(200).json(updatedSubscription);
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: { message: errorMessage } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}