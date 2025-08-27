export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: {
    dailyConversations: number;
    aiFeatures: boolean;
    therapistAccess: boolean;
    analytics: boolean;
    crisisIntervention: boolean;
    customTherapeuticPlans: boolean;
    whiteLabelAccess: boolean;
    prioritySupport: boolean;
  };
  stripePriceId: string;
  description: string;
  popular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tierId: string;
  status: string; // Changed from enum to string to match Prisma schema
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null; // Made nullable to match Prisma schema
  stripeCustomerId: string;
  usage: string; // Changed from object to string to match Prisma schema
}

export interface SubscriptionUsage {
  userId: string;
  tierId: string;
  date: Date;
  conversationsUsed: number;
  aiFeaturesUsed: number;
  therapistSessionsUsed: number;
  crisisInterventionsUsed: number;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  stripePaymentIntentId: string;
  description: string;
  createdAt: Date;
}

export interface SubscriptionUpgrade {
  fromTierId: string;
  toTierId: string;
  prorationAmount: number;
  effectiveDate: Date;
  reason: string;
}

export interface SubscriptionDowngrade {
  fromTierId: string;
  toTierId: string;
  effectiveDate: Date;
  reason: string;
}

export interface EnterpriseSubscription {
  id: string;
  organizationId: string;
  organizationName: string;
  tierId: string;
  userCount: number;
  customFeatures: string; // JSON string
  whiteLabelConfig: string; // JSON string
  adminUsers: string; // JSON string
  billingContact: string; // JSON string
  status: string;
  stripeSubscriptionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  conversionRate: number;
  tierDistribution: {
    [tierId: string]: number;
  };
  revenueByTier: {
    [tierId: string]: number;
  };
}

export interface SubscriptionLimits {
  dailyConversations: number;
  monthlyConversations: number;
  aiFeatures: boolean;
  therapistAccess: boolean;
  analytics: boolean;
  crisisIntervention: boolean;
  customTherapeuticPlans: boolean;
  whiteLabelAccess: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionValidation {
  isValid: boolean;
  canAccessFeature: boolean;
  remainingConversations: number;
  nextBillingDate: Date;
  upgradeRecommendation?: string;
  downgradeWarning?: string;
} 