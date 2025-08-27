'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Users, Clock, AlertTriangle } from 'lucide-react';

export const CrisisIntervention: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const emergencyResources = [
    {
      name: 'Suicide & Crisis Lifeline',
      number: '988',
      description: '24/7 free and confidential support',
      type: 'call',
      icon: Phone,
      priority: 'immediate'
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis support via text',
      type: 'text',
      icon: MessageCircle,
      priority: 'immediate'
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'For immediate medical emergencies',
      type: 'emergency',
      icon: AlertTriangle,
      priority: 'emergency'
    }
  ];

  const supportStrategies = [
    'Reach out to a trusted friend or family member',
    'Stay in a safe, public place',
    'Remove any means of self-harm from your environment',
    'Focus on your breathing: inhale for 4, hold for 4, exhale for 4',
    'Remember: this feeling is temporary and will pass',
    'Consider going to your nearest emergency room'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8 p-6 bg-white rounded-lg shadow-lg border-l-4 border-red-500"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            We're Here to Help You Right Now
          </h1>
          <p className="text-gray-600">
            Your safety is our priority. Please reach out for immediate support.
          </p>
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Current time: {currentTime.toLocaleTimeString()}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Emergency Resources */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-red-500" />
              Immediate Help
            </h2>
            
            <div className="space-y-4">
              {emergencyResources.map((resource, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${resource.priority === 'emergency' 
                      ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                      : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                    }
                  `}
                  onClick={() => {
                    if (resource.type === 'call') {
                      window.location.href = `tel:${resource.number}`;
                    } else if (resource.type === 'text') {
                      window.location.href = `sms:741741?body=HOME`;
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <resource.icon className={`
                      w-6 h-6 mt-1
                      ${resource.priority === 'emergency' ? 'text-red-600' : 'text-blue-600'}
                    `} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{resource.name}</h3>
                      <p className="text-lg font-bold text-gray-700 mt-1">{resource.number}</p>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Remember:</strong> If you're in immediate danger, call 911 or go to your nearest emergency room.
              </p>
            </div>
          </motion.div>

          {/* Coping Strategies */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Right Now, You Can
            </h2>
            
            <div className="space-y-3">
              {supportStrategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{strategy}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Breathing Exercise</h3>
              <p className="text-sm text-blue-700">
                Take slow, deep breaths: Inhale for 4 counts, hold for 4, exhale for 4. 
                Repeat this pattern until you feel more grounded.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Professional Support */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-white rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-purple-500" />
            Find Local Support
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800">Emergency Rooms</h3>
              <p className="text-sm text-purple-700 mt-1">
                Available 24/7 for mental health emergencies
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800">Crisis Centers</h3>
              <p className="text-sm text-blue-700 mt-1">
                Specialized facilities for mental health crises
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800">Mobile Crisis Teams</h3>
              <p className="text-sm text-green-700 mt-1">
                Mental health professionals who come to you
              </p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>
            This is not a substitute for professional medical advice. 
            If you're experiencing a medical emergency, please call 911 immediately.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}; 