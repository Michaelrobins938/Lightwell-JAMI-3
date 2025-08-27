import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { HelpCircle, MessageSquare, Shield, Clock, Heart, Users } from 'lucide-react';

export default function HelpCenterPage() {
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
                Help Center
              </h1>
              <p className="text-xl text-zinc-300 mb-8 max-w-3xl mx-auto">
                Find answers to your questions, learn how to get the most out of Luna, 
                and get the support you need.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white text-center mb-16">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  How does Luna work?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Luna is an AI companion designed to provide compassionate, judgment-free support. 
                  Simply start a conversation and Luna will listen, respond, and provide guidance 
                  based on your needs. The AI learns from your interactions to provide increasingly 
                  personalized support over time.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Is my privacy protected?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Absolutely. Your conversations with Luna are protected with enterprise-grade security. 
                  We use end-to-end encryption and never share your personal information with third parties. 
                  Your privacy and trust are our top priorities.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Can Luna replace therapy?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Luna is designed to complement, not replace, professional therapy. While Luna can provide 
                  valuable support and guidance, we always recommend seeking professional help for serious 
                  mental health concerns. Luna can be a great supplement to traditional therapy.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  What if I'm in crisis?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  If you're experiencing a mental health crisis, please contact emergency services immediately. 
                  Luna can provide support, but for immediate crisis situations, please call your local 
                  emergency number or a crisis hotline.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  How much does Luna cost?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Luna offers a free tier with basic features to get you started. Premium plans provide 
                  unlimited conversations, advanced features, and priority support. We believe mental health 
                  support should be accessible to everyone.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  How do I get started?
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  Getting started is easy! Simply create an account, choose your plan, and start talking 
                  to Luna. You can begin with the free tier and upgrade anytime. Luna is available 24/7, 
                  so you can start whenever you're ready.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Still Need Help?
            </h2>
            <p className="text-xl text-zinc-300 mb-8">
              Our support team is here to help you get the most out of Luna.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Get instant help from our support team
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm">
                  Start Chat
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <HelpCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Send us a detailed message
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm">
                  Send Email
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Response Time</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  We typically respond within 2 hours
                </p>
                <span className="text-green-400 text-sm font-semibold">
                  Available 24/7
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
} 