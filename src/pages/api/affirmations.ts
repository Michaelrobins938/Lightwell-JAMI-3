import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const affirmations = {
      selfWorth: {
        category: 'Self-Worth',
        affirmations: [
          'I am worthy of love, respect, and happiness',
          'I am enough just as I am',
          'I have inherent value that cannot be diminished',
          'I deserve to take up space and be heard',
          'I am capable of achieving my goals',
          'I am strong and resilient',
          'I trust myself and my abilities',
          'I am worthy of good things in my life'
        ]
      },
      confidence: {
        category: 'Confidence',
        affirmations: [
          'I am confident in my abilities',
          'I trust my judgment and decisions',
          'I have the power to create positive change',
          'I am capable of handling challenges',
          'I believe in myself and my potential',
          'I am worthy of success and recognition',
          'I have valuable skills and talents',
          'I am becoming more confident each day'
        ]
      },
      anxiety: {
        category: 'Anxiety Relief',
        affirmations: [
          'I am safe and secure in this moment',
          'I can handle whatever comes my way',
          'I choose to focus on what I can control',
          'I am stronger than my anxiety',
          'I breathe deeply and find peace',
          'I trust that everything will work out',
          'I am calm and centered',
          'I release worry and embrace peace'
        ]
      },
      depression: {
        category: 'Depression Support',
        affirmations: [
          'This feeling is temporary and will pass',
          'I am not alone in my struggles',
          'I have the strength to get through this',
          'I deserve help and support',
          'I am making progress, even if it\'s small',
          'I have overcome difficult times before',
          'I am worthy of healing and recovery',
          'I choose to be gentle with myself today'
        ]
      },
      relationships: {
        category: 'Healthy Relationships',
        affirmations: [
          'I attract healthy, loving relationships',
          'I set and maintain healthy boundaries',
          'I communicate my needs clearly and kindly',
          'I deserve respect in all my relationships',
          'I am worthy of love and connection',
          'I choose relationships that uplift me',
          'I am a good friend and partner',
          'I am surrounded by people who care about me'
        ]
      },
      growth: {
        category: 'Personal Growth',
        affirmations: [
          'I am constantly growing and learning',
          'I embrace challenges as opportunities for growth',
          'I am becoming the best version of myself',
          'I learn from my mistakes and move forward',
          'I am open to new experiences and perspectives',
          'I trust the journey of my personal development',
          'I am patient with my progress',
          'I celebrate my achievements, big and small'
        ]
      },
      gratitude: {
        category: 'Gratitude',
        affirmations: [
          'I am grateful for all the good in my life',
          'I find joy in simple moments',
          'I appreciate the people who support me',
          'I am thankful for my health and abilities',
          'I recognize the beauty around me',
          'I am blessed with abundance',
          'I choose to focus on what I have',
          'I express gratitude daily'
        ]
      },
      strength: {
        category: 'Inner Strength',
        affirmations: [
          'I am resilient and can overcome obstacles',
          'I have survived 100% of my difficult days',
          'I am stronger than I think',
          'I have the power to change my life',
          'I am capable of amazing things',
          'I trust my inner wisdom',
          'I am brave enough to face my fears',
          'I am unstoppable when I believe in myself'
        ]
      }
    };

    return res.status(200).json({ data: affirmations });
  } catch (error) {
    console.error('Affirmations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 