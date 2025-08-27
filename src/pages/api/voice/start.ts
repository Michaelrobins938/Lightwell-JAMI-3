/**
 * Voice Session Start Endpoint
 * Creates a temporary session ID for TTS playback
 */

import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  res.status(200).json({ success: true, sessionId: uuidv4() });
}
