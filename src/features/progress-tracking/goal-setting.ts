import { prisma } from '../../lib/prisma';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  milestones?: any[];
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  targetDate?: Date;
  milestones?: any[];
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  targetDate?: Date;
  progress?: number;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  milestones?: any[];
}

export const goalSettingSystem = {
  async createGoal(userId: string, title: string, description?: string, targetDate?: Date, milestones?: any[]): Promise<Goal> {
    try {
      const goal = await prisma.userProgress.create({
        data: {
          userId,
          title,
          description: description || '',
          targetDate: targetDate || null,
          progress: 0,
          status: 'active',
          milestones: milestones ? JSON.stringify(milestones) : null,
        },
      });

      return {
        id: goal.id,
        userId: goal.userId,
        title: goal.title,
        description: goal.description ?? undefined,
        targetDate: goal.targetDate ?? undefined,
        progress: goal.progress || 0,
        status: goal.status as any,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
      };
    } catch (error) {
      console.error('Error creating goal:', error);
      throw new Error('Failed to create goal');
    }
  },

  async updateGoal(goalId: string, updates: UpdateGoalRequest): Promise<Goal> {
    try {
      const goal = await prisma.userProgress.update({
        where: { id: goalId },
        data: {
          title: updates.title,
          description: updates.description,
          targetDate: updates.targetDate,
          progress: updates.progress,
          status: updates.status,
          milestones: updates.milestones ? JSON.stringify(updates.milestones) : undefined,
          updatedAt: new Date(),
        },
      });

      return {
        id: goal.id,
        userId: goal.userId,
        title: goal.title,
        description: goal.description ?? undefined,
        targetDate: goal.targetDate ?? undefined,
        progress: goal.progress || 0,
        status: goal.status as any,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
      };
    } catch (error) {
      console.error('Error updating goal:', error);
      throw new Error('Failed to update goal');
    }
  },

  async updateGoalProgress(goalId: string, progress: number): Promise<Goal> {
    try {
      const goal = await prisma.userProgress.update({
        where: { id: goalId },
        data: {
          progress,
          updatedAt: new Date(),
        },
      });

      return {
        id: goal.id,
        userId: goal.userId,
        title: goal.title,
        description: goal.description ?? undefined,
        targetDate: goal.targetDate ?? undefined,
        progress: goal.progress || 0,
        status: goal.status as any,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
      };
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw new Error('Failed to update goal progress');
    }
  },

  async getGoals(userId: string): Promise<Goal[]> {
    try {
      const goals = await prisma.userProgress.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return goals.map((goal: any) => ({
        id: goal.id,
        userId: goal.userId,
        title: goal.title,
        description: goal.description ?? undefined,
        targetDate: goal.targetDate ?? undefined,
        progress: goal.progress || 0,
        status: goal.status as any,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
      }));
    } catch (error) {
      console.error('Error getting goals:', error);
      throw new Error('Failed to retrieve goals');
    }
  },

  async getGoalWithProgress(goalId: string): Promise<Goal> {
    try {
      const goal = await prisma.userProgress.findUnique({
        where: { id: goalId },
      });

      if (!goal) {
        throw new Error('Goal not found');
      }

      return {
        id: goal.id,
        userId: goal.userId,
        title: goal.title,
        description: goal.description ?? undefined,
        targetDate: goal.targetDate ?? undefined,
        progress: goal.progress || 0,
        status: goal.status as any,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
        milestones: goal.milestones ? JSON.parse(goal.milestones) : [],
      };
    } catch (error) {
      console.error('Error getting goal:', error);
      throw new Error('Failed to retrieve goal');
    }
  },

  async deleteGoal(goalId: string): Promise<boolean> {
    try {
      await prisma.userProgress.delete({
        where: { id: goalId },
      });
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw new Error('Failed to delete goal');
    }
  },
}; 