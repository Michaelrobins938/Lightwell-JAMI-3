// File management API - get/delete specific files

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Simple in-memory store (in production, use a database)
const fileStore = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { fileId } = req.query;

  if (!fileId || typeof fileId !== 'string') {
    return res.status(400).json({ error: 'File ID is required' });
  }

  switch (req.method) {
    case 'GET':
      return handleGetFile(req, res, fileId);
    case 'DELETE':
      return handleDeleteFile(req, res, fileId);
    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetFile(req: NextApiRequest, res: NextApiResponse, fileId: string) {
  try {
    const file = fileStore.get(fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ 
      error: 'Failed to get file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleDeleteFile(req: NextApiRequest, res: NextApiResponse, fileId: string) {
  try {
    const file = fileStore.get(fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), 'public', file.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from store
    fileStore.delete(fileId);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}