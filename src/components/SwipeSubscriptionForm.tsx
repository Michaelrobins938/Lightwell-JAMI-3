"use client";

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { SUBSCRIPTION_TIERS } from '../services/subscriptionService';

interface SwipeSubscriptionFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const SwipeSubscriptionForm: React.FC<SwipeSubscriptionFormProps> = ({ 
  userId, 
  onSuccess,
  onCancel
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customPrice, setCustomPrice] = useState<number>(25);

  const stripe = useStripe();
  const elements = useElements();

  const selectedTierData = SUBSCRIPTION_TIERS.find(tier => tier.id === selectedTier) || SUBSCRIPTION_TIERS[1];

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Get the amount based on selection
      const amount = isCustomizing ? customPrice : selectedTierData.price;

      // Create subscription with Stripe
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tierId: selectedTier,
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          isCustomAmount: isCustomizing
        }),
      });

      const { error, clientSecret } = await response.json();

      if (error) {
        setErrorMessage(error.message || 'An error occurred');
        setIsProcessing(false);
        return;
      }

      // Confirm the payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        setErrorMessage(stripeError.message || 'An error occurred with the payment');
      } else {
        // Handle successful subscription
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred.');
    }

    setIsProcessing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subscribe to Luna</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubscribe} className="space-y-6">
        {/* Subscription Tiers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select a Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBSCRIPTION_TIERS.filter(tier => tier.id !== 'free').map((tier) => (
              <motion.div
                key={tier.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTier === tier.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
                onClick={() => {
                  setSelectedTier(tier.id);
                  setIsCustomizing(false);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{tier.name}</h4>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      ${tier.price.toFixed(2)}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
                    </p>
                  </div>
                  {tier.popular && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Popular
                    </span>
                  )}
                </div>
                <ul className="mt-3 space-y-1">
                  {tier.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
            
            {/* Custom Amount Option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isCustomizing
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
              }`}
              onClick={() => setIsCustomizing(true)}
            >
              <h4 className="font-bold text-gray-900 dark:text-white">Custom Amount</h4>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Donation
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0.00"
                    disabled={!isCustomizing}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 101.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            type="submit"
            disabled={!stripe || isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Subscribe ${isCustomizing ? `$${customPrice.toFixed(2)}/month` : `$${selectedTierData.price.toFixed(2)}/month`}`
            )}
          </motion.button>
          
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};