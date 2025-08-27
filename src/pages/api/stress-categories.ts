import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stressCategories = {
      work: {
        name: 'Work Stress',
        description: 'Stress related to job, career, or workplace',
        factors: [
          'High workload',
          'Job insecurity',
          'Poor work-life balance',
          'Conflict with colleagues',
          'Lack of control',
          'Unclear expectations',
          'Career stagnation',
          'Workplace bullying'
        ],
        symptoms: [
          'Difficulty concentrating',
          'Irritability',
          'Sleep problems',
          'Physical tension',
          'Decreased productivity',
          'Avoidance behaviors'
        ]
      },
      relationships: {
        name: 'Relationship Stress',
        description: 'Stress from personal relationships and social interactions',
        factors: [
          'Conflict with partner',
          'Family issues',
          'Social isolation',
          'Dating stress',
          'Friendship problems',
          'Communication difficulties',
          'Trust issues',
          'Boundary problems'
        ],
        symptoms: [
          'Mood swings',
          'Withdrawal',
          'Trust issues',
          'Communication problems',
          'Emotional exhaustion',
          'Avoidance of social situations'
        ]
      },
      health: {
        name: 'Health Stress',
        description: 'Stress related to physical and mental health',
        factors: [
          'Chronic illness',
          'Mental health conditions',
          'Pain or discomfort',
          'Medical procedures',
          'Health insurance issues',
          'Lifestyle changes',
          'Aging concerns',
          'Caregiving responsibilities'
        ],
        symptoms: [
          'Physical symptoms',
          'Anxiety about health',
          'Depression',
          'Fatigue',
          'Changes in appetite',
          'Sleep disturbances'
        ]
      },
      financial: {
        name: 'Financial Stress',
        description: 'Stress related to money and financial security',
        factors: [
          'Debt',
          'Job loss',
          'Unexpected expenses',
          'Retirement planning',
          'Housing costs',
          'Medical bills',
          'Student loans',
          'Economic uncertainty'
        ],
        symptoms: [
          'Anxiety about money',
          'Sleep problems',
          'Irritability',
          'Avoidance of financial tasks',
          'Physical symptoms',
          'Relationship strain'
        ]
      },
      lifeChanges: {
        name: 'Life Changes',
        description: 'Stress from major life transitions',
        factors: [
          'Moving',
          'Job change',
          'Marriage or divorce',
          'Birth of child',
          'Death of loved one',
          'Retirement',
          'Empty nest',
          'Graduation'
        ],
        symptoms: [
          'Adjustment difficulties',
          'Mood changes',
          'Sleep problems',
          'Anxiety',
          'Depression',
          'Physical symptoms'
        ]
      }
    };

    return res.status(200).json({ data: stressCategories });
  } catch (error) {
    console.error('Stress categories API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 