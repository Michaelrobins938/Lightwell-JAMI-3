import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Define interfaces for Teams and Workspaces
export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  isPublic: boolean;
  memberCount: number;
  workspaceCount: number;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  teamId?: string;
  isPublic: boolean;
  memberCount: number;
  conversationCount: number;
}

export const useTeamWorkspace = () => {
  const { user } = useAuth();
  
  // State management
  const [teams, setTeams] = useState<Team[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams and workspaces
  const fetchTeamsAndWorkspaces = useCallback(async () => {
    if (!user) {
      setTeams([]);
      setWorkspaces([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Simulated data fetch - replace with actual API call
      const mockTeams: Team[] = [
        {
          id: 'team-1',
          name: 'Default Team',
          description: 'Your primary workspace team',
          isPublic: true,
          memberCount: 1,
          workspaceCount: 2
        }
      ];

      const mockWorkspaces: Workspace[] = [
        {
          id: 'workspace-1',
          name: 'Personal Workspace',
          description: 'Your personal conversations',
          teamId: 'team-1',
          isPublic: false,
          memberCount: 1,
          conversationCount: 5
        }
      ];

      setTeams(mockTeams);
      setWorkspaces(mockWorkspaces);
      
      // Set default team and workspace if not set
      if (!currentTeam && mockTeams.length > 0) {
        setCurrentTeam(mockTeams[0]);
      }
      if (!currentWorkspace && mockWorkspaces.length > 0) {
        setCurrentWorkspace(mockWorkspaces[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams and workspaces');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Team management functions
  const createTeam = useCallback(async (teamData: Partial<Team>) => {
    try {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamData.name || 'New Team',
        description: teamData.description || '',
        isPublic: teamData.isPublic || false,
        memberCount: 1,
        workspaceCount: 0
      };

      setTeams(prevTeams => [...prevTeams, newTeam]);
      setCurrentTeam(newTeam);
      return newTeam;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
      throw err;
    }
  }, []);

  const updateTeam = useCallback(async (teamId: string, updates: Partial<Team>) => {
    try {
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === teamId ? { ...team, ...updates } : team
        )
      );
      
      // Update current team if it's the one being updated
      if (currentTeam?.id === teamId) {
        setCurrentTeam(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update team');
      throw err;
    }
  }, [currentTeam]);

  const deleteTeam = useCallback(async (teamId: string) => {
    try {
      setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
      
      // Remove associated workspaces
      setWorkspaces(prevWorkspaces => 
        prevWorkspaces.filter(workspace => workspace.teamId !== teamId)
      );

      // Reset current team if it was the deleted one
      if (currentTeam?.id === teamId) {
        setCurrentTeam(teams.length > 0 ? teams[0] : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team');
      throw err;
    }
  }, [currentTeam, teams]);

  // Workspace management functions
  const createWorkspace = useCallback(async (workspaceData: Partial<Workspace>) => {
    try {
      const newWorkspace: Workspace = {
        id: `workspace-${Date.now()}`,
        name: workspaceData.name || 'New Workspace',
        description: workspaceData.description || '',
        teamId: workspaceData.teamId,
        isPublic: workspaceData.isPublic || false,
        memberCount: 1,
        conversationCount: 0
      };

      setWorkspaces(prevWorkspaces => [...prevWorkspaces, newWorkspace]);
      setCurrentWorkspace(newWorkspace);
      return newWorkspace;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
      throw err;
    }
  }, []);

  const updateWorkspace = useCallback(async (workspaceId: string, updates: Partial<Workspace>) => {
    try {
      setWorkspaces(prevWorkspaces => 
        prevWorkspaces.map(workspace => 
          workspace.id === workspaceId ? { ...workspace, ...updates } : workspace
        )
      );
      
      // Update current workspace if it's the one being updated
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workspace');
      throw err;
    }
  }, [currentWorkspace]);

  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    try {
      setWorkspaces(prevWorkspaces => 
        prevWorkspaces.filter(workspace => workspace.id !== workspaceId)
      );

      // Reset current workspace if it was the deleted one
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(workspaces.length > 0 ? workspaces[0] : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workspace');
      throw err;
    }
  }, [currentWorkspace, workspaces]);

  // Invite to team function (placeholder)
  const inviteToTeam = useCallback(async (teamId: string, email: string, role: string) => {
    try {
      // Placeholder for actual invite logic
      console.log(`Inviting ${email} to team ${teamId} with role ${role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite to team');
      throw err;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch teams and workspaces on user change
  useEffect(() => {
    fetchTeamsAndWorkspaces();
  }, [fetchTeamsAndWorkspaces]);

  return {
    teams,
    workspaces,
    currentTeam,
    currentWorkspace,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteToTeam,
    setCurrentTeam,
    setCurrentWorkspace,
    clearError
  };
};

