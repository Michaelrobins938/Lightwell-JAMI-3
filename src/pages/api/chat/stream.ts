import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const bodyChunks: Buffer[] = [];
    for await (const chunk of req) {
      bodyChunks.push(chunk as Buffer);
    }
    const { content, sessionId, systemPrompt, context } = JSON.parse(Buffer.concat(bodyChunks).toString());

    // Build conversation context
    const conversation = [];

    // Add system prompt if provided
    if (systemPrompt) {
      conversation.push({ role: "system", content: systemPrompt });
    }

    // Add recent context messages
    if (context && context.length > 0) {
      conversation.push(...context.map((m: any) => ({ role: m.role, content: m.content })));
    }

    // Add current user message
    conversation.push({ role: "user", content });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: conversation,
        stream: true,
        max_tokens: 4000
      })
    });

    if (!openaiRes.body) {
      res.end();
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });

    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // Parse SSE data
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(content);
            }
          } catch (e) {
            // Ignore parse errors for now
          }
        }
      }
    }

    res.end();
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}