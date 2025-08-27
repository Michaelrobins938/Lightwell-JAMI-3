/**
 * Voice Chunk Endpoint
 * Stores text that will be converted to speech at /end
 */

import { NextApiRequest, NextApiResponse } from "next";

const sessionTexts = new Map<string, string>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sessionId, text } = req.body;
  if (!sessionId || !text) return res.status(400).json({ error: "sessionId and text required" });

  const existing = sessionTexts.get(sessionId) || "";
  sessionTexts.set(sessionId, existing + " " + text);

  res.status(200).json({ success: true, sessionId, text });
}

export { sessionTexts };