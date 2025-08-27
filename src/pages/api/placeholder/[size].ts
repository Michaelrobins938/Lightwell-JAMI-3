import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { size } = req.query;
    const [width, height] = (size as string).split('x').map(Number);
    
    // Generate a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/3}" fill="#9ca3af"/>
        <text x="${width/2}" y="${height/2 + 4}" text-anchor="middle" fill="white" font-family="Arial" font-size="${Math.min(width, height)/4}">U</text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.status(200).send(svg);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
} 