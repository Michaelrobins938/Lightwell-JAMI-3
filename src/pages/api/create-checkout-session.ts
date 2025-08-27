import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { amount, isMonthly, planName, planId } = req.body;

      // Determine if this is a subscription or donation
      const isSubscription = planName && planId;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: isSubscription 
                  ? `Luna ${planName} Plan - ${isMonthly ? 'Monthly' : 'Yearly'} Subscription`
                  : (isMonthly ? 'Monthly Donation to Luna' : 'One-time Donation to Luna'),
                description: isSubscription
                  ? `Access to Luna's ${planName} mental health features`
                  : undefined,
              },
              unit_amount: amount * 100, // Stripe uses cents
              recurring: isSubscription || isMonthly ? { 
                interval: isMonthly ? 'month' : 'year' 
              } : undefined,
            },
            quantity: 1,
          },
        ],
        mode: (isSubscription || isMonthly) ? 'subscription' : 'payment',
        success_url: `${req.headers.origin}/${isSubscription ? 'onboarding?plan=' + planName.toLowerCase() : 'donation-success'}`,
        cancel_url: `${req.headers.origin}/${isSubscription ? '/' : 'support-us'}`,
        metadata: isSubscription ? {
          planName,
          planId,
          isSubscription: 'true'
        } : undefined,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}