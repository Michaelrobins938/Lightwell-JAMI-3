import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Cinematic Success Modal Component
const SuccessModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  const router = useRouter();
  const [countdown, setCountdown] = React.useState(3);
  const [particles, setParticles] = React.useState<Array<{ id: number, x: number, y: number, delay: number, type: string }>>([]); 
  const [orbPulse, setOrbPulse] = React.useState(1);

  React.useEffect(() => {
    if (show) {
      // Create enhanced cinematic particles
      const particleArray = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.2,
        type: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'dot' : 'sparkle'
      }));
      setParticles(particleArray);

      // Enhanced orb pulsing animation
      const orbInterval = setInterval(() => {
        setOrbPulse(prev => prev === 1 ? 1.15 : 1);
      }, 800);

      // Countdown timer with smooth transitions
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            clearInterval(orbInterval);
            // Add cinematic fade out before navigation
            setTimeout(() => router.push('/onboarding'), 300);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(countdownInterval);
        clearInterval(orbInterval);
      };
    }
  }, [show, router]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-gradient-to-br from-black/90 via-slate-950/95 to-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      >
        {/* Dynamic Background Beams */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gpt5-beam-radial opacity-10"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-radial from-gpt5-amber-start/5 via-gpt5-pink/3 to-transparent"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Enhanced Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`fixed ${
              particle.type === 'star' ? 'w-1 h-1' : 
              particle.type === 'dot' ? 'w-1.5 h-1.5' : 'w-0.5 h-0.5'
            } bg-gpt5-beam-gradient rounded-full`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 1, 0],
              scale: particle.type === 'star' ? [0, 1.5, 0] : [0, 1, 0],
              rotate: particle.type === 'sparkle' ? [0, 180, 360] : 0
            }}
            transition={{
              duration: particle.type === 'star' ? 3 : 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut"
            }}
          />
        ))}
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.8
          }}
          className="relative"
        >
          {/* Cinematic Ambient Glow */}
          <div className="absolute -inset-32 bg-gpt5-beam-radial opacity-20 rounded-full blur-3xl animate-pulse" />
          
          <motion.div 
            className="relative bg-gradient-to-br from-gpt5-slate-950/98 to-gpt5-black/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 text-center w-full max-w-lg mx-4 overflow-hidden"
            animate={{ 
              boxShadow: [
                "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                "0 25px 50px -12px rgba(245, 158, 11, 0.15)",
                "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Floating Success Orb with Enhanced Animations */}
            <motion.div className="relative mb-8">
              <motion.div
                className="w-32 h-32 mx-auto bg-gpt5-beam-gradient rounded-full flex items-center justify-center shadow-2xl"
                animate={{ 
                  scale: [1, orbPulse, 1],
                  boxShadow: [
                    "0 20px 25px -5px rgba(245, 158, 11, 0.3)",
                    "0 20px 25px -5px rgba(236, 72, 153, 0.4)",
                    "0 20px 25px -5px rgba(245, 158, 11, 0.3)"
                  ]
                }}
                transition={{
                  scale: { duration: 0.8, ease: "easeInOut" },
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.div 
                  className="w-28 h-28 bg-gradient-to-r from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <motion.svg 
                    className="w-12 h-12 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  >
                    <motion.path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>
              </motion.div>
              
              {/* Enhanced Pulsing Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 w-32 h-32 mx-auto border-2 border-gradient-to-r from-gpt5-amber-start/20 to-gpt5-pink/20 rounded-full"
                  animate={{ 
                    scale: [1, 1.5 + i * 0.3],
                    opacity: [0.6, 0]
                  }}
                  transition={{
                    duration: 2.5 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="text-4xl font-light text-white mb-4 tracking-wide">
                Welcome to <span className="bg-gpt5-beam-gradient bg-clip-text text-transparent font-semibold">JAMI-3</span>
              </h2>
              <p className="text-slate-300 text-xl mb-3 font-light">Your account has been created successfully!</p>
              <p className="text-slate-400 text-base mb-8 max-w-md mx-auto leading-relaxed">Your journey with personalized AI therapy begins now...</p>
            </motion.div>
            
            {/* Enhanced Countdown Display */}
            <motion.div 
              className="mb-8"
              animate={{ scale: countdown <= 1 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
                <motion.div 
                  className="w-3 h-3 bg-gpt5-beam-gradient rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-white text-base font-medium">
                  Entering onboarding in {countdown}s
                </span>
              </div>
            </motion.div>

            <motion.button
              onClick={() => router.push('/onboarding')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gpt5-beam-gradient hover:opacity-90 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
            >
              <motion.svg 
                className="w-6 h-6 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
              <span className="text-lg">Begin Your Journey</span>
            </motion.button>
            
            <motion.p 
              className="text-xs text-slate-500 mt-6 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 bg-gpt5-amber-start rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Lightwell • HIPAA Compliant • Clinical Grade • FDA Ready
              </span>
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      let data;
      const responseText = await response.text();
      
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        console.error('Response text:', responseText);
        throw new Error(`Server error: ${response.status} - ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Signup failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Show success modal
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Continue with JAMI-3 - Create Your Account</title>
        <meta name="description" content="Create your Lightwell account and continue your journey with JAMI-3, personalized AI therapy, and mental wellness support." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gpt5-slate-950 via-gpt5-black to-gpt5-zinc-900">
        {/* GPT-5 Beam Animated Background */}
        <div className="fixed inset-0 bg-gpt5-beam-radial opacity-15 mix-blend-overlay pointer-events-none animate-gpt5-beam" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(245,158,11,0.08),_transparent_45%)] opacity-50 mix-blend-overlay pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(236,72,153,0.06),_transparent_55%)] opacity-35 mix-blend-screen pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-gpt5-amber-start/10 via-gpt5-pink/8 via-gpt5-purple/6 to-gpt5-purple-end/10 opacity-40 mix-blend-overlay pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_transparent_60%,_rgba(0,0,0,0.4)_80%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-none" />

        <div className="relative z-10 min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            {/* Header with JAMI-3 branding */}
            <div className="text-center mb-8">
              <div className="absolute top-6 right-6 flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-sm"></div>
                </div>
                <span className="text-[#fafafa]/80 text-sm font-medium">Lightwell</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-wide text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                JAMI-3
              </h1>
              <p className="text-white/95 text-lg sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Create your account
              </p>
              <p className="text-[#fafafa]/80 text-sm mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Takes less than 2 minutes. No credit card required.
              </p>
            </div>

            {/* Signup Form */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[rgba(20,20,20,0.85)] backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/40">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b9d]/20 to-[#c44cff]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-[#fafafa] mb-1">Create your account</h2>
                  <p className="text-[#fafafa]/80 text-sm">Join thousands who trust JAMI-3 for their mental wellness journey</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-300 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* OAuth Buttons */}
                <div className="space-y-4 mb-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <p className="text-[#fafafa]/70 text-sm mb-3 sm:mb-4 px-2">Choose your preferred way to get started</p>
                  </div>

                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-white hover:bg-white/95 text-gray-900 font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 border border-white/20"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Microsoft Sign-Up Button */}
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-white hover:bg-white/95 text-gray-900 font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 border border-white/20"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z"/>
                      <path fill="#00A4EF" d="M12 1h10v10H12z"/>
                      <path fill="#7FBA00" d="M1 12h10v10H1z"/>
                      <path fill="#FFB900" d="M12 12h10v10H12z"/>
                    </svg>
                    <span>Sign up with Microsoft</span>
                  </button>

                  {/* Phone OAuth Button */}
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-gpt5-beam-gradient hover:opacity-90 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 border border-white/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Continue with Phone</span>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <span className="mx-6 text-white/60 text-sm font-medium">or</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-[#fafafa]/70 text-sm">Create account with email</p>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#fafafa]/90 mb-2">First Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-[rgba(30,30,30,0.7)] border border-white/20 rounded-xl text-[#fafafa] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 transition-all duration-300 backdrop-blur-sm"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#fafafa]/90 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[rgba(30,30,30,0.7)] border border-white/20 rounded-xl text-[#fafafa] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#fafafa]/90 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[rgba(30,30,30,0.7)] border border-white/20 rounded-xl text-[#fafafa] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#fafafa]/90 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[rgba(30,30,30,0.7)] border border-white/20 rounded-xl text-[#fafafa] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 transition-all duration-300 backdrop-blur-sm"
                        placeholder="Create password"
                        required
                      />
                    </div>
                    <p className="text-xs text-white/60 mt-2">Must be at least 8 characters with uppercase, lowercase, and number</p>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-white bg-white/10 border-white/30 rounded focus:ring-white focus:ring-2"
                        required
                      />
                      <label className="text-sm text-[#fafafa]/80">
                        I accept Lightwell's <a href="/terms" className="text-white hover:text-[#fafafa]/80 underline">Terms of Service</a> to access JAMI-3
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-white bg-white/10 border-white/30 rounded focus:ring-white focus:ring-2"
                        required
                      />
                      <label className="text-sm text-[#fafafa]/80">
                        I accept Lightwell's <a href="/privacy" className="text-white hover:text-[#fafafa]/80 underline">Privacy Policy</a> and consent to HIPAA-compliant data handling
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gpt5-beam-gradient hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    <span>{isLoading ? 'Creating your JAMI-3 account...' : 'Continue with JAMI-3'}</span>
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-8 text-center">
                  <p className="text-[#fafafa]/80 text-sm">
                    Already have a JAMI-3 account? <a href="/login" className="text-white hover:text-[#fafafa]/80 font-semibold underline">Sign in here</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="text-center mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-white/60 mb-3">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Lightwell HIPAA Compliant
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  SOC 2 Type II Certified
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  FDA Ready Platform
                </span>
              </div>
              <p className="text-xs text-white/40 px-4">
                Your JAMI-3 conversations are secured by enterprise-grade Lightwell infrastructure
              </p>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      </div>
    </>
  );
}
