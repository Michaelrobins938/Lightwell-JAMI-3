import { prisma } from '../lib/database';
import { randomBytes } from 'crypto';
import type { Team, Workspace, TeamMember, TeamInvitation } from '@prisma/client';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  avatar: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  workspaceCount: number;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  teamId: string | null;
  ownerId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  conversationCount: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class TeamWorkspaceService {
  private static instance: TeamWorkspaceService;

  public static getInstance(): TeamWorkspaceService {
    if (!TeamWorkspaceService.instance) {
      TeamWorkspaceService.instance = new TeamWorkspaceService();
    }
    return TeamWorkspaceService.instance;
  }

  /**
   * Create a new team
   */
  async createTeam(userId: string, teamData: {
    name: string;
    avatar?: string;
  }): Promise<Team> {
    const team = await prisma.team.create({
      data: {
        ...teamData,
        members: {
          create: {
            userId,
            role: 'owner'
          }
        }
      }
    });

    return team;
  }

  /**
   * Get teams for a user
   */
  async getUserTeams(userId: string): Promise<Team[]> {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      }
    });

    return teams;
  }

  /**
   * Get team by ID with members
   */
  async getTeamById(teamId: string, userId: string): Promise<(Team & { members: (TeamMember & { user: { id: string; name: string | null; email: string; } })[] }) | null> {
    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!team) {
      return null;
    }

    return team;
  }

  /**
   * Update team
   */
  async updateTeam(teamId: string, userId: string, updates: {
    name?: string;
    avatar?: string;
  }): Promise<Team> {
    // Check if user is owner or admin
    const member = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: {
          in: ['owner', 'admin']
        }
      }
    });

    if (!member) {
      throw new Error('Insufficient permissions');
    }

    const team = await prisma.team.update({
      where: { id: teamId },
      data: updates
    });

    return team;
  }

  /**
   * Delete team
   */
  async deleteTeam(teamId: string, userId: string): Promise<void> {
    // Check if user is owner
    const member = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: 'owner'
      }
    });

    if (!member) {
      throw new Error('Only team owner can delete team');
    }

    await prisma.team.delete({
      where: { id: teamId }
    });
  }

  /**
   * Invite user to team
   */
  async inviteToTeam(teamId: string, userId: string, email: string, role: 'admin' | 'member' | 'viewer' = 'member'): Promise<TeamInvitation> {
    // Check if user is owner or admin
    const member = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: {
          in: ['owner', 'admin']
        }
      }
    });

    if (!member) {
      throw new Error('Insufficient permissions');
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        user: {
          email
        }
      }
    });

    if (existingMember) {
      throw new Error('User is already a team member');
    }

    // Create invitation
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return await prisma.teamInvitation.create({
      data: {
        teamId,
        email,
        role,
        token,
        expiresAt
      }
    });
  }

  /**
   * Accept team invitation
   */
  async acceptTeamInvitation(token: string, userId: string): Promise<TeamMember> {
    const invitation = await prisma.teamInvitation.findUnique({
      where: { token },
      include: { team: true }
    });

    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    // Check if user email matches invitation
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.email !== invitation.email) {
      throw new Error('Email does not match invitation');
    }

    // Create team member
    const member = await prisma.teamMember.create({
      data: {
        teamId: invitation.teamId,
        userId,
        role: invitation.role as any
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Delete invitation
    await prisma.teamInvitation.delete({
      where: { id: invitation.id }
    });

    return member;
  }

  /**
   * Create workspace
   */
  async createWorkspace(userId: string, workspaceData: {
    name: string;
    teamId?: string;
  }): Promise<Workspace> {
    // If teamId is provided, check if user is team member
    if (workspaceData.teamId) {
      const teamMember = await prisma.teamMember.findFirst({
        where: {
          teamId: workspaceData.teamId,
          userId
        }
      });

      if (!teamMember) {
        throw new Error('Not a member of the specified team');
      }
    }

    const workspace = await prisma.workspace.create({
      data: {
        ...workspaceData,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'owner'
          }
        }
      }
    });

    return workspace;
  }

  /**
   * Get workspaces for a user
   */
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ]
      }
    });

    return workspaces;
  }

  /**
   * Get workspace by ID with members
   */
  async getWorkspaceById(workspaceId: string, userId: string): Promise<(Workspace & { members: (WorkspaceMember & { user: { id: string; name: string | null; email: string; } })[] }) | null> {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId
              }
            }
          }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!workspace) {
      return null;
    }

    return workspace;
  }

  /**
   * Update workspace
   */
  async updateWorkspace(workspaceId: string, userId: string, updates: {
    name?: string;
  }): Promise<Workspace> {
    // Check if user is owner or admin
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: {
          in: ['owner', 'admin']
        }
      }
    });

    if (!member) {
      throw new Error('Insufficient permissions');
    }

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: updates
    });

    return workspace;
  }

  /**
   * Delete workspace
   */
  async deleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    // Check if user is owner
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: 'owner'
      }
    });

    if (!member) {
      throw new Error('Only workspace owner can delete workspace');
    }

    await prisma.workspace.delete({
      where: { id: workspaceId }
    });
  }

  /**
   * Add member to workspace
   */
  async addWorkspaceMember(workspaceId: string, userId: string, targetUserId: string, role: 'admin' | 'member' | 'viewer' = 'member'): Promise<WorkspaceMember> {
    // Check if user is owner or admin
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: {
          in: ['owner', 'admin']
        }
      }
    });

    if (!member) {
      throw new Error('Insufficient permissions');
    }

    // Check if target user is already a member
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: targetUserId
      }
    });

    if (existingMember) {
      throw new Error('User is already a workspace member');
    }

    return await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUserId,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  /**
   * Remove member from workspace
   */
  async removeWorkspaceMember(workspaceId: string, userId: string, targetUserId: string): Promise<void> {
    // Check if user is owner or admin
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: {
          in: ['owner', 'admin']
        }
      }
    });

    if (!member) {
      throw new Error('Insufficient permissions');
    }

    // Cannot remove owner
    const targetMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: targetUserId
      }
    });

    if (targetMember?.role === 'owner') {
      throw new Error('Cannot remove workspace owner');
    }

    await prisma.workspaceMember.deleteMany({
      where: {
        workspaceId,
        userId: targetUserId
      }
    });
  }

  /**
   * Get conversations in workspace
   */
  async getWorkspaceConversations(workspaceId: string, userId: string): Promise<any[]> {
    // Check if user has access to workspace
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId
      }
    });

    if (!member) {
      throw new Error('Access denied to workspace');
    }

    return await prisma.chatSession.findMany({
      where: {
        workspaceId
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 1
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  /**
   * Move conversation to workspace
   */
  async moveConversationToWorkspace(conversationId: string, workspaceId: string, userId: string): Promise<void> {
    // Check if user owns the conversation
    const conversation = await prisma.chatSession.findFirst({
      where: {
        id: conversationId,
        userId
      }
    });

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    // Check if user has access to workspace
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId
      }
    });

    if (!member) {
      throw new Error('Access denied to workspace');
    }

    await prisma.chatSession.update({
      where: { id: conversationId },
      data: { workspaceId }
    });
  }
}

export const teamWorkspaceService = TeamWorkspaceService.getInstance();


