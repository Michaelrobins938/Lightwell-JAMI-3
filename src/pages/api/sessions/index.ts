import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(401).json({ error: "User not found" });

  if (req.method === "GET") {
    const sessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { messages: false }
    });
    res.json(sessions);
  } else if (req.method === "POST") {
    const { title, systemPrompt, model } = req.body;
    const newSession = await prisma.chatSession.create({
      data: {
        title: title || "New Chat",
        systemPrompt: systemPrompt || "",
        model: model || "gpt-4o",
        userId: user.id
      }
    });
    res.json(newSession);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
