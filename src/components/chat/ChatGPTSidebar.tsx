"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  BookOpen,
  Play,
  Zap,
  Folder,
  Code,
  Circle,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  PenTool,
  User
} from 'lucide-react';
import { SearchModal } from './SearchModal';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: any[];
  createdAt: number;
  updatedAt: number;
}

interface ChatGPTSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  sidebarItems: SidebarItem[];
  projectItems: SidebarItem[];
  showProfileDropdown: boolean;
  setShowProfileDropdown: (show: boolean) => void;
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  showHamburger: boolean;
  setShowHamburger: (show: boolean) => void;
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatGPTSidebar: React.FC<ChatGPTSidebarProps> = ({
  isCollapsed,
  onToggle,
  sidebarItems,
  projectItems,
  showProfileDropdown,
  setShowProfileDropdown,
  hoveredItem,
  setHoveredItem,
  showHamburger,
  setShowHamburger,
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat
}) => {
  // Add search modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Sidebar animation variants
  const sidebarVariants = {
    collapsed: {
      width: 48
    },
    expanded: {
      width: 220
    }
  };

  const gptLogoVariants = {
    collapsed: {
      scale: 1,
      opacity: 1
    },
    hamburger: {
      scale: 0.8,
      opacity: 0
    }
  };

  const hamburgerVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1
    }
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      x: -10
    },
    visible: {
      opacity: 1,
      x: 0
    }
  };

  return (
    <motion.div
      className="h-full bg-gray-900 border-r border-gray-700 flex flex-col overflow-hidden relative"
      variants={sidebarVariants}
      initial="collapsed"
      animate={isCollapsed ? "collapsed" : "expanded"}
    >
      {/* ChatGPT Logo / New Chat Section */}
      <div className="p-3 mb-2 flex-shrink-0 relative flex items-center justify-between">
        {/* OpenAI Logo */}
        <motion.div
          className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors"
          variants={gptLogoVariants}
          animate={showHamburger ? "hamburger" : "collapsed"}
          onMouseEnter={() => setShowHamburger(true)}
          onMouseLeave={() => setShowHamburger(false)}
          onClick={onToggle}
        >
          {/* OpenAI-style logo: circle with broken ring */}
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 w-6 h-6 border-2 border-white rounded-full"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-white transform -translate-x-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-0.5 h-3 bg-white transform -translate-x-1/2"></div>
            <div className="absolute left-0 top-1/2 w-3 h-0.5 bg-white transform -translate-y-1/2"></div>
            <div className="absolute right-0 top-1/2 w-3 h-0.5 bg-white transform -translate-y-1/2"></div>
          </div>
        </motion.div>

        {/* Hamburger Icon */}
        <motion.div
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          variants={hamburgerVariants}
          animate={showHamburger ? "visible" : "hidden"}
          onClick={onToggle}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <div className="w-4 h-0.5 bg-white mb-1 transition-all duration-200"></div>
            <div className="w-4 h-0.5 bg-white mb-1 transition-all duration-200"></div>
            <div className="w-4 h-0.5 bg-white transition-all duration-200"></div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Items */}
      <div className={`flex-1 ${isCollapsed ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
        <div className="space-y-1 px-2">
          {/* Only show first 3 essential items when collapsed */}
          {sidebarItems.slice(0, isCollapsed ? 3 : undefined).map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.id === 'support-tools' ? (
                <a
                  href="/support"
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      className="text-left leading-tight break-words"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </a>
              ) : (
                <button
                  onClick={item.id === 'new-chat' ? onNewChat : undefined}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group ${
                    item.active ? 'bg-gray-800 text-white' : ''
                  } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      className="text-left leading-tight break-words"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item.id && (
                <motion.div
                  className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-[9999] border border-gray-700"
                  variants={tooltipVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {item.label}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Chat History Section */}
        {!isCollapsed && (
          <div className="mx-2 my-4 border-t border-gray-700" />
        )}

        {!isCollapsed && (
          <div className="space-y-1 px-2">
            {/* Search Chats Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group mb-3"
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className="text-left leading-tight">Search chats...</span>
            </button>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Recent Chats
              </span>
              <button
                onClick={onNewChat}
                className="p-1 hover:bg-gray-800 rounded-md transition-colors"
                title="New Chat"
              >
                <Plus className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(`chat-${chat.id}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <button
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full flex items-start gap-2 p-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors group ${
                      currentChatId === chat.id ? 'bg-gray-800 text-white' : ''
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-left text-sm font-medium truncate">
                        {chat.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {chat.messages.length} messages
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </button>

                  {hoveredItem === `chat-${chat.id}` && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="absolute top-1 right-1 p-1 hover:bg-red-600 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Chat"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {chats.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No chats yet</p>
                <p className="text-xs">Start a conversation</p>
              </div>
            )}
          </div>
        )}

        {/* Collapsed Chat History - Clean Icons */}
        {isCollapsed && (
          <div className="space-y-2 px-2">
            {/* Search Button for Collapsed State */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full p-2.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              title="Search chats"
            >
              <Search className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={onNewChat}
              className="w-full p-2.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              title="New Chat"
            >
              <PenTool className="w-5 h-5 mx-auto" />
            </button>
            {chats.slice(0, 2).map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full p-2.5 rounded-lg transition-colors ${
                  currentChatId === chat.id ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={chat.title}
              >
                <MessageSquare className="w-5 h-5 mx-auto" />
              </button>
            ))}
          </div>
        )}

        {/* Divider */}
        {!isCollapsed && (
          <div className="mx-2 my-4 border-t border-gray-700" />
        )}

        {/* Projects Section - Hidden when collapsed */}
        {!isCollapsed && (
          <div className="space-y-1 px-2">
            {projectItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      className="text-left leading-tight break-words"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.id && (
                  <motion.div
                    className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50 border border-gray-700"
                    variants={tooltipVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {item.label}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="p-2 border-t border-gray-700 flex-shrink-0">
        <div className="relative">
          <div
            className="relative"
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group ${
                isCollapsed ? 'justify-center' : 'justify-start'
              }`}
              title={isCollapsed ? "Profile & Settings" : undefined}
            >
              {isCollapsed ? (
                <User className="w-5 h-5 text-gray-300" />
              ) : (
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  MI
                </div>
              )}
              {!isCollapsed && (
                <motion.div
                  className="text-left leading-tight"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="font-medium">Michael Robinson</div>
                  <div className="text-xs text-gray-500">Plus</div>
                </motion.div>
              )}
            </button>

            {/* Tooltip for collapsed state */}
            {isCollapsed && hoveredItem === 'profile' && (
              <motion.div
                className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-[9999] border border-gray-700"
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="font-medium">Michael Robinson</div>
                <div className="text-xs text-gray-400">Plus</div>
              </motion.div>
            )}
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute bottom-12 left-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999]">
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      Michael Robinson
                    </div>
                    <div className="text-gray-400 text-xs truncate">
                      Plus
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </button>
                <div className="border-t border-gray-700 my-1" />
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        conversations={chats}
        onSelectConversation={onSelectChat}
        onNewChat={onNewChat}
      />
    </motion.div>
  );
};

export default ChatGPTSidebar;