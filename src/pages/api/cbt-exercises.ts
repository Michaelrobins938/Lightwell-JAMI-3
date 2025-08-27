import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cbtExercises = {
      cognitiveRestructuring: {
        name: 'Cognitive Restructuring',
        description: 'Identify and challenge negative thought patterns',
        exercises: [
          {
            title: 'Thought Record',
            description: 'Write down your thoughts, emotions, and evidence for/against them',
            steps: [
              'Identify the situation that triggered your thoughts',
              'Write down your automatic thoughts',
              'Rate your emotional intensity (0-100)',
              'List evidence that supports your thoughts',
              'List evidence that contradicts your thoughts',
              'Write a more balanced thought',
              'Re-rate your emotional intensity'
            ]
          },
          {
            title: 'Socratic Questioning',
            description: 'Ask yourself questions to examine your thoughts more objectively',
            questions: [
              'What evidence supports this thought?',
              'What evidence contradicts this thought?',
              'What would I tell a friend in this situation?',
              'What are the worst, best, and most realistic outcomes?',
              'How will this matter in 5 years?'
            ]
          }
        ]
      },
      behavioralActivation: {
        name: 'Behavioral Activation',
        description: 'Increase positive activities and reduce avoidance',
        exercises: [
          {
            title: 'Activity Scheduling',
            description: 'Plan and schedule enjoyable activities',
            steps: [
              'List activities you used to enjoy',
              'Rate each activity on a scale of 1-10',
              'Schedule at least one activity per day',
              'Track your mood before and after activities',
              'Gradually increase the difficulty of activities'
            ]
          },
          {
            title: 'Graded Task Assignment',
            description: 'Break down overwhelming tasks into smaller steps',
            steps: [
              'Identify a task you\'ve been avoiding',
              'Break it down into 5-10 smaller steps',
              'Start with the easiest step',
              'Complete one step at a time',
              'Reward yourself for each completed step'
            ]
          }
        ]
      },
      mindfulness: {
        name: 'Mindfulness Exercises',
        description: 'Practice present-moment awareness',
        exercises: [
          {
            title: 'Mindful Breathing',
            description: 'Focus on your breath to anchor yourself in the present',
            steps: [
              'Find a comfortable position',
              'Close your eyes or focus on a point',
              'Breathe naturally and notice the sensation',
              'When your mind wanders, gently return to your breath',
              'Practice for 5-10 minutes daily'
            ]
          },
          {
            title: 'Body Scan',
            description: 'Systematically focus attention on different parts of your body',
            steps: [
              'Lie down in a comfortable position',
              'Start with your toes and work up to your head',
              'Notice sensations in each body part',
              'Don\'t try to change anything, just observe',
              'Practice for 10-15 minutes'
            ]
          }
        ]
      }
    };

    return res.status(200).json({ data: cbtExercises });
  } catch (error) {
    console.error('CBT exercises API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 