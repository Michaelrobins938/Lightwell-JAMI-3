import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // we're receiving raw binary PNG blobs
  },
};

// helper: stream blob -> buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    // 🔹 Read raw PNG frame from frontend
    const buffer = await streamToBuffer(req);
    const base64Image = buffer.toString("base64");

    // 🔹 Send to Google AI Studio Vision API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: "You are assisting with screen analysis for a voice + vision chat application. Describe key elements clearly and concisely." 
                },
                {
                  inline_data: {
                    mime_type: "image/png",
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // 🔹 Extract text result
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No vision output";

    // Return back to client
    res.status(200).json({ text: output });
  } catch (err) {
    console.error("Vision API error:", err);
    res.status(500).json({ error: "Vision API failed" });
  }
}