// LunaSidebar.tsx - Pixel-perfect ChatGPT-style sidebar
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { SearchModal } from "./SearchModal";
import { useChatStore } from "../../store/slices/chatSlice";
import {
  Plus, Search, Library, Brain, Video, ShieldAlert, PhoneCall, LineChart,
  Moon, BookOpen, HeartPulse, Target, GraduationCap, Users, UserCheck,
  ClipboardCheck, ChevronDown, ChevronRight, Settings, LogOut, HelpCircle, User,
  ChevronLeft, MessageSquare, Crown, Download, Keyboard, FileText, ArrowRight,
  Play, Grid, Code, Cloud, FolderOpen, Leaf, Trash2, Edit3, Puzzle
} from "lucide-react";

type Item = {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  description?: string;
  children?: Item[];
  onClick?: () => void;
};

const CORE: Item[] = [
  { id: "new", label: "New chat", icon: Plus },
  { id: "search", label: "Search chats", icon: Search },
  { id: "library", label: "Library", icon: Library },
];

const GROUPS: Item[] = [
  { id: "cbt", label: "CBT Exercises", icon: Brain, description: "Cognitive Behavioral Therapy tools" },
  { id: "video", label: "Video Sessions", icon: Video, description: "Guided video therapy sessions" },
  { id: "crisis-support", label: "Crisis Support", icon: ShieldAlert, description: "24/7 crisis intervention & resources" },
  { id: "crisis-resources", label: "Crisis Resources", icon: PhoneCall, description: "Emergency contacts & immediate help" },
  { id: "progress", label: "Progress Tracking", icon: LineChart, description: "Monitor your mental health journey" },
  { id: "sleep", label: "Sleep Tracking", icon: Moon, description: "Monitor & improve your sleep quality" },
  { id: "mood", label: "Mood Journal", icon: BookOpen, description: "Track daily emotions & patterns" },
  {
    id: "wellness", label: "Wellness", icon: HeartPulse, children: [
      { id: "meditation", label: "Meditation & Mindfulness", icon: HeartPulse, description: "Guided sessions for inner peace" },
      { id: "challenges", label: "Wellness Challenges", icon: Target, description: "30-day wellness challenges" },
    ]
  },
  { id: "education", label: "Education", icon: GraduationCap, description: "Educational Content — Learn about mental health & wellness" },
  { id: "goals", label: "Goal Setting", icon: Target, description: "Set & track personal wellness goals" },
  {
    id: "community", label: "Community", icon: Users, children: [
      { id: "support-groups", label: "Support Groups", icon: Users, description: "Connect with peers & professionals" }
    ]
  },
  {
    id: "professional", label: "Professional Help", icon: UserCheck, children: [
      { id: "referrals", label: "Professional Referrals", icon: UserCheck, description: "Find licensed mental health professionals" }
    ]
  },
  { id: "assessment", label: "Assessment", icon: ClipboardCheck, description: "Mental health screening & evaluation" },
];

// Add the missing ChatGPT-style content between category breaks
const LUNA_FEATURES: Item[] = [
  { id: "enhanced-chat", label: "AI Therapy Sessions", icon: Brain, description: "Personalized AI therapy with Jamie" },
  { id: "personality-management", label: "Personality Management", icon: Settings, description: "Customize AI therapeutic personalities" },
  { id: "memory-insights", label: "Memory Insights", icon: Brain, description: "AI-powered therapeutic pattern analysis" },
  { id: "team-workspace-management", label: "Teams & Workspaces", icon: Users, description: "Manage collaborative spaces and team members" },
  { id: "plugin-management", label: "Plugin Management", icon: Puzzle, description: "Manage external integrations and API actions" },
  { id: "crisis-support", label: "Crisis Support", icon: ShieldAlert, description: "24/7 crisis intervention & resources" },
  { id: "dashboard", label: "Progress Tracking", icon: LineChart, description: "Monitor your mental health journey" },
  { id: "meditation", label: "Meditation & Mindfulness", icon: HeartPulse, description: "Guided sessions for inner peace" },
  { id: "assessments", label: "Assessment Tools", icon: ClipboardCheck, description: "Mental health screening & evaluation" },
  { id: "sleep-tracker", label: "Sleep Tracking", icon: Moon, description: "Monitor & improve your sleep quality" },
  { id: "mood-journal", label: "Mood Journal", icon: BookOpen, description: "Track daily emotions & patterns" },
  { id: "video-therapy", label: "Video Sessions", icon: Video, description: "Guided video therapy sessions" },
  { id: "challenges", label: "Wellness Challenges", icon: Target, description: "30-day wellness challenges" },
  { id: "referrals", label: "Professional Referrals", icon: UserCheck, description: "Find licensed mental health professionals" },
];

const PROJECTS: Item[] = [
  { id: "new-project", label: "New project", icon: Plus, description: "Start a new project" },
  { id: "watercolor", label: "Watercolor generator", icon: FolderOpen, description: "AI art generation" },
  { id: "omnipreneur", label: "omnipreneur", icon: FolderOpen, description: "Business tools" },
];

const CHATS_MOCK = [
  { id: "c1", title: "Feeling anxious before interview", ts: "2h" },
  { id: "c2", title: "Sleep routine reset plan", ts: "Yesterday" },
  { id: "c3", title: "CBT thought record", ts: "Mon" },
];

interface LunaSidebarProps {
  conversations?: any[];
  currentConversationId?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  onSelectConversation?: (id: string) => void;
  onNewConversation?: () => void;
  onDeleteConversation?: (id: string) => void;
  onRenameConversation?: (id: string, title: string) => void;
}

export function LunaSidebar({ 
  conversations = [], 
  collapsed = false,
  onToggle,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation
}: LunaSidebarProps) {
  const [active, setActive] = useState<string>("new");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpSubmenu, setShowHelpSubmenu] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  const sidebarRef = useRef<HTMLElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLButtonElement>(null);

  // Get chats from store
  const { chats, currentChatId, loadChat, deleteChat, renameChat } = useChatStore();

  // Use store chats if no conversations provided
  const displayChats = conversations.length > 0 ? conversations : chats;


  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        setShowHelpSubmenu(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };

    if (showProfileMenu || showModelDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showModelDropdown]);

  const handleItemClick = (item: Item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.id === "new") {
      onNewConversation?.();
    } else if (item.id === "search") {
      setShowSearchModal(true);
    } else {
      setActive(item.id);
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Format timestamp for chat display
  const formatTimestamp = (date: Date | string): string => {
    const now = new Date();
    const chatDate = new Date(date);
    const diffMs = now.getTime() - chatDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return chatDate.toLocaleDateString();
  };

  // Use ChatGPT's exact measurements
  const width = collapsed ? 72 : 260;

  return (
    <>
    <motion.aside
      ref={sidebarRef}
      className="fixed left-0 top-0 h-full bg-[#171717] z-30 border-r border-white/10"
      initial={false}
      animate={{
        width: width,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <AnimatePresence initial={false} mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 text-white/80">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.282 9.821a5.985 5.985 0 01-5.739-4.874A6.01 6.01 0 0112.05.006 6.01 6.01 0 016.558 4.88A5.985 5.985 0 01.82 9.821a6.01 6.01 0 014.887 5.739 6.003 6.003 0 014.986 4.366 6.01 6.01 0 015.492-4.366 5.985 5.985 0 014.898-5.739zm-9.31 11.143a6.1 6.1 0 01-1.967-1.967 5.985 5.985 0 01-4.874-5.739 6.006 6.006 0 013.934-5.627 6.006 6.006 0 015.739-4.874 5.985 5.985 0 015.627 3.934 6.01 6.01 0 014.874 5.739 6.006 6.006 0 01-3.934 5.627 5.985 5.985 0 01-5.739 4.874 5.985 5.985 0 01-5.627-3.934 6.01 6.01 0 01-1.967-1.967z"/>
                </svg>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-2 hover:bg-white/5 rounded-md px-2 py-1 transition-colors"
                  ref={modelDropdownRef}
                >
                  <span className="font-medium text-white">Luna AI</span>
                  <svg className={`w-4 h-4 text-white/50 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Model Selection Dropdown */}
                {showModelDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999]"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-white/60 border-b border-gray-700 mb-2">Models</div>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors">
                        <span>Luna AI 4</span>
                        <span className="ml-auto text-xs text-white/40">Default</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors">
                        <span>Luna AI 3.5</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors">
                        <span>Luna AI 4 Turbo</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onToggle}
              className="w-6 h-6 text-white/80 mx-auto hover:text-white/90 transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.282 9.821a5.985 5.985 0 01-5.739-4.874A6.01 6.01 0 0112.05.006 6.01 6.01 0 016.558 4.88A5.985 5.985 0 01.82 9.821a6.01 6.01 0 014.887 5.739 6.003 6.003 0 014.986 4.366 6.01 6.01 0 015.492-4.366 5.985 5.985 0 014.898-5.739zm-9.31 11.143a6.1 6.1 0 01-1.967-1.967 5.985 5.985 0 01-4.874-5.739 6.006 6.006 0 013.934-5.627 6.006 6.006 0 015.739-4.874 5.985 5.985 0 015.627 3.934 6.01 6.01 0 014.874 5.739 6.006 6.006 0 01-3.934 5.627 5.985 5.985 0 01-5.739 4.874 5.985 5.985 0 01-5.627-3.934 6.01 6.01 0 01-1.967-1.967z"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Official ChatGPT-style close button - only visible when expanded */}
        {!collapsed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={onToggle}
            className="p-1.5 text-white/50 hover:text-white/80 rounded-md hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* CONTENT */}
      <div className="h-full flex flex-col relative">
        {/* Top core (fixed) - properly aligned at top */}
        <div className="px-2 pt-0">
          <NavGroup>
            {CORE.map(item => (
              <NavRow
                key={item.id}
                collapsed={collapsed}
                item={item}
                active={active === item.id}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </NavGroup>
        </div>

        {/* ChatGPT Features Section */}
        {!collapsed && (
          <div className="px-2 pt-4">
            <SectionHeader collapsed={collapsed} label="Features" />
            <NavGroup>
              {LUNA_FEATURES.map(item => (
                <NavRow
                  key={item.id}
                  collapsed={collapsed}
                  item={item}
                  active={active === item.id}
                  onClick={() => handleItemClick(item)}
                  size="sm"
                />
              ))}
            </NavGroup>
          </div>
        )}

        {/* Projects Section */}
        {!collapsed && (
          <div className="px-2 pt-4">
            <SectionHeader collapsed={collapsed} label="Projects" />
            <NavGroup>
              {PROJECTS.map(item => (
                <NavRow
                  key={item.id}
                  collapsed={collapsed}
                  item={item}
                  active={active === item.id}
                  onClick={() => handleItemClick(item)}
                  size="sm"
                />
              ))}
            </NavGroup>
          </div>
        )}

        {/* Chat Conversations Section */}
        {!collapsed && displayChats.length > 0 && (
          <div className="px-2 pt-4">
            <SectionHeader collapsed={collapsed} label="Recent Chats" />
            <NavGroup>
              {displayChats.slice(0, 5).map((chat) => (
                <ChatRow
                  key={chat.id}
                  collapsed={collapsed}
                  title={chat.title}
                  ts={formatTimestamp(chat.updatedAt)}
                  onClick={() => {
                    if (onSelectConversation) {
                      onSelectConversation(chat.id);
                    } else {
                      loadChat(chat.id);
                    }
                    setActive(chat.id);
                  }}
                  isActive={currentChatId === chat.id}
                  onDelete={() => {
                    if (onDeleteConversation) {
                      onDeleteConversation(chat.id);
                    } else {
                      deleteChat(chat.id);
                    }
                  }}
                  onRename={() => {
                    setEditingChatId(chat.id);
                    setEditingTitle(chat.title);
                  }}
                  isEditing={editingChatId === chat.id}
                  editingTitle={editingTitle}
                  onSaveEdit={(newTitle) => {
                    if (onRenameConversation) {
                      onRenameConversation(chat.id, newTitle);
                    } else {
                      renameChat(chat.id, newTitle);
                    }
                    setEditingChatId(null);
                    setEditingTitle('');
                  }}
                  onCancelEdit={() => {
                    setEditingChatId(null);
                    setEditingTitle('');
                  }}
                />
              ))}
            </NavGroup>
          </div>
        )}

        {/* Spacer to push profile to bottom */}
        <div className="flex-1" />

        {/* Footer (fixed) - always visible at bottom */}
        <div 
          className="px-2 pb-2"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0,0,0,0.25)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 8px',
            zIndex: 50
          }}
        >
          <ProfileFooter 
            collapsed={collapsed} 
            showProfileMenu={showProfileMenu} 
            setShowProfileMenu={setShowProfileMenu}
            showHelpSubmenu={showHelpSubmenu}
            setShowHelpSubmenu={setShowHelpSubmenu}
            profileMenuRef={profileMenuRef}
          />
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        conversations={conversations}
        onSelectConversation={(id) => {
          if (onSelectConversation) {
            onSelectConversation(id);
          }
        }}
        onNewChat={() => {
          if (onNewConversation) {
            onNewConversation();
          }
        }}
      />
    </motion.aside>
    </>
  );
}

/* ——— primitives ——— */

function NavGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

function SectionHeader({ collapsed, label, className = "" }: { collapsed: boolean; label: string; className?: string }) {
  return (
    <div className={`px-3 ${className}`}>
      <motion.div
        initial={false}
        animate={{ opacity: collapsed ? 0.6 : 0 }}
        className="text-[11px] uppercase tracking-wide text-white/40"
      >
        {collapsed ? label : <span className="sr-only">{label}</span>}
      </motion.div>
    </div>
  );
}

function NavRow({
  collapsed,
  item,
  active,
  onClick,
  expandable,
  expanded,
  size = "md",
}: {
  collapsed: boolean;
  item: Item;
  active?: boolean;
  onClick?: () => void;
  expandable?: boolean;
  expanded?: boolean;
  size?: "md" | "sm";
}) {
  const Icon = item.icon;
  const baseH = size === "sm" ? "h-10" : "h-11";

  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={[
          "w-full flex items-center gap-3 rounded-xl transition",
          baseH,
          !collapsed ? "px-3" : "justify-center",
          active ? "bg-white/10 border border-white/10" : "hover:bg-white/6",
          "text-white/80 hover:text-white",
        ].join(" ")}
        aria-current={active ? "page" : undefined}
        aria-expanded={expandable ? expanded : undefined}
      >
        {Icon && <Icon className="w-5 h-5" />}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.16, delay: 0.04 }}
              className="flex-1 text-left"
            >
              <div className="text-sm">{item.label}</div>
              {item.description && size === "md" && (
                <div className="text-xs text-white/50 leading-5">{item.description}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {expandable && !collapsed && (
          <ChevronDown className={`ml-auto h-4 w-4 text-white/50 transition ${expanded ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Tooltip (collapsed) */}
      {collapsed && (
        <div className="pointer-events-none absolute left-[76px] top-1/2 -translate-y-1/2 z-50">
          <div className="invisible group-hover:visible">
            <div className="bg-black/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
              {item.label}
            </div>
          </div>
        </div>
      )}

      {/* Left accent bar */}
      <span
        className={[
          "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] rounded-full",
          active ? "bg-gradient-to-b from-violet-400 to-indigo-400" : "opacity-0 group-hover:opacity-60 bg-white/30",
          "transition-opacity",
        ].join(" ")}
      />
    </div>
  );
}

function ChatRow({ 
  collapsed, 
  title, 
  ts, 
  onClick,
  isActive,
  onDelete,
  onRename,
  isEditing,
  editingTitle,
  onSaveEdit,
  onCancelEdit
}: { 
  collapsed: boolean; 
  title: string; 
  ts: string; 
  onClick?: () => void;
  isActive?: boolean;
  onDelete?: () => void;
  onRename?: () => void;
  isEditing?: boolean;
  editingTitle?: string;
  onSaveEdit?: (newTitle: string) => void;
  onCancelEdit?: () => void;
}) {
  const [editValue, setEditValue] = useState(title);

  const handleSave = () => {
    if (onSaveEdit && editValue.trim()) {
      onSaveEdit(editValue.trim());
    }
  };

  const handleCancel = () => {
    setEditValue(title);
    onCancelEdit?.();
  };

  if (isEditing) {
    return (
      <div className="group">
        <div className="w-full flex items-center gap-3 rounded-xl transition h-11 px-3">
          <MessageIcon />
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className="flex-1 bg-transparent text-white text-sm outline-none border-b border-gray-600 focus:border-gray-400"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-1 text-green-400 hover:text-green-300 transition-colors"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div
        onClick={onClick}
        className={[
          "w-full flex items-center gap-3 rounded-xl transition h-11 cursor-pointer",
          !collapsed ? "px-3" : "justify-center",
          isActive ? "bg-white/10 border border-white/10" : "hover:bg-white/6",
          "text-white/80 hover:text-white",
        ].join(" ")}
      >
        <MessageIcon />
        {!collapsed && (
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm truncate">{title}</div>
            <div className="text-xs text-white/50">{ts}</div>
          </div>
        )}
      </div>
      
      {/* Action buttons - only show on hover */}
      {!collapsed && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {onRename && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Rename chat"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Delete chat"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Tooltip (collapsed) */}
      {collapsed && (
        <div className="pointer-events-none absolute left-[76px] top-1/2 -translate-y-1/2 z-50">
          <div className="invisible group-hover:visible">
            <div className="bg-black/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
              {title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileFooter({ collapsed, showProfileMenu, setShowProfileMenu, showHelpSubmenu, setShowHelpSubmenu, profileMenuRef }: { 
  collapsed: boolean; 
  showProfileMenu: boolean; 
  setShowProfileMenu: (show: boolean) => void;
  showHelpSubmenu: boolean;
  setShowHelpSubmenu: (show: boolean) => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="relative">
      <button
        className={[
          "w-full h-12 rounded-xl flex items-center gap-3 px-2 hover:bg-white/6 text-white/85 transition",
          !collapsed ? "justify-start" : "justify-center",
        ].join(" ")}
        aria-haspopup="menu"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">MI</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Michael Robinson</div>
            <div className="text-xs text-white/50">Plus</div>
          </div>
        )}
      </button>
      
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="pointer-events-none absolute left-[76px] top-1/2 -translate-y-1/2 z-50">
          <div className="invisible group-hover:visible">
            <div className="bg-black/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
              Profile
            </div>
          </div>
        </div>
      )}

      {/* Profile Dropdown Menu - Always visible when open */}
      {showProfileMenu && createPortal(
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="fixed w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999]"
          style={{ 
            left: collapsed ? '80px' : '296px',
            bottom: '80px',
            zIndex: 9999
          }}
          ref={profileMenuRef}
        >
          {/* Primary Menu */}
          <div className="p-3 border-b border-gray-700">
            <div className="text-sm font-medium text-white mb-3">
              michael.robins938@gmail.com
            </div>
            
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                <Crown className="w-4 h-4" />
                <span>Upgrade plan</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                <Settings className="w-4 h-4" />
                <span>Customize Luna</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button 
                className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setShowHelpSubmenu(!showHelpSubmenu)}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${showHelpSubmenu ? 'rotate-90' : ''}`} />
              </button>
              
              <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          {/* Help Submenu */}
          <AnimatePresence>
            {showHelpSubmenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3 bg-gray-800"
              >
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help center</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>Release notes</span>
                    </button>
                  
                  <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>Terms & policies</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download Luna app</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors">
                    <Keyboard className="w-4 h-4" />
                    <span>Keyboard shortcuts</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>,
        document.body
      )}
    </div>
  );
}

/* tiny helpers */
function MessageIcon() {
  return (
    <svg className="h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="1.8" d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 5V7Z" />
    </svg>
  );
}