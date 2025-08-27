// src/pages/api/chat/load-history.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    // Fetch all chats for this user
    const chats = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // newest first
    });

    // Parse messages from JSON string back into objects
    const result = chats.map((chat) => ({
      id: chat.id,
      userId: chat.userId,
      messages: JSON.parse(chat.messages),
      createdAt: chat.createdAt,
    }));

    return res.status(200).json({
      success: true,
      chats: result,
    });
  } catch (err: any) {
    console.error("❌ Failed to load chat history:", err);
    return res.status(500).json({ error: err.message || "Failed to load chat history" });
  }
}
