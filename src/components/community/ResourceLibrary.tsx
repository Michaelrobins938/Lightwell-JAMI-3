import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Star, Download, Share, Bookmark, Eye, Clock,
  FileText, Video, Wrench, Award, Tag, User, TrendingUp,
  Filter, Search, Plus, MoreHorizontal, ExternalLink
} from 'lucide-react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  image: string;
  isExpert?: boolean;
  isModerator?: boolean;
  joinDate: string;
  postCount: number;
  helpfulCount: number;
  reputation?: number;
  badges?: string[];
}

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'tool' | 'guide';
  tags: string[];
  rating: number;
  reviewCount: number;
  author: User;
  downloadCount?: number;
  viewCount?: number;
  isBookmarked?: boolean;
  createdAt?: string;
}

interface ResourceLibraryProps {
  resources: Resource[];
  user: User | null;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  resources,
  user,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'recent' | 'popular'>('rating');

  const types = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'article', label: 'Articles', icon: FileText },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'tool', label: 'Tools', icon: Wrench },
    { id: 'guide', label: 'Guides', icon: Award },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case 'popular':
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return 0;
    }
  });

  const handleDownload = (resourceId: string) => {
    // Simulate download
    console.log('Downloading resource:', resourceId);
  };

  const handleBookmark = (resourceId: string) => {
    // Simulate bookmark
    console.log('Bookmarking resource:', resourceId);
  };

  const handleShare = (resourceId: string) => {
    // Simulate share
    console.log('Sharing resource:', resourceId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <BookOpen className="mr-2 text-indigo-400" size={24} />
            Resource Library
          </h2>
          <p className="text-zinc-400">
            Discover helpful articles, videos, tools, and guides for mental health support
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-zinc-700 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-zinc-700 text-white"
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-zinc-700 text-white"
            >
              <option value="rating">Highest Rated</option>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResources.map((resource, index) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            user={user}
            onDownload={handleDownload}
            onBookmark={handleBookmark}
            onShare={handleShare}
            index={index}
          />
        ))}
      </div>

      {sortedResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-zinc-400"
        >
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No resources found.</p>
          <p className="text-sm">Check back later for new resources!</p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 text-center shadow-lg border border-white/10">
          <div className="text-2xl font-bold text-indigo-400">{resources.length}</div>
          <div className="text-sm text-zinc-400">Total Resources</div>
        </div>
        <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 text-center shadow-lg border border-white/10">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(resources.reduce((acc, r) => acc + r.rating, 0) / resources.length * 10) / 10}
          </div>
          <div className="text-sm text-zinc-400">Average Rating</div>
        </div>
        <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 text-center shadow-lg border border-white/10">
          <div className="text-2xl font-bold text-blue-400">
            {resources.reduce((acc, r) => acc + (r.downloadCount || 0), 0)}
          </div>
          <div className="text-sm text-zinc-400">Total Downloads</div>
        </div>
        <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 text-center shadow-lg border border-white/10">
          <div className="text-2xl font-bold text-purple-400">
            {resources.reduce((acc, r) => acc + (r.viewCount || 0), 0)}
          </div>
          <div className="text-sm text-zinc-400">Total Views</div>
        </div>
      </div>
    </div>
  );
};

const ResourceCard: React.FC<{
  resource: Resource;
  user: User | null;
  onDownload: (resourceId: string) => void;
  onBookmark: (resourceId: string) => void;
  onShare: (resourceId: string) => void;
  index: number;
}> = ({ resource, user, onDownload, onBookmark, onShare, index }) => {
  const [showOptions, setShowOptions] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return FileText;
      case 'video':
        return Video;
          case 'tool':
      return Wrench;
      case 'guide':
        return Award;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'text-blue-400';
      case 'video':
        return 'text-purple-400';
      case 'tool':
        return 'text-green-400';
      case 'guide':
        return 'text-yellow-400';
      default:
        return 'text-indigo-400';
    }
  };

  const TypeIcon = getTypeIcon(resource.type);
  const typeColor = getTypeColor(resource.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all duration-300"
    >
      {/* Resource Header */}
      <div className="p-6 border-b border-zinc-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center`}>
              <TypeIcon className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded-full bg-zinc-700 text-zinc-300 capitalize`}>
                  {resource.type}
                </span>
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-400" />
                  <span className="text-xs text-zinc-400">{resource.rating}</span>
                  <span className="text-xs text-zinc-500">({resource.reviewCount})</span>
                </div>
              </div>
              <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                {resource.title}
              </h3>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 hover:bg-zinc-700 rounded"
            >
              <MoreHorizontal size={16} className="text-zinc-400" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 py-1 z-10">
                <button
                  onClick={() => onBookmark(resource.id)}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center text-zinc-300"
                >
                  <Bookmark size={14} className="mr-2" />
                  {resource.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                </button>
                <button
                  onClick={() => onShare(resource.id)}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center text-zinc-300"
                >
                  <Share size={14} className="mr-2" />
                  Share
                </button>
                <button
                  onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center text-zinc-300"
                >
                  <ExternalLink size={14} className="mr-2" />
                  Open
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resource Content */}
      <div className="p-6">
        <p className="text-zinc-300 mb-4 line-clamp-3">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full">
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center space-x-2 mb-4">
          <Image
            src={resource.author.image}
            alt={resource.author.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm text-zinc-400">by {resource.author.name}</span>
          {resource.author.isExpert && (
            <span className="bg-yellow-900/50 text-yellow-300 text-xs px-1 py-0.5 rounded">
              Expert
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-zinc-400 mb-4">
          <div className="flex items-center space-x-4">
            {resource.downloadCount && (
              <span className="flex items-center">
                <Download size={12} className="mr-1" />
                {resource.downloadCount} downloads
              </span>
            )}
            {resource.viewCount && (
              <span className="flex items-center">
                <Eye size={12} className="mr-1" />
                {resource.viewCount} views
              </span>
            )}
            {resource.createdAt && (
              <span className="flex items-center">
                <Clock size={12} className="mr-1" />
                {new Date(resource.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => onDownload(resource.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            <span>Download</span>
          </motion.button>

          <button
            onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
            className="flex items-center space-x-2 px-4 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-all duration-300"
          >
            <ExternalLink size={16} />
            <span>View</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 