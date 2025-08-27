// src/lib/generate-title.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTitleAndSummary(messages: any[]) {
  // Skip if no OpenAI key is available
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[CHAT] ⚠️ No OpenAI API key found, skipping title/summary generation");
    return {
      title: "Voice Chat Session",
      summary: "Chat conversation"
    };
  }

  // Skip if no messages
  if (!messages || messages.length === 0) {
    return {
      title: "Empty Chat",
      summary: "No messages in conversation"
    };
  }

  try {
    const textDump = messages
      .map((m: any) => `${m.role?.toUpperCase() || 'USER'}: ${m.content || ''}`)
      .join("\n");

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that generates concise titles and 1-2 sentence summaries of chat conversations. Keep titles under 8 words and summaries under 2 sentences.",
        },
        {
          role: "user",
          content: `Generate a short TITLE (max 8 words) and a SUMMARY for this conversation:\n\n${textDump}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const result = response.choices[0]?.message?.content || "";
    const lines = result.split("\n").map((s) => s.trim()).filter(s => s.length > 0);

    // Parse the response - look for Title: and Summary: patterns
    let title = "Voice Chat Session";
    let summary = "Chat conversation";

    for (const line of lines) {
      if (line.toLowerCase().startsWith("title:")) {
        title = line.replace(/^title:\s*/i, "").trim();
      } else if (line.toLowerCase().startsWith("summary:")) {
        summary = line.replace(/^summary:\s*/i, "").trim();
      }
    }

    // Fallback parsing if the response format is different
    if (lines.length >= 2 && !lines[0].toLowerCase().includes("title:")) {
      title = lines[0];
      summary = lines.slice(1).join(" ");
    }

    return {
      title: title.length > 60 ? title.substring(0, 57) + "..." : title,
      summary: summary.length > 200 ? summary.substring(0, 197) + "..." : summary,
    };
  } catch (error) {
    console.error("[CHAT] ❌ Error generating title/summary:", error);
    return {
      title: "Voice Chat Session",
      summary: "Chat conversation"
    };
  }
}


