import { useState } from 'react';

export function useModal() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  const openFileUploadModal = () => setIsFileUploadModalOpen(true);
  const closeFileUploadModal = () => setIsFileUploadModalOpen(false);

  return {
    isSettingsModalOpen,
    isProfileModalOpen,
    isUpgradeModalOpen,
    isFileUploadModalOpen,
    openSettingsModal,
    closeSettingsModal,
    openProfileModal,
    closeProfileModal,
    openUpgradeModal,
    closeUpgradeModal,
    openFileUploadModal,
    closeFileUploadModal
  };
}
