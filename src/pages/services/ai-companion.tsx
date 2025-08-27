import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { Heart, MessageCircle, Clock, Shield, Brain, Users } from 'lucide-react';

export default function AICompanionPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-zinc-950">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
          
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-6">
                AI Companion
              </h1>
              <p className="text-xl text-zinc-300 mb-8 max-w-3xl mx-auto">
                Your compassionate AI companion, available 24/7 to provide judgment-free listening, 
                emotional support, and personalized mental health guidance.
              </p>
              <div className="flex justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                  Start Talking to Luna
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white text-center mb-16">
              Why Choose Luna's AI Companion?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <Heart className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Compassionate Listening</h3>
                <p className="text-zinc-300">
                  Luna provides a safe, judgment-free space where you can express your thoughts 
                  and feelings without fear of criticism or misunderstanding.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <Clock className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">24/7 Availability</h3>
                <p className="text-zinc-300">
                  Available whenever you need support, day or night. No waiting rooms, 
                  no appointments - just immediate, compassionate care.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <Brain className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Emotional Intelligence</h3>
                <p className="text-zinc-300">
                  Advanced AI that understands context, emotions, and provides 
                  responses tailored to your unique situation and needs.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <Shield className="w-12 h-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Privacy & Security</h3>
                <p className="text-zinc-300">
                  Your conversations are protected with enterprise-grade security. 
                  Your privacy is our top priority.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <MessageCircle className="w-12 h-12 text-pink-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Personalized Care</h3>
                <p className="text-zinc-300">
                  Luna learns and adapts to your communication style, preferences, 
                  and needs over time for increasingly personalized support.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <Users className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Community Integration</h3>
                <p className="text-zinc-300">
                  Connect with others on similar journeys while maintaining 
                  your privacy and personal space.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-zinc-300 mb-8">
              Join thousands of users who have found peace, understanding, and support with Luna.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              Start Your Free Trial
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
} 