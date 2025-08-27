import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { openAIChatCompletion } from '../../../services/openAIService';
import { getTechniquesForSituation } from '../../../ai/therapeutic_techniques';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MultimodalRequest {
  text?: string;
  imageUrl?: string;
  images?: Array<{
    id: string;
    url?: string;
    preview?: string;
    mimeType?: string;
  }>;
  audioUrl?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userId: string;
  sessionId?: string;
  stream?: boolean;
  model?: string;
}

interface ProcessedContent {
  type: 'text' | 'image' | 'audio';
  content: string;
  metadata?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      text, 
      imageUrl, 
      images = [], 
      audioUrl, 
      conversationHistory = [], 
      userId, 
      sessionId,
      stream = false,
      model = 'gpt-4o-mini'
    }: MultimodalRequest = req.body;

    if (!text && !imageUrl && !audioUrl && images.length === 0) {
      return res.status(400).json({ error: 'At least one input type (text, image, or audio) is required' });
    }

    // Use OpenAI Vision API for real image analysis
    if (process.env.OPENAI_API_KEY && (imageUrl || images.length > 0)) {
      return await handleOpenAIVision(req, res, {
        text,
        images: images.length > 0 ? images : imageUrl ? [{ id: 'single', url: imageUrl }] : [],
        conversationHistory,
        userId,
        stream,
        model,
      });
    }

    // Fallback to original Jamie processing
    const processedContent: ProcessedContent[] = [];
    let multimodalPrompt = '';

    // Process text input
    if (text) {
      processedContent.push({
        type: 'text',
        content: text
      });
      multimodalPrompt += `User's text message: "${text}"\n\n`;
    }

    // Process image input
    if (imageUrl || images.length > 0) {
      try {
        const imageAnalysis = await analyzeImage(imageUrl || images[0]?.url || '');
        processedContent.push({
          type: 'image',
          content: imageAnalysis.description,
          metadata: imageAnalysis
        });
        multimodalPrompt += `Image analysis: ${imageAnalysis.description}\nEmotional indicators: ${imageAnalysis.emotionalIndicators.join(', ')}\n\n`;
      } catch (error) {
        console.error('Image analysis failed:', error);
        multimodalPrompt += `[Image provided but analysis failed]\n\n`;
      }
    }

    // Process audio input
    if (audioUrl) {
      try {
        const audioAnalysis = await analyzeAudio(audioUrl);
        processedContent.push({
          type: 'audio',
          content: audioAnalysis.transcript,
          metadata: audioAnalysis
        });
        multimodalPrompt += `Audio transcript: "${audioAnalysis.transcript}"\nTone analysis: ${audioAnalysis.toneAnalysis}\nEmotional indicators: ${audioAnalysis.emotionalIndicators.join(', ')}\n\n`;
      } catch (error) {
        console.error('Audio analysis failed:', error);
        multimodalPrompt += `[Audio provided but analysis failed]\n\n`;
      }
    }

    // Generate therapeutic response
    const response = await generateMultimodalResponse(multimodalPrompt, processedContent, conversationHistory, userId);

    res.status(200).json({
      response: response.response,
      emotionalAssessment: response.emotionalAssessment,
      crisisAssessment: response.crisisAssessment,
      therapeuticIntervention: response.therapeuticIntervention,
      processedContent,
      multimodalInsights: response.multimodalInsights
    });

  } catch (error) {
    console.error('Multimodal processing error:', error);
    res.status(500).json({ error: 'Failed to process multimodal input' });
  }
}

// Handle OpenAI Vision API
async function handleOpenAIVision(
  req: NextApiRequest,
  res: NextApiResponse,
  options: {
    text?: string;
    images: Array<{ id: string; url?: string; preview?: string }>;
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
    userId: string;
    stream: boolean;
    model: string;
  }
) {
  const { text, images, conversationHistory, stream, model } = options;

  // Build message content with text and images
  const messageContent: Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: { url: string; detail?: 'low' | 'high' | 'auto' };
  }> = [];

  // Add text content
  if (text && text.trim()) {
    messageContent.push({
      type: 'text',
      text: text.trim(),
    });
  }

  // Add images
  for (const image of images) {
    const imageUrl = image.url || image.preview;
    if (imageUrl) {
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: imageUrl,
          detail: 'high',
        },
      });
    }
  }

  const messages = [
    {
      role: 'system' as const,
      content: `You are Luna, an AI therapist assistant. You can see and analyze images that users share. When users share images:

1. Describe what you see in a supportive, therapeutic context
2. Ask relevant questions about how the image relates to their feelings or situation  
3. Provide empathetic responses that acknowledge both the visual content and emotional context
4. If the image shows concerning content (self-harm, distress, etc.), respond with appropriate care and potentially suggest professional help

Always maintain a warm, supportive tone and remember this is a therapeutic conversation.`,
    },
    // Add conversation history
    ...conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })),
    // Add current user message
    {
      role: 'user' as const,
      content: messageContent,
    },
  ];

  if (stream) {
    // Streaming response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const send = (data: string) => {
      try {
        res.write(`data: ${data}\n\n`);
      } catch (error) {
        console.error('Error writing to stream:', error);
      }
    };

    try {
      send('[THINKING]');

      const stream = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 4000,
        stream: true,
      });

      let isFirstToken = true;

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        
        if (delta) {
          if (isFirstToken) {
            send('[FIRST_TOKEN]');
            isFirstToken = false;
          }
          send(delta);
        }

        const finishReason = chunk.choices[0]?.finish_reason;
        if (finishReason) {
          break;
        }
      }

      send('[DONE]');
      res.end();

    } catch (error) {
      console.error('OpenAI Vision streaming error:', error);
      send(`[ERROR] ${error instanceof Error ? error.message : 'Vision processing failed'}`);
      res.end();
    }
  } else {
    // Non-streaming response
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 4000,
      });

      const response = completion.choices[0]?.message?.content || '';
      
      res.json({
        response,
        usage: completion.usage,
        model: completion.model,
      });

    } catch (error) {
      console.error('OpenAI Vision error:', error);
      
      if (error && typeof error === 'object' && 'error' in error && 
          typeof error.error === 'object' && error.error && 'code' in error.error) {
        const errorCode = (error.error as any).code;
        if (errorCode === 'invalid_image') {
          return res.status(400).json({ error: 'Invalid image format. Please try again.' });
        }
      }

      res.status(500).json({
        error: 'Vision processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

async function analyzeImage(imageUrl: string): Promise<any> {
  // Mock image analysis - in production, this would use OpenAI's Vision API or similar
  const mockAnalysis = {
    description: 'A person sitting in a quiet room with natural lighting',
    emotionalIndicators: ['contemplative', 'calm', 'introspective'],
    objects: ['chair', 'window', 'natural light'],
    setting: 'indoor, peaceful environment',
    mood: 'reflective and calm'
  };

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  return mockAnalysis;
}

async function analyzeAudio(audioUrl: string): Promise<any> {
  // Mock audio analysis - in production, this would use speech-to-text and tone analysis
  const mockAnalysis = {
    transcript: 'I\'ve been feeling really overwhelmed lately with everything going on.',
    toneAnalysis: 'slightly anxious, contemplative',
    emotionalIndicators: ['overwhelmed', 'anxious', 'contemplative'],
    speechRate: 'moderate',
    volume: 'normal',
    clarity: 'clear'
  };

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  return mockAnalysis;
}

async function generateMultimodalResponse(
  prompt: string,
  processedContent: ProcessedContent[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userId: string
): Promise<any> {
  const systemPrompt = `You are Jamie, an AI mental health counselor with expertise in multimodal therapeutic support. You can process text, images, and audio to provide comprehensive emotional support.

MULTIMODAL ANALYSIS CAPABILITIES:
- Text: Analyze written content for emotional themes, cognitive patterns, and therapeutic needs
- Images: Interpret visual cues, body language, environment, and emotional context
- Audio: Process speech patterns, tone, emotional indicators, and verbal content

THERAPEUTIC APPROACH:
1. Integrate all available modalities for comprehensive understanding
2. Identify emotional patterns across different input types
3. Provide empathetic, evidence-based therapeutic responses
4. Suggest appropriate interventions based on multimodal assessment
5. Maintain safety protocols for crisis detection

RESPONSE STRUCTURE:
- Acknowledge all input modalities
- Provide integrated emotional assessment
- Offer therapeutic insights and coping strategies
- Suggest next steps or interventions
- Include crisis assessment if needed

Current multimodal input to analyze:
${prompt}

Provide a thoughtful, empathetic response that integrates all available information.`;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.slice(-10),
    { role: 'user' as const, content: `Please analyze this multimodal input and provide therapeutic support: ${prompt}` }
  ];

  const response = await openAIChatCompletion(messages);
  const jamieResponse = (response?.choices?.[0]?.message?.content || '').trim();

  // Extract insights from multimodal content
  const multimodalInsights = extractMultimodalInsights(processedContent);

  // Generate emotional assessment based on multimodal input
  const emotionalAssessment = generateEmotionalAssessment(processedContent);

  // Crisis assessment
  const crisisAssessment = await assessCrisisFromMultimodal(processedContent);

  // Therapeutic intervention
  const therapeuticIntervention = generateTherapeuticIntervention(processedContent, emotionalAssessment);

  return {
    response: jamieResponse || "I understand the complexity of what you're sharing. Let me help you process this.",
    emotionalAssessment,
    crisisAssessment,
    therapeuticIntervention,
    multimodalInsights
  };
}

function extractMultimodalInsights(processedContent: ProcessedContent[]): any {
  const insights = {
    primaryModality: processedContent.length > 0 ? processedContent[0].type : 'text',
    emotionalConsistency: 'consistent',
    communicationStyle: 'mixed',
    therapeuticNeeds: [] as string[],
    strengths: [] as string[]
  };

  // Analyze patterns across modalities
  const emotionalIndicators = processedContent.flatMap(content => {
    if (content.metadata?.emotionalIndicators) {
      return content.metadata.emotionalIndicators;
    }
    return [];
  });

  // Identify therapeutic needs
  if (emotionalIndicators.includes('overwhelmed')) {
    insights.therapeuticNeeds.push('stress_management', 'coping_strategies');
  }
  if (emotionalIndicators.includes('anxious')) {
    insights.therapeuticNeeds.push('anxiety_management', 'grounding_techniques');
  }
  if (emotionalIndicators.includes('sad')) {
    insights.therapeuticNeeds.push('mood_support', 'self_compassion');
  }

  return insights;
}

function generateEmotionalAssessment(processedContent: ProcessedContent[]): any {
  const emotionalIndicators = processedContent.flatMap(content => {
    if (content.metadata?.emotionalIndicators) {
      return content.metadata.emotionalIndicators;
    }
    return [];
  });

  // Determine primary emotion based on frequency and intensity
  const emotionCounts = emotionalIndicators.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const primaryEmotion = Object.keys(emotionCounts).reduce((a, b) => 
    emotionCounts[a] > emotionCounts[b] ? a : b, 'neutral'
  );

  return {
    primaryEmotion,
    intensity: Math.min(10, Math.max(1, Object.keys(emotionCounts).length * 2)),
    secondaryEmotions: Object.keys(emotionCounts).filter(emotion => emotion !== primaryEmotion),
    confidence: 0.8,
    multimodalSources: processedContent.length
  };
}

async function assessCrisisFromMultimodal(processedContent: ProcessedContent[]): Promise<any> {
  const crisisIndicators = [
    'suicidal', 'self-harm', 'hopeless', 'desperate', 'overwhelmed',
    'panic', 'severe', 'critical', 'emergency', 'danger'
  ];

  const allContent = processedContent.map(content => content.content).join(' ').toLowerCase();
  
  const crisisLevel = crisisIndicators.some(indicator => 
    allContent.includes(indicator)
  ) ? 'medium' : 'none';

  return {
    level: crisisLevel,
    confidence: 0.7,
    triggers: crisisIndicators.filter(indicator => allContent.includes(indicator)),
    recommendations: crisisLevel !== 'none' ? [
      'Consider reaching out to a mental health professional',
      'Call 988 for crisis support if needed',
      'Practice grounding techniques',
      'Reach out to trusted friends or family'
    ] : []
  };
}

function generateTherapeuticIntervention(processedContent: ProcessedContent[], emotionalAssessment: any): any {
  const symptoms = [emotionalAssessment.primaryEmotion, ...emotionalAssessment.secondaryEmotions];
  const relevantTechniques = getTechniquesForSituation(symptoms);

  return {
    technique: relevantTechniques[0]?.name || 'Active Listening',
    description: relevantTechniques[0]?.description || 'Providing empathetic support and validation',
    steps: relevantTechniques[0]?.steps || [],
    modality: 'multimodal',
    confidence: 0.8
  };
}
