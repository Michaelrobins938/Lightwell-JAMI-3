import { useCallback, useRef, useEffect } from 'react';

interface UseAutoScrollOptions {
  enabled?: boolean;
  threshold?: number;
  smooth?: boolean;
}

export const useAutoScroll = (options: UseAutoScrollOptions = {}, deps: React.DependencyList = []) => {
  const {
    enabled = true,
    threshold = 100,
    smooth = true
  } = options;

  const scrollRef = useRef<HTMLElement | null>(null);
  const isNearBottom = useRef(false);
  const shouldAutoScroll = useRef(true);

  // Check if user is near bottom of scrollable area
  const checkIfNearBottom = useCallback(() => {
    if (!scrollRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!scrollRef.current || !shouldAutoScroll.current) return;
    
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: smooth ? behavior : 'auto'
    });
  }, [smooth]);

  // Scroll to top
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!scrollRef.current) return;
    
    scrollRef.current.scrollTo({
      top: 0,
      behavior: smooth ? behavior : 'auto'
    });
  }, [smooth]);

  // Scroll to specific element
  const scrollToElement = useCallback((element: HTMLElement, behavior: ScrollBehavior = 'smooth') => {
    if (!scrollRef.current) return;
    
    element.scrollIntoView({
      behavior: smooth ? behavior : 'auto',
      block: 'nearest',
      inline: 'nearest'
    });
  }, [smooth]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    
    isNearBottom.current = checkIfNearBottom();
    
    // If user scrolls up, disable auto-scroll
    if (!isNearBottom.current) {
      shouldAutoScroll.current = false;
    }
  }, [checkIfNearBottom]);

  // Re-enable auto-scroll when user scrolls to bottom
  const handleScrollToBottom = useCallback(() => {
    shouldAutoScroll.current = true;
    scrollToBottom();
  }, [scrollToBottom]);

  // Disable auto-scroll
  const disableAutoScroll = useCallback(() => {
    shouldAutoScroll.current = false;
  }, []);

  // Enable auto-scroll
  const enableAutoScroll = useCallback(() => {
    shouldAutoScroll.current = true;
    scrollToBottom();
  }, [scrollToBottom]);

  // Set scroll reference
  const setScrollRef = useCallback((element: HTMLElement | null) => {
    // Clean up previous element
    if (scrollRef.current) {
      scrollRef.current.removeEventListener('scroll', handleScroll);
    }

    scrollRef.current = element;

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Auto-scroll on content changes
  useEffect(() => {
    if (enabled && shouldAutoScroll.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [enabled, shouldAutoScroll, scrollToBottom]);

  return {
    scrollRef: setScrollRef,
    scrollToBottom,
    scrollToTop,
    scrollToElement,
    isNearBottom: isNearBottom.current,
    shouldAutoScroll: shouldAutoScroll.current,
    enableAutoScroll,
    disableAutoScroll,
    checkIfNearBottom
  };
};
