import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '../../../../lib/prisma';
import Stripe from 'stripe';
import { SubscriptionService } from '../../../../services/subscriptionService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  if (req.method === 'GET') {
    try {
      // Get user's subscription
      const subscription = await SubscriptionService.getUserSubscription(session.user.id);

      if (!subscription) {
        return res.status(404).json({ error: { message: 'No subscription found' } });
      }

      res.status(200).json(subscription);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: { message: errorMessage } });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}