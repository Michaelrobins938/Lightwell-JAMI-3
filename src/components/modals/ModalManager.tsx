"use client";

import React, { useState, createContext, useContext } from 'react';
import SettingsModal from './SettingsModal';
import ProfileModal from './ProfileModal';
import ShareModal from './ShareModal';

// Global modal context
const ModalContext = createContext<{
  openModal: (modal: string) => void;
  closeModal: () => void;
} | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState('gpt-4o');

  const openModal = (modal: string) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/* Render modals */}
      {activeModal === 'settings' && (
        <SettingsModal onClose={closeModal} />
      )}

      {activeModal === 'profile' && (
        <ProfileModal onClose={closeModal} />
      )}

      {activeModal === 'share' && (
        <ShareModal onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
}

interface ModalManagerProps {}

export default function ModalManager({}: ModalManagerProps) {
  return null; // Modals are now rendered by ModalProvider
}
