import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Award, Target, Calendar } from 'lucide-react';
import Footer from '../components/layout/Footer';

export default function Challenges() {
  const upcomingChallenges = [
    { name: '30-Day Mindfulness', duration: '30 days', difficulty: 'Beginner' },
    { name: 'Gratitude Practice', duration: '7 days', difficulty: 'Easy' },
    { name: 'Sleep Hygiene', duration: '21 days', difficulty: 'Medium' }
  ];

  return (
    <>
      <Head>
        <title>Wellness Challenges - Luna Mental Health</title>
        <meta name="description" content="30-day wellness challenges to improve your mental health and build positive habits." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Award className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
                Wellness Challenges
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Build positive mental health habits with structured challenges and community support.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {upcomingChallenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Target className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{challenge.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{challenge.duration} • {challenge.difficulty}</p>
                  <motion.button
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    Coming Soon
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = '/goals'}
              >
                <Calendar className="w-5 h-5" />
                <span>Set Personal Goals</span>
              </motion.button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}