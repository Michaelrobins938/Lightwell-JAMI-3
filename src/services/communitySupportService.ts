import { openRouterChatCompletion, ChatMessage } from './openRouterService';
import { PsychologicalProfile, MoodTrackingEntry } from './comprehensiveAssessmentService';

// Community & Support Features Implementation
export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: 'anxiety' | 'depression' | 'trauma' | 'addiction' | 'grief' | 'general';
  type: 'peer_support' | 'moderated' | 'professional_led' | 'specialized';
  meetingSchedule: GroupMeeting[];
  members: GroupMember[];
  topics: string[];
  rules: string[];
  privacyLevel: 'anonymous' | 'pseudonymous' | 'identified';
  maxMembers: number;
  currentMembers: number;
  status: 'active' | 'inactive' | 'full';
}

export interface GroupMeeting {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  duration: number; // minutes
  type: 'live' | 'asynchronous' | 'hybrid';
  facilitator?: string;
  maxParticipants: number;
  currentParticipants: number;
  topics: string[];
  materials?: string[];
}

export interface GroupMember {
  id: string;
  displayName: string;
  joinDate: Date;
  role: 'member' | 'moderator' | 'facilitator' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  contributionLevel: number; // 0-1
  privacySettings: {
    showProfile: boolean;
    allowMessages: boolean;
    shareProgress: boolean;
  };
}

export interface FamilyIntegration {
  userId: string;
  familyMembers: FamilyMember[];
  sharedProgress: SharedProgressData;
  communicationPreferences: CommunicationPreferences;
  emergencyContacts: EmergencyContact[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  accessLevel: 'view_only' | 'limited' | 'full';
  notifications: {
    progressUpdates: boolean;
    crisisAlerts: boolean;
    achievements: boolean;
    appointments: boolean;
  };
  lastActive: Date;
}

export interface SharedProgressData {
  moodTrends: boolean;
  goalProgress: boolean;
  achievements: boolean;
  crisisAlerts: boolean;
  appointmentReminders: boolean;
  customData: string[];
}

export interface CommunicationPreferences {
  frequency: 'daily' | 'weekly' | 'monthly' | 'on_demand';
  method: 'email' | 'sms' | 'in_app' | 'all';
  content: 'summary' | 'detailed' | 'crisis_only';
  timeZone: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  availability: string;
  notificationPreferences: {
    crisisAlerts: boolean;
    progressUpdates: boolean;
    appointmentReminders: boolean;
  };
}

export interface ProfessionalNetwork {
  userId: string;
  therapists: Therapist[];
  psychiatrists: Psychiatrist[];
  supportCoordinators: SupportCoordinator[];
  referrals: Referral[];
  appointments: Appointment[];
}

export interface Therapist {
  id: string;
  name: string;
  credentials: string[];
  specialties: string[];
  approach: string[];
  location: {
    city: string;
    state: string;
    country: string;
    telehealth: boolean;
  };
  availability: {
    days: string[];
    hours: string;
    timeZone: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  insurance: string[];
  slidingScale: boolean;
  rating: number;
  reviews: Review[];
}

export interface Psychiatrist {
  id: string;
  name: string;
  credentials: string[];
  specialties: string[];
  location: {
    city: string;
    state: string;
    country: string;
    telehealth: boolean;
  };
  availability: {
    days: string[];
    hours: string;
    timeZone: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  insurance: string[];
  medicationManagement: boolean;
  rating: number;
  reviews: Review[];
}

export interface SupportCoordinator {
  id: string;
  name: string;
  organization: string;
  services: string[];
  location: {
    city: string;
    state: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  eligibility: string[];
  cost: string;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  reviewerId: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface Referral {
  id: string;
  fromProvider: string;
  toProvider: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  date: Date;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  notes: string;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  type: 'initial' | 'follow_up' | 'crisis' | 'medication' | 'group';
  dateTime: Date;
  duration: number; // minutes
  location: {
    type: 'in_person' | 'telehealth' | 'hybrid';
    address?: string;
    platform?: string;
  };
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  reminders: AppointmentReminder[];
}

export interface AppointmentReminder {
  id: string;
  type: 'email' | 'sms' | 'push';
  timeBeforeAppointment: number; // minutes
  sent: boolean;
  sentTime?: Date;
}

export interface EducationalContent {
  id: string;
  title: string;
  type: 'video' | 'article' | 'workshop' | 'webinar' | 'podcast' | 'worksheet';
  category: 'psychoeducation' | 'skills_training' | 'crisis_prevention' | 'wellness' | 'research';
  description: string;
  content: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: string[];
  tags: string[];
  author: string;
  publishDate: Date;
  lastUpdated: Date;
  rating: number;
  views: number;
  downloads: number;
  accessibility: {
    captions: boolean;
    transcripts: boolean;
    audioDescription: boolean;
    screenReader: boolean;
  };
  resources: EducationalResource[];
}

export interface EducationalResource {
  id: string;
  type: 'worksheet' | 'handout' | 'audio' | 'video' | 'link';
  title: string;
  description: string;
  url: string;
  fileSize?: number;
  downloadCount: number;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  facilitator: string;
  dateTime: Date;
  duration: number; // minutes
  maxParticipants: number;
  currentParticipants: number;
  topics: string[];
  materials: string[];
  recording?: string;
  transcript?: string;
  rating: number;
  reviews: Review[];
}

class CommunitySupportService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  // Peer Support Groups
  async getSupportGroups(userId: string, preferences: string[]): Promise<SupportGroup[]> {
    try {
      const prompt = `
        Find support groups for user with preferences: ${preferences.join(', ')}
        
        Consider:
        1. User's mental health needs
        2. Geographic location
        3. Meeting schedule preferences
        4. Privacy requirements
        5. Group size and activity level
        
        Provide relevant support groups with detailed information.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a support group coordinator matching users with appropriate groups.' },
        { role: 'user', content: prompt }
      ]);

      const groups = JSON.parse(response.choices[0].message.content);
      
      return groups.map((group: any) => ({
        ...group,
        id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    } catch (error) {
      console.error('Error getting support groups:', error);
      return this.fallbackSupportGroups();
    }
  }

  async joinSupportGroup(userId: string, groupId: string): Promise<GroupMember> {
    try {
      const member: GroupMember = {
        id: userId,
        displayName: `User_${userId.slice(-4)}`,
        joinDate: new Date(),
        role: 'member',
        status: 'active',
        contributionLevel: 0.5,
        privacySettings: {
          showProfile: true,
          allowMessages: true,
          shareProgress: false
        }
      };

      // Implementation for joining group
      console.log('User joined support group:', { userId, groupId, member });
      
      return member;
    } catch (error) {
      console.error('Error joining support group:', error);
      throw error;
    }
  }

  // Family/Partner Integration
  async setupFamilyIntegration(userId: string, familyMembers: Partial<FamilyMember>[]): Promise<FamilyIntegration> {
    try {
      const prompt = `
        Set up family integration for user with family members: ${JSON.stringify(familyMembers)}
        
        Configure:
        1. Appropriate access levels for each family member
        2. Communication preferences
        3. Shared progress settings
        4. Emergency contact setup
        5. Privacy protections
        
        Ensure user safety and appropriate information sharing.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a family integration specialist setting up support networks.' },
        { role: 'user', content: prompt }
      ]);

      const integration = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        ...integration
      };
    } catch (error) {
      console.error('Error setting up family integration:', error);
      return this.fallbackFamilyIntegration(userId);
    }
  }

  async shareProgressWithFamily(userId: string, progressData: any, familyMembers: FamilyMember[]): Promise<void> {
    try {
      // Implementation for sharing progress with family
      console.log('Sharing progress with family:', { userId, progressData, familyMembers });
      
      // Send notifications to family members based on their preferences
      familyMembers.forEach(member => {
        if (member.notifications.progressUpdates) {
          // Send progress update notification
          console.log(`Sending progress update to ${member.name}`);
        }
      });
    } catch (error) {
      console.error('Error sharing progress with family:', error);
      throw error;
    }
  }

  // Professional Network Integration
  async findTherapists(userId: string, location: string, preferences: string[]): Promise<Therapist[]> {
    try {
      const prompt = `
        Find therapists for user in ${location} with preferences: ${preferences.join(', ')}
        
        Consider:
        1. Specialties matching user needs
        2. Insurance and payment options
        3. Availability and scheduling
        4. Telehealth options
        5. User reviews and ratings
        
        Provide comprehensive therapist recommendations.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a mental health referral specialist matching users with therapists.' },
        { role: 'user', content: prompt }
      ]);

      const therapists = JSON.parse(response.choices[0].message.content);
      
      return therapists.map((therapist: any) => ({
        ...therapist,
        id: `therapist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    } catch (error) {
      console.error('Error finding therapists:', error);
      return this.fallbackTherapists();
    }
  }

  async scheduleAppointment(userId: string, providerId: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const appointment: Appointment = {
        id: `appointment_${Date.now()}`,
        providerId,
        providerName: 'Dr. Smith', // Would be fetched from provider data
        type: appointmentData.type || 'follow_up',
        dateTime: appointmentData.dateTime || new Date(),
        duration: appointmentData.duration || 50,
        location: {
          type: 'telehealth',
          platform: 'Zoom'
        },
        status: 'scheduled',
        notes: appointmentData.notes || '',
        reminders: [
          {
            id: `reminder_${Date.now()}`,
            type: 'email',
            timeBeforeAppointment: 1440, // 24 hours
            sent: false
          },
          {
            id: `reminder_${Date.now() + 1}`,
            type: 'sms',
            timeBeforeAppointment: 60, // 1 hour
            sent: false
          }
        ]
      };

      // Implementation for scheduling appointment
      console.log('Scheduled appointment:', appointment);
      
      return appointment;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  }

  // Educational Content Library
  async getEducationalContent(userId: string, interests: string[], difficulty: string): Promise<EducationalContent[]> {
    try {
      const prompt = `
        Find educational content for user with interests: ${interests.join(', ')} at ${difficulty} level.
        
        Consider:
        1. User's learning preferences
        2. Current therapeutic goals
        3. Accessibility needs
        4. Content quality and relevance
        5. User engagement patterns
        
        Provide diverse, high-quality educational resources.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are an educational content curator for mental health resources.' },
        { role: 'user', content: prompt }
      ]);

      const content = JSON.parse(response.choices[0].message.content);
      
      return content.map((item: any) => ({
        ...item,
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    } catch (error) {
      console.error('Error getting educational content:', error);
      return this.fallbackEducationalContent();
    }
  }

  async createWorkshop(workshopData: Partial<Workshop>): Promise<Workshop> {
    try {
      const workshop: Workshop = {
        id: `workshop_${Date.now()}`,
        title: workshopData.title || 'Managing Anxiety Workshop',
        description: workshopData.description || 'Learn practical techniques for managing anxiety',
        facilitator: workshopData.facilitator || 'Dr. Johnson',
        dateTime: workshopData.dateTime || new Date(),
        duration: workshopData.duration || 90,
        maxParticipants: workshopData.maxParticipants || 20,
        currentParticipants: 0,
        topics: workshopData.topics || ['Anxiety management', 'Breathing techniques', 'Cognitive restructuring'],
        materials: workshopData.materials || ['Worksheets', 'Guided meditation audio'],
        rating: 0,
        reviews: []
      };

      // Implementation for creating workshop
      console.log('Created workshop:', workshop);
      
      return workshop;
    } catch (error) {
      console.error('Error creating workshop:', error);
      throw error;
    }
  }

  // Community Moderation
  async moderateContent(content: string, userId: string): Promise<{
    approved: boolean;
    flagged: boolean;
    reason?: string;
    action?: string;
  }> {
    try {
      const prompt = `
        Moderate the following content for a mental health support community:
        
        Content: "${content}"
        User ID: ${userId}
        
        Check for:
        1. Harmful or dangerous advice
        2. Crisis situations requiring escalation
        3. Inappropriate or offensive content
        4. Spam or commercial content
        5. Privacy violations
        
        Provide moderation decision with reasoning.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a community moderator ensuring safe mental health discussions.' },
        { role: 'user', content: prompt }
      ]);

      const moderation = JSON.parse(response.choices[0].message.content);
      
      return moderation;
    } catch (error) {
      console.error('Error moderating content:', error);
      return {
        approved: true,
        flagged: false
      };
    }
  }

  // Crisis Escalation
  async escalateCrisis(userId: string, crisisData: any): Promise<{
    escalated: boolean;
    actions: string[];
    contacts: EmergencyContact[];
  }> {
    try {
      const prompt = `
        Assess crisis situation for user ${userId}:
        
        Crisis Data: ${JSON.stringify(crisisData)}
        
        Determine:
        1. Whether escalation is needed
        2. Appropriate emergency contacts
        3. Immediate actions required
        4. Follow-up procedures
        
        Provide crisis response plan.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a crisis intervention specialist handling emergency situations.' },
        { role: 'user', content: prompt }
      ]);

      const escalation = JSON.parse(response.choices[0].message.content);
      
      return escalation;
    } catch (error) {
      console.error('Error escalating crisis:', error);
      return {
        escalated: false,
        actions: ['Monitor situation', 'Provide crisis resources'],
        contacts: []
      };
    }
  }

  // Fallback implementations
  private fallbackSupportGroups(): SupportGroup[] {
    return [
      {
        id: 'group_1',
        name: 'Anxiety Support Group',
        description: 'A safe space for people dealing with anxiety disorders',
        category: 'anxiety',
        type: 'peer_support',
        meetingSchedule: [
          {
            id: 'meeting_1',
            title: 'Weekly Anxiety Support',
            description: 'Weekly peer support meeting for anxiety',
            dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            duration: 60,
            type: 'live',
            maxParticipants: 15,
            currentParticipants: 8,
            topics: ['Coping strategies', 'Progress sharing', 'Resource exchange']
          }
        ],
        members: [],
        topics: ['Anxiety management', 'Coping strategies', 'Progress sharing'],
        rules: ['Be respectful', 'Maintain confidentiality', 'No medical advice'],
        privacyLevel: 'anonymous',
        maxMembers: 50,
        currentMembers: 25,
        status: 'active'
      },
      {
        id: 'group_2',
        name: 'Depression Recovery Group',
        description: 'Support group for individuals working through depression',
        category: 'depression',
        type: 'moderated',
        meetingSchedule: [
          {
            id: 'meeting_2',
            title: 'Depression Recovery Meeting',
            description: 'Moderated support meeting for depression recovery',
            dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            duration: 90,
            type: 'live',
            facilitator: 'Dr. Sarah Johnson',
            maxParticipants: 12,
            currentParticipants: 6,
            topics: ['Recovery strategies', 'Hope and healing', 'Building resilience']
          }
        ],
        members: [],
        topics: ['Depression recovery', 'Hope and healing', 'Building resilience'],
        rules: ['Supportive environment', 'Confidentiality', 'Professional moderation'],
        privacyLevel: 'pseudonymous',
        maxMembers: 30,
        currentMembers: 18,
        status: 'active'
      }
    ];
  }

  private fallbackFamilyIntegration(userId: string): FamilyIntegration {
    return {
      userId,
      familyMembers: [
        {
          id: 'family_1',
          name: 'Spouse',
          relationship: 'spouse',
          email: 'spouse@example.com',
          phone: '555-0123',
          accessLevel: 'limited',
          notifications: {
            progressUpdates: true,
            crisisAlerts: true,
            achievements: true,
            appointments: false
          },
          lastActive: new Date()
        }
      ],
      sharedProgress: {
        moodTrends: true,
        goalProgress: true,
        achievements: true,
        crisisAlerts: true,
        appointmentReminders: false,
        customData: ['Weekly summary', 'Major milestones']
      },
      communicationPreferences: {
        frequency: 'weekly',
        method: 'email',
        content: 'summary',
        timeZone: 'America/New_York'
      },
      emergencyContacts: [
        {
          name: 'Emergency Contact',
          relationship: 'Family',
          phone: '555-0123',
          email: 'emergency@example.com',
          availability: '24/7',
          notificationPreferences: {
            crisisAlerts: true,
            progressUpdates: false,
            appointmentReminders: false
          }
        }
      ]
    };
  }

  private fallbackTherapists(): Therapist[] {
    return [
      {
        id: 'therapist_1',
        name: 'Dr. Sarah Johnson',
        credentials: ['PhD', 'Licensed Clinical Psychologist'],
        specialties: ['Anxiety', 'Depression', 'Trauma'],
        approach: ['CBT', 'EMDR', 'Mindfulness'],
        location: {
          city: 'New York',
          state: 'NY',
          country: 'USA',
          telehealth: true
        },
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          hours: '9:00 AM - 5:00 PM',
          timeZone: 'America/New_York'
        },
        contact: {
          phone: '555-0123',
          email: 'dr.johnson@example.com',
          website: 'www.drsarahjohnson.com'
        },
        insurance: ['Blue Cross', 'Aetna', 'Cigna'],
        slidingScale: true,
        rating: 4.8,
        reviews: []
      },
      {
        id: 'therapist_2',
        name: 'Dr. Michael Chen',
        credentials: ['LCSW', 'Licensed Clinical Social Worker'],
        specialties: ['Depression', 'Grief', 'Life Transitions'],
        approach: ['Humanistic', 'Solution-Focused', 'ACT'],
        location: {
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          telehealth: true
        },
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
          hours: '10:00 AM - 6:00 PM',
          timeZone: 'America/Los_Angeles'
        },
        contact: {
          phone: '555-0456',
          email: 'dr.chen@example.com',
          website: 'www.drmichaelchen.com'
        },
        insurance: ['Kaiser', 'Anthem', 'UnitedHealth'],
        slidingScale: false,
        rating: 4.6,
        reviews: []
      }
    ];
  }

  private fallbackEducationalContent(): EducationalContent[] {
    return [
      {
        id: 'content_1',
        title: 'Understanding Anxiety: A Complete Guide',
        type: 'video',
        category: 'psychoeducation',
        description: 'Comprehensive overview of anxiety disorders, symptoms, and treatment options',
        content: 'Video content about anxiety...',
        duration: 45,
        difficulty: 'beginner',
        targetAudience: ['General public', 'Anxiety sufferers', 'Family members'],
        tags: ['anxiety', 'psychoeducation', 'treatment'],
        author: 'Dr. Emily Rodriguez',
        publishDate: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        rating: 4.7,
        views: 1250,
        downloads: 340,
        accessibility: {
          captions: true,
          transcripts: true,
          audioDescription: false,
          screenReader: true
        },
        resources: [
          {
            id: 'resource_1',
            type: 'handout',
            title: 'Anxiety Symptoms Checklist',
            description: 'Printable checklist of common anxiety symptoms',
            url: '/resources/anxiety-checklist.pdf',
            fileSize: 245,
            downloadCount: 156
          }
        ]
      },
      {
        id: 'content_2',
        title: 'CBT Techniques for Depression',
        type: 'workshop',
        category: 'skills_training',
        description: 'Interactive workshop teaching cognitive behavioral therapy techniques',
        content: 'Workshop content about CBT...',
        duration: 90,
        difficulty: 'intermediate',
        targetAudience: ['Depression sufferers', 'Therapy clients', 'Mental health professionals'],
        tags: ['CBT', 'depression', 'skills', 'workshop'],
        author: 'Dr. James Wilson',
        publishDate: new Date('2024-02-01'),
        lastUpdated: new Date('2024-02-01'),
        rating: 4.9,
        views: 890,
        downloads: 567,
        accessibility: {
          captions: true,
          transcripts: true,
          audioDescription: true,
          screenReader: true
        },
        resources: [
          {
            id: 'resource_2',
            type: 'worksheet',
            title: 'Thought Record Worksheet',
            description: 'CBT worksheet for tracking and challenging negative thoughts',
            url: '/resources/thought-record.pdf',
            fileSize: 189,
            downloadCount: 423
          }
        ]
      }
    ];
  }
}

const communitySupportService = new CommunitySupportService();
export default communitySupportService; 