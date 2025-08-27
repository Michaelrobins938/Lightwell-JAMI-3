import React from 'react';

interface ProfileButtonProps {
  userName: string;
  userEmail: string;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onHelpClick: () => void;
}

export default function ProfileButton({
  userName,
  userEmail,
  onSettingsClick,
  onLogoutClick,
  onHelpClick
}: ProfileButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onSettingsClick}
        className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        Settings
      </button>
      <button
        onClick={onHelpClick}
        className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        Help
      </button>
      <button
        onClick={onLogoutClick}
        className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
