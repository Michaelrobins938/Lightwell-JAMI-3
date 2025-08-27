// Team/Workspace Sharing System for Luna AI
// Enables collaborative conversations and resource sharing

import { prisma } from '../lib/database';
import { randomBytes } from 'crypto';

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// WorkspaceSettings interface removed as it doesn't match the Prisma schema

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: string;
  joinedAt: Date;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: string;
  invitedBy: string;
  expiresAt: Date;
  status: string;
  createdAt: Date;
}

export interface SharedConversation {
  id: string;
  title: string | null;
  description: string | null;
  conversationId: string;
  isPublic: boolean;
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
  shareToken: string;
  shareId: string;
  viewCount: number;
}

export class WorkspaceService {
  // Create a new workspace
  static async createWorkspace(data: {
    name: string;
    description?: string;
    ownerId: string;
    isPublic?: boolean;
  }): Promise<Workspace> {
    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        isPublic: data.isPublic || false,
      },
    });

    // Add owner as workspace member
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: data.ownerId,
        role: 'owner',
      },
    });

    return workspace;
  }

  // Get workspace by ID
  static async getWorkspace(workspaceId: string, userId: string): Promise<Workspace | null> {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) return null;

    // Check if user has access
    if (!workspace.isPublic) {
      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId,
        },
      });
      
      if (!member) {
        return null;
      }
    }

    return workspace;
  }

  // Get user's workspaces
  static async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
    });

    return memberships.map(membership => membership.workspace);
  }

  // Invite user to workspace
  static async inviteToWorkspace(data: {
    workspaceId: string;
    email: string;
    role: string;
    invitedBy: string;
  }): Promise<WorkspaceInvitation> {
    // Check if inviter has permission (owner or admin can invite)
    const inviter = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: data.workspaceId,
        userId: data.invitedBy,
        role: {
          in: ['owner', 'admin']
        },
      },
    });

    if (!inviter) {
      throw new Error('Insufficient permissions to invite users');
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const existingMember = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: data.workspaceId,
          userId: existingUser.id,
        },
      });

      if (existingMember) {
        throw new Error('User is already a member of this workspace');
      }
    }

    // Create invitation
    const invitation = await prisma.workspaceInvitation.create({
      data: {
        workspaceId: data.workspaceId,
        email: data.email,
        role: data.role,
        invitedBy: data.invitedBy,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'pending',
      },
    });

    return invitation;
  }

  // Accept workspace invitation
  static async acceptInvitation(invitationId: string, userId: string): Promise<void> {
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.status !== 'pending') {
      throw new Error('Invalid or expired invitation');
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.workspaceInvitation.update({
        where: { id: invitationId },
        data: { status: 'expired' },
      });
      throw new Error('Invitation has expired');
    }

    // Add user to workspace
    await prisma.workspaceMember.create({
      data: {
        workspaceId: invitation.workspaceId,
        userId,
        role: invitation.role,
      },
    });

    // Update invitation status
    await prisma.workspaceInvitation.update({
      where: { id: invitationId },
      data: { status: 'accepted' },
    });
  }

  // Share conversation to workspace
  static async shareConversation(data: {
    workspaceId: string;
    originalChatId: string;
    title: string;
    summary?: string;
    tags?: string[];
    sharedBy: string;
    isPublic?: boolean;
    allowComments?: boolean;
  }): Promise<SharedConversation> {
    // Check if user has permission to share
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: data.workspaceId,
        userId: data.sharedBy,
        role: { in: ['owner', 'admin', 'member'] },
      },
    });

    if (!member) {
      throw new Error('Insufficient permissions to share conversations');
    }

    const sharedConversation = await prisma.sharedConversation.create({
      data: {
        conversationId: data.originalChatId,
        shareToken: randomBytes(32).toString('hex'),
        shareId: randomBytes(16).toString('hex'),
        title: data.title,
        description: data.summary,
        isPublic: data.isPublic || false,
        allowComments: data.allowComments || false,
      },
    });

    return sharedConversation;
  }

  // Get shared conversations in workspace
  static async getSharedConversations(workspaceId: string, userId: string): Promise<SharedConversation[]> {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) return [];

    // If user is not a member and workspace is not public, return empty
    if (!member && !workspace.isPublic) {
      return [];
    }

    const conversations = await prisma.sharedConversation.findMany({
      where: {
        isPublic: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return conversations;
  }

  // Update workspace settings - removed as settings field doesn't exist in current schema

  // Remove member from workspace
  static async removeMember(workspaceId: string, memberUserId: string, removedBy: string): Promise<void> {
    const remover = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: removedBy,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!remover) {
      throw new Error('Insufficient permissions to remove members');
    }

    const memberToRemove = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: memberUserId,
      },
    });

    if (!memberToRemove) {
      throw new Error('Member not found');
    }

    if (memberToRemove.role === 'owner') {
      throw new Error('Cannot remove workspace owner');
    }

    await prisma.workspaceMember.delete({
      where: { id: memberToRemove.id },
    });
  }

  // Get workspace members
  static async getWorkspaceMembers(workspaceId: string, userId: string): Promise<WorkspaceMember[]> {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
    });

    if (!member) {
      throw new Error('Access denied');
    }

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: true },
    });

    return members;
  }

  // Helper: Get permissions for role - removed as permissions field doesn't exist in current schema
}
