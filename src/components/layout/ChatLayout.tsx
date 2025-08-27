import React from 'react';
import { useRouter } from 'next/router';
import BlurHeader from './header'; // Corrected import path

interface ChatLayoutProps {
  children: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const router = useRouter();
  
  // Only show sidebar on chat-related routes
  const isChatRoute = router.pathname === '/chat' || 
                     router.pathname === '/enhanced-chat' || 
                     router.pathname.startsWith('/chat/');

  if (!isChatRoute) {
    // For non-chat routes, render without sidebar
    return <>{children}</>;
  }

  // For chat routes, wrap children with BlurHeader
  return (
    <div className="flex flex-col h-screen">
      <BlurHeader compact={true} />
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};
