"use client";

import React, { useState } from 'react';
import { Menu, MoreVertical, Share } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useModal } from '../modals/ModalManager';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  // Mock model selection - in a real app, this would use useChat hook
  const [activeModel, setActiveModel] = useState('gpt-4o');
  const { openModal } = useModal();
  const { data: session } = useSession();

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
      {/* Left side - Menu and Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Lightwell</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">AI Healthcare</p>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => openModal('share')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Share className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <button
          onClick={() => openModal('settings')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* User Avatar */}
        <button
          onClick={() => openModal('profile')}
          className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-700 transition-all"
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {session?.user?.name?.charAt(0) || 'U'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
