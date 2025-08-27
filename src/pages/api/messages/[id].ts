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

  // Find message and verify ownership through session
  const message = await prisma.message.findFirst({
    where: { id: String(id) },
    include: { session: true }
  });

  if (!message || message.session.userId !== user.id) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (req.method === "DELETE") {
    await prisma.message.delete({ where: { id: String(id) } });
    res.json({ success: true });
  } else if (req.method === "PATCH") {
    const { content } = req.body;
    const updated = await prisma.message.update({
      where: { id: String(id) },
      data: { content },
      include: { attachments: true }
    });
    res.json(updated);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
