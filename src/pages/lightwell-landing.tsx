"use client";
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Heart, Shield, Eye, Brain, Zap, Lightbulb, TrendingUp, Building2, Users } from 'lucide-react';
// TODO: Install gsap package when needed for animations
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation constants (OpenAI style)
const MOTION_CURVE = "easeOut" as const;
const STAGGER_DELAY = 0.12;
const SECTION_DURATION = 0.8;

// Reusable SectionWrapper component
const SectionWrapper = ({ 
  id, 
  children, 
  className = "", 
  background 
}: { 
  id: string; 
  children: React.ReactNode; 
  className?: string;
  background?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Create the railroad snap effect
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      scrub: 1
    });

    // Background transition
    if (background) {
      gsap.to(ref.current, {
        background: background,
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "top top",
          scrub: true
        }
      });
    }

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, [background]);

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${className}`}
      style={{ background }}
    >
      {children}
    </section>
  );
};

// Animated Counter component
const StatCounter = ({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function LightwellLanding() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize GSAP scroll-driven animations
    let ctx = gsap.context(() => {
      // Smooth scroll behavior for desktop
      const sections = gsap.utils.toArray<HTMLElement>('.railroad-section');
      
      sections.forEach((section, i) => {
        // Background color transitions
        const backgrounds = [
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
          'linear-gradient(135deg, #334155 0%, #475569 50%, #334155 100%)',
          'linear-gradient(135deg, #475569 0%, #64748b 50%, #475569 100%)',
          'linear-gradient(135deg, #64748b 0%, #334155 50%, #1e293b 100%)',
          'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #000000 100%)'
        ];

        gsap.set(section, { background: backgrounds[i] });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Head>
        <title>Lightwell</title>
        <meta name="description" content="Pioneering the future of therapeutic AI. Illuminating new pathways in mental healthcare, so no one faces darkness alone." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div ref={containerRef} className="relative bg-black text-white">
        {/* Hero Section - First Impression */}
        <SectionWrapper id="hero" className="railroad-section">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/8 to-transparent" />
            {/* Floating light particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, -200],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: Math.random() * 4,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: SECTION_DURATION, ease: MOTION_CURVE }}
            >
              <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tight mb-8 leading-none">
                <span 
                  className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '400% 100%',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}
                >
                  Lightwell
                </span>
              </h1>
              <style jsx>{`
                @keyframes shimmer {
                  0%, 100% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                }
              `}</style>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, delay: 0.3, ease: MOTION_CURVE }}
            >
              Pioneering the future of therapeutic AI. Illuminating new pathways in mental healthcare, so no one faces darkness alone.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, delay: 0.6, ease: MOTION_CURVE }}
            >
              <motion.button 
                className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 25px 50px rgba(59, 130, 246, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Our Research</span>
                <ArrowRight className="w-5 h-5 inline ml-3 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-600/40 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl hover:bg-slate-700/40 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Meet the Team
              </motion.button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-slate-400"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 rotate-90" />
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Mission Section - Why We Exist */}
        <SectionWrapper id="mission" className="railroad-section">
          <div className="max-w-5xl mx-auto text-center px-6">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-12 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, ease: MOTION_CURVE }}
              viewport={{ once: true }}
            >
              Our Mission
            </motion.h2>
            
            <div className="space-y-6 text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
              {[
                "At Lightwell, our mission is simple:",
                "harness the power of AI to bring empathy,",
                "intelligence, and safety into mental healthcare.",
                "We believe in a world where compassionate support",
                "is available to all, at any moment."
              ].map((line, i) => (
                <motion.p
                  key={i}
                  className="mission-line"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: SECTION_DURATION, 
                    delay: i * STAGGER_DELAY, 
                    ease: MOTION_CURVE 
                  }}
                  viewport={{ once: true }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Pillars Section - Our Guiding Lights */}
        <SectionWrapper id="pillars" className="railroad-section">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold text-center mb-16 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, ease: MOTION_CURVE }}
              viewport={{ once: true }}
            >
              Our Guiding Lights
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { 
                  icon: Heart, 
                  title: 'Compassion First', 
                  desc: 'Technology shaped around human dignity.',
                  color: 'red'
                },
                { 
                  icon: Shield, 
                  title: 'Clinical Rigor', 
                  desc: 'Rooted in evidence, backed by science.',
                  color: 'blue'
                },
                { 
                  icon: Eye, 
                  title: 'Ethical Integrity', 
                  desc: 'Built with safety, privacy, and transparency.',
                  color: 'green'
                },
                { 
                  icon: Users, 
                  title: 'Human Partnership', 
                  desc: 'AI designed to amplify—not replace—human care.',
                  color: 'purple'
                }
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  className="group p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: i * STAGGER_DELAY, 
                    duration: SECTION_DURATION, 
                    ease: MOTION_CURVE 
                  }}
                  whileHover={{ 
                    y: -5, 
                    rotateY: 5, 
                    rotateX: 5,
                    scale: 1.02
                  }}
                  viewport={{ once: true }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <pillar.icon className={`h-8 w-8 text-${pillar.color}-400 mb-4`} />
                  <h3 className="text-lg font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Breakthroughs Section - What We've Built */}
        <SectionWrapper id="breakthroughs" className="railroad-section">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold text-center mb-16 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, ease: MOTION_CURVE }}
              viewport={{ once: true }}
            >
              What We've Built
            </motion.h2>
            
            <div className="space-y-8">
              {[
                { 
                  icon: Brain, 
                  title: 'Persistent Memory Systems',
                  desc: 'AI that remembers safely and ethically.',
                  color: 'purple'
                },
                { 
                  icon: Heart, 
                  title: 'Emotional Intelligence Models',
                  desc: 'Recognizing nuance, empathy, and tone.',
                  color: 'red'
                },
                { 
                  icon: Shield, 
                  title: 'Crisis Detection Frameworks',
                  desc: 'Real-time recognition of urgent needs.',
                  color: 'blue'
                },
                { 
                  icon: Lightbulb, 
                  title: 'Therapeutic Methodology Integration',
                  desc: 'Grounded in CBT, DBT, and evidence-based care.',
                  color: 'amber'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="breakthrough-item flex items-center space-x-6 p-6 bg-gradient-to-r from-slate-800/30 to-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-700/30 shadow-xl"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: i * 0.1, 
                    duration: SECTION_DURATION, 
                    ease: MOTION_CURVE 
                  }}
                  viewport={{ once: true }}
                >
                  <item.icon className={`h-10 w-10 text-${item.color}-400 flex-shrink-0`} />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Impact Section - Why It Matters */}
        <SectionWrapper id="impact" className="railroad-section">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold text-center mb-16 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, ease: MOTION_CURVE }}
              viewport={{ once: true }}
            >
              Our Impact
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div
                className="text-center p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/40 shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: SECTION_DURATION, ease: MOTION_CURVE }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-black text-blue-400 mb-4">99.9%</div>
                <h3 className="text-xl font-bold text-white mb-2">Uptime</h3>
                <p className="text-slate-300 text-base">Reliable always-on access</p>
              </motion.div>

              <motion.div
                className="text-center p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/40 shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: SECTION_DURATION, delay: 0.1, ease: MOTION_CURVE }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-black text-purple-400 mb-4">
                  <StatCounter end={60} suffix="+" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Clinical Advisors</h3>
                <p className="text-slate-300 text-base">Guiding research</p>
              </motion.div>

              <motion.div
                className="text-center p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/40 shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: SECTION_DURATION, delay: 0.2, ease: MOTION_CURVE }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-black text-green-400 mb-4">24/7</div>
                <h3 className="text-xl font-bold text-white mb-2">Support</h3>
                <p className="text-slate-300 text-base">AI + human oversight</p>
              </motion.div>

              <motion.div
                className="text-center p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/40 shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: SECTION_DURATION, delay: 0.3, ease: MOTION_CURVE }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-black text-amber-400 mb-4">HIPAA</div>
                <h3 className="text-xl font-bold text-white mb-2">Grade Security</h3>
                <p className="text-slate-300 text-base">At the core</p>
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* Final CTA Section - The Movement */}
        <SectionWrapper id="cta" className="railroad-section">
          <div className="text-center max-w-4xl mx-auto px-6">
            <motion.h2
              className="text-6xl md:text-7xl font-bold mb-8 tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, ease: MOTION_CURVE }}
              viewport={{ once: true }}
            >
              Join Us in Illuminating the Future of Care
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 mb-16 font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, delay: 0.2, ease: MOTION_CURVE }}
              viewport={{ once: true }}
            >
              We're building the next chapter of therapeutic AI—and we're just getting started.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: SECTION_DURATION, delay: 0.4, ease: MOTION_CURVE }}
              viewport={{ once: true }}
            >
              <motion.button 
                className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl"
                animate={{ 
                  scale: [1, 1.03, 1],
                  boxShadow: [
                    '0 25px 50px rgba(59, 130, 246, 0.3)',
                    '0 35px 60px rgba(59, 130, 246, 0.4)',
                    '0 25px 50px rgba(59, 130, 246, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Careers</span>
                <ArrowRight className="w-5 h-5 inline ml-3 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-600/40 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl hover:bg-slate-700/40 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </SectionWrapper>
      </div>
    </>
  );
}