import { openAIChatCompletion } from '../services/openAIService';
import { openRouterChatCompletion } from '../services/openRouterService';
import { JamieSafeCore } from './jamie_safe_core';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface EmotionalState {
  primaryEmotion: string;
  intensity: number;
  secondaryEmotions: string[];
  triggers: string[];
  somaticSymptoms: string[];
  cognitivePatterns: string[];
}

interface CrisisAssessment {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  triggers: string[];
  recommendations: string[];
}

class JamieResponseGenerator {
  private safeCore: JamieSafeCore;

  constructor() {
    this.safeCore = new JamieSafeCore();
  }

  public async generateResponse(
    userId: string, 
    userInput: string, 
    conversationHistory: ConversationMessage[] = [],
    emotionalState?: EmotionalState
  ): Promise<{
    response: string;
    emotionalAssessment?: EmotionalState;
    crisisAssessment?: CrisisAssessment;
    therapeuticIntervention?: string;
  }> {
    try {
      // Use the safe core for reliable operation
      const result = await this.safeCore.generateSafeResponse(
        userId, 
        userInput
      );

      return {
        response: result.response,
        emotionalAssessment: result.crisisDetected ? {
          primaryEmotion: 'distress',
          intensity: 8,
          secondaryEmotions: [],
          triggers: [],
          somaticSymptoms: [],
          cognitivePatterns: []
        } : undefined,
        crisisAssessment: result.safetyStatus === 'critical' ? {
          level: 'high',
          confidence: result.confidence,
          triggers: [],
          recommendations: ['Contact crisis hotline', 'Seek professional help']
        } : { level: 'none', confidence: 0, triggers: [], recommendations: [] },
        therapeuticIntervention: 'AI therapeutic support with safety protocols'
      };

    } catch (error) {
      console.error('Jamie Response Generation Error:', error);
      return {
        response: "I apologize for the technical difficulty. Your concerns are important to me. Can you share more about what you're feeling right now?",
        emotionalAssessment: emotionalState,
        crisisAssessment: { level: 'none', confidence: 0, triggers: [], recommendations: [] }
      };
    }
  }

  private generateSystemPrompt(): string {
    return `You are Jamie, an AI mental health counselor with expertise in cognitive behavioral therapy, attachment theory, and various therapeutic modalities. Your primary goal is to provide empathetic, ethical, and personalized support to users seeking mental health guidance.

CORE PRINCIPLES:
1. **Empathy First**: Always lead with strong empathy and validation of the user's feelings
2. **Safety Priority**: Be vigilant for signs of crisis or self-harm, responding with appropriate support and resources
3. **Practical Support**: Provide direct, actionable guidance tailored to the user's specific situation
4. **Structured Approach**: Offer clear structure for the conversation with specific, actionable steps
5. **Self-Reflection**: Encourage self-reflection with targeted questions about experiences, strengths, and aspirations
6. **Coping Strategies**: Suggest concrete coping strategies and self-care techniques relevant to concerns
7. **Open Dialogue**: Maintain supportive dialogue, consistently offering to explore topics further
8. **Professional Resources**: Present professional resources as additional options, not primary solutions
9. **Active Listening**: Demonstrate deep understanding through active listening techniques
10. **Accessible Language**: Incorporate therapeutic knowledge sensitively, avoiding clinical jargon
11. **Non-Judgmental**: Maintain supportive, non-judgmental tone throughout

RESPONSE STRUCTURE:
- Start with empathy and validation
- Address the specific concern or question
- Provide practical guidance or coping strategies
- Ask follow-up questions to encourage exploration
- End with support and invitation to continue

CRISIS DETECTION:
Monitor for signs of:
- Suicidal thoughts or self-harm
- Severe depression or anxiety
- Substance abuse
- Domestic violence
- Eating disorders
- Psychosis

If crisis detected, immediately provide:
- Validation and support
- Crisis resources (988 Suicide & Crisis Lifeline, Crisis Text Line)
- Encouragement to seek professional help
- Safety planning if appropriate

RESPONSE FORMAT:
Provide your response naturally, but if you detect crisis indicators, include structured data like:
[CRISIS_LEVEL: high|medium|low|none]
[RECOMMENDATIONS: specific crisis resources and actions]`;
  }

  private buildConversationContext(
    conversationHistory: ConversationMessage[], 
    emotionalState?: EmotionalState
  ): string {
    let context = '';
    
    if (emotionalState) {
      context += `\nCurrent Emotional State: ${emotionalState.primaryEmotion} (intensity: ${emotionalState.intensity}/10)`;
      if (emotionalState.secondaryEmotions.length > 0) {
        context += `\nSecondary emotions: ${emotionalState.secondaryEmotions.join(', ')}`;
      }
      if (emotionalState.triggers.length > 0) {
        context += `\nTriggers: ${emotionalState.triggers.join(', ')}`;
      }
    }

    if (conversationHistory.length > 0) {
      context += '\n\nRecent conversation context:';
      const recentMessages = conversationHistory.slice(-6); // Last 6 messages
      recentMessages.forEach((msg, index) => {
        context += `\n${msg.role === 'user' ? 'User' : 'Jamie'}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`;
      });
    }

    return context;
  }

  private generateUserPrompt(userInput: string, conversationContext: string): string {
    return `User Input: ${userInput}

${conversationContext}

Please provide a thoughtful, empathetic, and therapeutically appropriate response that:
1. Directly addresses the user's concerns
2. Provides actionable support and guidance
3. Encourages further exploration of their feelings and situation
4. Maintains appropriate therapeutic boundaries
5. Includes crisis assessment if needed`;
  }

  private parseStructuredResponse(response: string): {
    cleanResponse: string;
    emotionalAssessment?: EmotionalState;
    crisisAssessment?: CrisisAssessment;
    therapeuticIntervention?: string;
  } {
    let cleanResponse = response;
    let emotionalAssessment: EmotionalState | undefined;
    let crisisAssessment: CrisisAssessment | undefined;
    let therapeuticIntervention: string | undefined;

    // Extract crisis level if present
    const crisisMatch = response.match(/\[CRISIS_LEVEL:\s*(high|medium|low|none)\]/i);
    if (crisisMatch) {
      const level = crisisMatch[1].toLowerCase() as 'high' | 'medium' | 'low' | 'none';
      crisisAssessment = {
        level,
        confidence: 0.8,
        triggers: [],
        recommendations: level !== 'none' ? [
          'Consider reaching out to a mental health professional',
          'Call 988 for crisis support if needed',
          'Practice grounding techniques',
          'Reach out to trusted friends or family'
        ] : []
      };
      cleanResponse = cleanResponse.replace(/\[CRISIS_LEVEL:[^\]]+\]/gi, '').trim();
    }

    // Extract recommendations if present
    const recommendationsMatch = response.match(/\[RECOMMENDATIONS:\s*([^\]]+)\]/i);
    if (recommendationsMatch && crisisAssessment) {
      crisisAssessment.recommendations = recommendationsMatch[1].split(',').map(r => r.trim());
      cleanResponse = cleanResponse.replace(/\[RECOMMENDATIONS:[^\]]+\]/gi, '').trim();
    }

    // Extract therapeutic intervention if present
    const interventionMatch = response.match(/\[INTERVENTION:\s*([^\]]+)\]/i);
    if (interventionMatch) {
      therapeuticIntervention = interventionMatch[1].trim();
      cleanResponse = cleanResponse.replace(/\[INTERVENTION:[^\]]+\]/gi, '').trim();
    }

    return {
      cleanResponse,
      emotionalAssessment,
      crisisAssessment,
      therapeuticIntervention
    };
  }

  public async assessCrisis(userInput: string, emotionalState?: EmotionalState): Promise<CrisisAssessment> {
    try {
      const crisisPrompt = `Assess the following user input for crisis indicators:

User Input: "${userInput}"
${emotionalState ? `Emotional State: ${emotionalState.primaryEmotion} (intensity: ${emotionalState.intensity}/10)` : ''}

Crisis indicators to look for:
- Suicidal thoughts or self-harm
- Severe depression or anxiety
- Substance abuse
- Domestic violence
- Eating disorders
- Psychosis
- Hopelessness
- Isolation

Respond with ONLY the crisis level: none, low, medium, high, or critical.`;

      let response;
      
      try {
        // Try OpenAI first
        response = await openAIChatCompletion([
          { role: 'system', content: 'You are a crisis assessment AI. Respond with only the crisis level.' },
          { role: 'user', content: crisisPrompt }
        ]);
      } catch (openAIError) {
        console.warn('OpenAI failed for crisis assessment, trying OpenRouter:', openAIError);
        
        try {
          // Fallback to OpenRouter
          response = await openRouterChatCompletion([
            { role: 'system', content: 'You are a crisis assessment AI. Respond with only the crisis level.' },
            { role: 'user', content: crisisPrompt }
          ], 'openai/gpt-4o-mini');
        } catch (openRouterError) {
          console.error('Both OpenAI and OpenRouter failed for crisis assessment:', { openAIError, openRouterError });
          return {
            level: 'none',
            confidence: 0,
            triggers: [],
            recommendations: []
          };
        }
      }

      const level = (response?.choices?.[0]?.message?.content || 'none').trim().toLowerCase();
      
      const validLevels = ['none', 'low', 'medium', 'high', 'critical'];
      const crisisLevel = validLevels.includes(level) ? level as 'none' | 'low' | 'medium' | 'high' | 'critical' : 'none';

      return {
        level: crisisLevel,
        confidence: 0.7,
        triggers: [],
        recommendations: crisisLevel !== 'none' ? [
          'Consider reaching out to a mental health professional',
          'Call 988 for crisis support if needed',
          'Practice grounding techniques',
          'Reach out to trusted friends or family'
        ] : []
      };

    } catch (error) {
      console.error('Crisis assessment error:', error);
      return {
        level: 'none',
        confidence: 0,
        triggers: [],
        recommendations: []
      };
    }
  }
}

export default JamieResponseGenerator;