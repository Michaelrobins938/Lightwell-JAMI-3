// Enhanced Jamie Core - Clean, Conversational AI Companion
// This file stitches together all the focused prompts for natural conversation

import { openRouterChatCompletion } from '../services/openRouterService';
import memoryService from '../services/memoryService';
import { 
  JAMIE_CORE_SYSTEM_PROMPT as JAMIE_SYSTEM_PROMPT, 
  SAFETY_PRE_PROMPT as JAMIE_CONVERSATION_STYLE, 
  PSYCHOSIS_SAFETY_PROTOCOLS as JAMIE_BOUNDARIES 
} from './jamie_core_system_prompt';
import { 
  CRISIS_INTERVENTION_PROMPT, 
  CRISIS_DETECTION_RULES 
} from './crisis_intervention_system';
import { 
  CRISIS_DETECTION_PROMPT, 
  CRISIS_KEYWORDS 
} from './advanced_crisis_detection';
import { TECHNIQUE_PROMPT } from './therapeutic_technique_selector';
import { EMPATHY_PROMPT } from './empathy-response';
import { RESPONSIBLE_AI_PROMPT } from './responsible_ai_governance';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface MemoryContext {
  recentMemories: any[];
  userProfile: any;
  conversationContext: string;
}

export class EnhancedJamieCore {
  private crisisDetection: any; // Placeholder, actual logic is in detectCrisis

  constructor() {
    this.crisisDetection = null; // Not directly used as a class instance here
  }

  async generateResponse(
    userInput: string,
    conversationHistory: any[] = [],
    userProfile?: any
  ): Promise<{
    response: string;
    crisisDetected: boolean;
    crisisLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    technique: string;
    empathy: string;
  }> {
    try {
      // Step 1: Retrieve relevant memories and context
      const memoryContext = await this.retrieveMemoryContext(userInput, conversationHistory, userProfile);
      
      // Step 2: Crisis Detection
      const crisisLevel = this.detectCrisis(userInput);
      
      // Step 3: Build the complete prompt with memory context
      const fullPrompt = this.buildCompletePrompt(
        userInput, 
        conversationHistory, 
        crisisLevel,
        memoryContext
      );

      // Step 4: Generate response using OpenRouter LLM service
      const response = await this.generateLLMResponse(fullPrompt, userInput);

      // Step 5: Store the interaction in memory
      await this.storeInteraction(userInput, response, crisisLevel, memoryContext);

      // Step 6: Post-process and return
      return {
        response: this.postProcessResponse(response, crisisLevel),
        crisisDetected: crisisLevel !== 'NONE',
        crisisLevel,
        technique: this.selectTechnique(userInput),
        empathy: this.generateEmpathy(userInput)
      };
    } catch (error) {
      console.error('EnhancedJamieCore error:', error);
      // Return fallback response if everything fails
      return {
        response: this.generateFallbackResponse(userInput),
        crisisDetected: false,
        crisisLevel: 'NONE',
        technique: 'Fallback Support',
        empathy: 'I hear you, and I\'m here for you.'
      };
    }
  }

  /**
   * Retrieve relevant memories and context for the conversation
   */
  private async retrieveMemoryContext(
    userInput: string, 
    conversationHistory: any[], 
    userProfile?: any
  ): Promise<MemoryContext> {
    try {
      // Get recent memories related to the current conversation
      const recentMemories = await memoryService.retrieveMemories({
        userId: userProfile?.userId || 'anonymous',
        type: 'conversation',
        limit: 5
      });

      // Build conversation context from recent messages
      const conversationContext = conversationHistory
        .slice(-5) // Last 5 messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join(' | ');
      
      return {
        recentMemories: recentMemories || [],
        userProfile: userProfile || {},
        conversationContext
      };
    } catch (error) {
      console.warn('Memory retrieval failed, continuing without context:', error);
      return {
        recentMemories: [],
        userProfile: userProfile || {},
        conversationContext: conversationHistory
          .slice(-3)
          .map(msg => `${msg.role}: ${msg.content}`)
          .join(' | ')
      };
    }
  }

  /**
   * Store the interaction in memory for future context
   */
  private async storeInteraction(
    userInput: string,
    aiResponse: string,
    crisisLevel: string,
    memoryContext: MemoryContext
  ): Promise<void> {
    try {
      await memoryService.storeMemory({
        userId: memoryContext.userProfile?.userId || 'anonymous',
        type: 'conversation',
        content: `User: ${userInput} | Jamie: ${aiResponse}`,
        importance: 7, // Medium-high importance for conversation memories
        metadata: {
          crisisLevel,
          timestamp: new Date().toISOString(),
          context: memoryContext.conversationContext,
          technique: this.selectTechnique(userInput),
          empathy: this.generateEmpathy(userInput)
        },
        tags: ['jamie-conversation', 'ai-companion']
      });
    } catch (error) {
      console.warn('Failed to store memory, continuing:', error);
    }
  }

  /**
   * Detect crisis level using the clean detection system
   */
  private detectCrisis(userInput: string): 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' {
    const input = userInput.toLowerCase();
    
    // Check for HIGH risk indicators
    for (const keyword of CRISIS_KEYWORDS.HIGH_RISK) {
      if (input.includes(keyword)) {
        return 'HIGH';
      }
    }
    
    // Check for MEDIUM risk indicators
    for (const keyword of CRISIS_KEYWORDS.MEDIUM_RISK) {
      if (input.includes(keyword)) {
        return 'MEDIUM';
      }
    }
    
    // Check for LOW risk indicators
    for (const keyword of CRISIS_KEYWORDS.LOW_RISK) {
      if (input.includes(keyword)) {
        return 'LOW';
      }
    }
    
    return 'NONE';
  }

  /**
   * Build the complete prompt by stitching together all components
   */
  private buildCompletePrompt(
    userInput: string,
    conversationHistory: any[],
    crisisLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH',
    memoryContext: MemoryContext
  ): string {
    let prompt = '';

    // Core personality and behavior
    prompt += JAMIE_SYSTEM_PROMPT + '\n\n';
    prompt += JAMIE_CONVERSATION_STYLE + '\n\n';
    prompt += JAMIE_BOUNDARIES + '\n\n';

    // Crisis handling (only if crisis detected)
    if (crisisLevel === 'HIGH') {
      prompt += CRISIS_INTERVENTION_PROMPT + '\n\n';
    } else if (crisisLevel === 'MEDIUM') {
      prompt += CRISIS_DETECTION_RULES + '\n\n';
    }

    // Therapeutic approach
    prompt += TECHNIQUE_PROMPT + '\n\n';

    // Empathy and emotional support
    prompt += EMPATHY_PROMPT + '\n\n';

    // Safety and governance
    prompt += RESPONSIBLE_AI_PROMPT + '\n\n';

    // MEMORY INTEGRATION: Add relevant memories and context
    if (memoryContext.recentMemories.length > 0) {
      prompt += `Recent relevant memories:\n`;
      memoryContext.recentMemories.forEach((memory, index) => {
        prompt += `${index + 1}. ${memory.content}\n`;
      });
      prompt += '\n';
    }

    // Conversation context
    if (memoryContext.conversationContext) {
      prompt += `Recent conversation context: ${memoryContext.conversationContext}\n\n`;
    }

    // User profile context
    if (memoryContext.userProfile && Object.keys(memoryContext.userProfile).length > 0) {
      prompt += `User context: ${JSON.stringify(memoryContext.userProfile)}\n\n`;
    }

    // Current user input
    prompt += `User's current message: "${userInput}"\n\n`;
    prompt += `Please respond as Jamie, following all the guidelines above. `;
    
    if (crisisLevel === 'HIGH') {
      prompt += `This is a HIGH RISK situation - provide crisis resources once, then return to supportive conversation.`;
    } else if (crisisLevel === 'MEDIUM') {
      prompt += `This is a MEDIUM RISK situation - stay supportive and encourage professional help, but no hotlines unless asked.`;
    } else {
      prompt += `This is a normal conversation - focus on warmth, empathy, and natural dialogue. Use the memory context to make responses more personal and relevant.`;
    }

    return prompt;
  }

  /**
   * Generate LLM response using OpenRouter service
   */
  private async generateLLMResponse(prompt: string, userInput: string): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: prompt },
        { role: 'user', content: userInput }
      ];

      const response = await openRouterChatCompletion(messages);
      
      if (response && response.choices && response.choices[0] && response.choices[0].message) {
        return response.choices[0].message.content || '';
      }
      
      return this.generateFallbackResponse(userInput);
      
    } catch (error) {
      console.error('LLM generation failed:', error);
      return this.generateFallbackResponse(userInput);
    }
  }

  private generateFallbackResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    if (input.includes('sad') || input.includes('depressed')) {
      return "I'm sorry you're going through this. That sounds really hard.";
    } else if (input.includes('overwhelmed') || input.includes('stressed')) {
      return "That sounds overwhelming. I can imagine how heavy that must feel.";
    } else if (input.includes('anxious') || input.includes('worried')) {
      return "That sounds really stressful. I can imagine how overwhelming that must feel. Is there anything that usually helps you feel more grounded?";
    } else {
      return "I hear you, and I want to understand better. Can you tell me more about what you're experiencing?";
    }
  }

  private postProcessResponse(rawResponse: string, crisisLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'): string {
    let processedResponse = rawResponse;
    
    // Ensure crisis resources are only added once and conditionally
    if (crisisLevel === 'HIGH') {
      if (!processedResponse.includes('988') && !processedResponse.includes('crisis')) {
        processedResponse += '\n\nI want you to be safe. If you\'re in the United States and feel like you might act on these thoughts, you can dial **988** right now for the Suicide & Crisis Lifeline, or call 911 if it\'s an emergency. You\'re not alone in this.';
      }
    }
    
    // Remove any explicit disclaimers that might have slipped through
    processedResponse = processedResponse.replace(/I am an AI language model/gi, 'I am an AI companion');
    processedResponse = processedResponse.replace(/As an AI/gi, 'As your AI companion');
    processedResponse = processedResponse.replace(/I cannot provide medical advice/gi, 'I cannot provide medical advice, but I can offer support');
    
    return processedResponse.trim();
  }

  private selectTechnique(userInput: string): string {
    const input = userInput.toLowerCase();
    if (input.includes('vent')) return 'Venting Reflection';
    if (input.includes('guidance')) return 'Gentle Perspective';
    if (input.includes('coping')) return 'Grounding Suggestion';
    if (input.includes('curious')) return 'Open-ended Exploration';
    return 'Supportive Conversation';
  }

  private generateEmpathy(userInput: string): string {
    const input = userInput.toLowerCase();
    if (input.includes('frustrat')) return "That sounds really frustrating. I can see why you'd feel that way.";
    if (input.includes('sad')) return "I'm sorry you're going through this. That sounds really hard.";
    if (input.includes('overwhelm')) return "That sounds overwhelming. I can imagine how heavy that must feel.";
    if (input.includes('anxi')) return "That sounds really stressful. I can imagine how overwhelming that must feel. Is there anything that usually helps you feel more grounded?";
    if (input.includes('die') || input.includes('died') || input.includes('loss') || input.includes('grief')) return "I'm so sorry for your loss. That kind of pain is unimaginable, and I want you to know that your feelings are completely valid.";
    return "I hear you, and I'm here for you.";
  }
} 