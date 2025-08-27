import { SentimentAnalyzer } from 'node-nlp';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;
    const analyzer = new SentimentAnalyzer({ language: 'en' });
    const sentiment = await analyzer.getSentiment(text);
    res.status(200).json({ sentiment });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
