import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.ensureDir(uploadDir);

    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ message: 'Error processing file upload' });
      }

      const file = files.image as File;
      if (!file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const fileName = `${uuidv4()}${path.extname(file.originalFilename || '')}`;
      const newPath = path.join(uploadDir, fileName);

      try {
        await sharp(file.filepath)
          .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(newPath);

        await fs.remove(file.filepath);

        const imageBuffer = await fs.readFile(newPath);
        const base64Image = imageBuffer.toString('base64');

        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this image and provide insights relevant to mental health or medical contexts:" },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
              ],
            },
          ],
          max_tokens: 300,
        });

        const analysis = response.choices[0].message?.content || 'No analysis provided';

        res.status(200).json({ 
          imageUrl: `/uploads/${fileName}`, 
          analysis 
        });
      } catch (error) {
        console.error('Error processing image:', error);
        await fs.remove(newPath).catch(console.error);
        res.status(500).json({ message: 'Error processing image' });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Unexpected error occurred' });
  }
}