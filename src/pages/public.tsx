import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '@/components/Public/Header';
import CenterInput from '@/components/Public/CenterInput';
import Footer from '@/components/Public/Footer';
import LoginModal from '@/components/Public/LoginModal';
import ChatInterface from '@/components/Public/ChatInterface';
import type { NextPageWithLayout } from './_app';

const PublicPage: NextPageWithLayout = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, content: string, role: 'user' | 'assistant'}>>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleNewChat = () => {
    setChatStarted(false);
    setMessages([]);
  };

  // Reset demo state when component mounts (for funnel loop)
  useEffect(() => {
    setChatStarted(false);
    setMessages([]);
    setIsTyping(false);
  }, []);

  // Canned responses for the demo funnel
  const getCannedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses: { [key: string]: string } = {
      // Exact matches for dropdown suggestions
      "how can JAMI-3 help with anxiety?": "I can help you understand anxiety better, teach coping strategies like breathing exercises and grounding techniques, and provide a safe space to talk through your feelings. Would you like to explore any specific aspect?",
      "tell me about mindfulness techniques": "Mindfulness is about staying present in the moment. I can guide you through techniques like deep breathing, body scans, and the 5-4-3-2-1 grounding exercise. These help calm your mind when you're feeling stressed or anxious. Which would you like to try first?",
      "i'm feeling overwhelmed today": "I hear you, and I'm glad you reached out. Feeling overwhelmed is completely valid. Let's take this one step at a time. What's been weighing on you most today? Sometimes just talking through it can help lighten the load.",
      "what are some coping strategies for stress?": "There are many effective stress management techniques I can share with you. These include deep breathing exercises, progressive muscle relaxation, time management strategies, and mindfulness practices. I can also help you identify your stress triggers. What type of stress are you dealing with most?",
      "how do i improve my sleep habits?": "Good sleep is essential for mental health. I can help you create better sleep hygiene habits like maintaining a consistent bedtime routine, limiting screen time before bed, creating a calming environment, and managing racing thoughts. What aspect of sleep is challenging you most?",
      
      // General greetings and help
      "help": "I'm here to listen and support you. What's been on your mind lately?",
      "JAMI-3": "I'm JAMI-3, designed to provide compassionate mental health support. How are you feeling today?",
      "hello": "Hello! I'm glad you're here. This is a safe space to share whatever's on your heart.",
      "hi": "Hi there! How can I help you today? 😊",
      "default": "I'm here to listen and support you. What would you like to talk about today?"
    };
    
    // Check for specific keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (keyword !== 'default' && lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleSubmitMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = { id: Date.now().toString(), content: message, role: 'user' as const };
    
    // Replace the entire conversation with just this new user message (ChatGPT demo style)
    setMessages([userMessage]);
    // Don't set chatStarted to true immediately - let the animation complete first
    
    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response with typing animation
    setTimeout(() => {
      const cannedResponse = getCannedResponse(message);
      const aiMessage = { 
        id: (Date.now() + 1).toString(), 
        content: '', // Start with empty content
        role: 'assistant' as const 
      };
      
      // Remove typing indicator and add empty AI message
      setIsTyping(false);
      setMessages([userMessage, aiMessage]);
      
      // Animate the typing effect
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex <= cannedResponse.length) {
          const partialContent = cannedResponse.slice(0, currentIndex);
          setMessages([
            userMessage,
            { ...aiMessage, content: partialContent + (currentIndex < cannedResponse.length ? '|' : '') }
          ]);
          currentIndex++;
        } else {
          // Remove cursor and finalize
          setMessages([
            userMessage,
            { ...aiMessage, content: cannedResponse }
          ]);
          clearInterval(typeInterval);
          // Now switch to ChatInterface for the interactive experience
          setTimeout(() => {
            setChatStarted(true);
          }, 500);
        }
      }, 15 + Math.random() * 15); // Faster typing speed for better UX

    }, 600 + Math.random() * 400); // Shorter delay for thinking animation
  };

  return (
    <>
      <Head>
        <title>JAMI-3 - Trusted Mental Health Support</title>
        <meta name="description" content="Trusted, caring, always present — bringing expert mental health support to anyone, anywhere." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        className="flex flex-col h-screen overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Version 2: Colored Glow Overlay - Adds Light Instead of Dimming */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
        <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header - Animate in first */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Header
              onLoginClick={() => setShowLoginModal(true)}
              onNewChat={handleNewChat}
            />
          </motion.div>
          
          {!chatStarted ? (
            <main className="flex-1 flex flex-col items-center justify-start pt-[5vh] pb-32 px-4">
                             {/* JAMI-3 Hero Section - Animate in second */}
               <motion.div
                 className="flex flex-col items-center w-full max-w-4xl"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{
                   duration: 0.6,
                   delay: 0.1,
                   ease: [0.25, 0.46, 0.45, 0.94]
                 }}
               >
                 {/* Header + Tagline with Soft Glow - Mobile responsive */}
                 <div className="text-center mb-8 sm:mb-12">
                   <motion.h1
                     className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-wide text-white mb-4 sm:mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                       duration: 0.7,
                       delay: 0.2,
                       ease: [0.25, 0.46, 0.45, 0.94]
                     }}
                                       >
                      JAMI-3
                    </motion.h1>
                   <motion.p
                     className="text-white/90 text-lg sm:text-xl font-normal max-w-3xl mx-auto leading-relaxed tracking-wide drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]"
                     style={{
                       textShadow: '0 3px 6px rgba(0,0,0,0.4)',
                       fontFamily: 'Nunito, system-ui, -apple-system, sans-serif'
                     }}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{
                       duration: 0.7,
                       delay: 0.3,
                       ease: [0.25, 0.46, 0.45, 0.94]
                     }}
                   >
                     Talk openly. Be heard. Find peace.
                   </motion.p>
                 </div>

                {/* Input with suggestions - Animate in last */}
                <motion.div
                  className="w-full max-w-[680px] relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <CenterInput onSubmit={handleSubmitMessage} />
                </motion.div>
              </motion.div>
            </main>
          ) : (
            <ChatInterface 
              messages={messages} 
              onSubmitMessage={handleSubmitMessage}
              onShowLoginModal={() => setShowLoginModal(true)}
              isTyping={isTyping}
            />
          )}

          {/* Footer - Animate in with the rest of landing page */}
          {!chatStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <Footer />
            </motion.div>
          )}
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </motion.div>
    </>
  );
};

// Define custom layout to bypass the default Layout wrapper
PublicPage.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default PublicPage;
