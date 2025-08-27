import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../sidebar/Sidebar';
import Header from './Header';
import ChatWindow from '../chat/ChatWindow';
import InputBar from '../chat/InputBar';
import VoiceOverlay from './VoiceOverlay';
import SettingsModal from './modals/SettingsModal';
import ProfileModal from './modals/ProfileModal';
import FileModal from './modals/FileModal';

interface AppShellProps {
  children?: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen bg-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-64 z-50"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onSettingsClick={() => setActiveModal('settings')}
          onProfileClick={() => setActiveModal('profile')}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow 
            model="GPT-4o" 
            markdown={true} 
            onVoiceModeToggle={() => {}} 
            onOpenSettings={() => {}} 
            onModelChange={() => {}} 
            onFullscreenOrbToggle={() => {}} 
          />

          {/* Input Bar */}
          <InputBar
            onSubmit={(message) => console.log('Send message:', message)}
          />

          {/* Voice Overlay */}
          <VoiceOverlay isActive={activeModal === 'voice'} />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <SettingsModal onClose={() => setActiveModal(null)} />
            </motion.div>
          </motion.div>
        )}

        {activeModal === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <ProfileModal onClose={() => setActiveModal(null)} />
            </motion.div>
          </motion.div>
        )}

        {activeModal === 'file' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <FileModal onClose={() => setActiveModal(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}

