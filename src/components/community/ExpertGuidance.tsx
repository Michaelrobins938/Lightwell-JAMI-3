import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, MessageSquare, Heart, Send, Smile, ChevronUp, ChevronDown,
  Shield, Flag, Pin, Star, UserCheck, Clock, TrendingUp,
  Reply, Share, Bookmark, ThumbsUp, ThumbsDown, MoreHorizontal,
  MessageCircle, Calendar, Tag, User, AlertTriangle,
  Plus, BookOpen, CheckCircle, Verified
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

interface ExpertGuidanceProps {
  posts: Post[];
  user: User | null;
  onLikePost: (postId: string, type: 'like' | 'helpful' | 'supportive') => void;
  onBookmarkPost: (postId: string) => void;
  onReportPost: (postId: string, reason: string) => void;
}

export const ExpertGuidance: React.FC<ExpertGuidanceProps> = ({
  posts,
  user,
  onLikePost,
  onBookmarkPost,
  onReportPost,
}) => {
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [selectedExpert, setSelectedExpert] = useState<string>('all');

  const expertPosts = posts.filter(post => post.isExpert || post.author.isExpert);
  const experts = Array.from(new Set(expertPosts.map(post => post.author.id)));

  const filteredPosts = selectedExpert === 'all' 
    ? expertPosts 
    : expertPosts.filter(post => post.author.id === selectedExpert);

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
            <Award className="mr-2 text-yellow-400" size={24} />
            Expert Guidance
          </h2>
          <p className="text-zinc-400">
            Get advice and insights from verified mental health professionals and experts
          </p>
        </div>
      </div>

      {/* Expert Filter */}
      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 border border-white/10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedExpert('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              selectedExpert === 'all'
                ? 'bg-yellow-500 text-white'
                : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            }`}
          >
            All Experts
          </button>
          {experts.map((expertId) => {
            const expert = expertPosts.find(post => post.author.id === expertId)?.author;
            if (!expert) return null;
            return (
              <button
                key={expertId}
                onClick={() => setSelectedExpert(expertId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedExpert === expertId
                    ? 'bg-yellow-500 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                <Image
                  src={expert.image}
                  alt={expert.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>{expert.name}</span>
                {expert.isExpert && <Verified size={14} className="text-yellow-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expert Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-zinc-400"
          >
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No expert posts found.</p>
            <p className="text-sm">Check back later for expert guidance!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <ExpertPostCard
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

const ExpertPostCard: React.FC<{
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
            <div className="relative">
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              {post.author.isExpert && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Verified size={12} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">{post.author.name}</span>
                {post.author.isExpert && (
                  <span className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded-full flex items-center">
                    <Award size={12} className="mr-1" />
                    Expert
                  </span>
                )}
                {post.author.isModerator && (
                  <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                    <Shield size={12} className="mr-1" />
                    Moderator
                  </span>
                )}
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
                      <MessageCircle size={12} className="mr-1" />
                      {post.viewCount} views
                    </span>
                  </>
                )}
              </div>
              {post.author.reputation && (
                <div className="flex items-center space-x-2 text-xs text-zinc-500 mt-1">
                  <Star size={12} className="text-yellow-400" />
                  <span>{post.author.reputation} reputation</span>
                  <span>•</span>
                  <span>{post.author.postCount} posts</span>
                </div>
              )}
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
                <div className="relative">
                  <Image
                    src={comment.author.image}
                    alt={comment.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {comment.author.isExpert && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                      <Verified size={8} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-white">
                      {comment.author.name}
                    </span>
                    {comment.author.isExpert && (
                      <span className="bg-yellow-900/50 text-yellow-300 text-xs px-1 py-0.5 rounded">
                        Expert
                      </span>
                    )}
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