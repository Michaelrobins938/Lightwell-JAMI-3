/**
 * Voice Session End Endpoint
 * Converts stored text into speech using OpenAI TTS
 */

import { NextApiRequest, NextApiResponse } from "next";
import { sessionTexts } from "./chunk";

export const config = { api: { responseLimit: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { id: sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Session ID required" });

  const text = sessionTexts.get(sessionId);
  if (!text) return res.status(404).json({ error: "No text found" });

  const openaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    }),
  });

  if (!openaiRes.ok) {
    const errText = await openaiRes.text();
    throw new Error(`OpenAI TTS failed: ${errText}`);
  }

  res.setHeader("Content-Type", "audio/mpeg");
  const buffer = Buffer.from(await openaiRes.arrayBuffer());
  res.send(buffer);

  sessionTexts.delete(sessionId);
}
