// src/pages/api/chat/save-history.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, messages } = req.body;

    if (!userId || !messages) {
      return res.status(400).json({ error: "Missing userId or messages" });
    }

    // Save chat session
    const chat = await prisma.chatSession.create({
      data: {
        userId,
        messages: JSON.stringify(messages), // store as JSON
      },
    });

    return res.status(200).json({
      success: true,
      chatId: chat.id,
      message: "Chat history saved successfully",
    });
  } catch (err: any) {
    console.error("❌ Failed to save chat:", err);
    return res.status(500).json({ error: err.message || "Failed to save chat" });
  }
}