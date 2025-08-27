"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Lightbulb, MessageCircle, BookOpen, Users, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/router';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  priority: number;
}

const ContextualSuggestions = () => {
  const [currentSuggestions, setCurrentSuggestions] = useState<Suggestion[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const router = useRouter();

  // Define contextual suggestions based on current page and user journey
  const getContextualSuggestions = (): Suggestion[] => {
    const path = router.pathname;
    const suggestions: Suggestion[] = [];

    switch (path) {
      case '/':
        suggestions.push(
          {
            id: 'start-therapy-home',
            title: 'Ready to start your therapy journey?',
            description: 'Take the first step towards better mental health with our AI companion Jamie.',
            action: 'Get Started',
            href: '/onboarding',
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'emerald',
            priority: 1
          },
          {
            id: 'learn-about-jamie',
            title: 'Meet Jamie',
            description: 'Learn about our therapeutic AI and how it can support your mental health.',
            action: 'Meet Jamie',
            href: '/meet-jamie',
            icon: <Lightbulb className="w-5 h-5" />,
            color: 'blue',
            priority: 2
          }
        );
        break;

      case '/chat':
        suggestions.push(
          {
            id: 'after-chat-resources',
            title: 'Continue your wellness journey',
            description: 'Explore additional resources and tools to support your mental health.',
            action: 'Browse Resources',
            href: '/resources',
            icon: <BookOpen className="w-5 h-5" />,
            color: 'purple',
            priority: 1
          },
          {
            id: 'join-community',
            title: 'Connect with others',
            description: 'Share experiences and find support in our mental health community.',
            action: 'Join Community',
            href: '/community',
            icon: <Users className="w-5 h-5" />,
            color: 'green',
            priority: 2
          }
        );
        break;

      case '/meet-jamie':
        suggestions.push(
          {
            id: 'try-therapy-after-meet',
            title: 'Experience Jamie in action',
            description: 'Now that you know Jamie, start your personalized therapy journey.',
            action: 'Get Started',
            href: '/onboarding',
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'emerald',
            priority: 1
          },
          {
            id: 'learn-more-about-us',
            title: 'Our Mission',
            description: 'Discover the science and research behind our therapeutic approach.',
            action: 'Learn More',
            href: '/about',
            icon: <Lightbulb className="w-5 h-5" />,
            color: 'blue',
            priority: 2
          }
        );
        break;

      case '/resources':
        suggestions.push(
          {
            id: 'start-therapy-from-resources',
            title: 'Ready to talk?',
            description: 'Sometimes reading isn\'t enough. Connect with Jamie for personalized support.',
            action: 'Get Started',
            href: '/onboarding',
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'emerald',
            priority: 1
          },
          {
            id: 'track-progress',
            title: 'Track your journey',
            description: 'Monitor your mental health progress and set wellness goals.',
            action: 'View Progress',
            href: '/progress',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'orange',
            priority: 2
          }
        );
        break;

      default:
        // Generic suggestions for other pages
        suggestions.push(
          {
            id: 'general-therapy',
            title: 'Need someone to talk to?',
            description: 'Our AI companion Jamie is here to listen and support you 24/7.',
            action: 'Get Started',
            href: '/onboarding',
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'emerald',
            priority: 1
          }
        );
    }

    // Filter out dismissed suggestions
    return suggestions.filter(suggestion => !dismissedSuggestions.includes(suggestion.id));
  };

  useEffect(() => {
    const suggestions = getContextualSuggestions();
    if (suggestions.length > 0) {
      setCurrentSuggestions(suggestions);
      // Show suggestions after a brief delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [router.pathname]);

  const dismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
    setCurrentSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  if (!isVisible || currentSuggestions.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-sm space-y-3">
      <AnimatePresence>
        {currentSuggestions.slice(0, 2).map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            className={`bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-4 shadow-2xl relative overflow-hidden`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {/* Dismiss button */}
            <button
              onClick={() => dismissSuggestion(suggestion.id)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-200 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon and content */}
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 bg-${suggestion.color}-500/20 rounded-lg flex-shrink-0`}>
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {suggestion.title}
                </h4>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => {
                dismissSuggestion(suggestion.id);
                router.push(suggestion.href);
              }}
              className={`w-full bg-${suggestion.color}-500/20 hover:bg-${suggestion.color}-500/30 border border-${suggestion.color}-500/30 hover:border-${suggestion.color}-500/50 text-${suggestion.color}-400 hover:text-${suggestion.color}-300 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 group`}
            >
              {suggestion.action}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ContextualSuggestions;
