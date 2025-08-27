import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supportGroups = {
      depression: {
        name: 'Depression Support Groups',
        description: 'Groups for people dealing with depression',
        resources: [
          {
            name: 'Depression and Bipolar Support Alliance (DBSA)',
            description: 'Peer-led support groups for depression and bipolar disorder',
            url: 'https://www.dbsalliance.org/support/chapters-and-support-groups/',
            features: ['In-person and online groups', 'Peer support', 'Educational resources', 'Crisis support']
          },
          {
            name: 'NAMI Connection Recovery Support Group',
            description: 'Free, peer-led support group for adults with mental health conditions',
            url: 'https://www.nami.org/Support-Education/Support-Groups/NAMI-Connection',
            features: ['Weekly meetings', 'Peer support', 'Structured program', 'Free to attend']
          }
        ]
      },
      anxiety: {
        name: 'Anxiety Support Groups',
        description: 'Groups for people dealing with anxiety disorders',
        resources: [
          {
            name: 'Anxiety and Depression Association of America (ADAA)',
            description: 'Support groups and resources for anxiety and depression',
            url: 'https://adaa.org/find-help/support',
            features: ['Online support groups', 'Educational resources', 'Treatment information', 'Crisis resources']
          },
          {
            name: 'Anxiety Support Network',
            description: 'Online community for people with anxiety',
            url: 'https://www.anxietysupportnetwork.com/',
            features: ['Online forums', 'Peer support', 'Resource library', '24/7 community']
          }
        ]
      },
      trauma: {
        name: 'Trauma Support Groups',
        description: 'Groups for people dealing with trauma and PTSD',
        resources: [
          {
            name: 'PTSD Alliance',
            description: 'Support and resources for people with PTSD',
            url: 'https://www.ptsdalliance.org/',
            features: ['Support groups', 'Educational resources', 'Treatment information', 'Crisis support']
          },
          {
            name: 'RAINN Support Groups',
            description: 'Support groups for survivors of sexual violence',
            url: 'https://www.rainn.org/support-groups',
            features: ['Online support groups', 'Confidential', 'Professional facilitators', 'Free service']
          }
        ]
      },
      addiction: {
        name: 'Addiction Recovery Groups',
        description: 'Groups for people in addiction recovery',
        resources: [
          {
            name: 'Alcoholics Anonymous (AA)',
            description: '12-step program for alcohol recovery',
            url: 'https://www.aa.org/find-aa',
            features: ['12-step program', 'In-person and online meetings', 'Sponsorship', 'Free to attend']
          },
          {
            name: 'Narcotics Anonymous (NA)',
            description: '12-step program for drug addiction recovery',
            url: 'https://www.na.org/meetingsearch/',
            features: ['12-step program', 'In-person and online meetings', 'Sponsorship', 'Free to attend']
          },
          {
            name: 'SMART Recovery',
            description: 'Science-based addiction recovery program',
            url: 'https://www.smartrecovery.org/',
            features: ['Evidence-based approach', 'Online and in-person meetings', 'Self-empowerment', 'Free to attend']
          }
        ]
      },
      grief: {
        name: 'Grief Support Groups',
        description: 'Groups for people dealing with loss and grief',
        resources: [
          {
            name: 'GriefShare',
            description: 'Christian-based grief support groups',
            url: 'https://www.griefshare.org/',
            features: ['13-week program', 'In-person groups', 'Online resources', 'Faith-based approach']
          },
          {
            name: 'The Compassionate Friends',
            description: 'Support for families who have lost a child',
            url: 'https://www.compassionatefriends.org/',
            features: ['Peer support', 'Local chapters', 'Online resources', 'Bereaved parent support']
          }
        ]
      },
      online: {
        name: 'Online Support Communities',
        description: 'Virtual support groups and communities',
        resources: [
          {
            name: '7 Cups',
            description: 'Online therapy and emotional support',
            url: 'https://www.7cups.com/',
            features: ['Free chat with listeners', 'Online therapy', 'Support groups', 'Mobile app']
          },
          {
            name: 'Reddit Mental Health Communities',
            description: 'Various mental health support subreddits',
            url: 'https://www.reddit.com/r/mentalhealth/',
            features: ['Multiple communities', '24/7 support', 'Anonymous', 'Peer support']
          },
          {
            name: 'Mental Health America Online Support Groups',
            description: 'Online support groups for various mental health conditions',
            url: 'https://www.mhanational.org/online-support-groups',
            features: ['Free online groups', 'Professional facilitators', 'Various topics', 'Confidential']
          }
        ]
      }
    };

    return res.status(200).json({ data: supportGroups });
  } catch (error) {
    console.error('Support groups API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 