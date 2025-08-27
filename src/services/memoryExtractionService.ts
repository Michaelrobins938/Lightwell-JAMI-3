// Memory Extraction Service - Rules Engine for Therapeutic Memory
// Analyzes conversations and extracts memories with consent gating

import { secureMemoryService, MemoryProposal, MemoryType, MemoryCategory, ConsentLevel, RetentionPolicy } from './secureMemoryService';

export interface ConversationContext {
  userId: string;
  conversationId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  sessionStartTime: Date;
  currentTopic?: string;
  userEmotionalState?: string;
}

export interface ExtractionRule {
  id: string;
  name: string;
  description: string;
  pattern: RegExp | string[];
  memoryType: MemoryType;
  category: MemoryCategory;
  importance: number;
  consentLevel: ConsentLevel;
  retentionPolicy: RetentionPolicy;
  confidence: number;
  metadata?: Record<string, any>;
  conditions?: {
    minMessageLength?: number;
    emotionalIntensity?: number;
    repetitionCount?: number;
    userExplicitRequest?: boolean;
  };
}

export interface ExtractionResult {
  proposals: MemoryProposal[];
  requiresConsent: boolean[];
  confidence: number;
  reasoning: string;
}

export class MemoryExtractionService {
  private static instance: MemoryExtractionService;
  private extractionRules: ExtractionRule[];

  private constructor() {
    this.extractionRules = this.initializeRules();
  }

  public static getInstance(): MemoryExtractionService {
    if (!MemoryExtractionService.instance) {
      MemoryExtractionService.instance = new MemoryExtractionService();
    }
    return MemoryExtractionService.instance;
  }

  /**
   * Analyze conversation and extract potential memories
   */
  async extractMemories(context: ConversationContext): Promise<ExtractionResult> {
    const proposals: MemoryProposal[] = [];
    const requiresConsent: boolean[] = [];
    let totalConfidence = 0;
    let reasoning = '';

    // Analyze each message for potential memories
    for (const message of context.messages) {
      if (message.role === 'user') {
        const messageProposals = await this.analyzeUserMessage(message, context);
        proposals.push(...messageProposals.proposals);
        requiresConsent.push(...messageProposals.requiresConsent);
        totalConfidence += messageProposals.confidence;
        reasoning += messageProposals.reasoning + '; ';
      }
    }

    // Analyze conversation patterns
    const patternProposals = await this.analyzeConversationPatterns(context);
    proposals.push(...patternProposals.proposals);
    requiresConsent.push(...patternProposals.requiresConsent);
    totalConfidence += patternProposals.confidence;
    reasoning += patternProposals.reasoning + '; ';

    // Remove duplicates and merge similar proposals
    const uniqueProposals = this.deduplicateProposals(proposals);

    return {
      proposals: uniqueProposals,
      requiresConsent: uniqueProposals.map(p => this.requiresExplicitConsent(p)),
      confidence: totalConfidence / Math.max(proposals.length, 1),
      reasoning: reasoning.trim()
    };
  }

  /**
   * Analyze individual user message for memory extraction
   */
  private async analyzeUserMessage(
    message: { role: string; content: string; timestamp: Date },
    context: ConversationContext
  ): Promise<ExtractionResult> {
    const proposals: MemoryProposal[] = [];
    const requiresConsent: boolean[] = [];
    let confidence = 0;
    let reasoning = '';

    const content = message.content.toLowerCase();
    const words = content.split(/\s+/);

    // Check each extraction rule
    for (const rule of this.extractionRules) {
      const matches = this.checkRuleMatch(content, words, rule);
      
      if (matches.length > 0) {
        const proposal = this.createProposal(rule, matches, context, message);
        proposals.push(proposal);
        requiresConsent.push(this.requiresExplicitConsent(proposal));
        confidence += rule.confidence;
        reasoning += `Rule "${rule.name}" matched: ${matches.join(', ')}; `;
      }
    }

    // Check for explicit memory requests
    const explicitRequests = this.extractExplicitRequests(content);
    for (const request of explicitRequests) {
      const proposal = this.createExplicitProposal(request, context, message);
      proposals.push(proposal);
      requiresConsent.push(true); // Explicit requests always require consent
      confidence += 0.9;
      reasoning += `Explicit request: ${request.content}; `;
    }

    return { proposals, requiresConsent, confidence, reasoning };
  }

  /**
   * Analyze conversation patterns across multiple messages
   */
  private async analyzeConversationPatterns(context: ConversationContext): Promise<ExtractionResult> {
    const proposals: MemoryProposal[] = [];
    const requiresConsent: boolean[] = [];
    let confidence = 0;
    let reasoning = '';

    // Detect recurring themes
    const themes = this.detectRecurringThemes(context.messages);
    for (const theme of themes) {
      const proposal: MemoryProposal = {
        type: 'therapeutic_theme',
        category: 'therapy',
        content: theme.content,
        importance: theme.frequency >= 3 ? 8 : 6,
        emotionalValence: theme.emotionalValence,
        tags: theme.tags,
        metadata: {
          frequency: theme.frequency,
          firstMentioned: theme.firstMentioned,
          lastMentioned: theme.lastMentioned,
          isRecurring: true
        },
        consentLevel: 'inferred',
        retentionPolicy: 'therapeutic',
        source: 'ai_analysis',
        confidence: Math.min(0.8, theme.frequency * 0.2)
      };
      
      proposals.push(proposal);
      requiresConsent.push(this.requiresExplicitConsent(proposal));
      confidence += proposal.confidence;
      reasoning += `Recurring theme: ${theme.content} (${theme.frequency} times); `;
    }

    // Detect emotional patterns
    const emotionalPatterns = this.detectEmotionalPatterns(context.messages);
    for (const pattern of emotionalPatterns) {
      const proposal: MemoryProposal = {
        type: 'emotional_state',
        category: 'therapy',
        content: pattern.description,
        importance: 7,
        emotionalValence: pattern.valence,
        tags: ['emotional-pattern', pattern.emotion],
        metadata: {
          pattern: pattern.pattern,
          frequency: pattern.frequency,
          triggers: pattern.triggers
        },
        consentLevel: 'therapeutic',
        retentionPolicy: 'therapeutic',
        source: 'ai_analysis',
        confidence: 0.7
      };
      
      proposals.push(proposal);
      requiresConsent.push(this.requiresExplicitConsent(proposal));
      confidence += proposal.confidence;
      reasoning += `Emotional pattern: ${pattern.description}; `;
    }

    return { proposals, requiresConsent, confidence, reasoning };
  }

  /**
   * Check if a rule matches the message content
   */
  private checkRuleMatch(content: string, words: string[], rule: ExtractionRule): string[] {
    const matches: string[] = [];

    if (Array.isArray(rule.pattern)) {
      // Check for keyword matches
      for (const keyword of rule.pattern) {
        if (content.includes(keyword.toLowerCase())) {
          matches.push(keyword);
        }
      }
    } else {
      // Check regex pattern
      const regexMatches = content.match(rule.pattern);
      if (regexMatches) {
        matches.push(...regexMatches);
      }
    }

    // Apply conditions
    if (rule.conditions) {
      if (rule.conditions.minMessageLength && content.length < rule.conditions.minMessageLength) {
        return [];
      }
      
      if (rule.conditions.userExplicitRequest && !this.containsExplicitRequest(content)) {
        return [];
      }
    }

    return matches;
  }

  /**
   * Create memory proposal from rule match
   */
  private createProposal(
    rule: ExtractionRule,
    matches: string[],
    context: ConversationContext,
    message: { role: string; content: string; timestamp: Date }
  ): MemoryProposal {
    return {
      type: rule.memoryType,
      category: rule.category,
      content: this.extractRelevantContent(message.content, matches),
      importance: rule.importance,
      emotionalValence: this.assessEmotionalValence(message.content),
      tags: this.extractTags(message.content, matches),
      metadata: {
        ...rule.metadata,
        matchedPatterns: matches,
        sourceMessage: message.content.substring(0, 100),
        timestamp: message.timestamp
      },
      consentLevel: rule.consentLevel,
      retentionPolicy: rule.retentionPolicy,
      source: 'ai_analysis',
      confidence: rule.confidence
    };
  }

  /**
   * Extract explicit memory requests from user messages
   */
  private extractExplicitRequests(content: string): Array<{ content: string; type: string }> {
    const requests: Array<{ content: string; type: string }> = [];
    
    const explicitPatterns = [
      { pattern: /remember (that )?(.+)/i, type: 'general' },
      { pattern: /don't forget (that )?(.+)/i, type: 'general' },
      { pattern: /keep in mind (that )?(.+)/i, type: 'general' },
      { pattern: /save this: (.+)/i, type: 'important' },
      { pattern: /note (that )?(.+)/i, type: 'note' },
      { pattern: /write down (that )?(.+)/i, type: 'note' }
    ];

    for (const { pattern, type } of explicitPatterns) {
      const match = content.match(pattern);
      if (match) {
        requests.push({
          content: match[2] || match[1],
          type
        });
      }
    }

    return requests;
  }

  /**
   * Create proposal for explicit user request
   */
  private createExplicitProposal(
    request: { content: string; type: string },
    context: ConversationContext,
    message: { role: string; content: string; timestamp: Date }
  ): MemoryProposal {
    return {
      type: 'user_preference',
      category: 'preferences',
      content: request.content,
      importance: request.type === 'important' ? 9 : 7,
      emotionalValence: 0,
      tags: ['explicit-request', request.type],
      metadata: {
        requestType: request.type,
        sourceMessage: message.content,
        timestamp: message.timestamp
      },
      consentLevel: 'explicit',
      retentionPolicy: 'permanent',
      source: 'user_request',
      confidence: 0.95
    };
  }

  /**
   * Detect recurring themes across conversation
   */
  private detectRecurringThemes(messages: Array<{ role: string; content: string; timestamp: Date }>): Array<{
    content: string;
    frequency: number;
    emotionalValence: number;
    tags: string[];
    firstMentioned: Date;
    lastMentioned: Date;
  }> {
    const themeMap = new Map<string, {
      content: string;
      frequency: number;
      emotionalValence: number;
      tags: string[];
      firstMentioned: Date;
      lastMentioned: Date;
    }>();

    // Simple keyword-based theme detection
    const themeKeywords = [
      'anxiety', 'depression', 'stress', 'work', 'family', 'relationship',
      'sleep', 'exercise', 'meditation', 'therapy', 'goal', 'progress'
    ];

    for (const message of messages) {
      if (message.role === 'user') {
        const content = message.content.toLowerCase();
        
        for (const keyword of themeKeywords) {
          if (content.includes(keyword)) {
            if (!themeMap.has(keyword)) {
              themeMap.set(keyword, {
                content: keyword,
                frequency: 1,
                emotionalValence: this.assessEmotionalValence(content),
                tags: [keyword],
                firstMentioned: message.timestamp,
                lastMentioned: message.timestamp
              });
            } else {
              const theme = themeMap.get(keyword)!;
              theme.frequency++;
              theme.lastMentioned = message.timestamp;
              theme.emotionalValence = (theme.emotionalValence + this.assessEmotionalValence(content)) / 2;
            }
          }
        }
      }
    }

    return Array.from(themeMap.values()).filter(theme => theme.frequency >= 2);
  }

  /**
   * Detect emotional patterns in conversation
   */
  private detectEmotionalPatterns(messages: Array<{ role: string; content: string; timestamp: Date }>): Array<{
    emotion: string;
    pattern: string;
    description: string;
    valence: number;
    frequency: number;
    triggers: string[];
  }> {
    const patterns: Array<{
      emotion: string;
      pattern: string;
      description: string;
      valence: number;
      frequency: number;
      triggers: string[];
    }> = [];

    // Simple emotion detection
    const emotionKeywords = {
      'anxiety': { valence: -3, triggers: ['deadline', 'meeting', 'presentation'] },
      'frustration': { valence: -2, triggers: ['problem', 'issue', 'difficult'] },
      'sadness': { valence: -4, triggers: ['miss', 'loss', 'alone'] },
      'anger': { valence: -3, triggers: ['angry', 'mad', 'furious'] },
      'joy': { valence: 3, triggers: ['happy', 'excited', 'great'] },
      'relief': { valence: 2, triggers: ['better', 'relieved', 'calm'] }
    };

    for (const [emotion, config] of Object.entries(emotionKeywords)) {
      let frequency = 0;
      const triggers: string[] = [];

      for (const message of messages) {
        if (message.role === 'user') {
          const content = message.content.toLowerCase();
          if (content.includes(emotion)) {
            frequency++;
            
            // Check for triggers
            for (const trigger of config.triggers) {
              if (content.includes(trigger)) {
                triggers.push(trigger);
              }
            }
          }
        }
      }

      if (frequency > 0) {
        patterns.push({
          emotion,
          pattern: frequency >= 3 ? 'recurring' : 'occasional',
          description: `User experiences ${emotion} ${frequency >= 3 ? 'frequently' : 'occasionally'}`,
          valence: config.valence,
          frequency,
          triggers: [...new Set(triggers)]
        });
      }
    }

    return patterns;
  }

  /**
   * Assess emotional valence of content (-5 to +5)
   */
  private assessEmotionalValence(content: string): number {
    const positiveWords = ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'joy', 'peace'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'anxious', 'depressed', 'terrible', 'hate', 'pain'];
    
    const words = content.toLowerCase().split(/\s+/);
    let valence = 0;
    
    for (const word of words) {
      if (positiveWords.includes(word)) valence += 1;
      if (negativeWords.includes(word)) valence -= 1;
    }
    
    return Math.max(-5, Math.min(5, valence));
  }

  /**
   * Extract relevant content from message
   */
  private extractRelevantContent(content: string, matches: string[]): string {
    if (matches.length === 0) return content.substring(0, 200);
    
    // Find the context around the matched keywords
    const sentences = content.split(/[.!?]+/);
    const relevantSentences = sentences.filter(sentence => 
      matches.some(match => sentence.toLowerCase().includes(match.toLowerCase()))
    );
    
    return relevantSentences.join('. ').substring(0, 200);
  }

  /**
   * Extract tags from content
   */
  private extractTags(content: string, matches: string[]): string[] {
    const tags = [...matches];
    
    // Add emotion tags
    const emotions = ['anxiety', 'depression', 'stress', 'joy', 'anger', 'sadness'];
    for (const emotion of emotions) {
      if (content.toLowerCase().includes(emotion)) {
        tags.push(emotion);
      }
    }
    
    return [...new Set(tags)];
  }

  /**
   * Check if content contains explicit request
   */
  private containsExplicitRequest(content: string): boolean {
    const requestWords = ['remember', 'forget', 'save', 'note', 'write'];
    return requestWords.some(word => content.toLowerCase().includes(word));
  }

  /**
   * Remove duplicate proposals
   */
  private deduplicateProposals(proposals: MemoryProposal[]): MemoryProposal[] {
    const seen = new Set<string>();
    const unique: MemoryProposal[] = [];
    
    for (const proposal of proposals) {
      const key = `${proposal.type}:${proposal.content.substring(0, 50)}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(proposal);
      }
    }
    
    return unique;
  }

  /**
   * Check if proposal requires explicit consent
   */
  private requiresExplicitConsent(proposal: MemoryProposal): boolean {
    return proposal.consentLevel === 'explicit' || 
           proposal.importance >= 8 || 
           proposal.retentionPolicy === 'permanent';
  }

  /**
   * Initialize extraction rules
   */
  private initializeRules(): ExtractionRule[] {
    return [
      // Identity and preferences
      {
        id: 'identity_name',
        name: 'User Name',
        description: 'Extract user name and pronouns',
        pattern: ['my name is (\\w+)', 'i\'m (\\w+)', 'call me (\\w+)'],
        memoryType: 'stable_identity',
        category: 'general',
        importance: 9,
        consentLevel: 'explicit',
        retentionPolicy: 'permanent',
        confidence: 0.9,
        conditions: { minMessageLength: 10 }
      },
      
      // Therapeutic themes
      {
        id: 'anxiety_patterns',
        name: 'Anxiety Patterns',
        description: 'Detect anxiety-related content',
        pattern: ['anxiety', 'anxious', 'worry', 'panic', 'stress'],
        memoryType: 'therapeutic_theme',
        category: 'health',
        importance: 8,
        consentLevel: 'therapeutic',
        retentionPolicy: 'therapeutic',
        confidence: 0.8,
        metadata: { isTrigger: true }
      },
      
      // Coping strategies
      {
        id: 'coping_strategies',
        name: 'Coping Strategies',
        description: 'Identify what helps the user',
        pattern: ['helps', 'works for me', 'feel better', 'calm', 'relax'],
        memoryType: 'coping_strategy',
        category: 'therapy',
        importance: 7,
        consentLevel: 'therapeutic',
        retentionPolicy: 'therapeutic',
        confidence: 0.7
      },
      
      // Crisis indicators
      {
        id: 'crisis_indicators',
        name: 'Crisis Indicators',
        description: 'Detect crisis-related content',
        pattern: ['suicide', 'kill myself', 'end it all', 'no reason to live'],
        memoryType: 'crisis_history',
        category: 'crisis',
        importance: 10,
        consentLevel: 'crisis',
        retentionPolicy: 'crisis',
        confidence: 0.95,
        metadata: { requiresImmediate: true }
      }
    ];
  }
}

export const memoryExtractionService = MemoryExtractionService.getInstance();
