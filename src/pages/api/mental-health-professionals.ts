import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const professionals = {
      directories: {
        psychologyToday: {
          name: 'Psychology Today',
          description: 'Find licensed therapists, psychiatrists, and treatment centers',
          url: 'https://www.psychologytoday.com/us/therapists',
          features: ['Search by location', 'Filter by specialty', 'Read therapist profiles', 'Check insurance coverage']
        },
        goodTherapy: {
          name: 'GoodTherapy',
          description: 'Directory of therapists, psychiatrists, and treatment centers',
          url: 'https://www.goodtherapy.org/find-therapist.html',
          features: ['Advanced search filters', 'Therapist articles', 'Treatment approach information']
        },
        zocdoc: {
          name: 'Zocdoc',
          description: 'Find and book appointments with mental health professionals',
          url: 'https://www.zocdoc.com/psychiatrists',
          features: ['Online booking', 'Insurance verification', 'Patient reviews', 'Video appointments']
        }
      },
      onlineTherapy: {
        betterHelp: {
          name: 'BetterHelp',
          description: 'Online therapy with licensed professionals',
          url: 'https://www.betterhelp.com/',
          features: ['Video, phone, or chat sessions', 'Unlimited messaging', 'Licensed therapists', 'Flexible scheduling']
        },
        talkspace: {
          name: 'Talkspace',
          description: 'Online therapy and psychiatry services',
          url: 'https://www.talkspace.com/',
          features: ['Text, audio, and video therapy', 'Psychiatry services', 'Insurance accepted', 'Specialized programs']
        },
        amwell: {
          name: 'Amwell',
          description: 'Telehealth platform with mental health services',
          url: 'https://www.amwell.com/',
          features: ['Video consultations', 'Psychiatry services', 'Insurance coverage', '24/7 availability']
        }
      },
      specialized: {
        anxiety: {
          name: 'Anxiety and Depression Association of America',
          description: 'Find therapists specializing in anxiety and depression',
          url: 'https://adaa.org/find-help/support',
          features: ['Specialized directories', 'Support groups', 'Educational resources']
        },
        trauma: {
          name: 'International Society for Traumatic Stress Studies',
          description: 'Find trauma-informed therapists',
          url: 'https://istss.org/find-help',
          features: ['Trauma specialists', 'Research-based approaches', 'International directory']
        },
        addiction: {
          name: 'SAMHSA Treatment Locator',
          description: 'Find addiction treatment facilities',
          url: 'https://findtreatment.samhsa.gov/',
          features: ['Treatment facility search', 'Insurance information', 'Crisis resources']
        }
      },
      insurance: {
        blueCross: {
          name: 'Blue Cross Blue Shield',
          description: 'Find in-network mental health providers',
          url: 'https://www.bcbs.com/find-a-doctor',
          features: ['Insurance verification', 'Cost estimates', 'Provider ratings']
        },
        aetna: {
          name: 'Aetna',
          description: 'Search for covered mental health providers',
          url: 'https://www.aetna.com/find-a-doctor.html',
          features: ['Provider search', 'Coverage information', 'Online appointments']
        }
      }
    };

    return res.status(200).json({ data: professionals });
  } catch (error) {
    console.error('Mental health professionals API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 