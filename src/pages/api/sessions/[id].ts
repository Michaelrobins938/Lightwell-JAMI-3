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

  const { id } = req.query;

  // Verify session belongs to user
  const chatSession = await prisma.chatSession.findFirst({
    where: { id: String(id), userId: user.id }
  });

  if (!chatSession) {
    return res.status(404).json({ error: "Session not found" });
  }

  if (req.method === "GET") {
    res.json(chatSession);
  } else if (req.method === "PATCH") {
    const { title, systemPrompt, model } = req.body;
    const updated = await prisma.chatSession.update({
      where: { id: String(id) },
      data: { title, systemPrompt, model }
    });
    res.json(updated);
  } else if (req.method === "DELETE") {
    await prisma.chatSession.delete({ where: { id: String(id) } });
    res.json({ success: true });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
