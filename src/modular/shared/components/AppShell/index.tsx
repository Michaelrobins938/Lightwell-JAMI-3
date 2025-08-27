import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Settings, User } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  showSidebar?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  sidebar, 
  header,
  showSidebar = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black text-white overflow-hidden">
      {/* Header */}
      {header && (
        <div className="h-14 border-b border-white/10 bg-gpt5-slate-900/50 backdrop-blur-sm flex items-center justify-between px-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Desktop sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Header content */}
          <div className="flex-1">
            {header}
          </div>
        </div>
      )}

      <div className="flex h-full">
        {/* Sidebar - Desktop */}
        {showSidebar && (
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:block bg-gpt5-slate-900/30 backdrop-blur-sm border-r border-white/10"
              >
                <div className="h-full overflow-y-auto">
                  {sidebar || <DefaultSidebar />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Mobile sidebar */}
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="lg:hidden fixed left-0 top-0 h-full w-80 bg-gpt5-slate-900/95 backdrop-blur-xl border-r border-white/20 z-50"
              >
                <div className="h-full overflow-y-auto">
                  {sidebar || <DefaultSidebar />}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

// Default sidebar content
const DefaultSidebar: React.FC = () => {
  const menuItems = [
    { icon: MessageCircle, label: 'Chat', active: true },
    { icon: Settings, label: 'Settings', active: false },
    { icon: User, label: 'Profile', active: false },
  ];

  return (
    <div className="p-4 space-y-2">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gpt5-beam-gradient rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">J3</span>
          </div>
          <div>
            <h2 className="font-semibold text-white">JAMI-3</h2>
            <p className="text-xs text-slate-400">AI Therapist</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              item.active
                ? 'bg-gpt5-beam-gradient text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Chat History */}
      <div className="mt-6">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
          Recent Conversations
        </h3>
        <div className="space-y-1">
          {['Today', 'Yesterday', 'Last Week'].map((period, index) => (
            <div key={index} className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              {period}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};