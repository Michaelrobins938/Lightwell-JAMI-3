import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, MessageSquare, Heart, Send, Smile, ChevronUp, ChevronDown,
  Shield, Flag, Pin, Star, UserCheck, Clock, TrendingUp,
  Reply, Share, Bookmark, ThumbsUp, ThumbsDown, MoreHorizontal,
  MessageCircle, Calendar, Tag, User, Award, AlertTriangle,
  Plus, BookOpen
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

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  comments: Comment[];
  likes: Like[];
  isAnonymous?: boolean;
  tags: string[];
  category: 'general' | 'crisis' | 'recovery' | 'resources' | 'expert' | 'support' | 'vent' | 'celebration';
  isModerated?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  viewCount?: number;
  isBookmarked?: boolean;
  lastActivity?: string;
  threadId?: string;
  parentId?: string;
  isExpert?: boolean;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  isExpert?: boolean;
  isModerated?: boolean;
  likes: number;
  replies?: Comment[];
  parentId?: string;
}

interface Like {
  id: string;
  userId: string;
  type: 'like' | 'helpful' | 'supportive';
}

interface AnonymousSharingProps {
  posts: Post[];
  user: User | null;
  onCreatePost: (content: string, isAnonymous: boolean, category: string, tags: string[]) => void;
  onLikePost: (postId: string, type: 'like' | 'helpful' | 'supportive') => void;
  onBookmarkPost: (postId: string) => void;
  onReportPost: (postId: string, reason: string) => void;
}

export const AnonymousSharing: React.FC<AnonymousSharingProps> = ({
  posts,
  user,
  onCreatePost,
  onLikePost,
  onBookmarkPost,
  onReportPost,
}) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'general', label: 'General Discussion', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'support', label: 'Support & Encouragement', icon: Heart, color: 'text-green-400' },
    { id: 'vent', label: 'Vent & Rant', icon: AlertTriangle, color: 'text-orange-400' },
    { id: 'celebration', label: 'Celebrations & Wins', icon: Star, color: 'text-yellow-400' },
    { id: 'recovery', label: 'Recovery Journey', icon: TrendingUp, color: 'text-purple-400' },
    { id: 'crisis', label: 'Crisis Support', icon: Shield, color: 'text-red-400' },
    { id: 'resources', label: 'Resources & Tips', icon: BookOpen, color: 'text-indigo-400' },
    { id: 'expert', label: 'Expert Q&A', icon: Award, color: 'text-pink-400' },
  ];

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      onCreatePost(newPostContent, true, newPostCategory, newPostTags);
      setShowCreatePost(false);
      setNewPostContent('');
      setNewPostCategory('general');
      setNewPostTags([]);
    }
  };

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Eye className="mr-2 text-green-400" size={24} />
            Anonymous Sharing
          </h2>
          <p className="text-zinc-400">
            Share your thoughts anonymously in a safe, judgment-free space
          </p>
        </div>
        
        <motion.button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} className="mr-2" />
          Share Anonymously
        </motion.button>
      </div>

      {/* Create Post Form */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg p-6 border border-white/10"
          >
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Category
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-zinc-700 text-white"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Your Message (Anonymous)
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, feelings, or experiences anonymously..."
                  className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-zinc-700 text-white min-h-[120px]"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-zinc-400">
                  <Eye className="mr-2 text-green-400" size={16} />
                  <span>This post will be anonymous</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-2 text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Share Anonymously
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anonymous Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-zinc-400"
          >
            <Eye size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No anonymous posts yet.</p>
            <p className="text-sm">Be the first to share anonymously!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {posts.map((post, index) => (
              <AnonymousPostCard
                key={post.id}
                post={post}
                user={user}
                isExpanded={expandedPosts.has(post.id)}
                onToggleExpanded={() => toggleExpanded(post.id)}
                onLike={onLikePost}
                onBookmark={onBookmarkPost}
                onReport={onReportPost}
                index={index}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const AnonymousPostCard: React.FC<{
  post: Post;
  user: User | null;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onLike: (postId: string, type: 'like' | 'helpful' | 'supportive') => void;
  onBookmark: (postId: string) => void;
  onReport: (postId: string, reason: string) => void;
  index: number;
}> = ({ 
  post, 
  user, 
  isExpanded, 
  onToggleExpanded, 
  onLike, 
  onBookmark, 
  onReport,
  index
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const categories = [
    { id: 'general', label: 'General Discussion', icon: MessageSquare, color: 'text-blue-400' },
    { id: 'support', label: 'Support & Encouragement', icon: Heart, color: 'text-green-400' },
    { id: 'vent', label: 'Vent & Rant', icon: AlertTriangle, color: 'text-orange-400' },
    { id: 'celebration', label: 'Celebrations & Wins', icon: Star, color: 'text-yellow-400' },
    { id: 'recovery', label: 'Recovery Journey', icon: TrendingUp, color: 'text-purple-400' },
    { id: 'crisis', label: 'Crisis Support', icon: Shield, color: 'text-red-400' },
    { id: 'resources', label: 'Resources & Tips', icon: BookOpen, color: 'text-indigo-400' },
    { id: 'expert', label: 'Expert Q&A', icon: Award, color: 'text-pink-400' },
  ];
  const categoryInfo = categories.find(cat => cat.id === post.category);

  const getLikeCount = (type: string) => {
    return post.likes?.filter(like => like.type === type).length || 0;
  };

  const hasUserLiked = (type: string) => {
    return post.likes?.some(like => like.userId === user?.id && like.type === type) || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-white/10"
    >
      {/* Post Header */}
      <div className="p-6 border-b border-zinc-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Eye className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">Anonymous User</span>
                <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                  <Eye size={12} className="mr-1" />
                  Anonymous
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-zinc-400">
                <Clock size={12} />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className={`flex items-center ${categoryInfo?.color}`}>
                  {categoryInfo?.icon && <categoryInfo.icon size={12} className="mr-1" />}
                  {categoryInfo?.label}
                </span>
                {post.viewCount && (
                  <>
                    <span>•</span>
                    <span className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {post.viewCount} views
                    </span>
                  </>
                )}
              </div>
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
                  onClick={() => onBookmark(post.id)}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center text-zinc-300"
                >
                  <Bookmark size={14} className="mr-2" />
                  {post.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                </button>
                <button
                  onClick={() => onReport(post.id, '')}
                  className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex items-center text-red-400"
                >
                  <Flag size={14} className="mr-2" />
                  Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-white whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id, 'like')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                hasUserLiked('like')
                  ? 'bg-zinc-700 text-zinc-300'
                  : 'hover:bg-zinc-700 text-zinc-400'
              }`}
            >
              <ThumbsUp size={16} />
              <span>{getLikeCount('like')}</span>
            </button>

            <button
              onClick={() => onLike(post.id, 'helpful')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                hasUserLiked('helpful')
                  ? 'bg-green-900/50 text-green-300'
                  : 'hover:bg-green-900/50 text-green-400'
              }`}
            >
              <Heart size={16} />
              <span>{getLikeCount('helpful')}</span>
            </button>

            <button
              onClick={() => onLike(post.id, 'supportive')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                hasUserLiked('supportive')
                  ? 'bg-purple-900/50 text-purple-300'
                  : 'hover:bg-purple-900/50 text-purple-400'
              }`}
            >
              <MessageCircle size={16} />
              <span>{getLikeCount('supportive')}</span>
            </button>
          </div>

          <button
            onClick={onToggleExpanded}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-zinc-700 text-zinc-400"
          >
            <MessageCircle size={16} />
            <span>{post.comments?.length || 0} replies</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Comments */}
      {isExpanded && post.comments && post.comments.length > 0 && (
        <div className="border-t border-zinc-700">
          <div className="p-4 space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Eye className="text-white" size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-white">
                      Anonymous
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-zinc-300">
                      <ThumbsUp size={12} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}; 