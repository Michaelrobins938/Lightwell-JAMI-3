import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { UserCheck, MapPin, Phone, Mail, Star, Filter, Search, ExternalLink, Heart, Shield, Clock, Users, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';
import Footer from '../components/layout/Footer';

interface ProfessionalResource {
  name: string;
  description: string;
  url: string;
  features: string[];
}

interface ProfessionalResources {
  directories: { [key: string]: ProfessionalResource };
  onlineTherapy: { [key: string]: ProfessionalResource };
  specialized: { [key: string]: ProfessionalResource };
  insurance: { [key: string]: ProfessionalResource };
}

export default function Referrals() {
  const [professionals, setProfessionals] = useState<ProfessionalResources | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('directories');

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      const response = await fetch('/api/mental-health-professionals');
      if (response.ok) {
        const data = await response.json();
        setProfessionals(data.data);
      }
    } catch (error) {
      console.error('Failed to load professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'directories', name: 'Find Therapists', icon: <Search className="w-5 h-5" /> },
    { id: 'onlineTherapy', name: 'Online Therapy', icon: <Globe className="w-5 h-5" /> },
    { id: 'specialized', name: 'Specialized Care', icon: <Heart className="w-5 h-5" /> },
    { id: 'insurance', name: 'Insurance Search', icon: <Shield className="w-5 h-5" /> }
  ];

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'directories': return <UserCheck className="w-8 h-8" />;
      case 'onlineTherapy': return <Globe className="w-8 h-8" />;
      case 'specialized': return <Heart className="w-8 h-8" />;
      case 'insurance': return <Shield className="w-8 h-8" />;
      default: return <Users className="w-8 h-8" />;
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'directories': return 'from-blue-500 to-indigo-500';
      case 'onlineTherapy': return 'from-green-500 to-teal-500';
      case 'specialized': return 'from-purple-500 to-pink-500';
      case 'insurance': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading professional resources...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Professional Referrals - Luna Mental Health</title>
        <meta name="description" content="Find qualified mental health professionals, therapists, and treatment resources. Connect with licensed providers in your area." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <main className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <UserCheck className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Professional Referrals
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Connect with qualified mental health professionals, therapists, and specialized treatment providers to support your mental health journey.
              </p>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              className="mb-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-start space-x-4">
                <BookOpen className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">Finding the Right Professional</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Finding the right mental health professional is a personal journey. Consider factors like specialties, treatment approaches, 
                    location, insurance coverage, and your comfort level. Many professionals offer brief consultations to help determine if 
                    they're a good fit for your needs.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Category Navigation */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/40 hover:text-white'
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Resources Display */}
            {professionals && (
              <motion.div
                key={activeCategory}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {Object.values(professionals[activeCategory as keyof ProfessionalResources]).map((resource, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all hover:scale-[1.02] group"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className={`p-3 bg-gradient-to-br ${getCategoryColor(activeCategory)} bg-opacity-20 rounded-xl flex-shrink-0`}>
                        {getCategoryIcon(activeCategory)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-2">
                          {resource.name}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {resource.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-300 mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {resource.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2 text-sm text-slate-300">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 group"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tips Section */}
            <motion.div
              className="mt-16 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Tips for Finding the Right Professional</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-300 mb-4 flex items-center space-x-2">
                    <Search className="w-5 h-5 text-blue-400" />
                    <span>Research & Preparation</span>
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Identify your specific needs and treatment goals</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Check your insurance coverage and provider networks</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Consider location, scheduling, and treatment modalities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Read professional profiles and patient reviews</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-300 mb-4 flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-green-400" />
                    <span>Initial Contact</span>
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Ask about their experience with your specific concerns</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Inquire about treatment approaches and methods</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Discuss fees, insurance, and scheduling availability</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Trust your instincts about the therapeutic relationship</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Emergency Notice */}
            <motion.div
              className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-300 mb-2">Need Immediate Help?</h3>
                  <p className="text-red-200 text-sm mb-4">
                    If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out for immediate support.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/crisis-support"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-all text-sm"
                    >
                      Crisis Resources
                    </Link>
                    <a
                      href="tel:988"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-all text-sm"
                    >
                      Call 988
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}