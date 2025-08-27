import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/router';
// React Icons - Healthcare focused
import { 
  BsChatDots, BsShield, BsPeople, BsGraphUp, BsHeart, BsStars,
  BsCheckCircle, BsArrowRight, BsPlay
} from 'react-icons/bs';
import { 
  MdPsychology, MdHealthAndSafety, MdSecurity, MdAccessibility,
  MdNotifications, MdTimeline
} from 'react-icons/md';
import { 
  FaUserMd, FaChartLine, FaLightbulb, FaGraduationCap, FaAward
} from 'react-icons/fa';
import { 
  HiOutlineSparkles, HiOutlineClock
} from 'react-icons/hi';
// Animations
import { 
  fadeUp, staggerParent, scaleInSpring, floatLoop, cinematicFadeUp,
  cinematicStagger, cardReveal, buttonSpring, enhancedFadeUp
} from '../utils/animations';

// Reusable Components with GPT-5 styling
const FeatureCard = ({ feature, index }: { feature: any; index: number }) => (
  <motion.div
    variants={cardReveal}
    custom={index}
    className="group p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/15"
    style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg group-hover:from-purple-400/30 group-hover:to-pink-400/30 transition-all duration-300">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
        {feature.title}
      </h3>
    </div>
    <p className="text-white/80 leading-relaxed">{feature.description}</p>
    {feature.stats && (
      <div className="mt-4 text-sm text-purple-300 font-medium">
        {feature.stats}
      </div>
    )}
  </motion.div>
);

const StatCard = ({ stat, index }: { stat: any; index: number }) => (
  <motion.div
    variants={cardReveal}
    custom={index}
    className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
  >
    <motion.div
      className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 + 0.5, duration: 0.6, type: "spring" }}
    >
      {stat.value}
    </motion.div>
    <div className="text-white/70">{stat.label}</div>
  </motion.div>
);

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Core Features Data
  const coreFeatures = [
    {
      icon: <MdPsychology className="w-6 h-6 text-purple-400" />,
      title: "AI Therapy Sessions",
      description: "24/7 access to empathetic, evidence-based therapeutic conversations powered by advanced AI that understands mental health.",
      stats: "87% improvement in mood scores"
    },
    {
      icon: <MdHealthAndSafety className="w-6 h-6 text-pink-400" />,
      title: "Crisis Detection",
      description: "Real-time monitoring and immediate intervention protocols to ensure your safety during vulnerable moments.",
      stats: "99.9% accuracy in crisis detection"
    },
    {
      icon: <FaChartLine className="w-6 h-6 text-blue-400" />,
      title: "Progress Tracking",
      description: "Comprehensive analytics and insights to track your mental health journey and celebrate your growth.",
      stats: "Track 50+ wellness metrics"
    },
    {
      icon: <BsShield className="w-6 h-6 text-cyan-400" />,
      title: "HIPAA Compliant",
      description: "Bank-level security with end-to-end encryption ensures your therapeutic conversations remain completely private.",
      stats: "256-bit encryption standard"
    },
    {
      icon: <HiOutlineClock className="w-6 h-6 text-purple-300" />,
      title: "Always Available",
      description: "No appointment needed. Get support whenever you need it, whether it's 3 AM or during a lunch break.",
      stats: "Available 365 days a year"
    },
    {
      icon: <FaUserMd className="w-6 h-6 text-pink-300" />,
      title: "Clinical Excellence",
      description: "Trained on DSM-5 guidelines and evidence-based therapeutic approaches by licensed mental health professionals.",
      stats: "Based on 10,000+ clinical hours"
    }
  ];

  // AI Capabilities
  const aiCapabilities = [
    {
      icon: <MdPsychology className="w-5 h-5" />,
      title: "Emotional Intelligence",
      description: "Understands nuanced emotions and responds with appropriate therapeutic techniques."
    },
    {
      icon: <BsGraphUp className="w-5 h-5" />,
      title: "Personalized Learning",
      description: "Adapts to your communication style and therapeutic preferences over time."
    },
    {
      icon: <MdTimeline className="w-5 h-5" />,
      title: "Memory Continuity",
      description: "Remembers your progress, goals, and important life events across sessions."
    },
    {
      icon: <MdAccessibility className="w-5 h-5" />,
      title: "Multi-Modal Support",
      description: "Text, voice, and visual interaction modes to suit your preferences."
    }
  ];

  // Social Proof Stats
  const stats = [
    { value: "500K+", label: "Users Helped" },
    { value: "2M+", label: "Therapy Sessions" },
    { value: "4.9/5", label: "User Rating" },
    { value: "94%", label: "Report Improvement" }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Lightwell helped me through my darkest moments. Having 24/7 access to therapy changed my life.",
      author: "Sarah M.",
      role: "Student"
    },
    {
      quote: "The AI understands me better than some human therapists I've worked with. It's remarkable.",
      author: "Dr. James R.",
      role: "Healthcare Professional"
    },
    {
      quote: "Crisis detection saved my life. I'm grateful for this technology every single day.",
      author: "Alex P.",
      role: "Community Member"
    }
  ];

  return (
    <>
      <Head>
        <title>Lightwell - Your AI Mental Health Companion</title>
        <meta name="description" content="24/7 AI-powered mental health support. Get therapy, crisis intervention, and personalized care whenever you need it. HIPAA compliant and clinically validated." />
        <meta name="keywords" content="AI therapy, mental health, counseling, crisis intervention, HIPAA compliant, 24/7 support" />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* GPT-5 Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
        <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />
        
        {/* Hero Section */}
        <motion.section 
          style={{ y: heroY }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 z-10"
        >

          {/* Hero Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerParent}
            className="relative z-10 text-center max-w-6xl mx-auto px-6"
          >
            {/* Trust Badge */}
            <motion.div
              variants={scaleInSpring}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-8 shadow-2xl"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            >
              <MdHealthAndSafety className="w-4 h-4" />
              <span>Clinical Grade AI</span>
              <div className="w-1 h-1 bg-purple-400 rounded-full" />
              <span>HIPAA Compliant</span>
              <div className="w-1 h-1 bg-pink-400 rounded-full" />
              <span>Crisis Detection</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={enhancedFadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-8 tracking-wide leading-none"
            >
              Your AI-powered{' '}
              <div className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                  mental health
                </span>
              </div>
              <br />companion
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Get 24/7 access to empathetic, evidence-based therapy and crisis support. 
              No appointments, no waiting rooms—just instant, professional mental healthcare 
              whenever you need it most.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerParent}
              className="flex flex-col items-center gap-6 mb-16"
            >
              <motion.button
                variants={buttonSpring}
                whileHover="hover"
                onClick={() => router.push('/chat')}
                className="w-full max-w-md bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/20 text-white px-12 py-5 rounded-full text-xl font-semibold shadow-xl flex items-center justify-center gap-3 group transition-all duration-300"
                style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
              >
                <BsChatDots className="w-6 h-6" />
                Start Therapy Now
                <BsArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Disclaimer */}
              <div className="text-center text-sm text-white/60 max-w-md">
                Want to jump straight to the chat? Click the button above. 
                To continue our guided tour, follow the path to the right.
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={cinematicStagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Core Features Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cinematicStagger}
              className="text-center mb-16"
            >
              <motion.h2
                variants={cinematicFadeUp}
                className="text-4xl md:text-5xl font-extralight mb-6 tracking-wide"
              >
                Why Choose{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  Lightwell
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-xl text-white/80 max-w-3xl mx-auto"
              >
                Advanced AI technology meets compassionate care to provide you with 
                the most effective mental health support available.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cinematicStagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {coreFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Capabilities Showcase */}
        <section className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerParent}
              className="text-center mb-16"
            >
              <motion.h2
                variants={cinematicFadeUp}
                className="text-4xl md:text-5xl font-extralight mb-6 tracking-wide"
              >
                Powered by Advanced{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  AI Technology
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-xl text-white/80 max-w-3xl mx-auto"
              >
                Our AI doesn't just chat—it understands, learns, and grows with you.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cinematicStagger}
              className="grid md:grid-cols-2 gap-8"
            >
              {aiCapabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  variants={cardReveal}
                  custom={index}
                  className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
                  style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                >
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                    {capability.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {capability.title}
                    </h3>
                    <p className="text-white/80">{capability.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Social Proof - Testimonials */}
        <section className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerParent}
              className="text-center mb-16"
            >
              <motion.h2
                variants={cinematicFadeUp}
                className="text-4xl md:text-5xl font-extralight mb-6 tracking-wide"
              >
                Trusted by{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  Hundreds
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-xl text-white/80 mb-12"
              >
                Early access users sharing their transformative experiences.
              </motion.p>

              {/* Testimonials Section */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerParent}
                className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                <motion.div 
                  variants={cardReveal}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/30 transition-all duration-300"
                >
                  <p className="text-white/80 italic mb-4">"JAMI-3 has been a game-changer for my mental health. The AI understands me in a way traditional therapy never did."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Alex R.</h4>
                      <p className="text-sm text-white/60">Alpha Tester</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  variants={cardReveal}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/30 transition-all duration-300"
                >
                  <p className="text-white/80 italic mb-4">"As someone with anxiety, JAMI-3 provides instant, judgment-free support exactly when I need it most."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Maya L.</h4>
                      <p className="text-sm text-white/60">Beta User</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  variants={cardReveal}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/30 transition-all duration-300"
                >
                  <p className="text-white/80 italic mb-4">"I was skeptical about AI therapy, but JAMI-3 has genuinely helped me develop better coping strategies."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      J
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Jordan K.</h4>
                      <p className="text-sm text-white/60">Early Access User</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerParent}
            >
              <motion.h2
                variants={cinematicFadeUp}
                className="text-4xl md:text-5xl font-extralight mb-6 tracking-wide"
              >
                Ready to start your{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                  healing journey?
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-xl text-white/80 mb-12"
              >
                Join thousands who have found hope, healing, and growth through AI-powered therapy.
                Your mental health matters—let us help you thrive.
              </motion.p>

              <motion.div
                variants={staggerParent}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <motion.button
                  variants={buttonSpring}
                  whileHover="hover"
                  onClick={() => {
                    // Check if user is authenticated
                    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
                    if (token) {
                      // User is logged in, go to onboarding
                      router.push('/onboarding');
                    } else {
                      // User needs to login/signup first
                      router.push('/login');
                    }
                  }}
                  className="bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/20 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-xl flex items-center justify-center gap-3 group transition-all duration-300"
                  style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
                >
                  <BsChatDots className="w-5 h-5" />
                  Start Free Session
                  <BsArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  variants={buttonSpring}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push('/pricing')}
                  className="px-12 py-4 border border-white/30 hover:border-white/50 text-white rounded-full text-lg font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                >
                  View Pricing
                </motion.button>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-white/60 text-sm"
              >
                No credit card required • HIPAA compliant • 24/7 support
              </motion.p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}