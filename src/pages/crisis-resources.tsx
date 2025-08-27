import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Shield, Phone, ExternalLink } from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function CrisisResources() {
  const resources = [
    { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
    { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' }
  ];

  return (
    <>
      <Head>
        <title>Crisis Resources - Luna Mental Health</title>
        <meta name="description" content="Emergency mental health resources and crisis intervention contacts." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
                Crisis Resources
              </h1>
              <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-8">
                <p className="text-red-200 font-semibold">If you're in immediate danger, call 911</p>
              </div>
            </motion.div>

            <div className="space-y-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{resource.name}</h3>
                      <p className="text-2xl font-bold text-red-400">{resource.number}</p>
                    </div>
                    <div className="text-slate-400">{resource.available}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-semibold text-white hover:from-red-700 hover:to-orange-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = '/crisis-support'}
              >
                More Crisis Support
              </motion.button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}