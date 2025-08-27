// src/pages/api/session.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        // crucial: tell OpenAI we want audio
        voice: {
          input: { enabled: true },
          output: { format: "wav", voice: "verse" },
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[SESSION] Error creating session:", err);
      res.status(500).json({ error: err });
      return;
    }

    const data = await response.json();
    console.log("[SESSION] Session created successfully:", data);
    res.status(200).json(data);
  } catch (err: any) {
    console.error("[SESSION] Unexpected error:", err);
    res.status(500).json({ error: err.message });
  }
}