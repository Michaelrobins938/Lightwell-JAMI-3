import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import formidable from "formidable";
import fs from "node:fs";

export const config = { api: { bodyParser: false } };
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;
      const f = Array.isArray(files.audio) ? files.audio[0] : (files.audio as any);
      if (!f?.filepath) return res.status(400).json({ error: "No audio" });
      const buffer = fs.readFileSync(f.filepath);

      const result = await client.audio.transcriptions.create({
        file: new File([buffer], "voice.webm", { type: "audio/webm" }),
        model: "whisper-1"
      } as any);

      res.status(200).json({ text: (result as any).text || "" });
    } catch (e:any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Transcription failed" });
    }
  });
}


