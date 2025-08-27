import { useState, useEffect } from 'react';

export function useScrollSpy(
  selectors: string[],
  offset: number = 0
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const elements = selectors.map((selector) => 
        document.getElementById(selector)
      ).filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return;

      // Find the element that's currently in view
      const scrollPosition = window.scrollY + offset;
      
      let currentActiveId: string | null = null;
      
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentActiveId = selectors[i];
          break;
        }
      }

      // If we're at the bottom, mark the last section as active
      if (!currentActiveId && scrollPosition + window.innerHeight >= document.documentElement.scrollHeight) {
        currentActiveId = selectors[selectors.length - 1];
      }

      // If we're at the top, mark the first section as active
      if (!currentActiveId && scrollPosition <= offset) {
        currentActiveId = selectors[0];
      }

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Call once to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectors, offset, activeId]);

  return activeId;
}
