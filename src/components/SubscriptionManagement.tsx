"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SubscriptionService, SUBSCRIPTION_TIERS } from '../../services/subscriptionService';

interface UserSubscription {
  id: string;
  tierId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null;
  usage: string;
}

interface Props {
  userId: string;
}

export const SubscriptionManagement: React.FC<Props> = ({ userId }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [userId]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subscription/user/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSubscription(data);
      } else {
        setError(data.error?.message || 'Failed to fetch subscription');
      }
    } catch (err) {
      setError('An error occurred while fetching subscription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      setIsCancelling(true);
      const response = await fetch(`/api/subscription/${subscription.id}/cancel`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSubscription(data);
      } else {
        setError(data.error?.message || 'Failed to cancel subscription');
      }
    } catch (err) {
      setError('An error occurred while cancelling subscription');
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (!subscription) return;

    try {
      const response = await fetch(`/api/subscription/${subscription.id}/resume`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSubscription(data);
      } else {
        setError(data.error?.message || 'Failed to resume subscription');
      }
    } catch (err) {
      setError('An error occurred while resuming subscription');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 101.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const tier = subscription ? SUBSCRIPTION_TIERS.find(t => t.id === subscription.tierId) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
      >
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Management</h2>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Manage your Luna AI subscription
              </p>
            </div>
            {subscription && tier && (
              <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-medium ${
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : subscription.status === 'past_due' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {subscription.status === 'active' ? 'Active' : 
                 subscription.status === 'past_due' ? 'Payment Due' : 
                 'Inactive'}
              </div>
            )}
          </div>

          {subscription && tier ? (
            <div className="space-y-8">
              {/* Subscription Overview */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier.name} Plan</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      ${tier.price.toFixed(2)}/month
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    {subscription.cancelAtPeriodEnd ? (
                      <div className="text-center">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Scheduled to cancel on {formatDate(subscription.currentPeriodEnd)}
                        </p>
                        <button
                          onClick={handleResumeSubscription}
                          disabled={isCancelling}
                          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          Resume Subscription
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Billing Period</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                      {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing Date</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subscription ID</p>
                    <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white truncate">
                      {subscription.stripeSubscriptionId || subscription.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage */}
              {subscription.usage && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Usage</h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {(() => {
                      try {
                        const usage = JSON.parse(subscription.usage);
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Conversations</p>
                              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                                {usage.dailyConversations || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Conversations</p>
                              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                                {usage.monthlyConversations || 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Last Reset</p>
                              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                                {usage.lastResetDate ? formatDate(usage.lastResetDate) : 'Never'}
                              </p>
                            </div>
                          </div>
                        );
                      } catch (e) {
                        return <p className="text-gray-500 dark:text-gray-400">Usage data unavailable</p>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Active Subscription</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                You don't have an active subscription. Subscribe to unlock premium features.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Plans
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};