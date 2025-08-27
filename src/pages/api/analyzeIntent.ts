import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;

    try {
      // Simple text analysis without heavy ML dependencies
      const sentiment = analyzeTextSentiment(text);
      res.status(200).json({ label: sentiment });
    } catch (error) {
      console.error('Error processing text analysis:', error);
      res.status(500).json({ message: 'Error processing text analysis' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Simple text sentiment analysis without ML dependencies
function analyzeTextSentiment(text: string): string {
  if (!text) return 'NEUTRAL';
  
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'love', 'like', 'enjoy', 'positive'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'negative', 'worst', 'horrible'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'POSITIVE';
  if (negativeCount > positiveCount) return 'NEGATIVE';
  return 'NEUTRAL';
}
