import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      name: 'Free',
      price: {
        monthly: 0,
        yearly: 0
      },
      features: [
        'Basic AI conversations',
        'Limited message history',
        'Standard response quality',
        'Community support'
      ],
      cta: 'Get Started',
      recommended: false
    },
    {
      name: 'Pro',
      price: {
        monthly: 20,
        yearly: 15
      },
      features: [
        'Advanced AI interactions',
        'Unlimited message history',
        'Priority response quality',
        'Dedicated support',
        'Early feature access',
        'Advanced analytics'
      ],
      cta: 'Upgrade to Pro',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: {
        monthly: 'Custom',
        yearly: 'Custom'
      },
      features: [
        'Fully customized AI solution',
        'Dedicated AI model',
        'White-glove onboarding',
        '24/7 premium support',
        'Advanced security',
        'Compliance integration',
        'Custom feature development'
      ],
      cta: 'Contact Sales',
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Pricing Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extralight mb-6 tracking-wide">
            Pricing for{' '}
            <span className="bg-gradient-to-r from-gpt5-amber-start to-gpt5-pink bg-clip-text text-transparent font-semibold">
              Lightwell AI
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Flexible plans designed to support your mental health journey, from personal growth to enterprise-level solutions.
          </p>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 rounded-full p-1 flex items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-gpt5-amber-start text-white' 
                  : 'text-white/60 hover:bg-white/10'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full transition-colors ${
                billingCycle === 'yearly' 
                  ? 'bg-gpt5-pink text-white' 
                  : 'text-white/60 hover:bg-white/10'
              }`}
            >
              Yearly
              <span className="ml-2 text-sm bg-gpt5-purple text-white px-2 py-1 rounded-full">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2 
              }}
              className={`
                p-8 rounded-3xl border transition-all duration-300
                ${plan.recommended 
                  ? 'bg-white/10 border-gpt5-pink/50 shadow-2xl shadow-gpt5-pink/20 scale-105' 
                  : 'bg-white/5 border-white/20 hover:border-white/40'}
              `}
            >
              {plan.recommended && (
                <div className="flex items-center justify-center mb-4 text-gpt5-pink">
                  <Star className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Most Popular</span>
                </div>
              )}
              
              <h2 className="text-3xl font-semibold mb-4 text-center">
                {plan.name}
              </h2>
              
              <div className="text-center mb-6">
                <p className="text-5xl font-bold">
                  {typeof plan.price[billingCycle] === 'number' 
                    ? `$${plan.price[billingCycle]}` 
                    : plan.price[billingCycle]}
                </p>
                <p className="text-white/60 mt-2">
                  {typeof plan.price[billingCycle] === 'number' 
                    ? `per ${billingCycle === 'monthly' ? 'month' : 'year'}` 
                    : 'Tailored Solutions'}
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 mr-3 text-gpt5-green" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`
                w-full py-4 rounded-full font-semibold transition-all duration-300
                ${plan.recommended 
                  ? 'bg-gpt5-pink text-white hover:bg-gpt5-pink/90' 
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}
              `}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Continue Onboarding Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <button
            onClick={() => router.push('/onboarding')}
            className="mx-auto flex items-center justify-center gap-3 px-10 py-4 bg-gpt5-amber-start text-white rounded-full text-lg font-semibold hover:bg-gpt5-amber-start/90 transition-colors duration-300 shadow-xl"
          >
            Continue Onboarding
            <ArrowRight className="w-6 h-6" />
          </button>
          
          <p className="text-sm text-white/60 mt-4 max-w-md mx-auto">
            Ready to explore how Lightwell can support your mental health journey? 
            Click below to continue your personalized onboarding experience.
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <h3 className="text-3xl text-center mb-12">
            Frequently Asked <span className="bg-gradient-to-r from-gpt5-amber-start to-gpt5-pink bg-clip-text text-transparent">Questions</span>
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/10 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-4">Can I change my plan later?</h4>
              <p className="text-white/80">Absolutely! You can upgrade, downgrade, or cancel your subscription at any time.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-4">Is there a free trial?</h4>
              <p className="text-white/80">Our Free plan offers basic features. Pro and Enterprise plans come with a 7-day free trial.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
