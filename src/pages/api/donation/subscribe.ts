import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, userEmail, userName, amount, currency, frequency } = req.body;

      // Create or retrieve Stripe customer
      let customer;
      try {
        customer = await stripe.customers.create({
          email: userEmail,
          name: userName,
          metadata: {
            userId: userId,
          },
        });
      } catch (err) {
        console.error('Error creating customer:', err);
        return res.status(500).json({ error: { message: 'Failed to create customer' } });
      }

      // Create product for donation
      const product = await stripe.products.create({
        name: `Luna AI Donation (${frequency})`,
        description: `Recurring donation to support Luna AI development (${frequency})`,
      });

      // Create price for donation
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount, // amount is already in cents
        currency: currency || 'usd',
        recurring: { 
          interval: frequency === 'yearly' ? 'year' : 'month' 
        },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      if (subscription.latest_invoice && (subscription.latest_invoice as any).payment_intent) {
        const paymentIntent = (subscription.latest_invoice as any).payment_intent;
        
        return res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          subscriptionId: subscription.id,
        });
      } else {
        return res.status(500).json({ error: { message: 'Failed to create subscription' } });
      }
    } catch (err) {
      console.error('Error creating donation subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return res.status(500).json({ error: { message: errorMessage } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}