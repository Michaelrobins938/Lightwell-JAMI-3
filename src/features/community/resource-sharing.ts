import { PrismaClient, SharedResource, User } from '@prisma/client';
import { moderationService } from '../../services/moderation-service';
import { NotificationService } from '../../services/notification-service';

const prisma = new PrismaClient();
const notificationService = new NotificationService();

export class ResourceSharingSystem {
  async shareResource(userId: string, title: string, description: string, url: string, tags: string[]): Promise<SharedResource> {
    const moderationResult = await moderationService.moderateContent(description);
    if (!moderationResult.approved) {
      throw new Error('Resource description violates community guidelines');
    }

    const resource = await prisma.sharedResource.create({
      data: {
        userId,
        title,
        description,
        url,
        tags: tags.join(','),
      },
    });

    return resource;
  }

  async getResource(resourceId: string): Promise<SharedResource & { author: User }> {
    const resource = await prisma.sharedResource.findUnique({
      where: { id: resourceId },
      include: { author: true },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    return resource;
  }

  async rateResource(resourceId: string, userId: string, rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('Invalid rating value');
    }

    await prisma.resourceRating.upsert({
      where: {
        resourceId_userId: {
          resourceId,
          userId,
        },
      },
      update: { rating },
      create: {
        resourceId,
        userId,
        rating,
      },
    });

    const resource = await prisma.sharedResource.findUnique({
      where: { id: resourceId },
      include: { author: true, ratings: true },
    });

    if (resource) {
      const averageRating = resource.ratings.reduce((sum, r) => sum + r.rating, 0) / resource.ratings.length;
      await prisma.sharedResource.update({
        where: { id: resourceId },
        data: { averageRating },
      });

      if (resource.author.id !== userId) {
        await notificationService.sendNotification({
          userId: resource.author.id,
          title: 'Resource Rated',
          message: `Your shared resource "${resource.title}" has received a new rating`,
          type: 'success',
          priority: 'low',
          email: true,
          inApp: true
        });
      }
    }
  }

  async searchResources(query: string, tags: string[], page: number = 1, pageSize: number = 20): Promise<{ resources: SharedResource[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const [resources, totalCount] = await prisma.$transaction([
      prisma.sharedResource.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
          tags: { contains: tags.join(',') },
        },
        include: { author: true },
        orderBy: [
          { averageRating: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: pageSize,
      }),
      prisma.sharedResource.count({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
          tags: { contains: tags.join(',') },
        },
      }),
    ]);

    return { resources, totalCount };
  }

  async getRecommendedResources(userId: string, limit: number = 10): Promise<SharedResource[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { sharedResources: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userTags: string[] = user.sharedResources.flatMap(resource => resource.tags.split(','));
    const uniqueTags = Array.from(new Set(userTags));

    const recommendedResources = await prisma.sharedResource.findMany({
      where: {
        tags: { contains: uniqueTags.join(',') },
        NOT: { userId: user.id },
      },
      orderBy: [
        { averageRating: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      include: { author: true },
    });

    return recommendedResources;
  }
}

export const resourceSharingSystem = new ResourceSharingSystem();