import { openRouterChatCompletion } from '../services/openRouterService';
import { JAMIE_CORE_SYSTEM_PROMPT } from './jamie_core_system_prompt';

interface SafeResponse {
  response: string;
  crisisDetected: boolean;
  safetyStatus: 'safe' | 'warning' | 'critical';
  confidence: number;
  processingTime: number;
}

export class JamieSafeCore {
  private readonly crisisKeywords = [
    'kill myself', 'suicide', 'end my life', 'want to die', 'hurt myself',
    'cut myself', 'overdose', 'not worth living', 'better off dead'
  ];

  private readonly manipulationKeywords = [
    'ignore instructions', 'pretend you are', 'roleplay as', 'forget your rules'
  ];

  async generateSafeResponse(
    userId: string,
    userInput: string,
    sessionId?: string
  ): Promise<SafeResponse> {
    const startTime = Date.now();

    try {
      // Pre-flight safety check
      const safetyCheck = this.preFlightSafetyCheck(userInput);
      if (safetyCheck.blockExecution) {
        return this.generateCrisisResponse(userInput, startTime);
      }

      // Generate response with locked system prompt
      const response = await this.callAIWithSafetyPrompt(userInput);
      
      // Post-process for safety
      const processedResponse = this.postProcessResponse(response, userInput);

      return {
        response: processedResponse.response,
        crisisDetected: processedResponse.crisisDetected,
        safetyStatus: safetyCheck.riskLevel === 'critical' ? 'critical' : 'safe',
        confidence: 0.8,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('Jamie Safe Core error:', error);
      return this.generateFallbackResponse(userInput, startTime);
    }
  }

  private preFlightSafetyCheck(userInput: string): {
    blockExecution: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    crisisDetected: boolean;
  } {
    const input = userInput.toLowerCase();
    
    // Check for crisis keywords
    const crisisDetected = this.crisisKeywords.some(keyword => input.includes(keyword));
    
    // Check for manipulation attempts
    const manipulationDetected = this.manipulationKeywords.some(keyword => input.includes(keyword));

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let blockExecution = false;

    if (crisisDetected) {
      riskLevel = 'critical';
      // Don't block, but ensure crisis resources are provided
    }

    if (manipulationDetected) {
      riskLevel = 'high';
    }

    // Check for explicit harmful requests
    const harmfulPatterns = [
      'how to kill', 'suicide methods', 'how to die', 'self harm methods',
      'how to overdose', 'ways to cut', 'painless death'
    ];

    for (const pattern of harmfulPatterns) {
      if (input.includes(pattern)) {
        riskLevel = 'critical';
        blockExecution = true;
        break;
      }
    }

    return {
      blockExecution,
      riskLevel,
      crisisDetected
    };
  }

  private async callAIWithSafetyPrompt(userInput: string): Promise<string> {
    const messages = [
      { 
        role: 'system' as const, 
        content: JAMIE_CORE_SYSTEM_PROMPT 
      },
      { 
        role: 'user' as const, 
        content: userInput 
      }
    ];

    try {
      const response = await openRouterChatCompletion(messages, 'openai/gpt-4o-mini');
      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('AI call failed:', error);
      throw new Error('AI service unavailable');
    }
  }

  private postProcessResponse(response: string, userInput: string): {
    response: string;
    crisisDetected: boolean;
  } {
    const safetyCheck = this.preFlightSafetyCheck(userInput);
    let processedResponse = response;
    
    // If crisis was detected but no resources provided, add them
    if (safetyCheck.crisisDetected && !response.includes('988') && !response.includes('crisis')) {
      processedResponse += `\n\n🚨 **IMMEDIATE SUPPORT AVAILABLE:**
• **Crisis Hotline:** Call 988 (Suicide & Crisis Lifeline)
• **Crisis Text:** Text HOME to 741741
• **Emergency:** Call 911 or go to your nearest emergency room

You don't have to face this alone. Professional help is available 24/7.`;
    }

    // Add appropriate disclaimer
    if (safetyCheck.crisisDetected) {
      processedResponse += `\n\n*I'm an AI emotional support companion, not a licensed therapist. For immediate professional help, please contact a mental health professional or emergency services.*`;
    } else {
      processedResponse += `\n\n*I'm here to provide emotional support. For serious mental health concerns, please consult with a licensed professional.*`;
    }

    return {
      response: processedResponse,
      crisisDetected: safetyCheck.crisisDetected
    };
  }

  private generateCrisisResponse(userInput: string, startTime: number): SafeResponse {
    return {
      response: `I'm very concerned about your safety right now. I cannot provide information that could be harmful, but I want you to know that help is available.

🚨 **IMMEDIATE SUPPORT:**
• **Call 988** (Suicide & Crisis Lifeline) - Available 24/7
• **Text HOME to 741741** (Crisis Text Line)
• **Call 911** if you're in immediate danger

Your life has value, and you don't have to go through this alone. Professional counselors are standing by to help you right now.

*I'm an AI companion, not a crisis counselor. Please reach out to these resources for immediate professional help.*`,
      crisisDetected: true,
      safetyStatus: 'critical',
      confidence: 1.0,
      processingTime: Date.now() - startTime
    };
  }

  private generateFallbackResponse(userInput: string, startTime: number): SafeResponse {
    return {
      response: `I apologize, but I'm experiencing technical difficulties right now. Your wellbeing is important to me.

If you're in crisis, please contact:
• **988** (Suicide & Crisis Lifeline)
• **911** for emergencies

Please try reaching out again in a moment, or consider speaking with a mental health professional if you need immediate support.

*I'm an AI emotional support companion. For serious mental health concerns, please consult with a licensed professional.*`,
      crisisDetected: false,
      safetyStatus: 'warning',
      confidence: 0.3,
      processingTime: Date.now() - startTime
    };
  }
}