# Luna AI Subscription and Donation System

This document explains how to use and manage the new subscription and donation features for Luna AI.

## Features Implemented

### 1. Swipe Subscriptions
- Users can subscribe to different tiers (Premium, Professional, Enterprise)
- Supports custom pricing options
- Integrated with Stripe for secure payment processing
- Recurring billing with automatic renewal

### 2. Donation Subscriptions
- One-time and recurring donation options
- Flexible pricing with preset amounts or custom values
- Monthly or yearly recurring options
- Integrated with Stripe for secure payment processing

### 3. Subscription Management
- User dashboard for viewing current subscription status
- Ability to cancel or resume subscriptions
- Usage tracking and analytics
- Automatic renewal management

## Components

### SwipeSubscriptionForm.tsx
A form component for creating new swipe subscriptions with tier selection.

### DonationSubscriptionForm.tsx
A form component for creating donation subscriptions with flexible pricing.

### SubscriptionChoice.tsx
A modal component that allows users to choose between swipe subscriptions and donation subscriptions.

### SubscriptionManagement.tsx
A dashboard component for users to manage their existing subscriptions.

## API Routes

### `/api/subscription/create`
Creates a new subscription with Stripe integration.

### `/api/donation/subscribe`
Creates a new donation subscription with Stripe integration.

### `/api/webhooks/stripe`
Handles Stripe webhook events for subscription lifecycle management.

### `/api/subscription/user/[userId]`
Retrieves a user's subscription information.

### `/api/subscription/[subscriptionId]/cancel`
Cancels a subscription at the end of the billing period.

### `/api/subscription/[subscriptionId]/resume`
Resumes a cancelled subscription.

## Environment Variables

Make sure to set the following environment variables:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Setup Instructions

1. Install required dependencies:
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js stripe micro
```

2. Configure Stripe in your environment variables

3. Set up Stripe webhooks in your Stripe Dashboard:
   - Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

4. Import and use the components in your application:

```jsx
// For subscription choice modal
import { SubscriptionChoice } from '@/components/SubscriptionChoice';

// For subscription management dashboard
import { SubscriptionManagement } from '@/components/SubscriptionManagement';

// For donation options
import { DonationOptions } from '@/components/DonationOptions';
```

## Testing

To test the subscription system:

1. Use Stripe's test cards:
   - `4242 4242 4242 4242` for successful payments
   - `4000 0000 0000 0002` for declined payments

2. Test webhook events using the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Security Considerations

1. All API routes are protected with authentication checks
2. Webhook signatures are verified to prevent unauthorized requests
3. User data is validated before processing payments
4. Sensitive information is stored securely using Prisma ORM