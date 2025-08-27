import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, Plus, Settings, Shield, AlertTriangle, CheckCircle,
  Edit, Trash2, Copy, Star, UserPlus, Mail, Globe, Lock, X
} from 'lucide-react';
import { useTeamWorkspace } from '../hooks/useTeamWorkspace';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const TeamWorkspaceManagement: React.FC = () => {
  const { user } = useAuth();
  const {
    teams,
    workspaces,
    currentTeam,
    currentWorkspace,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    inviteToTeam,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setCurrentTeam,
    setCurrentWorkspace,
    clearError
  } = useTeamWorkspace();

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to manage teams and workspaces.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleCreateTeam = async (teamData: any) => {
    try {
      await createTeam(teamData);
      setShowTeamModal(false);
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleUpdateTeam = async (teamId: string, updates: any) => {
    try {
      await updateTeam(teamId, updates);
      setShowTeamModal(false);
      setEditingTeam(null);
    } catch (error) {
      console.error('Failed to update team:', error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete team:', error);
    }
  };

  const handleCreateWorkspace = async (workspaceData: any) => {
    try {
      await createWorkspace(workspaceData);
      setShowWorkspaceModal(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleUpdateWorkspace = async (workspaceId: string, updates: any) => {
    try {
      await updateWorkspace(workspaceId, updates);
      setShowWorkspaceModal(false);
      setEditingWorkspace(null);
    } catch (error) {
      console.error('Failed to update workspace:', error);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await deleteWorkspace(workspaceId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };

  const handleInviteToTeam = async (teamId: string, email: string, role: string) => {
    try {
      await inviteToTeam(teamId, email, role as any);
      setShowInviteModal(false);
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Teams & Workspaces
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage your collaborative spaces and team members
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingTeam(null);
                    setShowTeamModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Team
                </button>
                <button
                  onClick={() => {
                    setEditingWorkspace(null);
                    setShowWorkspaceModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Workspace
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">{error}</span>
                <button
                  onClick={clearError}
                  className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Teams Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Teams
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {teams.length} team{teams.length !== 1 ? 's' : ''}
                </span>
              </div>

              {teams.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No teams yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first team to start collaborating
                  </p>
                  <button
                    onClick={() => {
                      setEditingTeam(null);
                      setShowTeamModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Team
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {team.name}
                            </h3>
                            {team.isPublic ? (
                              <Globe className="w-4 h-4 text-green-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          {team.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              {team.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{team.memberCount} member{team.memberCount !== 1 ? 's' : ''}</span>
                            <span>{team.workspaceCount} workspace{team.workspaceCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTeam(team);
                              setShowTeamModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowInviteModal(true)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(team.id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Workspaces Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  Workspaces
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}
                </span>
              </div>

              {workspaces.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No workspaces yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first workspace to organize conversations
                  </p>
                  <button
                    onClick={() => {
                      setEditingWorkspace(null);
                      setShowWorkspaceModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Workspace
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {workspaces.map((workspace) => (
                    <motion.div
                      key={workspace.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {workspace.name}
                            </h3>
                            {workspace.isPublic ? (
                              <Globe className="w-4 h-4 text-green-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          {workspace.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              {workspace.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{workspace.memberCount} member{workspace.memberCount !== 1 ? 's' : ''}</span>
                            <span>{workspace.conversationCount} conversation{workspace.conversationCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingWorkspace(workspace);
                              setShowWorkspaceModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(workspace.id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Modal */}
        {showTeamModal && (
          <TeamModal
            team={editingTeam}
            onSave={editingTeam ? handleUpdateTeam : handleCreateTeam}
            onCancel={() => {
              setShowTeamModal(false);
              setEditingTeam(null);
            }}
          />
        )}

        {/* Workspace Modal */}
        {showWorkspaceModal && (
          <WorkspaceModal
            workspace={editingWorkspace}
            teams={teams}
            onSave={editingWorkspace ? handleUpdateWorkspace : handleCreateWorkspace}
            onCancel={() => {
              setShowWorkspaceModal(false);
              setEditingWorkspace(null);
            }}
          />
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal
            onInvite={handleInviteToTeam}
            onCancel={() => setShowInviteModal(false)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={() => {
              // Determine if it's a team or workspace based on the ID
              const isTeam = teams.some(team => team.id === showDeleteConfirm);
              if (isTeam) {
                handleDeleteTeam(showDeleteConfirm);
              } else {
                handleDeleteWorkspace(showDeleteConfirm);
              }
            }}
            onCancel={() => setShowDeleteConfirm(null)}
            itemType={teams.some(team => team.id === showDeleteConfirm) ? 'team' : 'workspace'}
          />
        )}
      </div>
    </Layout>
  );
};

// Team Modal Component
const TeamModal: React.FC<{
  team?: any;
  onSave: (teamId: string, data: any) => void;
  onCancel: () => void;
}> = ({ team, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
    avatar: team?.avatar || '',
    isPublic: team?.isPublic || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (team) {
      onSave(team.id, formData);
    } else {
      onSave('', formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {team ? 'Edit Team' : 'Create Team'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Public team
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {team ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Workspace Modal Component
const WorkspaceModal: React.FC<{
  workspace?: any;
  teams: any[];
  onSave: (workspaceId: string, data: any) => void;
  onCancel: () => void;
}> = ({ workspace, teams, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: workspace?.name || '',
    description: workspace?.description || '',
    teamId: workspace?.teamId || '',
    isPublic: workspace?.isPublic || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspace) {
      onSave(workspace.id, formData);
    } else {
      onSave('', formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {workspace ? 'Edit Workspace' : 'Create Workspace'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team (Optional)
            </label>
            <select
              value={formData.teamId}
              onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">No team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Public workspace
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {workspace ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Invite Modal Component
const InviteModal: React.FC<{
  onInvite: (teamId: string, email: string, role: string) => void;
  onCancel: () => void;
}> = ({ onInvite, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'member'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, using a placeholder team ID - in a real app, you'd select the team
    onInvite('placeholder-team-id', formData.email, formData.role);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Invite to Team
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Invitation
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  itemType: 'team' | 'workspace';
}> = ({ onConfirm, onCancel, itemType }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Delete {itemType}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this {itemType}? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamWorkspaceManagement;


