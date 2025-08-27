import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const crisisResources = {
      emergency: {
        nationalSuicidePrevention: {
          name: 'National Suicide Prevention Lifeline',
          phone: '988',
          description: '24/7 free and confidential support for people in distress',
          url: 'https://988lifeline.org/'
        },
        crisisTextLine: {
          name: 'Crisis Text Line',
          phone: 'Text HOME to 741741',
          description: 'Free 24/7 crisis counseling via text message',
          url: 'https://www.crisistextline.org/'
        },
        emergencyServices: {
          name: 'Emergency Services',
          phone: '911',
          description: 'For immediate life-threatening emergencies',
          url: null
        }
      },
      professional: {
        psychologyToday: {
          name: 'Psychology Today Therapist Directory',
          description: 'Find licensed therapists in your area',
          url: 'https://www.psychologytoday.com/us/therapists'
        },
        betterHelp: {
          name: 'BetterHelp Online Therapy',
          description: 'Online therapy with licensed professionals',
          url: 'https://www.betterhelp.com/'
        },
        talkspace: {
          name: 'Talkspace',
          description: 'Online therapy and psychiatry services',
          url: 'https://www.talkspace.com/'
        }
      },
      support: {
        nami: {
          name: 'NAMI HelpLine',
          phone: '1-800-950-NAMI (6264)',
          description: 'National Alliance on Mental Illness support',
          url: 'https://www.nami.org/help'
        },
        samhsa: {
          name: 'SAMHSA National Helpline',
          phone: '1-800-662-HELP (4357)',
          description: 'Treatment referral and information service',
          url: 'https://www.samhsa.gov/find-help/national-helpline'
        }
      }
    };

    return res.status(200).json({ data: crisisResources });
  } catch (error) {
    console.error('Crisis resources API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 