import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Video, Lock, Unlock, Plus, Star, Clock,
  MessageSquare, Heart, MapPin, UserCheck, TrendingUp, Settings
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
}

interface PeerSupportGroupsProps {
  groups: SupportGroup[];
  user: User | null;
  onJoinGroup: (groupId: string) => void;
}

export const PeerSupportGroups: React.FC<PeerSupportGroupsProps> = ({
  groups,
  user,
  onJoinGroup,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const categories = [
    { id: 'all', label: 'All Groups' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'trauma', label: 'Trauma' },
    { id: 'addiction', label: 'Addiction' },
    { id: 'grief', label: 'Grief' },
    { id: 'general', label: 'General' },
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchQuery === '' || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      alert('Please log in to join groups.');
      return;
    }
    onJoinGroup(groupId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Peer Support Groups
          </h2>
          <p className="text-zinc-400">
            Connect with others on similar journeys in safe, moderated spaces
          </p>
        </div>
        
        <motion.button
          onClick={() => setShowCreateGroup(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} className="mr-2" />
          Create Group
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-4 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group, index) => (
          <GroupCard
            key={group.id}
            group={group}
            user={user}
            onJoinGroup={handleJoinGroup}
            index={index}
          />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-zinc-400"
        >
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No groups found.</p>
          <p className="text-sm">Create the first support group!</p>
        </motion.div>
      )}

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <CreateGroupModal
            onClose={() => setShowCreateGroup(false)}
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const GroupCard: React.FC<{
  group: SupportGroup;
  user: User | null;
  onJoinGroup: (groupId: string) => void;
  index: number;
}> = ({ group, user, onJoinGroup, index }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    await onJoinGroup(group.id);
    setIsJoining(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-zinc-800/50 backdrop-blur-xl rounded-lg p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{group.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              {group.isPrivate ? (
                <Lock size={12} />
              ) : (
                <Unlock size={12} />
              )}
              <span>{group.isPrivate ? 'Private' : 'Public'}</span>
            </div>
          </div>
        </div>
        {group.isMember && (
          <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded-full">
            Member
          </span>
        )}
      </div>

      <p className="text-zinc-300 mb-4 line-clamp-3">{group.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-400 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Users size={14} className="mr-1" />
            {group.memberCount} members
          </span>
          {group.nextMeeting && (
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {new Date(group.nextMeeting).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <Star size={14} className="mr-1 text-yellow-400" />
          <span>Active</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src={group.creator.image}
            alt={group.creator.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-xs text-zinc-400">Created by {group.creator.name}</span>
        </div>

        <motion.button
          onClick={handleJoin}
          disabled={isJoining || group.isMember}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            group.isMember
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
          }`}
          whileHover={!group.isMember ? { scale: 1.05 } : {}}
          whileTap={!group.isMember ? { scale: 0.95 } : {}}
        >
          {isJoining ? 'Joining...' : group.isMember ? 'Joined' : 'Join Group'}
        </motion.button>
      </div>
    </motion.div>
  );
};

const CreateGroupModal: React.FC<{
  onClose: () => void;
  user: User | null;
}> = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    isPrivate: false,
    tags: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Creating group:', formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-800 rounded-lg p-6 max-w-md w-full mx-4 border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-4">Create Support Group</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-700 text-white"
            >
              <option value="general">General</option>
              <option value="anxiety">Anxiety</option>
              <option value="depression">Depression</option>
              <option value="trauma">Trauma</option>
              <option value="addiction">Addiction</option>
              <option value="grief">Grief</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isPrivate" className="text-sm text-zinc-300">
              Private Group
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Group
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}; 