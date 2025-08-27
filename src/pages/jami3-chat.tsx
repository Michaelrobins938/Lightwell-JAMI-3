import React, { useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

// Import modular system components
import { AppShell } from '../modular/shared/components';
import { ChatWindow, initializeChat } from '../modular/features/chat';
import { initializeLunaWeb, presets } from '../modular';

export default function JAMI3ChatPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Initialize the modular system
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize with full therapy preset
        const result = await initializeLunaWeb(presets.fullTherapy);
        console.log('🎉 Luna Web Modular System initialized:', result);
        
        // Initialize chat specifically
        await initializeChat();
      } catch (error) {
        console.error('❌ Failed to initialize modular system:', error);
      }
    };

    init();
  }, []);

  // Handle authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/public'); 
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
          <p className="text-slate-300">Initializing JAMI-3 Modular System...</p>
          <div className="flex justify-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gpt5-beam-gradient rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Custom header for JAMI-3
  const header = (
    <div className="flex items-center justify-between w-full px-2">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gpt5-beam-gradient rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">J3</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">JAMI-3</h1>
          <p className="text-xs text-slate-400">Modular AI Therapy</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gpt5-amber-start rounded-full animate-pulse" />
        <span className="text-xs text-slate-400">Online</span>
      </div>
    </div>
  );

  // Custom sidebar for chat history
  const sidebar = (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white mb-1">JAMI-3</h2>
        <p className="text-sm text-slate-400">Your AI Therapeutic Companion</p>
      </div>
      
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Recent Conversations
          </h3>
          <div className="space-y-1">
            {[
              'How to manage anxiety',
              'Sleep improvement techniques',
              'Building healthy habits',
              'Stress management session'
            ].map((title, index) => (
              <div
                key={index}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
              >
                {title}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            <button className="w-full px-3 py-2 text-sm text-left text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              New Session
            </button>
            <button className="w-full px-3 py-2 text-sm text-left text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              Export Chat
            </button>
            <button className="w-full px-3 py-2 text-sm text-left text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gpt5-beam-gradient rounded-full flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm text-white font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">{user?.plan || 'Free'} Plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>JAMI-3 Modular Chat - Lightwell</title>
        <meta name="description" content="Enhanced JAMI-3 chat with modular architecture" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <AppShell 
        header={header}
        sidebar={sidebar}
        showSidebar={true}
      >
        <ChatWindow />
      </AppShell>
    </>
  );
}