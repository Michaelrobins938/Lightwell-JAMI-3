import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      // Create sample users
      const users = await Promise.all([
        prisma.user.upsert({
          where: { email: 'expert@luna.com' },
          update: {},
          create: {
            name: 'Dr. Sarah Johnson',
            email: 'expert@luna.com',
            password: 'hashedpassword',
            image: '/api/placeholder/40/40',
            isExpert: true,
            credentials: 'Licensed Clinical Psychologist',
            specialization: 'Anxiety & Depression',
            postCount: 15,
            helpfulCount: 127,
          },
        }),
        prisma.user.upsert({
          where: { email: 'moderator@luna.com' },
          update: {},
          create: {
            name: 'Alex Chen',
            email: 'moderator@luna.com',
            password: 'hashedpassword',
            image: '/api/placeholder/40/40',
            isModerator: true,
            postCount: 8,
            helpfulCount: 45,
          },
        }),
        prisma.user.upsert({
          where: { email: 'member@luna.com' },
          update: {},
          create: {
            name: 'Jordan Smith',
            email: 'member@luna.com',
            password: 'hashedpassword',
            image: '/api/placeholder/40/40',
            postCount: 3,
            helpfulCount: 12,
          },
        }),
      ]);

      // Create sample posts
      const posts = await Promise.all([
        prisma.post.create({
          data: {
            content: "I've been struggling with anxiety for the past few months and I'm not sure where to start. Has anyone found any techniques that really help?",
            authorId: users[2].id,
            category: 'general',
            tags: JSON.stringify(['anxiety', 'support', 'techniques']),
            isAnonymous: false,
          },
        }),
        prisma.post.create({
          data: {
            content: "Today I'm feeling really grateful for this community. It's amazing to know I'm not alone in this journey.",
            authorId: users[2].id,
            category: 'recovery',
            tags: JSON.stringify(['gratitude', 'community', 'recovery']),
            isAnonymous: false,
          },
        }),
        prisma.post.create({
          data: {
            content: "I'm having a really hard time right now and I don't know what to do. Everything feels overwhelming.",
            authorId: users[2].id,
            category: 'crisis',
            tags: JSON.stringify(['crisis', 'overwhelmed', 'support']),
            isAnonymous: true,
          },
        }),
        prisma.post.create({
          data: {
            content: "As a licensed therapist, I want to share some evidence-based techniques for managing anxiety. First, try deep breathing exercises...",
            authorId: users[0].id,
            category: 'expert',
            tags: JSON.stringify(['expert', 'anxiety', 'techniques', 'therapy']),
            isAnonymous: false,
            isExpertAnswer: true,
          },
        }),
      ]);

      // Create sample support groups
      const groups = await Promise.all([
        prisma.supportGroup.create({
          data: {
            name: 'Anxiety Support Circle',
            description: 'A safe space for people dealing with anxiety to share experiences and support each other.',
            category: 'anxiety',
            tags: JSON.stringify(['anxiety', 'support', 'coping']),
            isPrivate: false,
            maxMembers: 50,
            creatorId: users[1].id,
          },
        }),
        prisma.supportGroup.create({
          data: {
            name: 'Recovery Warriors',
            description: 'For those on their recovery journey from various mental health challenges.',
            category: 'general',
            tags: JSON.stringify(['recovery', 'mental-health', 'support']),
            isPrivate: false,
            maxMembers: 100,
            creatorId: users[0].id,
          },
        }),
      ]);

      // Create sample resources
      const resources = await Promise.all([
        prisma.sharedResource.create({
          data: {
            title: 'Understanding Anxiety: A Complete Guide',
            description: 'A comprehensive guide to understanding anxiety, its symptoms, and treatment options.',
            url: 'https://example.com/anxiety-guide',
            type: 'article',
            tags: JSON.stringify(['anxiety', 'guide', 'education']),
            isFeatured: true,
            downloadCount: 156,
            averageRating: 4.8,
            userId: users[0].id,
          },
        }),
        prisma.sharedResource.create({
          data: {
            title: 'Mindfulness Meditation for Beginners',
            description: 'Learn the basics of mindfulness meditation to help manage stress and anxiety.',
            url: 'https://example.com/mindfulness',
            type: 'video',
            tags: JSON.stringify(['meditation', 'mindfulness', 'stress']),
            downloadCount: 89,
            averageRating: 4.6,
            userId: users[0].id,
          },
        }),
        prisma.sharedResource.create({
          data: {
            title: 'Crisis Coping Strategies',
            description: 'Immediate strategies to use when you are in crisis or feeling overwhelmed.',
            url: 'https://example.com/crisis-strategies',
            type: 'tool',
            tags: JSON.stringify(['crisis', 'coping', 'emergency']),
            downloadCount: 234,
            averageRating: 4.9,
            userId: users[0].id,
          },
        }),
      ]);

      // Add some ratings to resources
      await Promise.all([
        prisma.resourceRating.create({
          data: {
            resourceId: resources[0].id,
            userId: users[1].id,
            rating: 5,
          },
        }),
        prisma.resourceRating.create({
          data: {
            resourceId: resources[0].id,
            userId: users[2].id,
            rating: 4,
          },
        }),
        prisma.resourceRating.create({
          data: {
            resourceId: resources[1].id,
            userId: users[1].id,
            rating: 5,
          },
        }),
      ]);

      res.status(200).json({ 
        message: 'Sample data created successfully',
        users: users.length,
        posts: posts.length,
        groups: groups.length,
        resources: resources.length,
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
} 