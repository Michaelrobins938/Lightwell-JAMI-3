import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mindfulnessTechniques = {
      breathing: {
        name: 'Breathing Techniques',
        description: 'Mindful breathing exercises for relaxation and focus',
        techniques: [
          {
            name: '4-7-8 Breathing',
            description: 'A calming breathing pattern that helps reduce anxiety and promote sleep',
            steps: [
              'Sit or lie down in a comfortable position',
              'Close your eyes and relax your body',
              'Inhale through your nose for 4 counts',
              'Hold your breath for 7 counts',
              'Exhale through your mouth for 8 counts',
              'Repeat 4-8 times'
            ],
            benefits: ['Reduces anxiety', 'Improves sleep', 'Lowers blood pressure', 'Increases focus']
          },
          {
            name: 'Box Breathing',
            description: 'A technique used by Navy SEALs to maintain calm under pressure',
            steps: [
              'Sit with your back straight',
              'Inhale for 4 counts',
              'Hold for 4 counts',
              'Exhale for 4 counts',
              'Hold for 4 counts',
              'Repeat for 5-10 minutes'
            ],
            benefits: ['Reduces stress', 'Improves concentration', 'Regulates nervous system', 'Enhances performance']
          },
          {
            name: 'Diaphragmatic Breathing',
            description: 'Deep breathing that engages the diaphragm for maximum oxygen intake',
            steps: [
              'Place one hand on your chest, the other on your belly',
              'Breathe in deeply through your nose',
              'Feel your belly expand while your chest stays relatively still',
              'Exhale slowly through your mouth',
              'Focus on the rise and fall of your belly'
            ],
            benefits: ['Reduces stress hormones', 'Improves lung function', 'Lowers heart rate', 'Enhances relaxation']
          }
        ]
      },
      meditation: {
        name: 'Meditation Techniques',
        description: 'Various meditation practices for mental clarity and peace',
        techniques: [
          {
            name: 'Mindfulness Meditation',
            description: 'Focusing on the present moment without judgment',
            steps: [
              'Find a quiet, comfortable place to sit',
              'Close your eyes or focus on a point',
              'Focus on your breath or a chosen object',
              'When thoughts arise, acknowledge them without judgment',
              'Gently return your focus to your breath',
              'Start with 5-10 minutes daily'
            ],
            benefits: ['Reduces stress', 'Improves focus', 'Enhances self-awareness', 'Promotes emotional balance']
          },
          {
            name: 'Loving-Kindness Meditation',
            description: 'Cultivating compassion for yourself and others',
            steps: [
              'Sit comfortably and close your eyes',
              'Begin by directing loving-kindness toward yourself',
              'Repeat phrases like "May I be happy, may I be healthy"',
              'Gradually extend these wishes to others',
              'Include difficult people in your practice',
              'Practice for 10-20 minutes'
            ],
            benefits: ['Increases compassion', 'Reduces negative emotions', 'Improves relationships', 'Enhances well-being']
          },
          {
            name: 'Body Scan Meditation',
            description: 'Systematically focusing attention on different parts of your body',
            steps: [
              'Lie down in a comfortable position',
              'Close your eyes and take a few deep breaths',
              'Start with your toes and work up to your head',
              'Notice sensations in each body part',
              'Don\'t try to change anything, just observe',
              'Practice for 10-20 minutes'
            ],
            benefits: ['Reduces tension', 'Improves body awareness', 'Promotes relaxation', 'Enhances sleep']
          }
        ]
      },
      grounding: {
        name: 'Grounding Techniques',
        description: 'Exercises to help you stay present and connected to the moment',
        techniques: [
          {
            name: '5-4-3-2-1 Sensory Grounding',
            description: 'Using your five senses to anchor yourself in the present',
            steps: [
              'Look around and name 5 things you can see',
              'Touch 4 things and notice their texture',
              'Listen for 3 sounds you can hear',
              'Identify 2 things you can smell',
              'Notice 1 thing you can taste'
            ],
            benefits: ['Reduces anxiety', 'Helps with dissociation', 'Improves focus', 'Calms nervous system']
          },
          {
            name: 'Progressive Muscle Relaxation',
            description: 'Systematically tensing and relaxing muscle groups',
            steps: [
              'Start with your toes and work up to your head',
              'Tense each muscle group for 5 seconds',
              'Release and feel the relaxation for 10 seconds',
              'Move to the next muscle group',
              'Focus on the contrast between tension and relaxation'
            ],
            benefits: ['Reduces muscle tension', 'Lowers stress hormones', 'Improves sleep', 'Relieves pain']
          },
          {
            name: 'Nature Connection',
            description: 'Using nature to ground and center yourself',
            steps: [
              'Go outside or look out a window',
              'Notice the natural elements around you',
              'Feel the air on your skin',
              'Listen to natural sounds',
              'Take in the colors and textures',
              'Spend at least 10 minutes in nature'
            ],
            benefits: ['Reduces stress', 'Improves mood', 'Enhances creativity', 'Boosts immune system']
          }
        ]
      },
      daily: {
        name: 'Daily Mindfulness Practices',
        description: 'Simple mindfulness exercises you can incorporate into daily life',
        techniques: [
          {
            name: 'Mindful Eating',
            description: 'Paying full attention to the experience of eating',
            steps: [
              'Before eating, take a moment to appreciate your food',
              'Notice the colors, smells, and textures',
              'Take small bites and chew slowly',
              'Pay attention to the taste and sensations',
              'Put your fork down between bites',
              'Eat without distractions'
            ],
            benefits: ['Improves digestion', 'Helps with portion control', 'Enhances enjoyment', 'Reduces stress']
          },
          {
            name: 'Mindful Walking',
            description: 'Walking with awareness of each step and your surroundings',
            steps: [
              'Walk at a slower pace than usual',
              'Feel your feet making contact with the ground',
              'Notice the movement of your body',
              'Observe your surroundings without judgment',
              'Focus on your breath as you walk',
              'Practice for 10-20 minutes'
            ],
            benefits: ['Reduces stress', 'Improves mood', 'Enhances awareness', 'Provides exercise']
          },
          {
            name: 'Mindful Listening',
            description: 'Giving your full attention to what others are saying',
            steps: [
              'Put away distractions when someone is speaking',
              'Make eye contact and face the speaker',
              'Listen without planning your response',
              'Notice the speaker\'s tone and body language',
              'Ask clarifying questions when appropriate',
              'Reflect back what you heard'
            ],
            benefits: ['Improves relationships', 'Reduces misunderstandings', 'Enhances communication', 'Builds trust']
          }
        ]
      }
    };

    return res.status(200).json({ data: mindfulnessTechniques });
  } catch (error) {
    console.error('Mindfulness techniques API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 