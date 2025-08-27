// pages/api/generate-prompt.ts
import { NextApiRequest, NextApiResponse } from 'next';

const prompts = [
  "What are you grateful for today?",
  "Describe a challenge you're facing and how you plan to overcome it.",
  "What's a goal you're working towards, and what steps are you taking to achieve it?",
  "Reflect on a recent accomplishment and how it made you feel.",
  "Write about a person who has positively influenced your life and why.",
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  res.status(200).json({ prompt: randomPrompt });
}