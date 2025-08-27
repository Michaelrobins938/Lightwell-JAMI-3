import { PrismaClient, SupportGroup, SupportGroupMeeting, User } from '@prisma/client';
import { NotificationService } from '../../services/notification-service';
import { videoConferenceService } from '../../services/video-conference-service';

const prisma = new PrismaClient();
const notificationService = new NotificationService();

export class SupportGroupSystem {
  async createGroup(name: string, description: string, tags: string[], creatorId: string): Promise<SupportGroup> {
    const group = await prisma.supportGroup.create({
      data: {
        name,
        description,
        tags: tags.join(','), // Join tags into a comma-separated string
        creator: { connect: { id: creatorId } },
        members: { connect: { id: creatorId } },
      },
    });

    return group;
  }

  async joinGroup(groupId: string, userId: string): Promise<void> {
    await prisma.supportGroup.update({
      where: { id: groupId },
      data: { members: { connect: { id: userId } } },
    });

    const group = await prisma.supportGroup.findUnique({ where: { id: groupId }, include: { creator: true } });
    if (group) {
      await notificationService.sendNotification({
        userId: group.creator.id,
        title: 'New Group Member',
        message: `A new member has joined your support group: "${group.name}"`,
        type: 'success',
        priority: 'low',
        email: true,
        inApp: true
      });
    }
  }

  async scheduleMeeting(groupId: string, schedulerId: string, title: string, description: string, startTime: Date, duration: number): Promise<SupportGroupMeeting> {
    const group = await prisma.supportGroup.findUnique({ where: { id: groupId }, include: { members: true } });
    if (!group) {
      throw new Error('Support group not found');
    }

    const videoConferenceDetails = await videoConferenceService.createMeeting(title, startTime, duration);

    const meeting = await prisma.supportGroupMeeting.create({
      data: {
        group: { connect: { id: groupId } },
        scheduler: { connect: { id: schedulerId } },
        title,
        description,
        startTime,
        duration,
        videoConferenceLink: videoConferenceDetails.joinLink,
      },
    });

    for (const member of group.members) {
      if (member.id !== schedulerId) {
        await notificationService.sendNotification({
          userId: member.id,
          title: 'New Support Group Meeting',
          message: `A new meeting has been scheduled for "${group.name}": ${title}`,
          type: 'info',
          priority: 'medium',
          email: true,
          inApp: true,
          data: { meetingId: meeting.id }
        });
      }
    }

    return meeting;
  }

  async getMeetingsForUser(userId: string, startDate: Date, endDate: Date): Promise<(SupportGroupMeeting & { group: SupportGroup })[]> {
    const meetings = await prisma.supportGroupMeeting.findMany({
      where: {
        group: { members: { some: { id: userId } } },
        startTime: { gte: startDate, lte: endDate },
      },
      include: { group: true },
      orderBy: { startTime: 'asc' },
    });

    return meetings;
  }

  async searchGroups(query: string, tags: string[], page: number = 1, pageSize: number = 20): Promise<{ groups: SupportGroup[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const [groups, totalCount] = await prisma.$transaction([
      prisma.supportGroup.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
          tags: { contains: tags.join(',') },
        },
        include: { creator: true, _count: { select: { members: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.supportGroup.count({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
          tags: { contains: tags.join(',') },
        },
      }),
    ]);

    return { groups, totalCount };
  }
}

export const supportGroupSystem = new SupportGroupSystem();