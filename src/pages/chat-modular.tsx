import React, { useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

// Import modular chat system
import { ChatWindow, initializeChat } from '../modular/features/chat';
import { initializeLunaWeb, presets } from '../modular';

export default function ModularChatPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Initialize the modular system
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize with full therapy preset
        const result = await initializeLunaWeb(presets.fullTherapy);
        console.log('Luna Web initialized:', result);
        
        // Initialize chat specifically
        await initializeChat();
      } catch (error) {
        console.error('Failed to initialize modular system:', error);
      }
    };

    init();
  }, []);

  // Handle authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/public'); // Redirect to public page for non-authenticated users
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gpt5-beam-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-xl">
            <span className="text-white text-xl font-bold">J3</span>
          </div>
          <p className="text-slate-300">Initializing JAMI-3...</p>
        </div>
      </div>
    );
  }

  // Show authentication required
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <>
      <Head>
        <title>JAMI-3 Chat - Lightwell</title>
        <meta name="description" content="Chat with JAMI-3, your AI therapeutic companion" />
      </Head>

      {/* Full-screen chat interface */}
      <div className="fixed inset-0 overflow-hidden">
        <ChatWindow />
      </div>
    </>
  );
}