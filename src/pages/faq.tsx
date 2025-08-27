"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Search,
  BookOpen,
  FileText,
  Video,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  ExternalLink,
  Zap,
  Shield,
  Heart,
  Target,
  Globe,
  Brain,
  Lock,
  Eye,
  Activity,
  BarChart3,
  Calendar,
  MapPin,
  Phone as PhoneIcon,
  Mail as MailIcon,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  Rocket,
  CreditCard,
  Target as TargetIcon,
  Users as UsersIcon,
  Globe as GlobeIcon,
  Clock as ClockIcon,
  Shield as ShieldIcon,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon2,
  Mail as MailIcon2,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Zap as ZapIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  Rocket as RocketIcon
} from 'lucide-react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Floating particle component
const FloatingParticle = ({ delay, duration, x, y }: any) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
    animate={{
      x: [x, x + 100, x],
      y: [y, y - 100, y],
      opacity: [0.3, 0.8, 0.3],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

// FAQ Category component
const FAQCategory = ({ 
  title, 
  icon: Icon, 
  description, 
  children, 
  delay 
}: {
  title: string;
  icon: any;
  description: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className="mb-12"
  >
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-zinc-400">{description}</p>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

// FAQ Item component
const FAQItem = ({ 
  question, 
  answer, 
  delay 
}: {
  question: string;
  answer: string;
  delay: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-white pr-4">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          )}
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <p className="text-zinc-300 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Contact method component
const ContactMethod = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  href, 
  delay 
}: {
  icon: any;
  title: string;
  description: string;
  action: string;
  href: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
  >
    <a href={href} className="block">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-400 leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center space-x-2 text-blue-400 group-hover:text-blue-300 transition-colors">
        <span className="text-sm font-medium">{action}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </a>
  </motion.div>
);

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team via live chat",
      action: "Start Chat",
      href: "#live-chat"
    },
    {
      icon: MailIcon,
      title: "Email Support",
      description: "Send us a detailed message and we'll respond within 24 hours",
      action: "Send Email",
      href: "/contact"
    },
    {
      icon: PhoneIcon,
      title: "Phone Support",
      description: "Speak directly with our technical support team",
      action: "Call Now",
      href: "tel:+1-800-LUNA-AI"
    }
  ];

  return (
    <>
      <Head>
        <title>FAQ - Frequently Asked Questions | Luna</title>
        <meta name="description" content="Find answers to frequently asked questions about Luna's AI-powered mental health support platform. Get help with features, privacy, security, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-zinc-950">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
          
          {/* Floating Particles */}
          <FloatingParticle delay={0} duration={8} x={100} y={200} />
          <FloatingParticle delay={2} duration={10} x={300} y={150} />
          <FloatingParticle delay={4} duration={12} x={500} y={300} />
          <FloatingParticle delay={6} duration={9} x={700} y={250} />
          
          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Frequently Asked Questions
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6"
              >
                Find Answers to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Your Questions
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Everything you need to know about Luna's AI-powered mental health support platform. 
                Can't find what you're looking for? Our support team is here to help.
              </motion.p>
              
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative max-w-2xl mx-auto"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            
            {/* Getting Started */}
            <FAQCategory
              title="Getting Started"
              icon={Rocket}
              description="Learn how to begin your journey with Luna"
              delay={0.1}
            >
              <FAQItem
                question="How do I create an account with Luna?"
                answer="Creating an account is simple! Visit our homepage and click 'Get Started' or 'Sign Up'. You can register using your email address or connect with your Google or Microsoft account. The process takes less than 2 minutes and you'll have immediate access to our basic features."
                delay={0.2}
              />
              <FAQItem
                question="What features are available in the free version?"
                answer="Our free version includes access to basic AI conversations, mood tracking, educational resources, and community forums. You can have up to 10 conversations per month and access our library of mental health articles and exercises."
                delay={0.3}
              />
              <FAQItem
                question="How do I upgrade to a premium subscription?"
                answer="You can upgrade to premium anytime from your dashboard. Click on 'Upgrade' in the top navigation or visit the pricing page. We offer monthly and annual plans with a 30-day money-back guarantee. Premium includes unlimited conversations, advanced analytics, and priority support."
                delay={0.4}
              />
              <FAQItem
                question="Is Luna available on mobile devices?"
                answer="Yes! Luna is fully responsive and works on all devices. We have dedicated mobile apps for iOS and Android available in the App Store and Google Play Store. You can also access Luna through any web browser on your phone or tablet."
                delay={0.5}
              />
            </FAQCategory>

            {/* AI Features */}
            <FAQCategory
              title="AI Features & Capabilities"
              icon={Brain}
              description="Understanding Luna's AI technology and features"
              delay={0.6}
            >
              <FAQItem
                question="How does Luna's AI understand my emotions?"
                answer="Luna uses advanced natural language processing and sentiment analysis to understand your emotional state. Our AI analyzes your words, tone, and conversation patterns to provide empathetic and contextually appropriate responses. It's trained on extensive mental health data and continuously learns from interactions."
                delay={0.7}
              />
              <FAQItem
                question="Can Luna provide crisis intervention?"
                answer="Yes, Luna has built-in crisis detection capabilities. If the AI detects signs of crisis or emergency situations, it will immediately connect you with human crisis counselors and provide emergency contact information. Luna is designed to recognize high-risk situations and respond appropriately."
                delay={0.8}
              />
              <FAQItem
                question="How accurate is Luna's emotional analysis?"
                answer="Luna's emotional analysis achieves over 90% accuracy in identifying user emotions and mental states. Our AI is trained on diverse datasets and validated by mental health professionals. However, it's important to note that Luna is a support tool and not a replacement for professional mental health care."
                delay={0.9}
              />
              <FAQItem
                question="Can I customize my AI companion's personality?"
                answer="Yes! You can customize your AI companion's communication style, therapeutic approach, and personality traits. Choose from different therapeutic modalities like CBT, DBT, or mindfulness-based approaches. You can also adjust the level of formality and the type of support you prefer."
                delay={1.0}
              />
              <FAQItem
                question="Does Luna remember our previous conversations?"
                answer="Yes, Luna maintains context across conversations to provide continuity in your mental health journey. Your conversation history helps the AI understand your patterns, progress, and specific needs. You can also review past conversations and track your emotional trends over time."
                delay={1.1}
              />
            </FAQCategory>

            {/* Privacy & Security */}
            <FAQCategory
              title="Privacy & Security"
              icon={Shield}
              description="How we protect your data and privacy"
              delay={1.2}
            >
              <FAQItem
                question="How does Luna protect my privacy?"
                answer="Luna implements enterprise-grade security measures including end-to-end encryption, HIPAA compliance, and regular security audits. All conversations are encrypted in transit and at rest. We never share your personal information with third parties without your explicit consent."
                delay={1.3}
              />
              <FAQItem
                question="Is my conversation data shared with anyone?"
                answer="No, your conversations are completely private. We use anonymized, aggregated data only for improving our AI systems. Individual conversations are never shared with third parties, employers, or insurance companies. You have full control over your data and can delete it at any time."
                delay={1.4}
              />
              <FAQItem
                question="Does Luna comply with healthcare privacy regulations?"
                answer="Yes, Luna is fully HIPAA compliant and follows all relevant healthcare privacy regulations. We implement strict data protection measures and regular compliance audits. Our platform meets the highest standards for mental health data security and privacy protection."
                delay={1.5}
              />
              <FAQItem
                question="Can I export or delete my data?"
                answer="Absolutely. You have full control over your data. You can export your conversation history, mood tracking data, and other information at any time. You can also permanently delete your account and all associated data. We make it easy to manage your privacy preferences."
                delay={1.6}
              />
              <FAQItem
                question="How long is my data stored?"
                answer="Your data is stored for as long as you maintain an active account. If you delete your account, all data is permanently removed within 30 days. You can also set automatic data deletion preferences in your account settings."
                delay={1.7}
              />
            </FAQCategory>

            {/* Mental Health Support */}
            <FAQCategory
              title="Mental Health Support"
              icon={Heart}
              description="Understanding Luna's approach to mental health"
              delay={1.8}
            >
              <FAQItem
                question="Can Luna replace traditional therapy?"
                answer="Luna is designed to complement, not replace, traditional therapy. It's an excellent tool for ongoing support, skill-building, and crisis intervention, but we always recommend professional mental health care for serious conditions. Luna can work alongside traditional therapy to enhance your mental health journey."
                delay={1.9}
              />
              <FAQItem
                question="What types of mental health support does Luna provide?"
                answer="Luna provides support for a wide range of mental health concerns including anxiety, depression, stress, relationship issues, and more. Our AI offers evidence-based techniques like cognitive behavioral therapy (CBT), mindfulness, breathing exercises, and crisis intervention when needed."
                delay={2.0}
              />
              <FAQItem
                question="How does Luna handle crisis situations?"
                answer="Luna has sophisticated crisis detection algorithms that can identify high-risk situations. When crisis is detected, Luna immediately connects you with human crisis counselors and provides emergency contact information. The AI is trained to recognize warning signs and respond appropriately."
                delay={2.1}
              />
              <FAQItem
                question="Can Luna provide diagnoses?"
                answer="No, Luna cannot provide medical diagnoses. While our AI can help identify patterns and symptoms, only licensed mental health professionals can provide official diagnoses. Luna is designed to support and guide you, but we always recommend professional evaluation for diagnostic purposes."
                delay={2.2}
              />
              <FAQItem
                question="How does Luna work with existing mental health treatment?"
                answer="Luna can be an excellent complement to existing mental health treatment. Many users find it helpful for practicing skills learned in therapy, tracking mood between sessions, and getting support during difficult moments. You can share insights from Luna with your mental health provider."
                delay={2.3}
              />
            </FAQCategory>

            {/* Technical Support */}
            <FAQCategory
              title="Technical Support"
              icon={Zap}
              description="Resolving technical issues and platform questions"
              delay={2.4}
            >
              <FAQItem
                question="What devices and browsers are supported?"
                answer="Luna works on all modern devices and browsers. We support iOS 13+, Android 8+, and all major browsers including Chrome, Safari, Firefox, and Edge. Our platform is fully responsive and optimized for mobile, tablet, and desktop use."
                delay={2.5}
              />
              <FAQItem
                question="How do I reset my password?"
                answer="You can reset your password by clicking 'Forgot Password' on the login page. Enter your email address and we'll send you a secure link to create a new password. The link expires after 24 hours for security purposes."
                delay={2.6}
              />
              <FAQItem
                question="Why is my conversation not loading?"
                answer="This could be due to a slow internet connection or temporary server issues. Try refreshing the page or checking your internet connection. If the problem persists, contact our support team and we'll help you resolve it quickly."
                delay={2.7}
              />
              <FAQItem
                question="Can I use Luna offline?"
                answer="Luna requires an internet connection to function properly, as our AI processing happens on secure servers. However, you can access previously downloaded resources and some basic features offline. We recommend a stable internet connection for the best experience."
                delay={2.8}
              />
              <FAQItem
                question="How do I update my account information?"
                answer="You can update your account information anytime from your profile settings. Click on your profile picture in the top right corner, then select 'Settings' to modify your personal information, preferences, and privacy settings."
                delay={2.9}
              />
            </FAQCategory>

            {/* Billing & Subscriptions */}
            <FAQCategory
              title="Billing & Subscriptions"
              icon={CreditCard}
              description="Managing your subscription and billing questions"
              delay={3.0}
            >
              <FAQItem
                question="What payment methods does Luna accept?"
                answer="We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and digital wallets. All payments are processed securely through Stripe, a trusted payment processor. We don't store your payment information on our servers."
                delay={3.1}
              />
              <FAQItem
                question="Can I cancel my subscription anytime?"
                answer="Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. We offer a 30-day money-back guarantee if you're not satisfied with our service."
                delay={3.2}
              />
              <FAQItem
                question="How do I change my billing plan?"
                answer="You can upgrade or downgrade your plan anytime from your account settings. Changes take effect immediately, and we'll prorate any charges. You can also switch between monthly and annual billing cycles at any time."
                delay={3.3}
              />
              <FAQItem
                question="Do you offer refunds?"
                answer="Yes, we offer a 30-day money-back guarantee for all subscriptions. If you're not satisfied with Luna, contact our support team within 30 days of your purchase and we'll provide a full refund, no questions asked."
                delay={3.4}
              />
              <FAQItem
                question="Are there any hidden fees?"
                answer="No, there are no hidden fees. The price you see is the price you pay. We're transparent about all costs, and you'll never be charged additional fees without your explicit consent. All pricing is clearly displayed on our website."
                delay={3.5}
              />
            </FAQCategory>

            {/* Community & Social Features */}
            <FAQCategory
              title="Community & Social Features"
              icon={Users}
              description="Understanding Luna's community features and social support"
              delay={3.6}
            >
              <FAQItem
                question="How does Luna's community work?"
                answer="Luna's community provides a safe, moderated space for users to connect, share experiences, and support each other. You can join discussion groups, participate in forums, and connect with others on similar mental health journeys. All community interactions are anonymous by default."
                delay={3.7}
              />
              <FAQItem
                question="Is the community moderated?"
                answer="Yes, our community is actively moderated by trained mental health professionals and community managers. We have strict guidelines to ensure a safe, supportive environment. Inappropriate content is removed promptly, and users can report concerning posts."
                delay={3.8}
              />
              <FAQItem
                question="Can I remain anonymous in the community?"
                answer="Yes, you can choose to remain completely anonymous in the community. You can use a username that doesn't reveal your identity, and we never require personal information for community participation. Your privacy is always protected."
                delay={3.9}
              />
              <FAQItem
                question="How do I report inappropriate content?"
                answer="You can report any inappropriate content by clicking the report button on any post or comment. Our moderation team reviews all reports promptly and takes appropriate action. We're committed to maintaining a safe, supportive community environment."
                delay={4.0}
              />
              <FAQItem
                question="Are there different community groups?"
                answer="Yes, we have various community groups focused on different topics like anxiety, depression, stress management, relationships, and more. You can join groups that match your interests and needs. New groups are created based on community demand."
                delay={4.1}
              />
            </FAQCategory>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Still Need Help?
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you 24/7
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <ContactMethod
                  key={method.title}
                  icon={method.icon}
                  title={method.title}
                  description={method.description}
                  action={method.action}
                  href={method.href}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Support Hours */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Support Hours
              </h2>
              <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
                We're here to help you whenever you need us
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 mx-auto">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Crisis Support</h3>
                  <p className="text-zinc-400 mb-4">24/7</p>
                  <p className="text-zinc-300 text-sm">Immediate crisis intervention and emergency support available around the clock</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 mx-auto">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Live Chat</h3>
                  <p className="text-zinc-400 mb-4">24/7</p>
                  <p className="text-zinc-300 text-sm">Instant support via live chat for technical issues and general questions</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 mx-auto">
                    <MailIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Email Support</h3>
                  <p className="text-zinc-400 mb-4">Mon-Fri, 9AM-6PM EST</p>
                  <p className="text-zinc-300 text-sm">Detailed email support with response within 24 hours during business days</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default FAQ; 