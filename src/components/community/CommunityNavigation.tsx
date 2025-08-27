import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Users, Eye, Award, BookOpen, HelpCircle, 
  Search, Filter, EyeOff, Settings, Plus, TrendingUp, Clock, Star
} from 'lucide-react';

interface CommunityNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showAnonymous: boolean;
  onToggleAnonymous: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'recent' | 'popular' | 'trending' | 'most_replies';
  onSortChange: (sort: 'recent' | 'popular' | 'trending' | 'most_replies') => void;
  showCreatePost: boolean;
  onToggleCreatePost: () => void;
}

const tabs = [
  { id: 'discussions', label: 'Discussions', icon: MessageSquare },
  { id: 'groups', label: 'Support Groups', icon: Users },
  { id: 'anonymous', label: 'Anonymous', icon: Eye },
  { id: 'experts', label: 'Expert Q&A', icon: Award },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'crisis', label: 'Crisis Support', icon: HelpCircle },
];

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'general', label: 'General Discussion' },
  { id: 'support', label: 'Support & Encouragement' },
  { id: 'vent', label: 'Vent & Rant' },
  { id: 'celebration', label: 'Celebrations & Wins' },
  { id: 'recovery', label: 'Recovery Journey' },
  { id: 'crisis', label: 'Crisis Support' },
  { id: 'resources', label: 'Resources & Tips' },
  { id: 'expert', label: 'Expert Q&A' },
];

const sortOptions = [
  { id: 'recent', label: 'Most Recent', icon: Clock },
  { id: 'popular', label: 'Most Popular', icon: Star },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'most_replies', label: 'Most Replies', icon: MessageSquare },
];

export const CommunityNavigation: React.FC<CommunityNavigationProps> = ({
  activeTab,
  onTabChange,
  showAnonymous,
  onToggleAnonymous,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  showCreatePost,
  onToggleCreatePost,
}) => {
  return (
    <div className="mb-8 space-y-6">
      {/* Tab Navigation */}
      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg p-4 border border-white/10">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg p-4 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Search posts, groups, or resources..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="px-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Anonymous Toggle */}
            <motion.button
              onClick={onToggleAnonymous}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                showAnonymous
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAnonymous ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
              Anonymous
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {activeTab === 'discussions' && (
        <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-blue-400" />
                <span className="text-sm text-zinc-400">
                  Quick Filters:
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-600">
                  Pinned
                </button>
                <button className="px-3 py-1 text-xs bg-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-600">
                  Unanswered
                </button>
                <button className="px-3 py-1 text-xs bg-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-600">
                  My Posts
                </button>
              </div>
            </div>

            <motion.button
              onClick={onToggleCreatePost}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                showCreatePost
                  ? 'bg-purple-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={18} className="mr-2" />
              {showCreatePost ? 'Cancel' : 'New Post'}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}; 