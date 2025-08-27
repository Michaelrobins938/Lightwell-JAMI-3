import { openRouterChatCompletion, ChatMessage } from './openRouterService';
import { PsychologicalProfile, MoodTrackingEntry } from './comprehensiveAssessmentService';

// Personalized Wellness Ecosystem Implementation
export interface WellnessPlan {
  userId: string;
  date: Date;
  therapeuticExercises: CBTExercise[];
  mindfulness: MindfulnessSession[];
  journaling: JournalPrompt[];
  behavioral: BehavioralActivity[];
  sleepOptimization: SleepRecommendation;
  nutritionGuidance: NutritionRecommendation;
  socialConnection: SocialActivity[];
  crisisPrevention: CrisisPreventionPlan;
}

export interface CBTExercise {
  id: string;
  type: 'thought_record' | 'behavioral_experiment' | 'cognitive_restructuring' | 'exposure' | 'problem_solving';
  title: string;
  description: string;
  instructions: string[];
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetSymptoms: string[];
  expectedOutcome: string;
  homework?: string;
  aiAssistance: boolean;
}

export interface MindfulnessSession {
  id: string;
  type: 'breathing' | 'body_scan' | 'loving_kindness' | 'mindful_movement' | 'meditation';
  title: string;
  description: string;
  duration: number; // minutes
  guided: boolean;
  audioUrl?: string;
  instructions: string[];
  targetBenefits: string[];
  contraindications: string[];
}

export interface JournalPrompt {
  id: string;
  type: 'reflection' | 'gratitude' | 'problem_solving' | 'emotional_processing' | 'goal_setting';
  title: string;
  prompt: string;
  followUpQuestions: string[];
  expectedInsights: string[];
  therapeuticFramework: string;
}

export interface BehavioralActivity {
  id: string;
  type: 'exposure' | 'behavioral_activation' | 'social_skill' | 'self_care' | 'goal_oriented';
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: number; // 1-10
  targetGoals: string[];
  stepByStepInstructions: string[];
  safetyConsiderations: string[];
  progressTracking: string[];
}

export interface SleepRecommendation {
  bedtime: string;
  wakeTime: string;
  sleepHygiene: string[];
  relaxationTechniques: string[];
  environmentalOptimization: string[];
  sleepTracking: boolean;
}

export interface NutritionRecommendation {
  mealTiming: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  moodSupportingFoods: string[];
  foodsToLimit: string[];
  hydrationGoal: number; // liters
  supplements?: string[];
}

export interface SocialActivity {
  id: string;
  type: 'support_group' | 'social_event' | 'volunteering' | 'hobby_group' | 'family_time';
  title: string;
  description: string;
  duration: number; // minutes
  socialIntensity: 'low' | 'medium' | 'high';
  benefits: string[];
  accessibility: string[];
}

export interface CrisisPreventionPlan {
  triggers: string[];
  earlyWarningSigns: string[];
  copingStrategies: string[];
  supportContacts: {
    name: string;
    relationship: string;
    phone: string;
    availability: string;
  }[];
  emergencyResources: {
    name: string;
    phone: string;
    description: string;
  }[];
  safetyPlan: string[];
}

export interface TherapeuticTool {
  id: string;
  name: string;
  category: 'cbt' | 'mindfulness' | 'exposure' | 'skills_training' | 'crisis';
  description: string;
  duration: number;
  difficulty: number;
  effectiveness: number; // 0-1
  userRating: number;
  usageCount: number;
  lastUsed: Date;
}

export interface SkillsTrainingModule {
  id: string;
  name: string;
  framework: 'DBT' | 'ACT' | 'CBT' | 'Mindfulness' | 'Trauma_Focused';
  description: string;
  modules: {
    id: string;
    title: string;
    content: string[];
    exercises: string[];
    duration: number;
    prerequisites: string[];
  }[];
  totalDuration: number;
  progress: number; // 0-1
}

class WellnessEcosystemService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  // Personalized intervention engine
  async generateDailyPlan(userId: string, userProfile: PsychologicalProfile, currentMood: MoodTrackingEntry): Promise<WellnessPlan> {
    try {
      const prompt = `
        Generate a personalized daily wellness plan based on:
        
        User Profile: ${JSON.stringify(userProfile)}
        Current Mood: ${JSON.stringify(currentMood)}
        
        Create a comprehensive plan including:
        1. CBT exercises tailored to current symptoms
        2. Mindfulness sessions appropriate for current state
        3. Journaling prompts for emotional processing
        4. Behavioral activities for mood improvement
        5. Sleep optimization recommendations
        6. Nutrition guidance for mental health
        7. Social connection activities
        8. Crisis prevention strategies
        
        Provide the plan in JSON format with detailed, actionable items.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a clinical psychologist creating personalized wellness plans.' },
        { role: 'user', content: prompt }
      ]);

      const plan = JSON.parse(response.choices[0].message.content);
      
      return {
        userId,
        date: new Date(),
        ...plan
      };
    } catch (error) {
      console.error('Error generating daily plan:', error);
      return this.fallbackWellnessPlan(userId);
    }
  }

  // Interactive Therapeutic Tools
  async generateCBTWorksheet(userId: string, targetSymptom: string, difficulty: string): Promise<CBTExercise> {
    try {
      const prompt = `
        Create a CBT worksheet for ${targetSymptom} at ${difficulty} level.
        
        Include:
        - Clear instructions
        - Step-by-step process
        - Expected outcomes
        - Homework assignment
        - AI assistance features
        
        Make it engaging and clinically effective.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a CBT specialist creating therapeutic worksheets.' },
        { role: 'user', content: prompt }
      ]);

      const worksheet = JSON.parse(response.choices[0].message.content);
      
      return {
        id: `cbt_${Date.now()}`,
        ...worksheet
      };
    } catch (error) {
      console.error('Error generating CBT worksheet:', error);
      return this.fallbackCBTExercise();
    }
  }

  async generateMindfulnessSession(userId: string, targetBenefit: string, duration: number): Promise<MindfulnessSession> {
    try {
      const prompt = `
        Create a ${duration}-minute mindfulness session targeting ${targetBenefit}.
        
        Include:
        - Guided instructions
        - Breathing techniques
        - Body awareness
        - Expected benefits
        - Safety considerations
        
        Make it accessible and effective.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a mindfulness instructor creating guided sessions.' },
        { role: 'user', content: prompt }
      ]);

      const session = JSON.parse(response.choices[0].message.content);
      
      return {
        id: `mindfulness_${Date.now()}`,
        ...session
      };
    } catch (error) {
      console.error('Error generating mindfulness session:', error);
      return this.fallbackMindfulnessSession();
    }
  }

  async generateJournalPrompt(userId: string, emotionalState: string, therapeuticGoal: string): Promise<JournalPrompt> {
    try {
      const prompt = `
        Create a journaling prompt for someone experiencing ${emotionalState} who wants to work on ${therapeuticGoal}.
        
        Include:
        - Engaging opening prompt
        - Follow-up questions
        - Expected insights
        - Therapeutic framework
        
        Make it thought-provoking and therapeutic.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a therapeutic writing specialist creating journal prompts.' },
        { role: 'user', content: prompt }
      ]);

      const journalPrompt = JSON.parse(response.choices[0].message.content);
      
      return {
        id: `journal_${Date.now()}`,
        ...journalPrompt
      };
    } catch (error) {
      console.error('Error generating journal prompt:', error);
      return this.fallbackJournalPrompt();
    }
  }

  // Exposure Therapy Simulator
  async generateExposureExercise(userId: string, fear: string, intensity: number): Promise<BehavioralActivity> {
    try {
      const prompt = `
        Create a graded exposure exercise for ${fear} at intensity level ${intensity}/10.
        
        Include:
        - Progressive steps
        - Safety considerations
        - Coping strategies
        - Progress tracking
        - Expected outcomes
        
        Make it safe and effective for gradual exposure.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are an exposure therapy specialist creating graded exposure exercises.' },
        { role: 'user', content: prompt }
      ]);

      const exercise = JSON.parse(response.choices[0].message.content);
      
      return {
        id: `exposure_${Date.now()}`,
        ...exercise
      };
    } catch (error) {
      console.error('Error generating exposure exercise:', error);
      return this.fallbackBehavioralActivity();
    }
  }

  // Skills Training Modules
  async generateSkillsModule(userId: string, framework: string, targetSkill: string): Promise<SkillsTrainingModule> {
    try {
      const prompt = `
        Create a ${framework} skills training module for ${targetSkill}.
        
        Include:
        - Multiple learning modules
        - Practical exercises
        - Progress tracking
        - Real-world applications
        
        Make it comprehensive and skill-building.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a skills training specialist creating therapeutic modules.' },
        { role: 'user', content: prompt }
      ]);

      const skillsModule = JSON.parse(response.choices[0].message.content);
      
      return {
        id: `skills_${Date.now()}`,
        ...skillsModule
      };
    } catch (error) {
      console.error('Error generating skills module:', error);
      return this.fallbackSkillsModule();
    }
  }

  // Crisis Coping Toolkit
  async generateCrisisPlan(userId: string, riskFactors: string[], protectiveFactors: string[]): Promise<CrisisPreventionPlan> {
    try {
      const prompt = `
        Create a crisis prevention plan for someone with risk factors: ${riskFactors.join(', ')} and protective factors: ${protectiveFactors.join(', ')}.
        
        Include:
        - Trigger identification
        - Early warning signs
        - Coping strategies
        - Support contacts
        - Emergency resources
        - Safety plan
        
        Make it comprehensive and actionable.
      `;

      const response = await openRouterChatCompletion([
        { role: 'system', content: 'You are a crisis intervention specialist creating safety plans.' },
        { role: 'user', content: prompt }
      ]);

      const plan = JSON.parse(response.choices[0].message.content);
      
      return plan;
    } catch (error) {
      console.error('Error generating crisis plan:', error);
      return this.fallbackCrisisPlan();
    }
  }

  // Get available therapeutic tools
  async getTherapeuticTools(userId: string, category?: string): Promise<TherapeuticTool[]> {
    const tools: TherapeuticTool[] = [
      {
        id: 'cbt_thought_record',
        name: 'Thought Record Worksheet',
        category: 'cbt',
        description: 'Identify and challenge negative thoughts',
        duration: 15,
        difficulty: 3,
        effectiveness: 0.85,
        userRating: 4.5,
        usageCount: 150,
        lastUsed: new Date()
      },
      {
        id: 'mindfulness_breathing',
        name: 'Breathing Meditation',
        category: 'mindfulness',
        description: 'Calm your nervous system with guided breathing',
        duration: 10,
        difficulty: 2,
        effectiveness: 0.78,
        userRating: 4.3,
        usageCount: 89,
        lastUsed: new Date()
      },
      {
        id: 'exposure_social_anxiety',
        name: 'Social Anxiety Exposure',
        category: 'exposure',
        description: 'Gradual exposure to social situations',
        duration: 30,
        difficulty: 7,
        effectiveness: 0.82,
        userRating: 4.1,
        usageCount: 45,
        lastUsed: new Date()
      },
      {
        id: 'dbt_distress_tolerance',
        name: 'DBT Distress Tolerance',
        category: 'skills_training',
        description: 'Learn to tolerate difficult emotions',
        duration: 20,
        difficulty: 5,
        effectiveness: 0.79,
        userRating: 4.4,
        usageCount: 67,
        lastUsed: new Date()
      },
      {
        id: 'crisis_grounding',
        name: 'Grounding Techniques',
        category: 'crisis',
        description: 'Immediate crisis intervention tools',
        duration: 5,
        difficulty: 1,
        effectiveness: 0.88,
        userRating: 4.7,
        usageCount: 234,
        lastUsed: new Date()
      }
    ];

    if (category) {
      return tools.filter(tool => tool.category === category);
    }

    return tools;
  }

  // Track tool usage and effectiveness
  async trackToolUsage(userId: string, toolId: string, effectiveness: number, feedback: string) {
    // Implementation for tracking tool usage
    console.log('Tracking tool usage:', { userId, toolId, effectiveness, feedback });
  }

  // Fallback implementations
  private fallbackWellnessPlan(userId: string): WellnessPlan {
    return {
      userId,
      date: new Date(),
      therapeuticExercises: [this.fallbackCBTExercise()],
      mindfulness: [this.fallbackMindfulnessSession()],
      journaling: [this.fallbackJournalPrompt()],
      behavioral: [this.fallbackBehavioralActivity()],
      sleepOptimization: {
        bedtime: '10:00 PM',
        wakeTime: '7:00 AM',
        sleepHygiene: ['Avoid screens 1 hour before bed', 'Keep room cool and dark'],
        relaxationTechniques: ['Progressive muscle relaxation', 'Deep breathing'],
        environmentalOptimization: ['Use white noise', 'Keep room temperature cool'],
        sleepTracking: true
      },
      nutritionGuidance: {
        mealTiming: {
          breakfast: '8:00 AM',
          lunch: '12:30 PM',
          dinner: '7:00 PM',
          snacks: ['10:30 AM', '3:00 PM']
        },
        moodSupportingFoods: ['Omega-3 rich foods', 'Complex carbohydrates', 'Lean proteins'],
        foodsToLimit: ['Caffeine after 2 PM', 'Processed sugars'],
        hydrationGoal: 2.5,
        supplements: ['Vitamin D', 'B-complex vitamins']
      },
      socialConnection: [{
        id: 'social_1',
        type: 'support_group',
        title: 'Online Support Group',
        description: 'Connect with others experiencing similar challenges',
        duration: 60,
        socialIntensity: 'medium',
        benefits: ['Reduced isolation', 'Shared experiences', 'Coping strategies'],
        accessibility: ['Available 24/7', 'Anonymous participation']
      }],
      crisisPrevention: this.fallbackCrisisPlan()
    };
  }

  private fallbackCBTExercise(): CBTExercise {
    return {
      id: 'cbt_fallback',
      type: 'thought_record',
      title: 'Thought Record Worksheet',
      description: 'Identify and challenge negative thoughts',
      instructions: [
        'Write down the situation that triggered your thought',
        'Record your automatic thought',
        'Rate your belief in the thought (0-100%)',
        'Identify evidence for and against the thought',
        'Generate a more balanced thought',
        'Rate your belief in the new thought'
      ],
      duration: 15,
      difficulty: 'beginner',
      targetSymptoms: ['anxiety', 'depression', 'negative thinking'],
      expectedOutcome: 'Reduced intensity of negative thoughts',
      homework: 'Practice this exercise daily for one week',
      aiAssistance: true
    };
  }

  private fallbackMindfulnessSession(): MindfulnessSession {
    return {
      id: 'mindfulness_fallback',
      type: 'breathing',
      title: '5-Minute Breathing Meditation',
      description: 'A simple breathing exercise to calm your nervous system',
      duration: 5,
      guided: true,
      instructions: [
        'Find a comfortable seated position',
        'Close your eyes or soften your gaze',
        'Take a deep breath in through your nose',
        'Hold for a moment',
        'Exhale slowly through your mouth',
        'Continue this pattern for 5 minutes'
      ],
      targetBenefits: ['Reduced anxiety', 'Improved focus', 'Better sleep'],
      contraindications: ['Severe breathing difficulties']
    };
  }

  private fallbackJournalPrompt(): JournalPrompt {
    return {
      id: 'journal_fallback',
      type: 'reflection',
      title: 'Daily Reflection',
      prompt: 'What was the most challenging moment of your day, and how did you handle it?',
      followUpQuestions: [
        'What emotions did you experience?',
        'What thoughts went through your mind?',
        'How did you cope with the situation?',
        'What would you do differently next time?'
      ],
      expectedInsights: ['Pattern recognition', 'Coping strategy identification', 'Growth opportunities'],
      therapeuticFramework: 'Cognitive Behavioral Therapy'
    };
  }

  private fallbackBehavioralActivity(): BehavioralActivity {
    return {
      id: 'behavioral_fallback',
      type: 'behavioral_activation',
      title: 'Pleasant Activity Scheduling',
      description: 'Schedule enjoyable activities to improve mood',
      duration: 30,
      difficulty: 4,
      targetGoals: ['Improved mood', 'Increased motivation', 'Better daily structure'],
      stepByStepInstructions: [
        'List 10 activities you used to enjoy',
        'Rate each activity on a scale of 1-10',
        'Schedule 2-3 activities for tomorrow',
        'Complete the activities as planned',
        'Rate your mood before and after each activity'
      ],
      safetyConsiderations: ['Start with low-intensity activities', 'Don\'t overcommit'],
      progressTracking: ['Mood ratings', 'Activity completion', 'Enjoyment levels']
    };
  }

  private fallbackSkillsModule(): SkillsTrainingModule {
    return {
      id: 'skills_fallback',
      name: 'Basic DBT Skills',
      framework: 'DBT',
      description: 'Learn fundamental Dialectical Behavior Therapy skills',
      modules: [
        {
          id: 'module_1',
          title: 'Mindfulness Basics',
          content: ['What is mindfulness?', 'Benefits of mindfulness', 'Basic mindfulness exercises'],
          exercises: ['Mindful breathing', 'Body scan', 'Mindful walking'],
          duration: 20,
          prerequisites: []
        }
      ],
      totalDuration: 60,
      progress: 0
    };
  }

  private fallbackCrisisPlan(): CrisisPreventionPlan {
    return {
      triggers: ['Work stress', 'Relationship conflicts', 'Financial worries'],
      earlyWarningSigns: ['Difficulty sleeping', 'Increased irritability', 'Withdrawal from activities'],
      copingStrategies: ['Deep breathing', 'Progressive muscle relaxation', 'Calling a friend'],
      supportContacts: [
        {
          name: 'Emergency Contact',
          relationship: 'Family member',
          phone: '555-0123',
          availability: '24/7'
        }
      ],
      emergencyResources: [
        {
          name: 'Crisis Hotline',
          phone: '988',
          description: '24/7 suicide prevention and crisis support'
        }
      ],
      safetyPlan: [
        'Remove access to harmful items',
        'Call crisis hotline if needed',
        'Go to emergency room if in immediate danger'
      ]
    };
  }
}

const wellnessEcosystemService = new WellnessEcosystemService();
export default wellnessEcosystemService; 