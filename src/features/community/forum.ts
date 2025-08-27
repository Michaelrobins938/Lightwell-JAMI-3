import { PrismaClient, User, ForumPost, ForumComment } from '@prisma/client';
import { moderationService } from '../../services/moderation-service';
import { NotificationService } from '../../services/notification-service';

const prisma = new PrismaClient();
const notificationService = new NotificationService();

export class ForumSystem {
  async createPost(userId: string, title: string, content: string, tags: string[]): Promise<ForumPost> {
    const moderationResult = await moderationService.moderateContent(content);
    if (!moderationResult.approved) {
      throw new Error('Post content violates community guidelines');
    }

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        tags: tags.join(','),
        author: { connect: { id: userId } },
      },
    });

    await this.notifyMentionedUsers(content, post.id);
    return post;
  }

  async getPost(postId: string): Promise<(ForumPost & { author: User; comments: (ForumComment & { author: User })[] }) & { parsedTags: string[] }> {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return {
      ...post,
      parsedTags: post.tags.split(','),
    };
  }

  async addComment(postId: string, userId: string, content: string): Promise<ForumComment> {
    const moderationResult = await moderationService.moderateContent(content);
    if (!moderationResult.approved) {
      throw new Error('Comment content violates community guidelines');
    }

    const comment = await prisma.forumComment.create({
      data: {
        content,
        author: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (post && post.author.id !== userId) {
      await notificationService.sendNotification({
        userId: post.author.id,
        title: 'New Comment',
        message: `Someone commented on your post: "${post.title}"`,
        type: 'info',
        priority: 'medium',
        email: true,
        inApp: true
      });
    }

    await this.notifyMentionedUsers(content, postId, comment.id);
    return comment;
  }

  async searchPosts(query: string, tags: string[], page: number = 1, pageSize: number = 20): Promise<{ posts: (ForumPost & { parsedTags: string[] })[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const [posts, totalCount] = await prisma.$transaction([
      prisma.forumPost.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
          tags: { contains: tags.join(',') },
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.forumPost.count({
        where: {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
          tags: { contains: tags.join(',') },
        },
      }),
    ]);

    return {
      posts: posts.map(post => ({
        ...post,
        parsedTags: post.tags.split(','),
      })),
      totalCount,
    };
  }

  private async notifyMentionedUsers(content: string, postId: string, commentId?: string): Promise<void> {
    const mentionedUsernames = content.match(/@(\w+)/g)?.map(match => match.slice(1)) || [];
    const mentionedUsers = await prisma.user.findMany({
      where: { name: { in: mentionedUsernames } },
    });

    for (const user of mentionedUsers) {
      await notificationService.sendNotification({
        userId: user.id,
        title: 'Mention',
        message: `You were mentioned in a ${commentId ? 'comment' : 'post'}`,
        type: 'info',
        priority: 'low',
        email: true,
        inApp: true,
        data: { postId, commentId }
      });
    }
  }
}

export const forumSystem = new ForumSystem();