"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import dynamic from 'next/dynamic';
// React Icons - Mix of different icon libraries for uniqueness
// React Icons - Mix of different icon libraries for uniqueness
import {
  BsChevronDown, BsHouse, BsChatDots, BsPeople, BsStars, BsBook, BsHeart,
  BsBarChart, BsPerson, BsGear, BsBoxArrowRight
} from 'react-icons/bs';
import {
  MdDashboard, MdPsychology, MdScience, MdHealthAndSafety, MdSupport
} from 'react-icons/md';
import {
  FaUserMd, FaChartLine, FaMicroscope, FaGraduationCap, FaAward,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaLightbulb
} from 'react-icons/fa';
import {
  HiOutlineMenu, HiOutlineX, HiOutlineInformationCircle
} from 'react-icons/hi';
import {
  FiTarget, FiActivity, FiCalendar, FiBookmark, FiVideo, FiHeadphones,
  FiHelpCircle, FiMail, FiPhone, FiMapPin, FiUserCheck, FiClock
} from 'react-icons/fi';
import {
  IoRocketOutline, IoGlobeOutline, IoBuildOutline, IoBriefcaseOutline
} from 'react-icons/io5';
import {
  AiOutlineMessage, AiOutlineTeam
} from 'react-icons/ai';
import {
  RiPuzzleLine, RiHeartPulseLine
} from 'react-icons/ri';

function BlurHeader({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent hydration mismatch and detect mobile
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Clean navigation items - organized by priority and user journey
  const getNavItems = () => {
    const baseItems = [
      { name: 'Home', href: '/', icon: <BsHouse className="w-4 h-4" />, isActive: isClient && router.isReady && router.pathname === '/' },
      { 
        name: 'AI Therapy', 
        href: isAuthenticated && user ? '/chat' : '/public', 
        icon: <MdPsychology className="w-4 h-4" />, 
        isActive: isClient && router.isReady && (router.pathname === '/chat' || router.pathname === '/public'), 
        priority: true 
      },
      { name: 'Community', href: '/community', icon: <BsPeople className="w-4 h-4" />, isActive: isClient && router.isReady && router.pathname === '/community' },
      { name: 'Get Started', href: '/pre-onboarding', icon: <IoRocketOutline className="w-4 h-4" />, isActive: isClient && router.isReady && router.pathname === '/pre-onboarding' },
    ];

    if (isAuthenticated && user) {
      // For authenticated users - show personalized dashboard and progress
      return [
        ...baseItems,
        { name: 'Dashboard', href: '/dashboard', icon: <MdDashboard className="w-4 h-4" />, isActive: isClient && router.isReady && router.pathname === '/dashboard' },
        { name: 'Progress', href: '/progress', icon: <FaChartLine className="w-4 h-4" />, isActive: isClient && router.isReady && router.pathname === '/progress' },
      ];
    } else {
      // For anonymous users - focus on key features
      return [
        ...baseItems,
        { name: 'Features', href: '/features', icon: <BsStars className="w-4 h-4" />, isActive: isClient && router.isReady && router.pathname === '/features' },
      ];
    }
  };

  const navItems = getNavItems();

  // Define grouped navigation items for dropdowns
  const learnItems = [
    { name: 'Lightwell Home', href: '/', icon: <BsHouse className="w-4 h-4" />, description: 'Main homepage with JAMI-3 demo' },
    { name: 'Showcase', href: '/showcase', icon: <BsStars className="w-4 h-4" />, description: 'Experience our AI solution' },
    { name: 'Meet JAMI-3', href: '/meet-jamie', icon: <MdPsychology className="w-4 h-4" />, description: 'Discover our therapeutic AI' },
    { name: 'About', href: '/about', icon: <HiOutlineInformationCircle className="w-4 h-4" />, description: 'Our mission and story' },
    { name: 'Resources', href: '/resources', icon: <BsBook className="w-4 h-4" />, description: 'Educational content and materials' },
    { name: 'Research', href: '/research', icon: <FaMicroscope className="w-4 h-4" />, description: 'Scientific backing and studies' }
  ];

  const supportItems = [
    { name: 'Get Help', href: '/support', icon: <MdHealthAndSafety className="w-4 h-4" />, description: 'Find the support you need' },
    { name: 'Crisis Resources', href: '/crisis-resources', icon: <FaShieldAlt className="w-4 h-4" />, description: 'Emergency help and resources' },
    { name: 'Support Us', href: '/support-us', icon: <BsHeart className="w-4 h-4" />, description: 'Ways to support our mission' }
  ];

  // Enhanced dropdown menu items with more valuable features
  const dropdownItems = [
    {
      name: 'Lightwell Homepage',
      href: '/',
      description: 'Main homepage with JAMI-3 demo chat',
      icon: <BsHouse className="w-5 h-5" />,
      category: 'homepage'
    },
    {
      name: 'AI Therapy Sessions',
      href: isAuthenticated && user ? '/chat' : '/public',
      description: 'Personalized AI therapy with JAMI-3',
      icon: <MdPsychology className="w-5 h-5" />,
      category: 'therapy'
    },
    {
      name: 'JAMI-3 Enhanced Chat',
      href: isAuthenticated && user ? '/jami3-chat' : '/public',
      description: 'Full-featured modular chat with JAMI-3',
      icon: <MdPsychology className="w-5 h-5" />,
      category: 'therapy'
    },
    {
      name: 'JAMI-3 GPT-5 Demo',
      href: '/jami3-gpt5-demo',
      description: 'ChatGPT-5 style interface with JAMI-3',
      icon: <MdPsychology className="w-5 h-5" />,
      category: 'therapy'
    },
    {
      name: 'Personality Management',
      href: '/personality-management',
      description: 'Customize AI therapeutic personalities',
      icon: <BsGear className="w-5 h-5" />,
      category: 'therapy'
    },
    {
      name: 'Memory Insights',
      href: '/memory-insights',
      description: 'AI-powered therapeutic pattern analysis',
      icon: <MdPsychology className="w-5 h-5" />,
      category: 'therapy'
    },
    {
      name: 'Teams & Workspaces',
      href: '/team-workspace-management',
      description: 'Manage collaborative spaces and team members',
      icon: <AiOutlineTeam className="w-5 h-5" />,
      category: 'collaboration'
    },
    {
      name: 'Plugin Management',
      href: '/plugin-management',
      description: 'Manage external integrations and API actions',
      icon: <RiPuzzleLine className="w-5 h-5" />,
      category: 'integrations'
    },
    {
      name: 'Crisis Support',
      href: '/crisis-support',
      description: '24/7 crisis intervention & resources',
      icon: <MdHealthAndSafety className="w-5 h-5" />,
      category: 'crisis'
    },
    {
      name: 'Progress Tracking',
      href: '/dashboard',
      description: 'Monitor your mental health journey',
      icon: <FaChartLine className="w-5 h-5" />,
      category: 'tracking'
    },
    {
      name: 'Meditation & Mindfulness',
      href: '/meditation',
      description: 'Guided sessions for inner peace',
      icon: <FiHeadphones className="w-5 h-5" />,
      category: 'wellness'
    },
    {
      name: 'Educational Content',
      href: '/resources',
      description: 'Learn about mental health & wellness',
      icon: <FaGraduationCap className="w-5 h-5" />,
      category: 'education'
    },
    {
      name: 'Goal Setting',
      href: '/goals',
      description: 'Set & track personal wellness goals',
      icon: <FiTarget className="w-5 h-5" />,
      category: 'goals'
    },
    {
      name: 'Support Groups',
      href: '/community',
      description: 'Connect with peers & professionals',
      icon: <BsPeople className="w-5 h-5" />,
      category: 'community'
    },
    {
      name: 'Professional Referrals',
      href: '/referrals',
      description: 'Find licensed mental health professionals',
      icon: <FiUserCheck className="w-5 h-5" />,
      category: 'referrals'
    },
    {
      name: 'Sleep Tracking',
      href: '/sleep-tracker',
      description: 'Monitor & improve your sleep quality',
      icon: <FiClock className="w-5 h-5" />,
      category: 'tracking'
    },
    {
      name: 'Mood Journal',
      href: '/mood-journal',
      description: 'Track daily emotions & patterns',
      icon: <FiBookmark className="w-5 h-5" />,
      category: 'tracking'
    },
    {
      name: 'CBT Exercises',
      href: '/resources/cbt',
      description: 'Cognitive Behavioral Therapy tools',
      icon: <FaLightbulb className="w-5 h-5" />,
      category: 'therapy'
    },
    {
      name: 'Crisis Resources',
      href: '/crisis-resources',
      description: 'Emergency contacts & immediate help',
      icon: <FaShieldAlt className="w-5 h-5" />,
      category: 'crisis'
    },
    {
      name: 'Video Sessions',
      href: '/video-therapy',
      description: 'Guided video therapy sessions',
      icon: <FiVideo className="w-5 h-5" />,
      category: 'therapy'
    },
    {
      name: 'Assessment Tools',
      href: '/assessments',
      description: 'Mental health screening & evaluation',
      icon: <BsBarChart className="w-5 h-5" />,
      category: 'assessment'
    },
    {
      name: 'Wellness Challenges',
      href: '/challenges',
      description: '30-day wellness challenges',
      icon: <FaAward className="w-5 h-5" />,
      category: 'wellness'
    }
  ];

  // Group items by category for better organization
  const groupedItems = dropdownItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof dropdownItems>);

  const categoryLabels = {
    homepage: 'Homepage',
    therapy: 'AI Therapy',
    crisis: 'Crisis Support',
    tracking: 'Progress Tracking',
    wellness: 'Wellness',
    education: 'Education',
    goals: 'Goal Setting',
    community: 'Community',
    referrals: 'Professional Help',
    assessment: 'Assessment'
  };

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Improved dropdown handling with longer delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown('Features');
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 500); // Increased delay to allow mouse movement to dropdown
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        // Check if click is not on Learn or Support triggers
        const learnTrigger = document.querySelector('[data-dropdown="Learn"]');
        const supportTrigger = document.querySelector('[data-dropdown="Support"]');
        const featuresTrigger = document.querySelector('[data-dropdown="Features"]');

        if (learnTrigger && learnTrigger.contains(event.target as Node)) return;
        if (supportTrigger && supportTrigger.contains(event.target as Node)) return;
        if (featuresTrigger && featuresTrigger.contains(event.target as Node)) return;

        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className={`sticky top-0 z-20 mx-auto flex w-full items-center justify-between ${compact ? 'p-2 sm:px-4' : 'p-3 sm:px-6'} bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800`}>
      
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        {/* Enhanced Logo */}
        <Link href="/landingpage" className="z-[10] flex items-center space-x-2 group">
          <motion.div
            className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-md"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              rotate: [0, -1, 1, 0]
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-400/30 via-blue-400/30 to-purple-400/30 blur-sm"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Medical cross with AI circuit pattern */}
            <div className="relative z-10 w-5 h-5 flex items-center justify-center">
              {/* Vertical bar of cross */}
              <div className="absolute w-1 h-4 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full shadow-sm" />
              {/* Horizontal bar of cross */}
              <div className="absolute w-4 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-sm" />
              
              {/* AI circuit dots */}
              <motion.div
                className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-80"
                style={{ top: '2px', left: '9px' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-80"
                style={{ bottom: '2px', right: '9px' }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          <div className="flex flex-col">
            <motion.span 
              className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              JAMI-3
            </motion.span>
            <span className="text-[9px] font-medium text-emerald-400/70 tracking-wider uppercase -mt-1 group-hover:text-emerald-300/80 transition-colors duration-300">
              AI Healthcare
            </span>
          </div>
        </Link>
        
        {/* Enhanced Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 z-[10]">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium overflow-hidden ${
                item.isActive
                  ? 'text-white bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 shadow-sm'
                  : item.priority
                  ? 'text-emerald-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-blue-500/10 border border-emerald-500/20 hover:border-emerald-400/40'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50'
              }`}
            >
              <div className={`relative z-10 transition-transform duration-200 group-hover:scale-110 ${
                item.priority ? 'text-emerald-400' : ''
              }`}>
                {item.icon}
              </div>
              <span className="relative z-10 font-medium">{item.name}</span>
            </Link>
          ))}

          {/* Simplified Dropdown Triggers */}
          <div className="flex items-center space-x-1">
            {/* Learn dropdown trigger */}
            <div
              className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50 cursor-pointer"
              data-dropdown="Learn"
              onMouseEnter={() => {
                if (!isMobile) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setActiveDropdown('Learn');
                }
              }}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile) {
                  setActiveDropdown(activeDropdown === 'Learn' ? null : 'Learn');
                }
              }}
            >
              <BsBook className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">Learn</span>
              <BsChevronDown className={`w-3 h-3 text-zinc-500 transition-all duration-200 group-hover:text-zinc-300 ${
                activeDropdown === 'Learn' ? 'rotate-180' : ''
              }`} />
            </div>

            {/* Support dropdown trigger */}
            <div
              className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50 cursor-pointer"
              data-dropdown="Support"
              onMouseEnter={() => {
                if (!isMobile) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setActiveDropdown('Support');
                }
              }}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile) {
                  setActiveDropdown(activeDropdown === 'Support' ? null : 'Support');
                }
              }}
            >
              <BsHeart className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 text-red-400 group-hover:text-red-300" />
              <span className="font-medium">Support</span>
              <BsChevronDown className={`w-3 h-3 text-zinc-500 transition-all duration-200 group-hover:text-zinc-300 ${
                activeDropdown === 'Support' ? 'rotate-180' : ''
              }`} />
            </div>

            {/* More dropdown trigger */}
            <div
              ref={triggerRef}
              className="group relative flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50 cursor-pointer"
              data-dropdown="Features"
              onMouseEnter={() => !isMobile && handleMouseEnter()}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile) {
                  setActiveDropdown(activeDropdown === 'Features' ? null : 'Features');
                }
              }}
            >
              <BsStars className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 text-purple-400 group-hover:text-purple-300" />
              <span className="font-medium">More</span>
              <BsChevronDown className={`w-3 h-3 text-zinc-500 transition-all duration-200 group-hover:text-zinc-300 ${
                activeDropdown === 'Features' ? 'rotate-180' : ''
              }`} />
            </div>
          </div>
        </nav>
        
        {/* Enhanced Right side - Authentication */}
        <div className="hidden lg:flex items-center space-x-4 z-[10]">
          {!isClient || isLoading ? (
            <div className="w-8 h-8 border-2 border-emerald-600/30 border-t-emerald-500 rounded-full animate-spin" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              {/* Enhanced User Profile Dropdown */}
              <div className="relative">
                <motion.button
                  className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 hover:from-zinc-700/80 hover:to-zinc-600/80 border border-zinc-600/50 hover:border-zinc-500/50 rounded-xl transition-all duration-300 shadow-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDropdownToggle('UserMenu')}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <BsPerson className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-white text-sm font-semibold">{user.name}</span>
                    <span className="text-emerald-400/70 text-xs">Online</span>
                  </div>
                  <BsChevronDown className={`w-3 h-3 text-zinc-400 transition-all duration-300 ${
                    activeDropdown === 'UserMenu' ? 'rotate-180 text-zinc-200' : ''
                  }`} />
                </motion.button>
                
                {/* User Dropdown Menu */}
                {activeDropdown === 'UserMenu' && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-48 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-xl shadow-2xl z-[20]"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3">
                      <div className="border-b border-zinc-700/50 pb-3 mb-3">
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-zinc-400 text-xs">{user.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-2 px-2 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 text-sm"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <BsBarChart className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-2 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 text-sm"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <BsGear className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setActiveDropdown(null);
                            router.push('/landingpage');
                          }}
                          className="flex items-center space-x-2 w-full text-left px-2 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-sm"
                        >
                          <BsBoxArrowRight className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <motion.button
                  className="px-5 py-2.5 text-zinc-300 hover:text-white border border-zinc-700/50 hover:border-zinc-600/50 rounded-xl transition-all duration-300 text-sm font-medium hover:bg-zinc-800/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-emerald-500/25 overflow-hidden group"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Get Started</span>
                </motion.button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-1.5 rounded-md hover:bg-white/10 transition-colors duration-200 z-[10]"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiOutlineX className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiOutlineMenu className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </button>
      </div>
      
      {/* Enhanced Dropdown Menu - Organized by categories */}
      {activeDropdown && activeDropdown !== 'Learn' && activeDropdown !== 'Support' && (
        <>
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-96 bg-zinc-900 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl z-[50]"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
                setActiveDropdown('Features');
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-white font-semibold text-sm mb-2">Mental Health Features</h3>
                  <p className="text-zinc-400 text-xs">Comprehensive tools for your wellness journey</p>
                </div>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-zinc-300 text-xs font-medium uppercase tracking-wide">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                          >
                            <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-200">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm truncate">{item.name}</div>
                              <div className="text-zinc-400 text-xs truncate">{item.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Need immediate help?</span>
                    <Link href="/crisis-support" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Crisis Support →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Learn Dropdown Menu */}
      {activeDropdown === 'Learn' && (
        <AnimatePresence>
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-80 bg-zinc-900 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl z-[50]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              setActiveDropdown('Learn');
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-white font-semibold text-sm mb-2">Learn About JAMI-3</h3>
                <p className="text-zinc-400 text-xs">Discover our mission, features, and research</p>
              </div>
              <div className="space-y-1">
                {learnItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-md group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-200">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">{item.name}</div>
                      <div className="text-zinc-400 text-xs truncate">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Support Dropdown Menu */}
      {activeDropdown === 'Support' && (
        <AnimatePresence>
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-80 bg-zinc-900 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl z-[50]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              setActiveDropdown('Support');
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-white font-semibold text-sm mb-2">Get Support</h3>
                <p className="text-zinc-400 text-xs">Find help and ways to support our mission</p>
              </div>
              <div className="space-y-1">
                {supportItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="p-1.5 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-md group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all duration-200">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">{item.name}</div>
                      <div className="text-zinc-400 text-xs truncate">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <AnimatePresence>
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 z-[10] max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 space-y-1">
                {/* Priority actions at the top */}
                <Link
                  href={isAuthenticated && user ? '/chat' : '/public'}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MdPsychology className="w-4 h-4" />
                  <span>AI Therapy</span>
                  <span className="ml-auto text-xs bg-emerald-500/20 px-2 py-1 rounded-full">Recommended</span>
                </Link>

                <Link
                  href="/pre-onboarding"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IoRocketOutline className="w-4 h-4" />
                  <span>Get Started</span>
                  <span className="ml-auto text-xs bg-purple-500/20 px-2 py-1 rounded-full">New</span>
                </Link>

                {/* Features - Main Navigation */}
                <Link
                  href="/features"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                    isClient && router.isReady && router.pathname === '/features'
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BsStars className="w-4 h-4" />
                  <span>Features</span>
                </Link>

                {/* Show user-specific actions */}
                {isAuthenticated && user && (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BsPerson className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {!isAuthenticated && (
                  <Link
                    href="/signup"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BsPerson className="w-4 h-4" />
                    <span>Sign Up</span>
                    <span className="ml-auto text-xs bg-purple-500/20 px-2 py-1 rounded-full">Free</span>
                  </Link>
                )}

                {navItems.filter(item =>
                  item.name !== 'AI Therapy' &&
                  item.name !== 'Dashboard' &&
                  item.name !== 'Sign Up' &&
                  item.name !== 'Progress' &&
                  item.name !== 'Features'
                ).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      item.isActive
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Mobile Learn dropdown */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-zinc-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                    onClick={() => handleDropdownToggle('Learn')}
                  >
                    <div className="flex items-center space-x-2">
                      <BsBook className="w-4 h-4" />
                      <span>Learn</span>
                    </div>
                    <BsChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === 'Learn' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === 'Learn' && (
                    <motion.div
                      className="pl-4 space-y-2 mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {learnItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-2 py-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-zinc-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Mobile Support dropdown */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-zinc-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                    onClick={() => handleDropdownToggle('Support')}
                  >
                    <div className="flex items-center space-x-2">
                      <BsHeart className="w-4 h-4" />
                      <span>Support</span>
                    </div>
                    <BsChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === 'Support' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === 'Support' && (
                    <motion.div
                      className="pl-4 space-y-2 mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {supportItems
                        .sort((a, b) => {
                          // Prioritize crisis resources and getting help
                          const priority = ['Get Help', 'Crisis Resources'];
                          const aPriority = priority.includes(a.name) ? 1 : 0;
                          const bPriority = priority.includes(b.name) ? 1 : 0;
                          return bPriority - aPriority;
                        })
                        .map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center space-x-2 py-2 transition-colors duration-200 text-sm ${
                            item.name === 'Crisis Resources'
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                              : item.name === 'Get Help'
                              ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-zinc-500">{item.description}</div>
                          </div>
                          {item.name === 'Crisis Resources' && (
                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Urgent</span>
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Mobile Enhanced Features dropdown */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-zinc-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                    onClick={() => handleDropdownToggle('Features')}
                  >
                    <div className="flex items-center space-x-2">
                      <BsStars className="w-4 h-4" />
                      <span>Features</span>
                    </div>
                    <BsChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === 'Features' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === 'Features' && (
                    <motion.div
                      className="pl-4 space-y-3 mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category} className="space-y-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wide">
                              {categoryLabels[category as keyof typeof categoryLabels]}
                            </span>
                          </div>
                          {items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-2 py-1.5 text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.icon}
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-zinc-500">{item.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                {/* Mobile Authentication Section */}
                <div className="pt-3 border-t border-white/10 space-y-1">
                  {!isClient || isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  ) : isAuthenticated && user ? (
                    <div className="space-y-3">
                      <div className="px-3 py-2 bg-zinc-800/30 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <BsPerson className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{user.name}</p>
                            <p className="text-zinc-400 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link href="/dashboard">
                        <button 
                          className="w-full flex items-center space-x-2 text-left px-3 py-2 text-zinc-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BsBarChart className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                      </Link>
                      
                      <Link href="/profile">
                        <button 
                          className="w-full flex items-center space-x-2 text-left px-3 py-2 text-zinc-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BsGear className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                          router.push('/landingpage');
                        }}
                        className="w-full flex items-center space-x-2 text-left px-3 py-2 text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
                      >
                        <BsBoxArrowRight className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link href="/login">
                        <button 
                          className="w-full text-left px-3 py-2 text-zinc-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </button>
                      </Link>
                      <Link href="/signup">
                        <button 
                          className="w-full text-left px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                  
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </header>
  );
}

const Header = ({ compact = false }: { compact?: boolean }) => {
  return <BlurHeader compact={compact} />;
};

export default Header;
