import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
// React Icons - Mix of different libraries for uniqueness
import { 
  BsChatDots, BsSearch, BsBook, BsPlus, BsPencil, BsTrash, BsPerson,
  BsGear, BsBoxArrowLeft, BsQuestionCircle, BsNewspaper, BsShop, BsPhone,
  BsInfoCircle, BsShield, BsHeart, BsClipboardData,
  BsCalendarCheck, BsJournalText, BsMoon, BsGraphUp
} from 'react-icons/bs';
import { 
  MdPsychology, MdDashboard, MdUpgrade, MdKeyboard, MdSupport, MdWork,
  MdAccessibility, MdPolicy, MdVideoLibrary, MdHealthAndSafety,
  MdGroups, MdInsights, MdOutlinePlaylistAddCheck
} from 'react-icons/md';
import { 
  FaUserMd, FaDownload, FaFileContract, FaBlog, FaHandsHelping,
  FaAward, FaVideo, FaUserTie, FaMicroscope, FaChartLine, FaLightbulb
} from 'react-icons/fa';
import { 
  HiOutlineMenu, HiOutlineX, HiOutlineDocumentText, HiOutlineSpeakerphone
} from 'react-icons/hi';
import { 
  AiOutlineTeam, AiOutlineExperiment
} from 'react-icons/ai';
import {
  RiMentalHealthLine, RiHeartPulseLine, RiHistoryLine
} from 'react-icons/ri';
import {
  IoDocumentTextOutline, IoHeartOutline, IoSettingsOutline
} from 'react-icons/io5';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  conversations: Array<{
    id: string;
    title: string;
    timestamp: Date;
    preview: string;
  }>;
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  badge?: number;
}

export const CollapsibleSidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      icon: <BsPencil className="w-5 h-5" />,
      label: "New chat",
      action: onNewConversation
    },
    {
      icon: <BsSearch className="w-5 h-5" />,
      label: "Search chats",
      action: () => console.log('Search')
    },
    {
      icon: <BsBook className="w-5 h-5" />,
      label: "Library",
      action: () => console.log('Library')
    },
    {
      icon: <MdPsychology className="w-5 h-5" />,
      label: "AI Therapy Sessions",
      action: () => router.push('/enhanced-chat')
    },
    {
      icon: <BsGear className="w-5 h-5" />,
      label: "Personality Management",
      action: () => router.push('/personality-management')
    },
    {
      icon: <AiOutlineTeam className="w-5 h-5" />,
      label: "Teams & Workspaces",
      action: () => router.push('/team-workspace-management')
    }
  ];

  // Content & Learning Pages
  const contentItems: SidebarItem[] = [
    {
      icon: <FaBlog className="w-5 h-5" />,
      label: "Blog",
      action: () => router.push('/blog')
    },
    {
      icon: <HiOutlineDocumentText className="w-5 h-5" />,
      label: "Documentation",
      action: () => router.push('/documentation')
    },
    {
      icon: <BsBook className="w-5 h-5" />,
      label: "Tutorials",
      action: () => router.push('/tutorials')
    },
    {
      icon: <FaMicroscope className="w-5 h-5" />,
      label: "Research",
      action: () => router.push('/research')
    },
    {
      icon: <BsQuestionCircle className="w-5 h-5" />,
      label: "FAQ",
      action: () => router.push('/faq')
    }
  ];

  // Professional & Business Pages
  const professionalItems: SidebarItem[] = [
    {
      icon: <MdWork className="w-5 h-5" />,
      label: "Careers",
      action: () => router.push('/careers')
    },
    {
      icon: <FaHandsHelping className="w-5 h-5" />,
      label: "Partners",
      action: () => router.push('/partners')
    },
    {
      icon: <HiOutlineSpeakerphone className="w-5 h-5" />,
      label: "Press",
      action: () => router.push('/press')
    },
    {
      icon: <BsPhone className="w-5 h-5" />,
      label: "Contact",
      action: () => router.push('/contact')
    }
  ];

  // Health & Wellness Features
  const healthItems: SidebarItem[] = [
    {
      icon: <RiMentalHealthLine className="w-5 h-5" />,
      label: "Video Therapy",
      action: () => router.push('/video-therapy')
    },
    {
      icon: <RiHeartPulseLine className="w-5 h-5" />,
      label: "Voice Therapy",
      action: () => router.push('/voice-therapy')
    },
    {
      icon: <FaAward className="w-5 h-5" />,
      label: "Wellness Challenges",
      action: () => router.push('/challenges')
    },
    {
      icon: <BsJournalText className="w-5 h-5" />,
      label: "Journal",
      action: () => router.push('/journal')
    },
    {
      icon: <BsMoon className="w-5 h-5" />,
      label: "Sleep Tracker",
      action: () => router.push('/sleep-tracker')
    },
    {
      icon: <BsClipboardData className="w-5 h-5" />,
      label: "Assessments",
      action: () => router.push('/assessments')
    }
  ];

  // Tools & Features
  const toolsItems: SidebarItem[] = [
    {
      icon: <BsGraphUp className="w-5 h-5" />,
      label: "Progress Tracking",
      action: () => router.push('/progress')
    },
    {
      icon: <RiHistoryLine className="w-5 h-5" />,
      label: "Chat History",
      action: () => router.push('/chat-history')
    },
    {
      icon: <MdInsights className="w-5 h-5" />,
      label: "Memory Insights",
      action: () => router.push('/memory-insights')
    },
    {
      icon: <AiOutlineExperiment className="w-5 h-5" />,
      label: "Memory Test",
      action: () => router.push('/memory-test')
    },
    {
      icon: <IoSettingsOutline className="w-5 h-5" />,
      label: "Settings",
      action: () => router.push('/settings')
    }
  ];

  // Legal & Compliance
  const legalItems: SidebarItem[] = [
    {
      icon: <MdAccessibility className="w-5 h-5" />,
      label: "Accessibility",
      action: () => router.push('/accessibility')
    },
    {
      icon: <MdPolicy className="w-5 h-5" />,
      label: "State Compliance",
      action: () => router.push('/state-compliance')
    },
    {
      icon: <BsShield className="w-5 h-5" />,
      label: "Privacy Policy",
      action: () => router.push('/privacy')
    },
    {
      icon: <FaFileContract className="w-5 h-5" />,
      label: "Terms of Service",
      action: () => router.push('/terms')
    },
    {
      icon: <MdHealthAndSafety className="w-5 h-5" />,
      label: "Safety",
      action: () => router.push('/safety')
    }
  ];

  // Alternative Pages
  const alternativeItems: SidebarItem[] = [
    {
      icon: <FaLightbulb className="w-5 h-5" />,
      label: "Lightwell Landing",
      action: () => router.push('/lightwell-landing')
    },
    {
      icon: <FaChartLine className="w-5 h-5" />,
      label: "Enhanced Chat Demo",
      action: () => router.push('/enhanced-chat-demo')
    },
    {
      icon: <MdVideoLibrary className="w-5 h-5" />,
      label: "Showcase",
      action: () => router.push('/showcase')
    },
    {
      icon: <IoHeartOutline className="w-5 h-5" />,
      label: "Donation Success",
      action: () => router.push('/donation-success')
    }
  ];

  const profileMenuItems = [
    {
      icon: <BsQuestionCircle className="w-4 h-4" />,
      label: "Help center",
      action: () => router.push('/support')
    },
    {
      icon: <MdSupport className="w-4 h-4" />,
      label: "Release notes", 
      action: () => router.push('/release-notes')
    },
    {
      icon: <FaFileContract className="w-4 h-4" />,
      label: "Terms & policies",
      action: () => router.push('/terms')
    },
    {
      icon: <FaDownload className="w-4 h-4" />,
      label: "Download apps",
      action: () => router.push('/download')
    },
    {
      icon: <MdKeyboard className="w-4 h-4" />,
      label: "Keyboard shortcuts",
      action: () => console.log('Show keyboard shortcuts modal')
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (conversation: any) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  // Helper function to render sidebar sections
  const renderSidebarSection = (
    title: string, 
    items: SidebarItem[], 
    isCollapsed: boolean, 
    startIndex: number = 0
  ) => {
    return (
      <div className="mb-4">
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </div>
        )}
        <div className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-2'}`}>
          {items.map((item, index) => (
            isCollapsed ? (
              <motion.button
                key={startIndex + index}
                onClick={item.action}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 
                              text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                              transition-opacity pointer-events-none whitespace-nowrap z-50
                              transform translate-x-2 group-hover:translate-x-0">
                  {item.label}
                </div>
              </motion.button>
            ) : (
              <motion.button
                key={startIndex + index}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-left"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (startIndex + index) * 0.05 + 0.1 }}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="truncate text-sm"
                >
                  {item.label}
                </motion.span>

                {item.badge && (
                  <div className="ml-auto text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                    {item.badge}
                  </div>
                )}
              </motion.button>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Luna AI-style Sidebar */}
      <motion.div
        className="relative bg-gray-900 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
                   flex flex-col h-full transition-all duration-300 ease-in-out"
        initial={false}
        animate={{
          width: isCollapsed ? 64 : 320,
        }}
      >
        {/* Luna AI Logo/Header */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 text-gray-700 dark:text-gray-300">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.282 9.821a5.985 5.985 0 01-5.739-4.874A6.01 6.01 0 0112.05.006 6.01 6.01 0 016.558 4.88A5.985 5.985 0 01.82 9.821a6.01 6.01 0 014.887 5.739 6.003 6.003 0 014.986 4.366 6.01 6.01 0 015.492-4.366 5.985 5.985 0 014.898-5.739zm-9.31 11.143a6.1 6.1 0 01-1.967-1.967 5.985 5.985 0 01-4.874-5.739 6.006 6.006 0 013.934-5.627 6.006 6.006 0 015.739-4.874 5.985 5.985 0 015.627 3.934 6.01 6.01 0 014.874 5.739 6.006 6.006 0 01-3.934 5.627 5.985 5.985 0 01-5.739 4.874 5.985 5.985 0 01-5.627-3.934 6.01 6.01 0 01-1.967-1.967z"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Luna AI</span>
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-6 h-6 text-gray-700 dark:text-gray-300 mx-auto"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.282 9.821a5.985 5.985 0 01-5.739-4.874A6.01 6.01 0 0112.05.006 6.01 6.01 0 016.558 4.88A5.985 5.985 0 01.82 9.821a6.01 6.01 0 014.887 5.739 6.003 6.003 0 014.986 4.366 6.01 6.01 0 015.492-4.366 5.985 5.985 0 014.898-5.739zm-9.31 11.143a6.1 6.1 0 01-1.967-1.967 5.985 5.985 0 01-4.874-5.739 6.006 6.006 0 013.934-5.627 6.006 6.006 0 015.739-4.874 5.985 5.985 0 015.627 3.934 6.01 6.01 0 014.874 5.739 6.006 6.006 0 01-3.934 5.627 5.985 5.985 0 01-5.739 4.874 5.985 5.985 0 01-5.627-3.934 6.01 6.01 0 01-1.967-1.967z"/>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isCollapsed && (
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items with Categories */}
        <div className="pb-2">
          {renderSidebarSection("Core Features", sidebarItems, isCollapsed, 0)}
          {renderSidebarSection("Content & Learning", contentItems, isCollapsed, 100)}
          {renderSidebarSection("Professional", professionalItems, isCollapsed, 200)}
          {renderSidebarSection("Health & Wellness", healthItems, isCollapsed, 300)}
          {renderSidebarSection("Tools & Features", toolsItems, isCollapsed, 400)}
          {renderSidebarSection("Legal & Compliance", legalItems, isCollapsed, 500)}
          {renderSidebarSection("Alternative Pages", alternativeItems, isCollapsed, 600)}
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-2 py-3 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="relative">
                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg
                           text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-2 py-2 space-y-1"
              >
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                      currentConversationId === conversation.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingId === conversation.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 
                                     rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <h4 className="font-medium truncate text-sm">
                              {conversation.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                              {conversation.preview}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {conversation.timestamp.toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(conversation);
                          }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <BsPencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                        >
                          <BsTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - User Profile with Modal */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 mt-auto relative">
          {!isCollapsed ? (
            <motion.button
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              whileHover={{ x: 2 }}
            >
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'MI'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {user?.email || 'michael.robins938@gmail.com'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Plus</div>
              </div>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'MI'}
                </span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 
                            text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                            transition-opacity pointer-events-none whitespace-nowrap z-50
                            transform translate-x-2 group-hover:translate-x-0">
                {user?.email || 'michael.robins938@gmail.com'}
              </div>
            </motion.button>
          )}

          {/* Profile Modal - ChatGPT Style */}
          <AnimatePresence>
            {showProfileModal && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowProfileModal(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                />
                
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-16 left-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[110] overflow-hidden"
                >
                  {/* User Info Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'MI'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user?.email || 'michael.robins938@gmail.com'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Free plan</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Upgrade Plan */}
                    <motion.button
                      onClick={() => {
                        router.push('/pricing');
                        setShowProfileModal(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <MdUpgrade className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Upgrade plan</span>
                    </motion.button>

                    {/* Customize ChatGPT */}
                    <motion.button
                      onClick={() => {
                        router.push('/settings');
                        setShowProfileModal(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <BsGear className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Customize Lightwell</span>
                    </motion.button>

                    {/* Settings */}
                    <motion.button
                      onClick={() => {
                        router.push('/profile');
                        setShowProfileModal(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <BsGear className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                    </motion.button>

                    {/* Separator */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                    {/* Menu Items */}
                    {profileMenuItems.map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          item.action();
                          setShowProfileModal(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        <div className="text-gray-600 dark:text-gray-400">
                          {item.icon}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                      </motion.button>
                    ))}

                    {/* Separator */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                    {/* Log Out */}
                    <motion.button
                      onClick={() => {
                        logout();
                        setShowProfileModal(false);
                        router.push('/landingpage');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <BsBoxArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Log out</span>
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};