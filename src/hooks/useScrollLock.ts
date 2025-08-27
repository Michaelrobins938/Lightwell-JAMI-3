import { useRef, useCallback, useEffect, useState } from 'react';

export interface UseScrollLockReturn {
  scrollRef: React.RefObject<HTMLDivElement>;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  isUserScrolling: boolean;
  isLockedToBottom: boolean;
  scrollToBottom: () => void;
  lockToBottom: () => void;
  unlockFromBottom: () => void;
}

export function useScrollLock(dependencies: any[] = []): UseScrollLockReturn {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isLockedToBottom, setIsLockedToBottom] = useState(true);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsLockedToBottom(true);
    }
  }, []);

  const lockToBottom = useCallback(() => {
    setIsLockedToBottom(true);
    scrollToBottom();
  }, [scrollToBottom]);

  const unlockFromBottom = useCallback(() => {
    setIsLockedToBottom(false);
  }, []);

  const isNearBottom = useCallback((element: HTMLDivElement): boolean => {
    const threshold = 100; // pixels from bottom
    const { scrollTop, scrollHeight, clientHeight } = element;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const currentScrollTop = element.scrollTop;
    
    // Detect if user is actively scrolling
    const isScrollingUp = currentScrollTop < lastScrollTopRef.current;
    lastScrollTopRef.current = currentScrollTop;

    // If user scrolls up significantly, unlock from bottom
    if (isScrollingUp && !isNearBottom(element)) {
      setIsLockedToBottom(false);
    } else if (isNearBottom(element)) {
      setIsLockedToBottom(true);
    }

    // Set user scrolling flag
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // Reset user scrolling flag after a delay
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 150);
  }, [isNearBottom]);

  // Auto-scroll to bottom when dependencies change (new messages, etc.)
  useEffect(() => {
    if (isLockedToBottom && !isUserScrolling) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50); // Small delay to ensure DOM is updated

      return () => clearTimeout(timeoutId);
    }
  }, [...dependencies, isLockedToBottom, isUserScrolling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollRef,
    handleScroll,
    isUserScrolling,
    isLockedToBottom,
    scrollToBottom,
    lockToBottom,
    unlockFromBottom,
  };
}