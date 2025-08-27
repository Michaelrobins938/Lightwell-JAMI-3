import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import React, { useEffect } from 'react';
import '../styles/globals.css';
import { Layout } from '../components/layout/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { SessionProvider } from 'next-auth/react';

// Extend Window interface to include motion property
declare global {
  interface Window {
    motion?: {
      useInView: () => { inView: boolean };
    };
  }
}

// Quick fix for disabling scroll animations on specific pages:
/*
1. Set DISABLE_ANIMATIONS = true above
2. Or call disableAnimations() in browser console
3. Or run: node scripts/disable-animations.js

For immediate results, you can also temporarily replace motion.div with regular div:
- Search: <motion\.div
- Replace: <div className="opacity-100"
*/

// Disable all scroll animations for screenshot purposes
const DISABLE_ANIMATIONS = true; // Set to true to disable animations
const DISABLE_SCROLL_ANIMATIONS = true; // Set to true to disable scroll-reveal animations

// For bulk animation removal, run the script: scripts/disable-animations.js

// Animation disabling utility
if (DISABLE_ANIMATIONS && typeof window !== 'undefined') {
  // Override framer-motion's whileInView to always render visible
  const originalUseInView = window?.motion?.useInView;
  if (originalUseInView) {
    window.motion.useInView = () => ({ inView: true });
  }

  // Disable CSS transitions temporarily
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;
  document.head.appendChild(style);
}

// Quick animation disabler function (call this from browser console)
const disableAllAnimations = () => {
  // Force all elements to be visible
  document.querySelectorAll('[style*="opacity"]').forEach(el => {
    const style = getComputedStyle(el);
    if (parseFloat(style.opacity) < 1) {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    }
  });

  // Remove loading states
  document.querySelectorAll('[data-loading]').forEach(el => {
    el.removeAttribute('data-loading');
  });

  console.log('✅ All animations disabled for screenshot purposes');
};

// Make it available globally for easy access
if (DISABLE_ANIMATIONS && typeof window !== 'undefined') {
  (window as any).disableAnimations = disableAllAnimations;
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  // Otherwise, wrap with the default Layout component
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  // Apply CSS class to disable scroll animations
  useEffect(() => {
    if (DISABLE_SCROLL_ANIMATIONS && typeof document !== 'undefined') {
      document.body.classList.add('disable-scroll-animations');
    }
    return () => {
      if (DISABLE_SCROLL_ANIMATIONS && typeof document !== 'undefined') {
        document.body.classList.remove('disable-scroll-animations');
      }
    };
  }, []);

  return (
    <React.StrictMode>
      <SessionProvider session={session}>
        <AuthProvider>
          {getLayout(<Component {...pageProps} />)}
        </AuthProvider>
      </SessionProvider>
    </React.StrictMode>
  );
}