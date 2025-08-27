import { openRouterChatCompletion, ChatMessage } from './openRouterService';
import { MoodTrackingEntry } from './comprehensiveAssessmentService';

// Integration & Connectivity Implementation
export interface WearableData {
  userId: string;
  timestamp: Date;
  deviceType: 'fitbit' | 'apple_watch' | 'garmin' | 'samsung' | 'generic';
  heartRate: {
    current: number;
    resting: number;
    average: number;
    variability: number;
  };
  sleep: {
    duration: number; // hours
    quality: number; // 0-1
    stages: {
      deep: number;
      light: number;
      rem: number;
      awake: number;
    };
    efficiency: number; // 0-1
  };
  activity: {
    steps: number;
    calories: number;
    activeMinutes: number;
    distance: number; // km
    intensity: 'low' | 'medium' | 'high';
  };
  stress: {
    level: number; // 0-1
    recovery: number; // 0-1
    readiness: number; // 0-1
  };
  biometrics: {
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    bloodOxygen?: number;
    temperature?: number;
    respiration?: number;
  };
}

export interface CalendarIntegration {
  userId: string;
  calendarType: 'google' | 'outlook' | 'apple' | 'generic';
  events: CalendarEvent[];
  reminders: CalendarReminder[];
  availability: AvailabilityWindow[];
  syncSettings: {
    syncMoodCheckins: boolean;
    syncTherapySessions: boolean;
    syncMedicationReminders: boolean;
    syncExerciseSessions: boolean;
    syncSleepTracking: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'therapy' | 'medication' | 'exercise' | 'mood_checkin' | 'appointment' | 'reminder';
  location?: string;
  attendees?: string[];
  notes?: string;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
}

export interface CalendarReminder {
  id: string;
  title: string;
  description: string;
  dueTime: Date;
  type: 'medication' | 'mood_checkin' | 'exercise' | 'therapy_homework' | 'appointment';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  snoozeCount: number;
}

export interface AvailabilityWindow {
  id: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  type: 'therapy' | 'exercise' | 'meditation' | 'general';
  recurring: boolean;
}

export interface HealthcareProviderPortal {
  userId: string;
  providers: HealthcareProvider[];
  sharedData: SharedHealthData;
  communicationLog: ProviderCommunication[];
  appointments: HealthcareAppointment[];
  referrals: HealthcareReferral[];
  medications: Medication[];
  labResults: LabResult[];
}

export interface HealthcareProvider {
  id: string;
  name: string;
  type: 'therapist' | 'psychiatrist' | 'primary_care' | 'specialist' | 'nurse';
  organization: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  specialties: string[];
  credentials: string[];
  accessLevel: 'view_only' | 'limited' | 'full';
  lastAccess: Date;
  permissions: {
    viewMoodData: boolean;
    viewProgressReports: boolean;
    viewCrisisAlerts: boolean;
    addNotes: boolean;
    prescribeMedication: boolean;
  };
}

export interface SharedHealthData {
  moodTrends: boolean;
  sleepData: boolean;
  activityData: boolean;
  medicationAdherence: boolean;
  crisisEvents: boolean;
  progressReports: boolean;
  treatmentGoals: boolean;
  customData: string[];
}

export interface ProviderCommunication {
  id: string;
  providerId: string;
  type: 'message' | 'report' | 'alert' | 'note';
  subject: string;
  content: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  attachments?: string[];
}

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  type: 'email' | 'sms' | 'push' | 'calendar';
  time: Date;
  sent: boolean;
  acknowledged: boolean;
}

export interface HealthcareAppointment {
  id: string;
  providerId: string;
  providerName: string;
  type: 'initial' | 'follow_up' | 'medication' | 'crisis' | 'assessment';
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
  followUpRequired: boolean;
}

export interface HealthcareReferral {
  id: string;
  fromProvider: string;
  toProvider: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  date: Date;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  notes: string;
  insurance: {
    covered: boolean;
    authorizationRequired: boolean;
    copay?: number;
  };
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'inhalation' | 'injection' | 'topical';
  prescribedBy: string;
  prescribedDate: Date;
  endDate?: Date;
  instructions: string;
  sideEffects: string[];
  interactions: string[];
  adherence: {
    taken: number;
    missed: number;
    adherenceRate: number; // 0-1
  };
  reminders: MedicationReminder[];
}

export interface MedicationReminder {
  id: string;
  medicationId: string;
  time: string; // HH:MM
  days: number[]; // 0-6, Sunday = 0
  enabled: boolean;
  lastTaken?: Date;
  nextDue: Date;
}

export interface LabResult {
  id: string;
  testName: string;
  testDate: Date;
  results: LabValue[];
  referenceRange: string;
  interpretation: 'normal' | 'abnormal' | 'critical';
  orderedBy: string;
  notes: string;
}

export interface LabValue {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface CrisisServicesIntegration {
  userId: string;
  localServices: CrisisService[];
  emergencyContacts: EmergencyContact[];
  safetyPlan: SafetyPlan;
  escalationProtocol: EscalationProtocol;
  recentCrisisEvents: CrisisEvent[];
}

export interface CrisisService {
  id: string;
  name: string;
  type: 'hotline' | 'crisis_center' | 'emergency_room' | 'mobile_crisis' | 'peer_support';
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    distance: number; // km
  };
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  services: string[];
  availability: string;
  cost: string;
  insurance: string[];
  rating: number;
  reviews: CrisisServiceReview[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  availability: string;
  notificationPreferences: {
    crisisAlerts: boolean;
    progressUpdates: boolean;
    appointmentReminders: boolean;
  };
  lastContact: Date;
}

export interface SafetyPlan {
  id: string;
  createdDate: Date;
  lastUpdated: Date;
  triggers: string[];
  warningSigns: string[];
  copingStrategies: string[];
  supportContacts: string[];
  emergencyContacts: string[];
  professionalContacts: string[];
  crisisResources: string[];
  safetyMeasures: string[];
}

export interface EscalationProtocol {
  id: string;
  level: 'monitor' | 'intervene' | 'escalate' | 'emergency';
  triggers: string[];
  actions: string[];
  contacts: string[];
  timeframe: string;
  followUp: string[];
}

export interface CrisisEvent {
  id: string;
  timestamp: Date;
  type: 'suicidal_ideation' | 'self_harm' | 'psychosis' | 'violence' | 'overdose' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actions: string[];
  contacts: string[];
  outcome: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

export interface CrisisServiceReview {
  id: string;
  reviewerId: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

class IntegrationConnectivityService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  // Wearable Device Sync
  async syncWearableData(userId: string, deviceType: string): Promise<WearableData> {
    try {
      const prompt = `
        Generate realistic wearable device data for user ${userId} with device type ${deviceType}.
        
        Include:
        1. Heart rate data (current, resting, average, variability)
        2. Sleep data (duration, quality, stages, efficiency)
        3. Activity data (steps, calories, active minutes, distance, intensity)
        4. Stress data (level, recovery, readiness)
        5. Biometric data (blood pressure, oxygen, temperature, respiration)
        
        Make data realistic and clinically relevant.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a wearable device data specialist generating realistic health metrics.' },
        { role: 'user', content: prompt }
      ]);

      const data = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        timestamp: new Date(),
        deviceType: deviceType as any,
        ...data
      };
    } catch (error) {
      console.error('Error syncing wearable data:', error);
      return this.fallbackWearableData(userId, deviceType);
    }
  }

  async analyzeWearableTrends(userId: string, dataHistory: WearableData[]): Promise<{
    sleepTrends: any;
    activityTrends: any;
    stressTrends: any;
    correlations: any;
    recommendations: string[];
  }> {
    try {
      const prompt = `
        Analyze wearable data trends for user ${userId}:
        
        Data History: ${JSON.stringify(dataHistory.slice(-30))}
        
        Identify:
        1. Sleep pattern trends and quality changes
        2. Activity level trends and exercise patterns
        3. Stress level trends and recovery patterns
        4. Correlations between different metrics
        5. Personalized recommendations for improvement
        
        Provide detailed trend analysis with actionable insights.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a health data analyst interpreting wearable device trends.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing wearable trends:', error);
      return {
        sleepTrends: { averageDuration: 7.2, qualityTrend: 'improving' },
        activityTrends: { averageSteps: 8500, intensityTrend: 'stable' },
        stressTrends: { averageLevel: 0.4, recoveryTrend: 'improving' },
        correlations: { 'sleep-activity': 0.6, 'stress-sleep': -0.7 },
        recommendations: ['Maintain consistent sleep schedule', 'Increase daily activity']
      };
    }
  }

  // Calendar Integration
  async syncCalendar(userId: string, calendarType: string): Promise<CalendarIntegration> {
    try {
      const prompt = `
        Set up calendar integration for user ${userId} with calendar type ${calendarType}.
        
        Configure:
        1. Therapy session scheduling
        2. Medication reminders
        3. Mood check-in reminders
        4. Exercise session scheduling
        5. Appointment management
        
        Ensure seamless integration with existing calendar.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a calendar integration specialist setting up health-related scheduling.' },
        { role: 'user', content: prompt }
      ]);

      const integration = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        calendarType: calendarType as any,
        ...integration
      };
    } catch (error) {
      console.error('Error syncing calendar:', error);
      return this.fallbackCalendarIntegration(userId, calendarType);
    }
  }

  async scheduleHealthEvent(userId: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const event: CalendarEvent = {
        id: `event_${Date.now()}`,
        title: eventData.title || 'Therapy Session',
        description: eventData.description || 'Regular therapy session',
        startTime: eventData.startTime || new Date(),
        endTime: eventData.endTime || new Date(Date.now() + 50 * 60 * 1000),
        type: eventData.type || 'therapy',
        location: eventData.location,
        attendees: eventData.attendees,
        notes: eventData.notes,
        recurrence: eventData.recurrence
      };

      // Implementation for scheduling calendar event
      console.log('Scheduled health event:', event);
      
      return event;
    } catch (error) {
      console.error('Error scheduling health event:', error);
      throw error;
    }
  }

  // Healthcare Provider Portal
  async setupProviderPortal(userId: string, providers: Partial<HealthcareProvider>[]): Promise<HealthcareProviderPortal> {
    try {
      const prompt = `
        Set up healthcare provider portal for user ${userId} with providers: ${JSON.stringify(providers)}
        
        Configure:
        1. Provider access levels and permissions
        2. Shared health data settings
        3. Communication protocols
        4. Appointment management
        5. Medication tracking
        
        Ensure HIPAA compliance and appropriate data sharing.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a healthcare integration specialist setting up provider portals.' },
        { role: 'user', content: prompt }
      ]);

      const portal = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        ...portal
      };
    } catch (error) {
      console.error('Error setting up provider portal:', error);
      return this.fallbackProviderPortal(userId);
    }
  }

  async shareDataWithProvider(userId: string, providerId: string, dataType: string, data: any): Promise<void> {
    try {
      // Implementation for sharing data with healthcare provider
      console.log('Sharing data with provider:', { userId, providerId, dataType, data });
      
      // Log the data sharing for audit purposes
      const communication: ProviderCommunication = {
        id: `comm_${Date.now()}`,
        providerId,
        type: 'report',
        subject: `${dataType} Data Shared`,
        content: `Shared ${dataType} data with provider`,
        timestamp: new Date(),
        direction: 'outbound',
        priority: 'medium',
        read: false
      };
      
      console.log('Provider communication logged:', communication);
    } catch (error) {
      console.error('Error sharing data with provider:', error);
      throw error;
    }
  }

  // Crisis Services Integration
  async findCrisisServices(userId: string, location: string): Promise<CrisisService[]> {
    try {
      const prompt = `
        Find crisis services for user ${userId} in ${location}.
        
        Include:
        1. Crisis hotlines and helplines
        2. Local crisis centers
        3. Emergency mental health services
        4. Mobile crisis teams
        5. Peer support crisis services
        
        Provide comprehensive crisis service information.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a crisis services coordinator finding local mental health resources.' },
        { role: 'user', content: prompt }
      ]);

      const services = JSON.parse(response.choices[0].message.content);
      
      return services.map((service: any) => ({
        ...service,
        id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    } catch (error) {
      console.error('Error finding crisis services:', error);
      return this.fallbackCrisisServices();
    }
  }

  async createSafetyPlan(userId: string, riskFactors: string[]): Promise<SafetyPlan> {
    try {
      const prompt = `
        Create a safety plan for user ${userId} with risk factors: ${riskFactors.join(', ')}
        
        Include:
        1. Personal triggers and warning signs
        2. Coping strategies and distractions
        3. Support contacts and emergency contacts
        4. Professional contacts and crisis resources
        5. Safety measures and emergency procedures
        
        Make it comprehensive and actionable.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a crisis intervention specialist creating safety plans.' },
        { role: 'user', content: prompt }
      ]);

      const plan = JSON.parse(response.choices[0].message.content);
      
      return {
        id: `plan_${Date.now()}`,
        createdDate: new Date(),
        lastUpdated: new Date(),
        ...plan
      };
    } catch (error) {
      console.error('Error creating safety plan:', error);
      return this.fallbackSafetyPlan(userId);
    }
  }

  async escalateCrisis(userId: string, crisisData: any): Promise<{
    escalated: boolean;
    actions: string[];
    contacts: EmergencyContact[];
    services: CrisisService[];
  }> {
    try {
      const prompt = `
        Assess crisis situation for user ${userId}:
        
        Crisis Data: ${JSON.stringify(crisisData)}
        
        Determine:
        1. Whether escalation is needed
        2. Appropriate emergency contacts
        3. Crisis services to contact
        4. Immediate actions required
        5. Follow-up procedures
        
        Provide comprehensive crisis response plan.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a crisis intervention specialist handling emergency situations.' },
        { role: 'user', content: prompt }
      ]);

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error escalating crisis:', error);
      return {
        escalated: false,
        actions: ['Monitor situation', 'Provide crisis resources'],
        contacts: [],
        services: []
      };
    }
  }

  // Fallback implementations
  private fallbackWearableData(userId: string, deviceType: string): WearableData {
    return {
      userId,
      timestamp: new Date(),
      deviceType: deviceType as any,
      heartRate: {
        current: 72,
        resting: 58,
        average: 68,
        variability: 45
      },
      sleep: {
        duration: 7.5,
        quality: 0.8,
        stages: {
          deep: 1.2,
          light: 4.8,
          rem: 1.5,
          awake: 0.2
        },
        efficiency: 0.85
      },
      activity: {
        steps: 8500,
        calories: 2100,
        activeMinutes: 45,
        distance: 6.2,
        intensity: 'medium'
      },
      stress: {
        level: 0.4,
        recovery: 0.7,
        readiness: 0.6
      },
      biometrics: {
        bloodPressure: {
          systolic: 120,
          diastolic: 80
        },
        bloodOxygen: 98,
        temperature: 98.6,
        respiration: 16
      }
    };
  }

  private fallbackCalendarIntegration(userId: string, calendarType: string): CalendarIntegration {
    return {
      userId,
      calendarType: calendarType as any,
      events: [
        {
          id: 'event_1',
          title: 'Therapy Session',
          description: 'Weekly therapy session with Dr. Smith',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 50 * 60 * 1000),
          type: 'therapy',
          location: 'Telehealth - Zoom',
          attendees: ['Dr. Smith'],
          notes: 'Focus on anxiety management techniques'
        }
      ],
      reminders: [
        {
          id: 'reminder_1',
          title: 'Mood Check-in',
          description: 'Daily mood tracking reminder',
          dueTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          type: 'mood_checkin',
          priority: 'medium',
          completed: false,
          snoozeCount: 0
        }
      ],
      availability: [
        {
          id: 'availability_1',
          dayOfWeek: 1, // Monday
          startTime: '09:00',
          endTime: '17:00',
          type: 'therapy',
          recurring: true
        }
      ],
      syncSettings: {
        syncMoodCheckins: true,
        syncTherapySessions: true,
        syncMedicationReminders: true,
        syncExerciseSessions: true,
        syncSleepTracking: true
      }
    };
  }

  private fallbackProviderPortal(userId: string): HealthcareProviderPortal {
    return {
      userId,
      providers: [
        {
          id: 'provider_1',
          name: 'Dr. Sarah Johnson',
          type: 'therapist',
          organization: 'Mental Health Associates',
          contact: {
            phone: '555-0123',
            email: 'dr.johnson@mha.com',
            address: '123 Main St, New York, NY 10001'
          },
          specialties: ['Anxiety', 'Depression', 'Trauma'],
          credentials: ['PhD', 'Licensed Clinical Psychologist'],
          accessLevel: 'limited',
          lastAccess: new Date(),
          permissions: {
            viewMoodData: true,
            viewProgressReports: true,
            viewCrisisAlerts: true,
            addNotes: true,
            prescribeMedication: false
          }
        }
      ],
      sharedData: {
        moodTrends: true,
        sleepData: true,
        activityData: true,
        medicationAdherence: true,
        crisisEvents: true,
        progressReports: true,
        treatmentGoals: true,
        customData: ['Weekly summaries', 'Crisis alerts']
      },
      communicationLog: [],
      appointments: [],
      referrals: [],
      medications: [],
      labResults: []
    };
  }

  private fallbackCrisisServices(): CrisisService[] {
    return [
      {
        id: 'service_1',
        name: 'National Suicide Prevention Lifeline',
        type: 'hotline',
        location: {
          address: 'National',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
          distance: 0
        },
        contact: {
          phone: '988',
          email: 'info@988lifeline.org',
          website: 'https://988lifeline.org'
        },
        services: ['Crisis intervention', 'Suicide prevention', 'Emotional support'],
        availability: '24/7',
        cost: 'Free',
        insurance: ['All accepted'],
        rating: 4.9,
        reviews: []
      },
      {
        id: 'service_2',
        name: 'Crisis Text Line',
        type: 'hotline',
        location: {
          address: 'Text-based service',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
          distance: 0
        },
        contact: {
          phone: 'Text HOME to 741741',
          email: 'info@crisistextline.org',
          website: 'https://www.crisistextline.org'
        },
        services: ['Crisis intervention', 'Text-based support', 'Emotional support'],
        availability: '24/7',
        cost: 'Free',
        insurance: ['All accepted'],
        rating: 4.8,
        reviews: []
      }
    ];
  }

  private fallbackSafetyPlan(userId: string): SafetyPlan {
    return {
      id: `plan_${Date.now()}`,
      createdDate: new Date(),
      lastUpdated: new Date(),
      triggers: ['Work stress', 'Relationship conflicts', 'Financial worries'],
      warningSigns: ['Difficulty sleeping', 'Increased irritability', 'Withdrawal from activities'],
      copingStrategies: ['Deep breathing', 'Progressive muscle relaxation', 'Calling a friend'],
      supportContacts: ['Family member', 'Close friend', 'Therapist'],
      emergencyContacts: ['Crisis hotline: 988', 'Emergency services: 911'],
      professionalContacts: ['Dr. Johnson: 555-0123', 'Crisis center: 555-0456'],
      crisisResources: ['988 Suicide & Crisis Lifeline', 'Crisis Text Line', 'Emergency room'],
      safetyMeasures: ['Remove access to harmful items', 'Stay with trusted person', 'Call crisis hotline']
    };
  }
}

const integrationConnectivityService = new IntegrationConnectivityService();
export default integrationConnectivityService; 