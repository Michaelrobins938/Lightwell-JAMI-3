import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Brain, Heart, Users, BookOpen } from 'lucide-react';

const features = [
  {
    name: 'Personalized Conversations',
    description: 'Our AI therapist, Jamie, learns from your conversations to provide a truly personalized experience.',
    icon: Heart,
  },
  {
    name: '24/7 Support',
    description: 'Jamie is available around the clock to provide support whenever you need it.',
    icon: Zap,
  },
  {
    name: 'Safe and Secure',
    description: 'Your conversations are private and secure, ensuring a safe space for you to open up.',
    icon: Shield,
  },
  {
    name: 'Evidence-Based Techniques',
    description: 'Jamie uses evidence-based therapeutic techniques to help you develop coping skills and build resilience.',
    icon: BookOpen,
  },
  {
    name: 'Community Support',
    description: 'Connect with others in our community for peer support and encouragement.',
    icon: Users,
  },
  {
    name: 'Mental Health Education',
    description: 'Learn more about mental health and well-being through our extensive library of resources.',
    icon: Brain,
  },
];

const Features = () => {
  return (
    <div className="bg-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400">Your Journey to Wellness</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A comprehensive approach to mental health
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Lightwell provides a holistic approach to mental wellness, combining personalized AI therapy with community support and educational resources.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="flex flex-col p-8 bg-slate-800/30 rounded-2xl border border-slate-700/40 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-blue-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
