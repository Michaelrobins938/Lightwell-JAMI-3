import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Share2, Copy, Link, Lock, Unlock, Calendar, Eye, 
  MessageCircle, Globe, Users, Settings, Check, AlertCircle
} from 'lucide-react';
// Disabled toast to eliminate spammy notifications
// import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  conversationTitle?: string;
  messageCount: number;
}

interface ShareSettings {
  isPublic: boolean;
  allowComments: boolean;
  passwordProtected: boolean;
  password: string;
  expiresAt: Date | null;
  expiresInDays: number;
}

interface SharedLink {
  id: string;
  url: string;
  shareId: string;
  title: string;
  isPublic: boolean;
  allowComments: boolean;
  expiresAt: Date | null;
  viewCount: number;
  createdAt: Date;
}

export function ShareDialog({
  isOpen,
  onClose,
  conversationId,
  conversationTitle = 'Conversation',
  messageCount
}: ShareDialogProps) {
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    isPublic: false,
    allowComments: false,
    passwordProtected: false,
    password: '',
    expiresAt: null,
    expiresInDays: 7
  });

  const [isCreating, setIsCreating] = useState(false);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  // Generate a unique share ID
  const generateShareId = () => {
    return `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create shared link
  const handleCreateShare = async () => {
    if (!conversationId) {
      // toast.error('No conversation selected');
      console.log('No conversation selected');
      return;
    }

    setIsCreating(true);
    try {
      const shareId = generateShareId();
      const expiresAt = shareSettings.expiresInDays > 0 
        ? new Date(Date.now() + shareSettings.expiresInDays * 24 * 60 * 60 * 1000)
        : null;

      const response = await fetch('/api/chat/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          title: conversationTitle,
          description: `Shared conversation with ${messageCount} messages`,
          isPublic: shareSettings.isPublic,
          allowComments: shareSettings.allowComments,
          password: shareSettings.passwordProtected ? shareSettings.password : null,
          expiresAt: expiresAt?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create shared link');
      }

      const data = await response.json();
      
      const newSharedLink: SharedLink = {
        id: data.id,
        url: `${window.location.origin}/shared/${data.shareId}`,
        shareId: data.shareId,
        title: conversationTitle,
        isPublic: shareSettings.isPublic,
        allowComments: shareSettings.allowComments,
        expiresAt: expiresAt,
        viewCount: 0,
        createdAt: new Date(),
      };

      setSharedLinks(prev => [newSharedLink, ...prev]);
      // toast.success('Shared link created successfully!');
      console.log('Shared link created successfully!');
    } catch (error) {
      console.error('Failed to create shared link:', error);
      // toast.error('Failed to create shared link');
    } finally {
      setIsCreating(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // toast.success('Link copied to clipboard!');
      console.log('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      // toast.error('Failed to copy link');
    }
  };

  // Delete shared link
  const handleDeleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/chat/share/${linkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete shared link');
      }

      setSharedLinks(prev => prev.filter(link => link.id !== linkId));
      // toast.success('Shared link deleted');
      console.log('Shared link deleted');
    } catch (error) {
      console.error('Failed to delete shared link:', error);
      // toast.error('Failed to delete shared link');
    }
  };

  // Load existing shared links
  useEffect(() => {
    if (isOpen && conversationId) {
      // TODO: Load existing shared links for this conversation
      // This would require an API endpoint to fetch shared links
    }
  }, [isOpen, conversationId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 border border-gray-700"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-gray-400" />
              Share Conversation
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'create'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Create Link
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Manage Links ({sharedLinks.length})
            </button>
          </div>

          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-3">Conversation Details</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-300">
                    <span className="font-medium">Title:</span> {conversationTitle}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium">Messages:</span> {messageCount}
                  </p>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-3">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-gray-300">Public Link</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareSettings.isPublic}
                        onChange={(e) => setShareSettings(prev => ({
                          ...prev,
                          isPublic: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-gray-300">Allow Comments</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareSettings.allowComments}
                        onChange={(e) => setShareSettings(prev => ({
                          ...prev,
                          allowComments: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-gray-300">Password Protected</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareSettings.passwordProtected}
                        onChange={(e) => setShareSettings(prev => ({
                          ...prev,
                          passwordProtected: e.target.checked,
                          password: e.target.checked ? prev.password : ''
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {shareSettings.passwordProtected && (
                    <div className="ml-7">
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={shareSettings.password}
                        onChange={(e) => setShareSettings(prev => ({
                          ...prev,
                          password: e.target.value
                        }))}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Expiration */}
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-3">Expiration</h3>
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <select
                    value={shareSettings.expiresInDays}
                    onChange={(e) => setShareSettings(prev => ({
                      ...prev,
                      expiresInDays: parseInt(e.target.value)
                    }))}
                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Never expires</option>
                    <option value={1}>1 day</option>
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateShare}
                  disabled={isCreating || (shareSettings.passwordProtected && !shareSettings.password)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Create Link
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              {sharedLinks.length === 0 ? (
                <div className="text-center py-8">
                  <Share2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No shared links yet</p>
                  <p className="text-gray-500 text-sm">Create your first shared link to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sharedLinks.map((link) => (
                    <div key={link.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-100">{link.title}</h4>
                        <div className="flex items-center space-x-2">
                          {link.isPublic ? (
                            <div title="Public">
                              <Globe className="w-4 h-4 text-green-400" />
                            </div>
                          ) : (
                            <div title="Private">
                              <Lock className="w-4 h-4 text-yellow-400" />
                            </div>
                          )}
                          {link.allowComments && (
                            <div title="Comments enabled">
                              <MessageCircle className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {link.viewCount} views
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never expires'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyLink(link.url)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors flex items-center"
                        >
                          <Link className="w-3 h-3 mr-1" />
                          Open
                        </a>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


