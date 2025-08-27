import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
// PersistenceDashboard removed - was causing infinite loops

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  // Check if this is a chat page that needs full viewport
  const isChatPage = router.pathname === '/chat' || 
                     router.pathname === '/enhanced-chat' || 
                     router.pathname.startsWith('/chat/');

  // Auto-hide header for chat pages
  useEffect(() => {
    if (!isChatPage) return;

    let hideTimeout: NodeJS.Timeout | null = null;
    let isHoveringHeader = false;

    const startHideTimer = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      hideTimeout = setTimeout(() => {
        if (!isHoveringHeader) {
          setIsHeaderVisible(false);
        }
      }, 2000); // Reduced to 2 seconds
    };

    const handleTopEdgeHover = (e: MouseEvent) => {
      // Only show header when mouse is very close to the top (within 5px)
      if (e.clientY <= 5) {
        setIsHeaderVisible(true);
        isHoveringHeader = true;
        startHideTimer();
      } else if (e.clientY > 20) {
        // Only hide when mouse moves away from the top area
        isHoveringHeader = false;
        startHideTimer();
      }
    };

    const handleHeaderInteraction = () => {
      setIsHeaderVisible(true);
      isHoveringHeader = true;
      startHideTimer();
    };

    const handlePageInteraction = () => {
      // Don't show header on general page interactions
      // Only show on intentional top-edge hover
    };

    // Event listeners
    document.addEventListener('mousemove', handleTopEdgeHover);
    
    // Header-specific interactions
    const headerElement = document.querySelector('header');
    if (headerElement) {
      headerElement.addEventListener('mouseenter', handleHeaderInteraction);
      headerElement.addEventListener('mouseleave', () => {
        isHoveringHeader = false;
        startHideTimer();
      });
    }

    // Page interactions (but don't show header)
    document.addEventListener('click', handlePageInteraction);
    document.addEventListener('keydown', handlePageInteraction);
    document.addEventListener('scroll', handlePageInteraction);

    // Initial state - show header briefly then hide
    setIsHeaderVisible(true);
    setTimeout(() => {
      if (!isHoveringHeader) {
        setIsHeaderVisible(false);
      }
    }, 1000);

    return () => {
      document.removeEventListener('mousemove', handleTopEdgeHover);
      document.removeEventListener('click', handlePageInteraction);
      document.removeEventListener('keydown', handlePageInteraction);
      document.removeEventListener('scroll', handlePageInteraction);
      if (headerElement) {
        headerElement.removeEventListener('mouseenter', handleHeaderInteraction);
        headerElement.removeEventListener('mouseleave', () => {
          isHoveringHeader = false;
          startHideTimer();
        });
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [isChatPage]);

  if (isChatPage) {
    // For chat pages: compact header, no scroll, full viewport for chat
    return (
      <div className="h-screen w-screen overflow-hidden bg-black">
        {/* Auto-hiding compact fixed header for chat pages */}
        <div 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
            isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
            <Header compact={true} />
          </div>
        </div>
        
        {/* Subtle top-edge indicator when header is hidden */}
        {!isHeaderVisible && (
          <div className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-gradient-to-r from-emerald-500/30 via-blue-500/30 to-purple-500/30 opacity-40 hover:opacity-80 transition-opacity duration-300" />
        )}
        
        {/* Chat content takes exact remaining viewport height */}
        <div className="h-full w-full relative"> {/* Removed pt-12 since chat is absolutely positioned */}
          {children}
        </div>
      </div>
    );
  }

  // For non-chat pages: normal scrollable layout
  return (
    <div className="min-h-screen flex flex-col bg-zinc-900/95 backdrop-blur-md text-white transition-colors duration-300">
      <Header />
      <main className="flex-grow bg-zinc-900/95 backdrop-blur-md">
        {children}
      </main>
      {/* PersistenceDashboard removed - was causing infinite loops */}
    </div>
  );
};

// Export as default for backward compatibility
export default Layout;