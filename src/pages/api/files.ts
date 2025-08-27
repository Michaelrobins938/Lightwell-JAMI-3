import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(401).json({ error: "User not found" });

  try {
    const form = formidable({
      multiples: true,
      uploadDir: "./uploads",
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed" });
      }

      const { sessionId, messageId } = fields;

      // Verify session belongs to user
      const chatSession = await prisma.chatSession.findFirst({
        where: { id: String(sessionId), userId: user.id }
      });

      if (!chatSession) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Verify message exists
      const message = await prisma.message.findFirst({
        where: { id: String(messageId), sessionId: String(sessionId) }
      });

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      const uploaded: any[] = Array.isArray(files.files) ? files.files : [files.files];

      const attachments = await Promise.all(
        uploaded.map(async (f) => {
          const filename = f.originalFilename || "file";
          const url = `/uploads/${path.basename(f.filepath)}`;
          return prisma.attachment.create({
            data: { filename, url, messageId: String(messageId) }
          });
        })
      );

      res.json({ success: true, attachments });
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
