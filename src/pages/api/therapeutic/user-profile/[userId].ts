import { NextApiRequest, NextApiResponse } from 'next';
import { UserProfile } from '../../../../types/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (req.method === 'GET') {
    try {
      // In a real implementation, this would fetch from a database
      // For now, we'll return a default profile
      const userProfile: UserProfile = {
        id: userId,
        name: 'User',
        email: 'user@example.com',
        preferences: {
          communicationStyle: 'empathetic',
          sessionLength: 30,
          homeworkPreference: true,
          crisisSupport: true,
        },
        therapeuticGoals: ['Emotional regulation', 'Understanding triggers'],
        triggers: [],
        copingStrategies: [],
        progressAreas: [],
        challenges: []
      };

      return res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedProfile: UserProfile = req.body;

      // Validate the profile data
      if (!updatedProfile.id || updatedProfile.id !== userId) {
        return res.status(400).json({ error: 'User ID mismatch' });
      }

      // In a real implementation, this would save to a database
      console.log('Updating user profile:', updatedProfile);

      return res.status(200).json({
        message: 'User profile updated successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ 
        error: 'Failed to update user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 