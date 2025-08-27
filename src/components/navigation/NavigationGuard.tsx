'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

interface NavigationGuardProps {
  children: React.ReactNode;
  isActive: boolean;
  message?: string;
  onConfirm?: () => void;
}

export const NavigationGuard: React.FC<NavigationGuardProps> = ({
  children,
  isActive,
  message = "Are you sure you want to leave? Your progress will be lost.",
  onConfirm
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    const handleRouteChange = (url: string) => {
      if (isActive) {
        const confirmed = window.confirm(message);
        if (!confirmed) {
          router.events.emit('routeChangeError');
          throw 'Route change aborted.';
        }
        if (onConfirm) {
          onConfirm();
        }
      }
    };

    // Prevent browser back/forward
    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [isActive, message, router, onConfirm]);

  return <>{children}</>;
};

export default NavigationGuard;
