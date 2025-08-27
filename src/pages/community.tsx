import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Send, AlertTriangle, Smile, ChevronUp, ChevronDown,
  Users, Shield, Eye, EyeOff, BookOpen, Video, Calendar, Star, Filter,
  Search, Plus, Settings, UserCheck, Award, Clock, TrendingUp, HelpCircle,
  Reply, Share, Bookmark, Flag, Pin, ThumbsUp, ThumbsDown, MoreHorizontal,
  Moon, Target, Info, MessageCircle, Contact, Cloud, Edit, Lightbulb
} from 'lucide-react';
import Image from 'next/image';
import Head from 'next/head';

import { Layout } from '../components/layout/Layout';
import { PeerSupportGroups } from '../components/community/PeerSupportGroups';
import { ModeratedDiscussions } from '../components/community/ModeratedDiscussions';
import { AnonymousSharing } from '../components/community/AnonymousSharing';
import { ExpertGuidance } from '../components/community/ExpertGuidance';
import { ResourceLibrary } from '../components/community/ResourceLibrary';
import { CrisisSupport } from '../components/community/CrisisSupport';
import { CommunityNavigation } from '../components/community/CommunityNavigation';
import { samplePosts, sampleUsers, sampleSupportGroups, sampleResources } from '../data/sampleCommunityData';

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

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  tags: string[];
  isPrivate: boolean;
  nextMeeting?: string;
  creator: User;
  isMember?: boolean;
  maxMembers?: number;
  category: 'anxiety' | 'depression' | 'trauma' | 'addiction' | 'grief' | 'general';
  isActive: boolean;
  lastActivity: string;
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
}

// Helper functions for category styling
const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'support':
      return 'bg-green-500/20 border border-green-400/30 text-green-300';
    case 'celebration':
      return 'bg-yellow-500/20 border border-yellow-400/30 text-yellow-300';
    case 'vent':
      return 'bg-red-500/20 border border-red-400/30 text-red-300';
    case 'resources':
      return 'bg-purple-500/20 border border-purple-400/30 text-purple-300';
    case 'recovery':
      return 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300';
    default:
      return 'bg-blue-500/20 border border-blue-400/30 text-blue-300';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'celebration':
      return '✨ Wins';
    case 'support':
      return '🤝 Support';
    case 'vent':
      return '💭 Vent';
    case 'resources':
      return '📚 Resources';
    case 'recovery':
      return '🌱 Recovery';
    default:
      return '💬 General';
  }
};

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ 
    content: '', 
    tags: [] as string[], 
    isAnonymous: false,
    category: 'general' as Post['category']
  });
  const [selectedCategory, setSelectedCategory] = useState<Post['category']>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  // Load posts from sample data (for beta demo)
  const loadPosts = async () => {
    try {
      setLoading(true);
      // Use sample data for beta demo
      setPosts(samplePosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newPost.content,
          tags: newPost.tags,
          isAnonymous: newPost.isAnonymous,
          category: selectedCategory,
          authorId: user?.id || 'anonymous'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost({ content: '', tags: [], isAnonymous: false, category: 'general' });
        setShowCreatePost(false);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  // Handle post like
  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          userId: user?.id || 'anonymous'
        }),
      });

      if (response.ok) {
        // Update local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: [...post.likes, { id: Date.now().toString(), userId: user?.id || 'anonymous', type: 'like' }] }
            : post
        ));
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // Add comment to post
  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/community/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          content: commentText,
          authorId: user?.id || 'anonymous'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state with new comment
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, data.comment] }
            : post
        ));
        setNewComment({ ...newComment, [postId]: '' });
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Load posts on mount
  useEffect(() => {
    loadPosts();
    // Load user info from localStorage or context
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header with Lightwell Branding */}
        <div className="text-center mb-12 relative">
          {/* Ambient light effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 bg-slate-800/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/40">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-amber-400/40 rounded-2xl text-amber-300 text-sm font-semibold mb-6">
              <Users className="w-4 h-4" />
              <span>Lightwell Community</span>
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <span>Safe Space</span>
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <span>Peer Support</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Find Your Light Together
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A compassionate community where you can share your journey, find support, and be that light in the dark for others. 
              Here, everyone's story matters and healing happens together.
            </p>
            
            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-amber-400">2.4k+</div>
                <div className="text-sm text-slate-400">Community Members</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">15k+</div>
                <div className="text-sm text-slate-400">Posts Shared</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">50k+</div>
                <div className="text-sm text-slate-400">Hearts Given</div>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-slate-400">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Categories Navigation */}
        <div className="mb-8">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/40">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-amber-400" />
              Community Spaces
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'general', label: 'General', icon: MessageCircle, color: 'blue', description: 'Open discussions' },
                { key: 'support', label: 'Support', icon: Heart, color: 'green', description: 'Seeking help' },
                { key: 'celebration', label: 'Wins', icon: Star, color: 'yellow', description: 'Celebrate progress' },
                { key: 'resources', label: 'Resources', icon: BookOpen, color: 'purple', description: 'Helpful tools' },
                { key: 'vent', label: 'Vent Space', icon: Cloud, color: 'red', description: 'Safe to express' },
                { key: 'recovery', label: 'Recovery', icon: TrendingUp, color: 'emerald', description: 'Journey stories' }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key as Post['category'])}
                  className={`p-3 rounded-xl transition-all duration-300 text-left group ${
                    selectedCategory === category.key
                      ? 'bg-blue-500/20 border border-blue-400/30 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-600/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {React.createElement(category.icon, { 
                      className: `w-4 h-4 ${selectedCategory === category.key ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}` 
                    })}
                    <span className={`text-sm font-medium ${selectedCategory === category.key ? 'text-blue-300' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {category.label}
                    </span>
                  </div>
                  <div className={`text-xs leading-tight ${selectedCategory === category.key ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Create Post Section */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/40 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Edit className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Share Your Story</h3>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">Safe Space Active</span>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                placeholder={`Share something with the ${selectedCategory} community... Remember, your story matters and might be exactly what someone else needs to hear today.`}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 resize-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
                rows={4}
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                    selectedCategory === 'support' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                    selectedCategory === 'celebration' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' :
                    selectedCategory === 'vent' ? 'bg-red-500/20 border-red-400/30 text-red-300' :
                    selectedCategory === 'resources' ? 'bg-purple-500/20 border-purple-400/30 text-purple-300' :
                    selectedCategory === 'recovery' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' :
                    'bg-blue-500/20 border-blue-400/30 text-blue-300'
                  }`}>
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Space
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500/20"
                    />
                    <span className="text-sm text-slate-300">Share anonymously</span>
                  </label>
                </div>
                
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.content.trim()}
                  className="ml-auto bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Posts Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-400/20 border-t-amber-400 mx-auto"></div>
                <Lightbulb className="w-6 h-6 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p className="mt-4 text-slate-300">Loading community stories...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/40 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start the Conversation</h3>
                <p className="text-slate-400 mb-4">Be the first to share your story and light the way for others in this space.</p>
                <div className="text-sm text-slate-500">
                  Your courage to share might be exactly what someone else needs to see today.
                </div>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div 
                key={post.id} 
                className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/40 overflow-hidden hover:border-slate-600/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Post Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      post.isAnonymous 
                        ? 'bg-gradient-to-br from-gray-500 to-gray-600' 
                        : 'bg-gradient-to-br from-amber-400 to-blue-500'
                    }`}>
                      <span className="text-white font-semibold text-lg">
                        {post.isAnonymous ? 'A' : post.author?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-white">
                          {post.isAnonymous ? 'Anonymous Community Member' : post.author?.name || 'Community Member'}
                        </span>
                        <span className="text-sm text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyles(post.category)}`}>
                          {getCategoryLabel(post.category)}
                        </div>
                      </div>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-200 leading-relaxed">{post.content}</p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group"
                      >
                        <Heart className={`w-5 h-5 transition-colors ${
                          post.likes.some(like => like.userId === user?.id) 
                            ? 'text-red-400 fill-red-400' 
                            : 'text-slate-400 group-hover:text-red-400'
                        }`} />
                        <span className="text-sm text-slate-300 group-hover:text-white">
                          {post.likes.length} {post.likes.length === 1 ? 'heart' : 'hearts'}
                        </span>
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group"
                      >
                        <MessageSquare className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span className="text-sm text-slate-300 group-hover:text-white">
                          {post.comments.length} {post.comments.length === 1 ? 'response' : 'responses'}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group">
                        <Share className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                        <span className="text-sm text-slate-300 group-hover:text-white">Share hope</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group">
                        <Bookmark className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-700/30 transition-all duration-200 group">
                        <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold mb-3">Comments</h4>
                    
                    {/* Add Comment */}
                    <div className="flex gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                          className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                        />
                      </div>
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComment[post.id]?.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Comment
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {comment.author?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                {comment.author?.name || 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-200 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}