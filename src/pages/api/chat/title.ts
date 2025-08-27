import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { content } = req.body;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Generate a short, descriptive title (3-6 words) for this conversation based on the user's first message. Return only the title, no quotes or explanation."
          },
          { role: "user", content }
        ],
        max_tokens: 20,
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();
    const title = data.choices?.[0]?.message?.content?.trim() || "New Chat";

    res.status(200).json({ title });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
