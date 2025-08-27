import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { prisma } from '../../../lib/database';

interface AnalyticsEvent {
  event: string;
  category: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId = null;

    // Analytics can work without authentication for anonymous tracking
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        userId = decoded.userId;
      } catch (error) {
        // Continue without user ID for anonymous analytics
      }
    }

    const { event, category, properties = {}, timestamp }: AnalyticsEvent = req.body;

    if (!event || !category) {
      return res.status(400).json({ error: 'Event and category are required' });
    }

    // Store analytics event in database
    const analyticsEntry = await prisma.analyticsEvent.create({
      data: {
        userId: userId,
        event: event,
        category: category,
        properties: JSON.stringify(properties),
        sessionId: properties.sessionId || null,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: getClientIp(req),
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      }
    });

    // Update user activity metrics if authenticated
    if (userId) {
      await updateUserMetrics(userId, event, category, properties);
    }

    return res.status(200).json({ 
      success: true, 
      eventId: analyticsEntry.id 
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUserMetrics(userId: string, event: string, category: string, properties: any) {
  try {
    // Update or create user metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMetrics = await prisma.userMetrics.findFirst({
      where: {
        userId: userId,
        date: today
      }
    });

    const updateData: any = {
      lastActivity: new Date(),
    };

    // Track specific metrics based on event type
    switch (category) {
      case 'mood':
        if (event === 'mood_entry_created') {
          updateData.moodEntries = existingMetrics ? existingMetrics.moodEntries + 1 : 1;
        }
        break;
      case 'sleep':
        if (event === 'sleep_entry_created') {
          updateData.sleepEntries = existingMetrics ? existingMetrics.sleepEntries + 1 : 1;
        }
        break;
      case 'assessment':
        if (event === 'assessment_completed') {
          updateData.assessmentsCompleted = existingMetrics ? existingMetrics.assessmentsCompleted + 1 : 1;
        }
        break;
      case 'therapy':
        if (event === 'session_started') {
          updateData.therapySessions = existingMetrics ? existingMetrics.therapySessions + 1 : 1;
        }
        if (event === 'session_completed' && properties.duration) {
          updateData.therapyMinutes = existingMetrics 
            ? existingMetrics.therapyMinutes + properties.duration 
            : properties.duration;
        }
        break;
      case 'engagement':
        updateData.pageViews = existingMetrics ? existingMetrics.pageViews + 1 : 1;
        if (properties.timeSpent) {
          updateData.timeSpent = existingMetrics 
            ? existingMetrics.timeSpent + properties.timeSpent 
            : properties.timeSpent;
        }
        break;
    }

    if (existingMetrics) {
      await prisma.userMetrics.update({
        where: { id: existingMetrics.id },
        data: updateData
      });
    } else {
      await prisma.userMetrics.create({
        data: {
          userId: userId,
          date: today,
          ...updateData,
          moodEntries: updateData.moodEntries || 0,
          sleepEntries: updateData.sleepEntries || 0,
          assessmentsCompleted: updateData.assessmentsCompleted || 0,
          therapySessions: updateData.therapySessions || 0,
          therapyMinutes: updateData.therapyMinutes || 0,
          pageViews: updateData.pageViews || 0,
          timeSpent: updateData.timeSpent || 0,
        }
      });
    }

    // Update user streak
    await updateUserStreak(userId);

  } catch (error) {
    console.error('Error updating user metrics:', error);
  }
}

async function updateUserStreak(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true }
    });

    if (!user) return;

    // Check if user was active yesterday and today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [todayMetrics, yesterdayMetrics] = await Promise.all([
      prisma.userMetrics.findFirst({
        where: { userId: userId, date: today }
      }),
      prisma.userMetrics.findFirst({
        where: { userId: userId, date: yesterday }
      })
    ]);

    let newStreak = user.currentStreak || 0;

    if (todayMetrics && hasActivity(todayMetrics)) {
      if (yesterdayMetrics && hasActivity(yesterdayMetrics)) {
        // Continue streak
        newStreak = newStreak + 1;
      } else if (newStreak === 0) {
        // Start new streak
        newStreak = 1;
      }
    }

    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak
      }
    });

  } catch (error) {
    console.error('Error updating user streak:', error);
  }
}

function hasActivity(metrics: any) {
  return (metrics.moodEntries > 0) || 
         (metrics.sleepEntries > 0) || 
         (metrics.assessmentsCompleted > 0) || 
         (metrics.therapySessions > 0);
}

function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.toString().split(',')[0] : req.connection?.remoteAddress;
  return ip || 'unknown';
}