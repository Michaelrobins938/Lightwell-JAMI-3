"use client";
import { 
  Home, MessageSquare, Clock, Settings, ChevronLeft, ChevronRight, Plus,
  Brain, Video, Shield, Phone, LineChart, Moon, BookOpen, 
  Heart, Target, GraduationCap, Users, UserCheck, ClipboardCheck,
  Library, Search, History, Info, Briefcase, Handshake, FileText, 
  HelpCircle, LogIn, UserPlus, Key, Activity, AlertTriangle,
  TestTube, Droplets, Camera, Mic, Monitor, Edit, SidebarIcon, 
  Download, Type, Star, Bot, Share2, Lightbulb, HeartPulse,
  ShieldAlert, PhoneCall
} from "lucide-react";

// Import additional icons from react-icons for missing ones
import { 
  FaPhone, FaShieldAlt, FaHeartbeat, FaCamera, FaMicrophone, FaDesktop, FaEdit,
  FaDownload, FaFont, FaStar, FaRobot, FaShareAlt, FaLightbulb
} from "react-icons/fa";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  collapsed: boolean;
  setCollapsed: (v:boolean)=>void;
  conversations: { id:string; title:string; createdAt:number }[];
  onNew: ()=>void;
  onSelect:(id:string)=>void;
  onOpenSettings?: ()=>void;
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  description?: string;
  children?: NavItem[];
};

const NAVIGATION_ITEMS: NavItem[] = [
  // Core Navigation
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "chat", label: "Jamie AI Chat", icon: MessageSquare, href: "/chat" },
  { id: "enhanced-chat", label: "Enhanced Chat", icon: History, href: "/enhanced-chat" },
  
  // AI & Chat Interfaces
  { id: "chatgpt", label: "ChatGPT Interface", icon: MessageSquare, href: "/ChatGPTPage" },
  { id: "codex", label: "Codex AI", icon: Brain, href: "/CodexPage" },
  { id: "jarvis-chat", label: "JARVIS Chat", icon: Brain, href: "/jarvis-chat" },
  { id: "enhanced-chat-interface", label: "Enhanced Chat Interface", icon: History, href: "/enhanced-chat-interface" },
  { id: "chat-history", label: "Chat History", icon: Clock, href: "/chat-history" },
  
  // AI Management
  { id: "personality-management", label: "Personality Management", icon: Settings, href: "/personality-management" },
  { id: "plugin-management", label: "Plugin Management", icon: Library, href: "/plugin-management" },
  { id: "memory-insights", label: "Memory Insights", icon: Brain, href: "/memory-insights" },
  { id: "memory-test", label: "Memory Test", icon: Brain, href: "/memory-test" },
  
  // Therapy & Wellness
  { id: "cbt", label: "CBT Exercises", icon: Brain, href: "/resources/cbt", description: "Cognitive Behavioral Therapy tools" },
  { id: "video", label: "Video Sessions", icon: Video, href: "/video-therapy", description: "Guided video therapy sessions" },
  { id: "voice-therapy", label: "Voice Therapy", icon: PhoneCall, href: "/voice-therapy" },
  { id: "voice-demo", label: "Voice Demo", icon: PhoneCall, href: "/voice-demo" },
  { id: "fullscreen-orb", label: "Fullscreen Orb", icon: Target, href: "/fullscreen-orb" },
  
  // Crisis & Support
  { id: "crisis-support", label: "Crisis Support", icon: ShieldAlert, href: "/crisis-support", description: "24/7 crisis intervention & resources" },
  { id: "crisis-support-enhanced", label: "Enhanced Crisis Support", icon: ShieldAlert, href: "/crisis-support-enhanced" },
  { id: "crisis-resources", label: "Crisis Resources", icon: PhoneCall, href: "/crisis-resources", description: "Emergency contacts & immediate help" },
  
  // Progress & Tracking
  { id: "progress", label: "Progress Tracking", icon: LineChart, href: "/progress", description: "Monitor your mental health journey" },
  { id: "dashboard", label: "Dashboard", icon: LineChart, href: "/dashboard" },
  { id: "sleep", label: "Sleep Tracking", icon: Moon, href: "/sleep-tracker", description: "Monitor & improve your sleep quality" },
  { id: "mood", label: "Mood Journal", icon: BookOpen, href: "/mood-journal", description: "Track daily emotions & patterns" },
  { id: "journal", label: "Journal", icon: BookOpen, href: "/journal" },
  
  // Wellness & Activities
  { id: "meditation", label: "Meditation", icon: Heart, href: "/meditation", description: "Guided sessions for inner peace" },
  { id: "challenges", label: "Wellness Challenges", icon: Target, href: "/challenges", description: "30-day wellness challenges" },
  { id: "goals", label: "Goal Setting", icon: Target, href: "/goals", description: "Set & track personal wellness goals" },
  
  // Education & Resources
  { id: "education", label: "Education", icon: GraduationCap, href: "/resources", description: "Educational Content — Learn about mental health & wellness" },
  { id: "blog", label: "Blog", icon: BookOpen, href: "/blog" },
  { id: "tutorials", label: "Tutorials", icon: GraduationCap, href: "/tutorials" },
  { id: "documentation", label: "Documentation", icon: BookOpen, href: "/documentation" },
  { id: "onboarding", label: "Onboarding", icon: GraduationCap, href: "/onboarding" },
  
  // Resource Sub-pages
  { id: "resources-blog", label: "Resources Blog", icon: BookOpen, href: "/resources/blog" },
  { id: "resources-cbt", label: "CBT Resources", icon: Brain, href: "/resources/cbt" },
  { id: "resources-experts", label: "Expert Advice", icon: UserCheck, href: "/resources/experts" },
  { id: "resources-meditation", label: "Meditation Guides", icon: Heart, href: "/resources/meditation" },
  { id: "resources-selfcare", label: "Self-Care Tools", icon: Heart, href: "/resources/self-care" },
  { id: "resources-tips", label: "Wellness Tips", icon: Lightbulb, href: "/resources/tips" },
  
  // Community & Support
  { id: "community", label: "Community", icon: Users, href: "/community", description: "Connect with peers & professionals" },
  { id: "support-groups", label: "Support Groups", icon: Users, href: "/support-groups" },
  { id: "referrals", label: "Professional Help", icon: UserCheck, href: "/referrals", description: "Find licensed mental health professionals" },
  { id: "support", label: "Support", icon: Heart, href: "/support" },
  { id: "support-help", label: "Help Center", icon: Heart, href: "/support/help" },
  
  // Assessment & Analysis
  { id: "assessment", label: "Assessment", icon: ClipboardCheck, href: "/assessments", description: "Mental health screening & evaluation" },
  { id: "analytics-chat", label: "Chat Analytics", icon: LineChart, href: "/analytics/chat" },
  
  // Team & Collaboration
  { id: "team-workspace", label: "Team Workspace", icon: Users, href: "/team-workspace-management" },
  { id: "project-page", label: "Project Management", icon: Library, href: "/ProjectPage" },
  
  // Content & Information
  { id: "about", label: "About", icon: Info, href: "/about" },
  { id: "mission", label: "Mission", icon: Target, href: "/about/mission" },
  { id: "careers", label: "Careers", icon: Briefcase, href: "/careers" },
  { id: "partners", label: "Partners", icon: Handshake, href: "/partners" },
  { id: "press", label: "Press", icon: FileText, href: "/press" },
  { id: "faq", label: "FAQ", icon: HelpCircle, href: "/faq" },
  { id: "contact", label: "Contact", icon: Phone, href: "/contact" },
  
  // Authentication & Account
  { id: "profile", label: "Profile", icon: Settings, href: "/profile", description: "Manage your account & preferences" },
  { id: "login", label: "Login", icon: LogIn, href: "/login" },
  { id: "signup", label: "Sign Up", icon: UserPlus, href: "/signup" },
  { id: "reset-password", label: "Reset Password", icon: Key, href: "/reset-password" },
  
  // Admin & Internal
  { id: "admin-dashboard", label: "Admin Dashboard", icon: Shield, href: "/admin/dashboard" },
  { id: "admin-monitoring", label: "Admin Monitoring", icon: Activity, href: "/admin/monitoring" },
  { id: "error-reports", label: "Error Reports", icon: AlertTriangle, href: "/error-reports" },
  
  // Test & Demo Pages
  { id: "test-jamie", label: "Test Jamie", icon: FaDesktop as React.ElementType, href: "/test-jamie" },
  { id: "test-form", label: "Test Form", icon: FileText, href: "/test-form" },
  { id: "test-hydration", label: "Test Hydration", icon: FaDesktop as React.ElementType, href: "/test-hydration" },
  { id: "test-voice-camera", label: "Test Voice Camera", icon: FaCamera as React.ElementType, href: "/test-voice-camera" },
  { id: "test-voice-orb", label: "Test Voice Orb", icon: Target, href: "/test-voice-orb" },
  { id: "test-voice-pipeline", label: "Test Voice Pipeline", icon: FaMicrophone as React.ElementType, href: "/test-voice-pipeline" },
  { id: "test-jarvis-voice", label: "Test JARVIS Voice", icon: FaMicrophone as React.ElementType, href: "/test-jarvis-voice" },
  { id: "test-jarvis-voice-complete", label: "Test JARVIS Complete", icon: FaMicrophone as React.ElementType, href: "/test-jarvis-voice-complete" },
  { id: "test-modern-ui", label: "Test Modern UI", icon: FaDesktop as React.ElementType, href: "/test-modern-ui" },
  { id: "advanced-ai-test", label: "Advanced AI Test", icon: Brain, href: "/advanced-ai-test" },
  
  // Demo Pages
  { id: "demo-editing", label: "Demo Editing", icon: FaEdit as React.ElementType, href: "/demo-editing" },
  { id: "demo-sidebar", label: "Demo Sidebar", icon: SidebarIcon, href: "/demo-sidebar" },
  { id: "demo-export", label: "Demo Export", icon: FaDownload as React.ElementType, href: "/demo-export" },
  { id: "demo-threads", label: "Demo Threads", icon: MessageSquare, href: "/demo-threads" },
  { id: "demo-titles", label: "Demo Titles", icon: FaFont as React.ElementType, href: "/demo-titles" },
  { id: "enhanced-chat-demo", label: "Enhanced Chat Demo", icon: MessageSquare, href: "/enhanced-chat-demo" },
  
  // Other Features
  { id: "wellness-resources", label: "Wellness Resources", icon: Heart, href: "/wellness-resources" },
  { id: "ai-companion", label: "AI Companion", icon: FaRobot as React.ElementType, href: "/services/ai-companion" },
  { id: "donation-success", label: "Donation Success", icon: Heart, href: "/donation-success" },
  { id: "support-us", label: "Support Us", icon: Heart, href: "/support-us" },
  { id: "features", label: "Features", icon: FaStar as React.ElementType, href: "/features" },
];

const IconRenderer = ({ Icon, size }: { Icon: React.ElementType, size: number }) => {
  return React.createElement(Icon, { size });
};

export default function Sidebar({ collapsed, setCollapsed, conversations, onNew, onSelect, onOpenSettings }: Props) {
  const [hover, setHover] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.id === 'profile' && onOpenSettings) {
      onOpenSettings();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  // Filter navigation items based on search query
  const filteredItems = NAVIGATION_ITEMS.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <aside className="relative h-full bg-neutral-950 flex flex-col" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {/* ChatGPT 5 style toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-4 w-6 h-6 flex items-center justify-center 
                   bg-neutral-800 rounded-full shadow-md hover:bg-neutral-700 
                   transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header with new chat */}
        <div style={{padding:12, display:"grid", gap:8, marginTop: "3rem"}}>
          <div style={{display:"flex", gap:8, alignItems:"center"}}>
            <button className="icon-btn" title="New Chat" onClick={onNew} style={{visibility: collapsed ? "hidden" : "visible"}}>
              <Plus size={18}/>
            </button>
            {!collapsed && <button className="rail-item" onClick={onNew} title="New Chat" style={{flex:1}}>
              <div className="rail-icon"><Plus size={18}/></div>
              <div className="rail-label">New Chat</div>
            </button>}
          </div>
          
          {/* Search Bar */}
          {!collapsed && (
            <div className="rail-search-container">
              <Search size={16} className="rail-search-icon" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rail-search-input"
              />
              {searchQuery && (
                <div className="rail-search-count">
                  {filteredItems.length} of {NAVIGATION_ITEMS.length} pages
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div style={{padding:12, display:"grid", gap:6}}>
          {/* Core Navigation Items */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              // Add category headers for better organization
              const showCategoryHeader = !collapsed && (
                (index === 0) || // First item
                (index === 3) || // AI & Chat Interfaces
                (index === 8) || // AI Management
                (index === 12) || // Therapy & Wellness
                (index === 17) || // Crisis & Support
                (index === 20) || // Progress & Tracking
                (index === 26) || // Wellness & Activities
                (index === 29) || // Education & Resources
                (index === 35) || // Resource Sub-pages
                (index === 41) || // Community & Support
                (index === 46) || // Assessment & Analysis
                (index === 48) || // Team & Collaboration
                (index === 50) || // Content & Information
                (index === 57) || // Authentication & Account
                (index === 61) || // Admin & Internal
                (index === 64) || // Test & Demo Pages
                (index === 74) || // Demo Pages
                (index === 80)    // Other Features
              );

              const categoryLabels = [
                "Core Navigation",
                "AI & Chat Interfaces", 
                "AI Management",
                "Therapy & Wellness",
                "Crisis & Support",
                "Progress & Tracking",
                "Wellness & Activities",
                "Education & Resources",
                "Resource Sub-pages",
                "Community & Support",
                "Assessment & Analysis",
                "Team & Collaboration",
                "Content & Information",
                "Authentication & Account",
                "Admin & Internal",
                "Test & Demo Pages",
                "Demo Pages",
                "Other Features"
              ];

              return (
                <div key={item.id}>
                  {showCategoryHeader && (
                    <div className="rail-category-header">
                      <div className="rail-category-title">{categoryLabels[Math.floor(index / 3)]}</div>
                    </div>
                  )}
                  <div 
                    className={`rail-item ${isActive(item.href) ? 'active' : ''}`}
                    onClick={() => handleItemClick(item)}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="rail-icon">
                      <IconRenderer Icon={item.icon} size={18}/>
                    </div>
                    {!collapsed && (
                      <div className="rail-label">
                        <div>{item.label}</div>
                        {item.description && (
                          <div className="rail-description">{item.description}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : searchQuery ? (
            <div className="rail-no-results">
              <div className="rail-no-results-icon">🔍</div>
              <div className="rail-no-results-text">No pages found</div>
              <div className="rail-no-results-hint">Try a different search term</div>
            </div>
          ) : null}

          {/* Divider */}
          <div style={{height:8}}/>

          {/* Recent Conversations */}
          {!collapsed && conversations?.length > 0 && (
            <div className="rail-section">
              <div className="rail-section-title">Recent Chats</div>
              {conversations.map(c => (
                <div key={c.id} className="rail-item" onClick={()=>onSelect(c.id)} title={c.title}>
                  <div className="rail-icon"><MessageSquare size={18}/></div>
                  <div className="rail-label">{c.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer with Profile - pinned at bottom */}
      <div className="rail-bottom flex-shrink-0">
        <div className="rail-profile">
          <div className="rail-avatar" />
          {!collapsed && <span>Profile</span>}
          <div style={{marginLeft:"auto"}} className="icon-btn" title="Settings">
            <Link href="/profile">
              <Settings size={16}/>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

