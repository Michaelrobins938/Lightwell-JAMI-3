"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { SwipeSubscriptionForm } from './SwipeSubscriptionForm';
import { DonationSubscriptionForm } from './DonationSubscriptionForm';

// Make sure to add your Stripe publishable key to your environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionChoiceProps {
  userId: string;
  userEmail: string;
  userName?: string;
  onSubscriptionComplete: () => void;
  onModalClose: () => void;
}

export const SubscriptionChoice: React.FC<SubscriptionChoiceProps> = ({ 
  userId,
  userEmail,
  userName,
  onSubscriptionComplete,
  onModalClose
}) => {
  const [choice, setChoice] = useState<'swipe' | 'donation' | null>(null);

  const handleSwipeSubscriptionSuccess = () => {
    onSubscriptionComplete();
  };

  const handleDonationSubscriptionSuccess = () => {
    onSubscriptionComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-4xl"
      >
        {!choice ? (
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Support Luna AI</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Choose how you'd like to support our mission
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Swipe Subscription Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6 cursor-pointer bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800"
                onClick={() => setChoice('swipe')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Subscription</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get full access to Luna AI features with a monthly subscription
                  </p>
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-indigo-800 dark:text-indigo-200">
                      Starting at $19.99/month
                    </p>
                  </div>
                  <ul className="text-left text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Full access to all features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Donation Subscription Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 cursor-pointer bg-gradient-to-br from-purple-50 to-white dark:from-gray-700 dark:to-gray-800"
                onClick={() => setChoice('donation')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Donation</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Support Luna AI development with a recurring donation
                  </p>
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      Any amount, any frequency
                    </p>
                  </div>
                  <ul className="text-left text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Support open development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>No feature restrictions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Tax deductible</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onModalClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        ) : choice === 'swipe' ? (
          <Elements stripe={stripePromise}>
            <SwipeSubscriptionForm 
              userId={userId}
              onSuccess={handleSwipeSubscriptionSuccess}
              onCancel={() => setChoice(null)}
            />
          </Elements>
        ) : (
          <Elements stripe={stripePromise}>
            <DonationSubscriptionForm 
              userId={userId}
              userEmail={userEmail}
              userName={userName}
              onSuccess={handleDonationSubscriptionSuccess}
              onCancel={() => setChoice(null)}
            />
          </Elements>
        )}
      </motion.div>
    </div>
  );
};