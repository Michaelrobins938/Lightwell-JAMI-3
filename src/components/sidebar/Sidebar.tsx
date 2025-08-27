"use client";

import React from 'react';
import { Plus, MessageSquare, User, Settings, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  lastMessage?: string;
}

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  // Mock data - in a real app, this would come from useChat hook
  const chats: Chat[] = [
    {
      id: '1',
      title: 'Understanding React Hooks',
      createdAt: '2024-01-15',
      lastMessage: 'How do useEffect dependencies work?'
    },
    {
      id: '2',
      title: 'Python Data Analysis',
      createdAt: '2024-01-14',
      lastMessage: 'Show me how to use pandas for data cleaning'
    },
    {
      id: '3',
      title: 'Machine Learning Basics',
      createdAt: '2024-01-13',
      lastMessage: 'Explain the difference between supervised and unsupervised learning'
    }
  ];

  const handleNewChat = () => {
    // TODO: Use useChat hook's createNewChat function
    console.log('Creating new chat...');
  };
  const { data: session } = useSession();

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Lightwell</h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        >
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Recent Chats
          </h2>
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  // TODO: Switch to selected chat
                  console.log('Selecting chat:', chat.id);
                  if (onClose) onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.title}
                    </p>
                    {chat.lastMessage && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <User className="w-4 h-4" />
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
