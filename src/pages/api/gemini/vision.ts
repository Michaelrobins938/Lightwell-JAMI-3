import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, images } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required for vision API' });
    }

    // Get Gemini API key from environment
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    // Prepare parts array with text and images
    const parts = [
      {
        text: message
      }
    ];

    // Add images to parts
    for (const image of images) {
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
      
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      } as any); // Use type assertion for Gemini API compatibility
    }

    // Call Gemini Vision API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: parts
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini Vision API error:', response.status, errorData);
      throw new Error(`Gemini Vision API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Invalid response from Gemini Vision API');
    }

    res.status(200).json({ response: responseText });

  } catch (error) {
    console.error('Gemini vision API error:', error);
    res.status(500).json({ 
      error: 'Failed to process vision request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
