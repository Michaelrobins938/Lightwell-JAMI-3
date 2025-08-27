import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GoogleSignInProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleSignIn({ onSuccess, onError, isLoading = false }: GoogleSignInProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Mark component as mounted on client
    setIsClient(true);
    
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (isClient && googleLoaded && buttonRef.current) {
      initializeGoogleSignIn();
    }
  }, [isClient, googleLoaded]);

  const initializeGoogleSignIn = () => {
    if (typeof window !== 'undefined' && window.google && buttonRef.current) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId || clientId === 'your-google-client-id-here') {
        onError('Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.');
        return;
      }
      
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
      });
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      // Send the ID token to your backend
      const authResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      if (authResponse.ok) {
        const data = await authResponse.json();
        onSuccess(data.token);
      } else {
        const errorData = await authResponse.json();
        onError(errorData.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      onError('Failed to authenticate with Google');
    }
  };

  // Don't render anything until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full">
        <div 
          className="w-full bg-slate-700 text-white font-medium py-3 px-6 rounded-lg border border-slate-600 flex items-center justify-center space-x-3"
          style={{ 
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Loading Google Sign-In...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={buttonRef}
        className="w-full"
        style={{ 
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
      {/* Fallback button in case Google API doesn't load */}
      {!googleLoaded && (
        <button
          onClick={() => onError('Google Sign-In is not configured. Please set up your Google OAuth credentials. See docs/GOOGLE_OAUTH_QUICK_SETUP.md for instructions.')}
          disabled={isLoading}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>
      )}
    </div>
  );
}
