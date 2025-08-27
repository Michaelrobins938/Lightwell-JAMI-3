"use client";
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';

const donationOptions = [
  { amount: 5, label: '$5' },
  { amount: 10, label: '$10' },
  { amount: 25, label: '$25' },
  { amount: 50, label: '$50' },
  { amount: 100, label: '$100' },
];

export const DonationOptions: React.FC<{ 
  userId: string; 
  userEmail: string;
  userName?: string;
  onDonationComplete?: () => void;
}> = ({ userId, userEmail, userName, onDonationComplete }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);

    if (amount <= 0) {
      setErrorMessage('Please select or enter a valid donation amount');
      setIsProcessing(false);
      return;
    }

    try {
      if (isRecurring) {
        // Handle recurring donation (subscription)
        const response = await fetch('/api/donation/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            userEmail,
            userName,
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            frequency,
          }),
        });

        const { error, clientSecret } = await response.json();

        if (error) {
          setErrorMessage(error.message || 'An error occurred');
          setIsProcessing(false);
          return;
        }

        const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (stripeError) {
          setErrorMessage(stripeError.message || 'An error occurred with the payment');
        } else {
          // Handle successful recurring donation
          if (onDonationComplete) onDonationComplete();
        }
      } else {
        // Handle one-time donation
        const { error: backendError, clientSecret } = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
          }),
        }).then(r => r.json());

        if (backendError) {
          setErrorMessage(backendError.message);
          setIsProcessing(false);
          return;
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (stripeError) {
          setErrorMessage(stripeError.message || 'An error occurred with the payment');
        } else if (paymentIntent.status === 'succeeded') {
          // Handle successful one-time donation
          if (onDonationComplete) onDonationComplete();
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Make a Donation</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">One-time</span>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isRecurring ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
            onClick={() => setIsRecurring(!isRecurring)}
          >
            <span
              className={`${
                isRecurring ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">Recurring</span>
        </div>
      </div>

      {isRecurring && (
        <div className="flex space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              frequency === 'monthly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setFrequency('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              frequency === 'yearly'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setFrequency('yearly')}
          >
            Yearly
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {donationOptions.map((option) => (
          <motion.button
            key={option.amount}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-3 px-2 border rounded-md text-center ${
              selectedAmount === option.amount
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
            onClick={() => {
              setSelectedAmount(option.amount);
              setCustomAmount('');
            }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
      
      <div>
        <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Custom amount
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="custom-amount"
            min="1"
            step="0.01"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Enter custom amount"
          />
        </div>
      </div>

      <div className="mt-6">
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

      {errorMessage && (
        <div className="mt-4 text-red-600 dark:text-red-400">{errorMessage}</div>
      )}

      <motion.button
        type="submit"
        disabled={!stripe || isProcessing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
          `Donate ${isRecurring ? `${frequency === 'monthly' ? 'Monthly' : 'Yearly'}` : 'Once'}`
        )}
      </motion.button>
    </form>
  );
};