import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MessageCircle, Shield, Clock, Heart, Users, ExternalLink, MapPin, Globe } from 'lucide-react';
import Footer from '../components/layout/Footer';

interface CrisisResource {
  name: string;
  phone?: string;
  description: string;
  url?: string;
}

interface CrisisResources {
  emergency: {
    nationalSuicidePrevention: CrisisResource;
    crisisTextLine: CrisisResource;
    emergencyServices: CrisisResource;
  };
  professional: {
    [key: string]: CrisisResource;
  };
  support: {
    [key: string]: CrisisResource;
  };
}

export default function CrisisSupport() {
  const [crisisResources, setCrisisResources] = useState<CrisisResources | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrisisResources();
  }, []);

  const loadCrisisResources = async () => {
    try {
      const response = await fetch('/api/crisis-resources');
      if (response.ok) {
        const data = await response.json();
        setCrisisResources(data.data);
      }
    } catch (error) {
      console.error('Failed to load crisis resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    // Remove non-numeric characters for tel: link
    const cleanPhone = phone.replace(/[^\d]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleTextCall = () => {
    // For text-based services, show instruction
    alert('To contact Crisis Text Line:\n\nText "HOME" to 741741\n\nThis will connect you with a trained crisis counselor.');
  };

  const warningSignsData = [
    'Talking about wanting to die or hurt oneself',
    'Looking for ways to kill oneself',
    'Talking about feeling hopeless or having no reason to live',
    'Feeling trapped or in unbearable pain',
    'Talking about being a burden to others',
    'Increasing use of alcohol or drugs',
    'Acting anxiously or agitated',
    'Withdrawing from family and friends',
    'Changing eating and sleeping habits',
    'Taking risks that could lead to death',
    'Giving away prized possessions',
    'Saying goodbye to loved ones',
    'Putting affairs in order'
  ];

  const supportingData = [
    'Listen without judgment and take them seriously',
    'Stay calm and ask directly if they are thinking of suicide',
    'Encourage professional help and offer to assist',
    'Remove any means of self-harm if possible',
    'Stay with them or ensure they\'re not alone',
    'Follow up and continue to show you care',
    'Take care of yourself during this difficult time'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading crisis resources...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Crisis Support - Luna Mental Health</title>
        <meta name="description" content="Immediate crisis support resources, emergency contacts, and mental health assistance available 24/7." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <main className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Crisis Alert Banner */}
            <motion.div
              className="mb-8 p-6 bg-red-500/20 border-2 border-red-500/40 rounded-2xl backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-red-300 mb-2">If you're in immediate danger</h2>
                  <p className="text-red-200 mb-4">
                    If you or someone you know is in immediate danger, please contact emergency services or go to your nearest emergency room.
                  </p>
                  <button
                    onClick={() => handleCall('911')}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold transition-all inline-flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call 911</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Shield className="w-12 h-12 text-red-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Crisis Support
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                You are not alone. Help is available 24/7. Reach out to trained professionals who care and want to help.
              </p>
            </motion.div>

            {/* Emergency Contacts */}
            {crisisResources && (
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Emergency Contacts</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/50 transition-all">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-red-500/20 rounded-full">
                          <Phone className="w-6 h-6 text-red-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{crisisResources.emergency.nationalSuicidePrevention.name}</h3>
                      <div className="text-3xl font-bold text-red-400 mb-3">{crisisResources.emergency.nationalSuicidePrevention.phone}</div>
                      <p className="text-slate-300 text-sm mb-4">{crisisResources.emergency.nationalSuicidePrevention.description}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCall(crisisResources.emergency.nationalSuicidePrevention.phone!)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </button>
                        {crisisResources.emergency.nationalSuicidePrevention.url && (
                          <a
                            href={crisisResources.emergency.nationalSuicidePrevention.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-xl transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-full">
                          <MessageCircle className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{crisisResources.emergency.crisisTextLine.name}</h3>
                      <div className="text-lg font-bold text-blue-400 mb-3">{crisisResources.emergency.crisisTextLine.phone}</div>
                      <p className="text-slate-300 text-sm mb-4">{crisisResources.emergency.crisisTextLine.description}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleTextCall}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Text Now</span>
                        </button>
                        {crisisResources.emergency.crisisTextLine.url && (
                          <a
                            href={crisisResources.emergency.crisisTextLine.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-xl transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-orange-500/20 rounded-full">
                          <AlertTriangle className="w-6 h-6 text-orange-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{crisisResources.emergency.emergencyServices.name}</h3>
                      <div className="text-3xl font-bold text-orange-400 mb-3">{crisisResources.emergency.emergencyServices.phone}</div>
                      <p className="text-slate-300 text-sm mb-4">{crisisResources.emergency.emergencyServices.description}</p>
                      <button
                        onClick={() => handleCall(crisisResources.emergency.emergencyServices.phone!)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Emergency</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Additional Support Resources */}
            {crisisResources && (
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Additional Support</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {Object.values(crisisResources.support).map((resource, index) => (
                    <div key={index} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-green-500/20 rounded-full flex-shrink-0">
                          <Heart className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{resource.name}</h3>
                          {resource.phone && (
                            <div className="text-lg font-semibold text-green-400 mb-2">{resource.phone}</div>
                          )}
                          <p className="text-slate-300 mb-4">{resource.description}</p>
                          <div className="flex space-x-2">
                            {resource.phone && (
                              <button
                                onClick={() => handleCall(resource.phone!)}
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-semibold transition-all flex items-center space-x-2"
                              >
                                <Phone className="w-4 h-4" />
                                <span>Call</span>
                              </button>
                            )}
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-xl font-semibold transition-all flex items-center space-x-2"
                              >
                                <Globe className="w-4 h-4" />
                                <span>Website</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 text-center">Professional Help</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.values(crisisResources.professional).map((resource, index) => (
                    <div key={index} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-full">
                          <Users className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{resource.name}</h3>
                      <p className="text-slate-300 text-sm mb-4">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit Site</span>
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Warning Signs */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    <span>Warning Signs</span>
                  </h3>
                  <ul className="space-y-3">
                    {warningSignsData.map((sign, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-300">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-green-400" />
                    <span>How to Help</span>
                  </h3>
                  <ul className="space-y-3">
                    {supportingData.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Remember Section */}
            <motion.div
              className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Remember</h3>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                You are valuable, you are loved, and you are not alone. Crisis is temporary, but suicide is permanent. 
                There are people who want to help you through this difficult time. Reach out - it's a sign of strength, not weakness.
              </p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}