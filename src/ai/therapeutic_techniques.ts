export interface TherapeuticTechnique {
  id: string;
  name: string;
  category: 'cbt' | 'mindfulness' | 'dbt' | 'act' | 'trauma' | 'crisis' | 'general';
  description: string;
  steps: string[];
  whenToUse: string[];
  contraindications: string[];
  effectiveness: number; // 0-100
}

export interface CopingStrategy {
  id: string;
  name: string;
  description: string;
  technique: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const therapeuticTechniques: TherapeuticTechnique[] = [
  {
    id: 'cognitive-reframing',
    name: 'Cognitive Reframing',
    category: 'cbt',
    description: 'Identify and challenge negative thought patterns to develop more balanced perspectives.',
    steps: [
      'Identify the negative thought or belief',
      'Examine the evidence for and against this thought',
      'Consider alternative explanations or perspectives',
      'Develop a more balanced and realistic thought',
      'Practice the new thought pattern regularly'
    ],
    whenToUse: [
      'When experiencing negative self-talk',
      'During periods of anxiety or depression',
      'When facing challenging situations',
      'To improve self-esteem and confidence'
    ],
    contraindications: [
      'During acute crisis situations',
      'When person is not ready to challenge beliefs'
    ],
    effectiveness: 85
  },
  {
    id: 'mindful-breathing',
    name: 'Mindful Breathing',
    category: 'mindfulness',
    description: 'Focus on the breath to anchor yourself in the present moment and reduce stress.',
    steps: [
      'Find a comfortable position',
      'Close your eyes or soften your gaze',
      'Take a deep breath in through your nose',
      'Exhale slowly through your mouth',
      'Focus on the sensation of breathing',
      'When your mind wanders, gently return to the breath'
    ],
    whenToUse: [
      'When feeling overwhelmed or stressed',
      'Before important events or decisions',
      'To improve focus and concentration',
      'As a daily relaxation practice'
    ],
    contraindications: [
      'If breathing causes panic or anxiety',
      'During respiratory distress'
    ],
    effectiveness: 80
  },
  {
    id: 'progressive-relaxation',
    name: 'Progressive Muscle Relaxation',
    category: 'general',
    description: 'Systematically tense and relax muscle groups to reduce physical tension and anxiety.',
    steps: [
      'Start with your toes and feet',
      'Tense the muscles for 5-7 seconds',
      'Release and feel the relaxation for 10-15 seconds',
      'Move up to calves, thighs, abdomen, chest, arms, hands, neck, and face',
      'Focus on the contrast between tension and relaxation'
    ],
    whenToUse: [
      'When experiencing physical tension',
      'Before sleep',
      'During anxiety or panic attacks',
      'To reduce stress-related symptoms'
    ],
    contraindications: [
      'If you have muscle injuries',
      'During pregnancy (consult healthcare provider)'
    ],
    effectiveness: 75
  },
  {
    id: 'grounding-54321',
    name: '5-4-3-2-1 Grounding',
    category: 'crisis',
    description: 'Use your five senses to anchor yourself in the present moment during distress.',
    steps: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste'
    ],
    whenToUse: [
      'During panic attacks',
      'When feeling dissociated',
      'During flashbacks or trauma responses',
      'When overwhelmed by emotions'
    ],
    contraindications: [
      'If it increases distress',
      'During active crisis requiring immediate intervention'
    ],
    effectiveness: 90
  },
  {
    id: 'radical-acceptance',
    name: 'Radical Acceptance',
    category: 'dbt',
    description: 'Accept reality as it is, without judgment, to reduce suffering and increase peace.',
    steps: [
      'Acknowledge the reality of the situation',
      'Recognize that fighting reality only increases suffering',
      'Practice accepting what cannot be changed',
      'Focus on what you can control',
      'Develop a plan for moving forward'
    ],
    whenToUse: [
      'When facing difficult circumstances',
      'During grief or loss',
      'When dealing with chronic conditions',
      'To reduce emotional suffering'
    ],
    contraindications: [
      'When action could improve the situation',
      'During active abuse or dangerous situations'
    ],
    effectiveness: 70
  },
  {
    id: 'gratitude-practice',
    name: 'Gratitude Practice',
    category: 'general',
    description: 'Focus on positive aspects of life to improve mood and overall well-being.',
    steps: [
      'Set aside time each day for gratitude',
      'Write down 3-5 things you are grateful for',
      'Be specific and detailed in your descriptions',
      'Reflect on why these things matter to you',
      'Express gratitude to others when possible'
    ],
    whenToUse: [
      'To improve mood and outlook',
      'During difficult times',
      'As a daily wellness practice',
      'To strengthen relationships'
    ],
    contraindications: [
      'When it feels forced or inauthentic',
      'During acute depression requiring professional help'
    ],
    effectiveness: 85
  },
  {
    id: 'problem-solving',
    name: 'Structured Problem Solving',
    category: 'cbt',
    description: 'Systematically approach problems to find effective solutions and reduce overwhelm.',
    steps: [
      'Define the problem clearly',
      'Brainstorm possible solutions',
      'Evaluate the pros and cons of each option',
      'Choose the best solution',
      'Create a plan to implement it',
      'Review and adjust as needed'
    ],
    whenToUse: [
      'When facing complex decisions',
      'During periods of overwhelm',
      'To improve decision-making skills',
      'When feeling stuck or helpless'
    ],
    contraindications: [
      'During crisis situations',
      'When emotions are too intense to think clearly'
    ],
    effectiveness: 80
  },
  {
    id: 'self-compassion',
    name: 'Self-Compassion Practice',
    category: 'mindfulness',
    description: 'Treat yourself with the same kindness you would offer a friend in distress.',
    steps: [
      'Recognize when you are suffering',
      'Remind yourself that suffering is part of being human',
      'Offer yourself kind words and comfort',
      'Practice self-soothing touch if helpful',
      'Develop a compassionate inner voice'
    ],
    whenToUse: [
      'When experiencing self-criticism',
      'During difficult emotions',
      'After making mistakes',
      'To improve self-esteem'
    ],
    contraindications: [
      'When it feels forced or inauthentic',
      'During active self-harm urges'
    ],
    effectiveness: 75
  },
  {
    id: 'emotion-regulation',
    name: 'Emotion Regulation Skills',
    category: 'dbt',
    description: 'Learn to understand, accept, and manage emotions effectively.',
    steps: [
      'Identify and label your emotions',
      'Understand the function of your emotions',
      'Practice opposite action when appropriate',
      'Build positive experiences',
      'Develop healthy coping strategies'
    ],
    whenToUse: [
      'When emotions feel overwhelming',
      'To improve emotional awareness',
      'During interpersonal conflicts',
      'To build emotional resilience'
    ],
    contraindications: [
      'During crisis requiring immediate intervention',
      'When emotions are serving a protective function'
    ],
    effectiveness: 80
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification',
    category: 'act',
    description: 'Identify your core values to guide decisions and increase meaning in life.',
    steps: [
      'Reflect on what matters most to you',
      'Identify your core values and principles',
      'Consider how your actions align with values',
      'Set goals based on your values',
      'Take committed action toward your values'
    ],
    whenToUse: [
      'When feeling lost or directionless',
      'During major life decisions',
      'To increase meaning and purpose',
      'When struggling with motivation'
    ],
    contraindications: [
      'During crisis situations',
      'When values conflict with safety needs'
    ],
    effectiveness: 70
  }
];

export const copingStrategies: CopingStrategy[] = [
  {
    id: 'quick-breathing',
    name: 'Quick Breathing Reset',
    description: 'A fast breathing technique to calm your nervous system in moments of stress.',
    technique: 'Take 4 deep breaths: inhale for 4 counts, hold for 4, exhale for 4, hold for 4.',
    duration: '2-3 minutes',
    difficulty: 'easy',
    category: 'stress-relief'
  },
  {
    id: 'body-scan',
    name: 'Body Scan Meditation',
    description: 'Systematically check in with each part of your body to release tension.',
    technique: 'Focus attention on each body part from toes to head, noticing sensations.',
    duration: '10-15 minutes',
    difficulty: 'medium',
    category: 'mindfulness'
  },
  {
    id: 'journaling',
    name: 'Emotional Journaling',
    description: 'Write about your thoughts and feelings to process emotions and gain clarity.',
    technique: 'Write freely about your emotions, thoughts, and experiences without judgment.',
    duration: '15-30 minutes',
    difficulty: 'easy',
    category: 'self-reflection'
  },
  {
    id: 'movement',
    name: 'Gentle Movement',
    description: 'Use physical movement to release tension and improve mood.',
    technique: 'Walk, stretch, dance, or do gentle yoga to move your body.',
    duration: '10-30 minutes',
    difficulty: 'easy',
    category: 'physical-wellness'
  },
  {
    id: 'social-connection',
    name: 'Social Connection',
    description: 'Reach out to supportive people to reduce isolation and increase support.',
    technique: 'Call, text, or meet with friends, family, or support groups.',
    duration: 'Variable',
    difficulty: 'medium',
    category: 'social-support'
  },
  {
    id: 'creative-expression',
    name: 'Creative Expression',
    description: 'Express emotions through art, music, writing, or other creative outlets.',
    technique: 'Draw, paint, write, play music, or engage in other creative activities.',
    duration: '20-60 minutes',
    difficulty: 'medium',
    category: 'self-expression'
  }
];

export function getTechniqueById(id: string): TherapeuticTechnique | undefined {
  return therapeuticTechniques.find(technique => technique.id === id);
}

export function getTechniquesByCategory(category: string): TherapeuticTechnique[] {
  return therapeuticTechniques.filter(technique => technique.category === category);
}

export function getTechniquesForSituation(symptoms: string[]): TherapeuticTechnique[] {
  const relevantTechniques: TherapeuticTechnique[] = [];
  
  symptoms.forEach(symptom => {
    const lowerSymptom = symptom.toLowerCase();
    
    therapeuticTechniques.forEach(technique => {
      const shouldUse = technique.whenToUse.some(useCase => 
        useCase.toLowerCase().includes(lowerSymptom)
      );
      
      if (shouldUse && !relevantTechniques.find(t => t.id === technique.id)) {
        relevantTechniques.push(technique);
      }
    });
  });
  
  return relevantTechniques.sort((a, b) => b.effectiveness - a.effectiveness);
}

export function getCopingStrategyById(id: string): CopingStrategy | undefined {
  return copingStrategies.find(strategy => strategy.id === id);
}

export function getCopingStrategiesByCategory(category: string): CopingStrategy[] {
  return copingStrategies.filter(strategy => strategy.category === category);
}
