import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { 
  SubscriptionTier, 
  UserSubscription, 
  SubscriptionUsage, 
  SubscriptionValidation,
  SubscriptionAnalytics,
  EnterpriseSubscription
} from '../types/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Predefined subscription tiers
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      '5 daily conversations with Jamie',
      'Basic mood tracking',
      'Journal prompts',
      'Community access'
    ],
    limits: {
      dailyConversations: 5,
      aiFeatures: false,
      therapistAccess: false,
      analytics: false,
      crisisIntervention: false,
      customTherapeuticPlans: false,
      whiteLabelAccess: false,
      prioritySupport: false,
    },
    stripePriceId: '',
    description: 'Get started with basic mental health support'
  },
  {
    id: 'premium',
    name: 'Premium Therapy',
    price: 19.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited conversations with Jamie',
      'Advanced therapeutic techniques',
      'Personalized insights',
      'Crisis intervention',
      'Progress analytics',
      'Priority support'
    ],
    limits: {
      dailyConversations: -1, // Unlimited
      aiFeatures: true,
      therapistAccess: false,
      analytics: true,
      crisisIntervention: true,
      customTherapeuticPlans: false,
      whiteLabelAccess: false,
      prioritySupport: true,
    },
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
    description: 'Advanced AI therapy with personalized support',
    popular: true
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49.99,
    billingCycle: 'monthly',
    features: [
      'Everything in Premium',
      'Therapist marketplace access',
      'Professional handoff capabilities',
      'Advanced AI features',
      'Custom therapeutic plans',
      'Priority support'
    ],
    limits: {
      dailyConversations: -1,
      aiFeatures: true,
      therapistAccess: true,
      analytics: true,
      crisisIntervention: true,
      customTherapeuticPlans: true,
      whiteLabelAccess: false,
      prioritySupport: true,
    },
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
    description: 'Professional-grade mental health support'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    billingCycle: 'monthly',
    features: [
      'Everything in Professional',
      'White-label solutions',
      'Custom AI training',
      'HIPAA compliance',
      'Professional integration',
      'Analytics dashboard',
      'Dedicated support'
    ],
    limits: {
      dailyConversations: -1,
      aiFeatures: true,
      therapistAccess: true,
      analytics: true,
      crisisIntervention: true,
      customTherapeuticPlans: true,
      whiteLabelAccess: true,
      prioritySupport: true,
    },
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    description: 'Enterprise mental health platform'
  }
];

export class SubscriptionService {
  /**
   * Get subscription tier by ID
   */
  static getTier(tierId: string): SubscriptionTier | undefined {
    return SUBSCRIPTION_TIERS.find(tier => tier.id === tierId);
  }

  /**
   * Get all available tiers
   */
  static getAllTiers(): SubscriptionTier[] {
    return SUBSCRIPTION_TIERS;
  }

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    return await prisma.userSubscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(
    userId: string,
    tierId: string,
    stripeCustomerId: string
  ): Promise<UserSubscription> {
    const tier = this.getTier(tierId);
    if (!tier) {
      throw new Error(`Invalid tier: ${tierId}`);
    }

    if (tier.price === 0) {
      // Free tier - create subscription without Stripe
      return await prisma.userSubscription.create({
        data: {
          userId,
          tierId,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: '',
          stripeCustomerId,
          usage: JSON.stringify({
            dailyConversations: 0,
            monthlyConversations: 0,
            lastResetDate: new Date()
          })
        }
      });
    }

    // Paid tier - create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: tier.stripePriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return await prisma.userSubscription.create({
      data: {
        userId,
        tierId,
        status: subscription.status as any,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId,
        usage: JSON.stringify({
          dailyConversations: 0,
          monthlyConversations: 0,
          lastResetDate: new Date()
        })
      }
    });
  }

  /**
   * Upgrade user subscription
   */
  static async upgradeSubscription(
    userId: string,
    newTierId: string
  ): Promise<UserSubscription> {
    const currentSubscription = await this.getUserSubscription(userId);
    if (!currentSubscription) {
      throw new Error('No active subscription found');
    }

    const newTier = this.getTier(newTierId);
    if (!newTier) {
      throw new Error(`Invalid tier: ${newTierId}`);
    }

    if (newTier.price === 0) {
      // Downgrading to free tier
      return await prisma.userSubscription.update({
        where: { id: currentSubscription.id },
        data: {
          tierId: newTierId,
          status: 'active',
          cancelAtPeriodEnd: false
        }
      });
    }

    if (!currentSubscription.stripeSubscriptionId) {
      throw new Error('No Stripe subscription ID found for this user.');
    }
    // Upgrade to paid tier
    const subscription = await stripe.subscriptions.update(
      currentSubscription.stripeSubscriptionId,
      {
        items: [{ price: newTier.stripePriceId }],
        proration_behavior: 'create_prorations',
      }
    );

    return await prisma.userSubscription.update({
      where: { id: currentSubscription.id },
      data: {
        tierId: newTierId,
        status: subscription.status as any,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(userId: string): Promise<UserSubscription> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new Error('No Stripe subscription ID found for this user.');
    }
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true
      }
    });
  }

  /**
   * Track usage for a user
   */
  static async trackUsage(
    userId: string,
    usageType: 'conversation' | 'aiFeature' | 'therapistSession' | 'crisisIntervention'
  ): Promise<void> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const tier = this.getTier(subscription.tierId);
    if (!tier) {
      throw new Error('Invalid subscription tier');
    }

    // Parse current usage from JSON
    const currentUsage = JSON.parse(subscription.usage);
    const today = new Date();
    const lastReset = new Date(currentUsage.lastResetDate);
    
    if (today.getDate() !== lastReset.getDate() || 
        today.getMonth() !== lastReset.getMonth() || 
        today.getFullYear() !== lastReset.getFullYear()) {
      // Reset daily usage
      const resetUsage = {
        dailyConversations: 0,
        monthlyConversations: currentUsage.monthlyConversations,
        lastResetDate: today.toISOString()
      };
      
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: {
          usage: JSON.stringify(resetUsage)
        }
      });
    }

    // Update usage based on type
    let updatedUsage = { ...currentUsage };
    if (usageType === 'conversation') {
      updatedUsage = {
        dailyConversations: currentUsage.dailyConversations + 1,
        monthlyConversations: currentUsage.monthlyConversations + 1,
        lastResetDate: currentUsage.lastResetDate
      };
    }

    await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: {
        usage: JSON.stringify(updatedUsage)
      }
    });

    // Log usage for analytics
    await prisma.subscriptionUsage.create({
      data: {
        userId,
        tierId: subscription.tierId,
        date: today,
        aiFeaturesUsed: usageType === 'aiFeature' ? 1 : 0,
        therapistSessionsUsed: usageType === 'therapistSession' ? 1 : 0,
        crisisInterventionsUsed: usageType === 'crisisIntervention' ? 1 : 0
      }
    });
  }

  /**
   * Validate user's access to a feature
   */
  static async validateFeatureAccess(
    userId: string,
    feature: keyof SubscriptionTier['limits']
  ): Promise<SubscriptionValidation> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) {
      return {
        isValid: false,
        canAccessFeature: false,
        remainingConversations: 0,
        nextBillingDate: new Date(),
        upgradeRecommendation: 'Subscribe to access this feature'
      };
    }

    const tier = this.getTier(subscription.tierId);
    if (!tier) {
      return {
        isValid: false,
        canAccessFeature: false,
        remainingConversations: 0,
        nextBillingDate: new Date(),
        upgradeRecommendation: 'Contact support for assistance'
      };
    }

    const canAccess = tier.limits[feature];
    let remainingConversations = 0;

    if (feature === 'dailyConversations') {
      // Parse usage JSON string
      const usage = JSON.parse(subscription.usage);
      remainingConversations = tier.limits.dailyConversations === -1 
        ? -1 
        : Math.max(0, tier.limits.dailyConversations - usage.dailyConversations);
    }

    return {
      isValid: subscription.status === 'active',
      canAccessFeature: !!canAccess,
      remainingConversations,
      nextBillingDate: subscription.currentPeriodEnd,
      upgradeRecommendation: !canAccess ? `Upgrade to ${this.getNextTier(tier.id)?.name || 'Premium'} to access this feature` : undefined
    };
  }

  /**
   * Get next tier for upgrade recommendations
   */
  private static getNextTier(currentTierId: string): SubscriptionTier | undefined {
    const currentIndex = SUBSCRIPTION_TIERS.findIndex(tier => tier.id === currentTierId);
    if (currentIndex === -1 || currentIndex === SUBSCRIPTION_TIERS.length - 1) {
      return undefined;
    }
    return SUBSCRIPTION_TIERS[currentIndex + 1];
  }

  /**
   * Get subscription analytics
   */
  static async getAnalytics(): Promise<SubscriptionAnalytics> {
    const subscriptions = await prisma.userSubscription.findMany({
      where: { status: 'active' }
    });

    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    
    const tierDistribution: { [key: string]: number } = {};
    const revenueByTier: { [key: string]: number } = {};

    subscriptions.forEach(sub => {
      const tier = this.getTier(sub.tierId);
      if (tier) {
        tierDistribution[sub.tierId] = (tierDistribution[sub.tierId] || 0) + 1;
        revenueByTier[sub.tierId] = (revenueByTier[sub.tierId] || 0) + tier.price;
      }
    });

    const monthlyRecurringRevenue = Object.values(revenueByTier).reduce((sum, revenue) => sum + revenue, 0);
    const averageRevenuePerUser = activeSubscriptions > 0 ? monthlyRecurringRevenue / activeSubscriptions : 0;

    return {
      totalSubscriptions,
      activeSubscriptions,
      monthlyRecurringRevenue,
      averageRevenuePerUser,
      churnRate: 0, // TODO: Calculate churn rate
      conversionRate: 0, // TODO: Calculate conversion rate
      tierDistribution,
      revenueByTier
    };
  }

  /**
   * Create enterprise subscription
   */
  static async createEnterpriseSubscription(
    organizationId: string,
    organizationName: string,
    tierId: string,
    userCount: number,
    customFeatures: string[],
    whiteLabelConfig: EnterpriseSubscription['whiteLabelConfig'],
    adminUsers: string[],
    billingContact: EnterpriseSubscription['billingContact']
  ): Promise<EnterpriseSubscription> {
    const tier = this.getTier(tierId);
    if (!tier || tier.id !== 'enterprise') {
      throw new Error('Enterprise subscription requires enterprise tier');
    }

    const parsedBillingContact = JSON.parse(billingContact);
    // Create Stripe customer for organization
    const customer = await stripe.customers.create({
      email: parsedBillingContact.email,
      name: organizationName,
      metadata: {
        organizationId,
      },
    });

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: tier.stripePriceId }],
      metadata: {
        organizationId,
        userCount: userCount.toString()
      }
    });

    return await prisma.enterpriseSubscription.create({
      data: {
        organizationId,
        organizationName,
        tierId,
        userCount,
        customFeatures: JSON.stringify(customFeatures),
        whiteLabelConfig: JSON.stringify(whiteLabelConfig),
        adminUsers: JSON.stringify(adminUsers),
        billingContact: JSON.stringify(billingContact),
        status: 'active',
      },
    });
  }
} 