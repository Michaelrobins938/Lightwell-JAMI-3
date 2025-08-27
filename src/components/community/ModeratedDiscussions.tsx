import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Send, Smile, ChevronUp, ChevronDown,
  Shield, Flag, Pin, Star, UserCheck, Clock, TrendingUp,
  Reply, Share, Bookmark, ThumbsUp, ThumbsDown, MoreHorizontal,
  Eye, MessageCircle, Calendar, Tag, User, Award, AlertTriangle,
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

interface ModeratedDiscussionsProps {
  posts: Post[];
  user: User | null;
  onCreatePost: (content: string, isAnonymous: boolean, category: string, tags: string[]) => void;
  onLikePost: (postId: string, type: 'like' | 'helpful' | 'supportive') => void;
  onBookmarkPost: (postId: string) => void;
  onReportPost: (postId: string, reason: string) => void;
  showAnonymous: boolean;
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'recent' | 'popular' | 'trending' | 'most_replies';
  showCreatePost: boolean;
  setShowCreatePost: (show: boolean) => void;
  newPostContent: string;
  setNewPostContent: (content: string) => void;
  newPostCategory: string;
  setNewPostCategory: (category: string) => void;
  newPostTags: string[];
  setNewPostTags: (tags: string[]) => void;
  isAnonymousPost: boolean;
  setIsAnonymousPost: (anonymous: boolean) => void;
}

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

export const ModeratedDiscussions: React.FC<ModeratedDiscussionsProps> = ({
  posts,
  user,
  onCreatePost,
  onLikePost,
  onBookmarkPost,
  onReportPost,
  showAnonymous,
  searchQuery,
  selectedCategory,
  sortBy,
  showCreatePost,
  setShowCreatePost,
  newPostContent,
  setNewPostContent,
  newPostCategory,
  setNewPostCategory,
  newPostTags,
  setNewPostTags,
  isAnonymousPost,
  setIsAnonymousPost,
}) => {
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [tagInput, setTagInput] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      case 'trending':
        return (b.viewCount || 0) - (a.viewCount || 0);
      case 'most_replies':
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      default:
        return 0;
    }
  });

  const pinnedPosts = sortedPosts.filter(post => post.isPinned);
  const regularPosts = sortedPosts.filter(post => !post.isPinned);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      onCreatePost(newPostContent, isAnonymousPost, newPostCategory, newPostTags);
    }
  };

  const handleSubmitReply = async (postId: string) => {
    if (replyContent.trim()) {
      try {
        // Simulate API call
        console.log('Submitting reply:', replyContent);
        setReplyContent('');
        setShowReplyForm(null);
      } catch (error) {
        console.error('Error posting reply:', error);
      }
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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newPostTags.includes(tagInput.trim())) {
        setNewPostTags([...newPostTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPostTags(newPostTags.filter(tag => tag !== tagToRemove));
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.id === category) || categories[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <MessageSquare className="mr-2 text-blue-400" size={24} />
            Community Discussions
          </h2>
          <p className="text-zinc-400">
            Share your thoughts, ask questions, and connect with others
          </p>
        </div>
        
        <motion.button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} className="mr-2" />
          New Post
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
                  className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
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
                  Content
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, ask a question, or start a discussion..."
                  className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white min-h-[120px]"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tags (press Enter to add)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleAddTag}
                  placeholder="Add tags to help others find your post..."
                  className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
                />
                {newPostTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newPostTags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center px-2 py-1 bg-zinc-700 text-zinc-300 text-sm rounded-full"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-zinc-400 hover:text-zinc-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAnonymousPost}
                    onChange={(e) => setIsAnonymousPost(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-zinc-400">
                    Post anonymously
                  </span>
                </label>

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
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned Posts */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Pin className="mr-2 text-yellow-400" size={20} />
            Pinned Discussions
          </h3>
          {pinnedPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              user={user}
              isExpanded={expandedPosts.has(post.id)}
              onToggleExpanded={() => toggleExpanded(post.id)}
              onLike={onLikePost}
              onBookmark={onBookmarkPost}
              onReport={onReportPost}
              onReply={(postId) => setShowReplyForm(showReplyForm === postId ? null : postId)}
              showReplyForm={showReplyForm === post.id}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={handleSubmitReply}
              index={index}
              isPinned={true}
            />
          ))}
        </div>
      )}

      {/* Regular Posts */}
      <div className="space-y-4">
        {pinnedPosts.length > 0 && (
          <h3 className="text-lg font-semibold text-white">
            Recent Discussions
          </h3>
        )}
        
        {regularPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-zinc-400"
          >
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No discussions found.</p>
            <p className="text-sm">Be the first to start a conversation!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {regularPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                isExpanded={expandedPosts.has(post.id)}
                onToggleExpanded={() => toggleExpanded(post.id)}
                onLike={onLikePost}
                onBookmark={onBookmarkPost}
                onReport={onReportPost}
                onReply={(postId) => setShowReplyForm(showReplyForm === postId ? null : postId)}
                showReplyForm={showReplyForm === post.id}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onSubmitReply={handleSubmitReply}
                index={index}
                isPinned={false}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowReportModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Report Post
              </h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please explain why you're reporting this post..."
                className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white mb-4"
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowReportModal(null)}
                  className="px-4 py-2 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showReportModal && reportReason.trim()) {
                      onReportPost(showReportModal, reportReason);
                      setShowReportModal(null);
                      setReportReason('');
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PostCard: React.FC<{
  post: Post;
  user: User | null;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onLike: (postId: string, type: 'like' | 'helpful' | 'supportive') => void;
  onBookmark: (postId: string) => void;
  onReport: (postId: string, reason: string) => void;
  onReply: (postId: string) => void;
  showReplyForm: boolean;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: (postId: string) => void;
  index: number;
  isPinned: boolean;
}> = ({ 
  post, 
  user, 
  isExpanded, 
  onToggleExpanded, 
  onLike, 
  onBookmark, 
  onReport,
  onReply,
  showReplyForm,
  replyContent,
  setReplyContent,
  onSubmitReply,
  index,
  isPinned
}) => {
  const [showOptions, setShowOptions] = useState(false);
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
      className={`bg-zinc-800/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-white/10 ${
        isPinned ? 'border-2 border-yellow-400/50' : ''
      }`}
    >
      {/* Post Header */}
      <div className="p-6 border-b border-zinc-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Image
              src={post.isAnonymous ? '/api/placeholder/40/40' : post.author.image}
              alt={post.isAnonymous ? 'Anonymous' : post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white">
                  {post.isAnonymous ? 'Anonymous' : post.author.name}
                </span>
                {post.author.isExpert && (
                  <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full">
                    Expert
                  </span>
                )}
                {post.author.isModerator && (
                  <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full">
                    Moderator
                  </span>
                )}
                {isPinned && (
                  <span className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded-full flex items-center">
                    <Pin size={12} className="mr-1" />
                    Pinned
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

            <button
              onClick={() => onReply(post.id)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-zinc-700 text-zinc-400"
            >
              <Reply size={16} />
              <span>Reply</span>
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

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 p-4 bg-zinc-700/50 rounded-lg">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white mb-3"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onReply(post.id)}
                className="px-3 py-1 text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={() => onSubmitReply(post.id)}
                disabled={!replyContent.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      {isExpanded && post.comments && post.comments.length > 0 && (
        <div className="border-t border-zinc-700">
          <div className="p-4 space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Image
                  src={comment.author.image}
                  alt={comment.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-white">
                      {comment.author.name}
                    </span>
                    {comment.author.isExpert && (
                      <span className="bg-blue-900/50 text-blue-300 text-xs px-1 py-0.5 rounded">
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
                    <button className="text-xs text-zinc-400 hover:text-zinc-300">
                      Reply
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