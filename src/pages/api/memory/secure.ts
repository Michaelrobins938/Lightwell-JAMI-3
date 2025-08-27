// Secure Memory API - Handles encrypted memory operations with consent management

import { NextApiRequest, NextApiResponse } from 'next';
import { secureMemoryService, MemoryProposal, MemoryQuery } from '../../../services/secureMemoryService';
import { memoryExtractionService, ConversationContext } from '../../../services/memoryExtractionService';
import { authMiddleware } from '../../../middleware/auth-middleware';
import { withSecurity } from '../../../middleware/securityMiddleware';
import { EncryptionService } from '../../../services/encryptionService';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        return await handlePost(req, res);
      case 'GET':
        return await handleGet(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Secure memory API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { action, data } = req.body;

  switch (action) {
    case 'extract':
      return await handleExtractMemories(req, res, userId);
    case 'propose':
      return await handleProposeMemory(req, res, userId);
    case 'approve':
      return await handleApproveMemory(req, res, userId);
    case 'reject':
      return await handleRejectMemory(req, res, userId);
    default:
      return res.status(400).json({ message: 'Invalid action' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { action } = req.query;

  switch (action) {
    case 'retrieve':
      return await handleRetrieveMemories(req, res, userId);
    case 'continuity':
      return await handleGetSessionContinuity(req, res, userId);
    default:
      return res.status(400).json({ message: 'Invalid action' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return await handleUpdateMemory(req, res, userId);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return await handleArchiveMemory(req, res, userId);
}

// Extract memories from conversation
async function handleExtractMemories(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { conversationId, messages, sessionStartTime, currentTopic, userEmotionalState } = req.body;

  if (!conversationId || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const context: ConversationContext = {
      userId,
      conversationId,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      })),
      sessionStartTime: new Date(sessionStartTime),
      currentTopic,
      userEmotionalState
    };

    const extractionResult = await memoryExtractionService.extractMemories(context);

    return res.status(200).json({
      success: true,
      data: extractionResult
    });
  } catch (error) {
    console.error('Memory extraction error:', error);
    return res.status(500).json({ message: 'Failed to extract memories' });
  }
}

// Propose a new memory
async function handleProposeMemory(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { proposal, userEncryptionKey } = req.body;

  if (!proposal || !userEncryptionKey) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Convert base64 key to buffer
    const keyBuffer = Buffer.from(userEncryptionKey, 'base64');
    
    const result = await secureMemoryService.proposeMemory(userId, proposal, keyBuffer);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Memory proposal error:', error);
    return res.status(500).json({ message: 'Failed to propose memory' });
  }
}

// Approve memory proposals
async function handleApproveMemory(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { proposals, userEncryptionKey } = req.body;

  if (!proposals || !Array.isArray(proposals) || !userEncryptionKey) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const keyBuffer = Buffer.from(userEncryptionKey, 'base64');
    const results = [];

    for (const proposal of proposals) {
      const result = await secureMemoryService.proposeMemory(userId, proposal, keyBuffer);
      results.push(result);
    }

    return res.status(200).json({
      success: true,
      data: { results }
    });
  } catch (error) {
    console.error('Memory approval error:', error);
    return res.status(500).json({ message: 'Failed to approve memories' });
  }
}

// Reject memory proposals
async function handleRejectMemory(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { proposalIds } = req.body;

  if (!proposalIds || !Array.isArray(proposalIds)) {
    return res.status(400).json({ message: 'Missing proposal IDs' });
  }

  try {
    // In a full implementation, you would store rejected proposals to avoid re-proposing
    // For now, we just acknowledge the rejection
    return res.status(200).json({
      success: true,
      message: `Rejected ${proposalIds.length} memory proposals`
    });
  } catch (error) {
    console.error('Memory rejection error:', error);
    return res.status(500).json({ message: 'Failed to reject memories' });
  }
}

// Retrieve memories
async function handleRetrieveMemories(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { 
    conversationId, 
    type, 
    category, 
    consentLevel, 
    importance, 
    limit, 
    includeInactive,
    userEncryptionKey 
  } = req.query;

  if (!userEncryptionKey || typeof userEncryptionKey !== 'string') {
    return res.status(400).json({ message: 'Missing user encryption key' });
  }

  try {
    const keyBuffer = Buffer.from(userEncryptionKey, 'base64');
    
    const query: MemoryQuery = {
      userId,
      conversationId: conversationId as string,
      type: type as any,
      category: category as any,
      consentLevel: consentLevel as any,
      importance: importance ? parseInt(importance as string) : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      includeInactive: includeInactive === 'true'
    };

    const memories = await secureMemoryService.retrieveMemories(query, keyBuffer);

    return res.status(200).json({
      success: true,
      data: { memories }
    });
  } catch (error) {
    console.error('Memory retrieval error:', error);
    return res.status(500).json({ message: 'Failed to retrieve memories' });
  }
}

// Get session continuity information
async function handleGetSessionContinuity(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { userEncryptionKey } = req.query;

  if (!userEncryptionKey || typeof userEncryptionKey !== 'string') {
    return res.status(400).json({ message: 'Missing user encryption key' });
  }

  try {
    const keyBuffer = Buffer.from(userEncryptionKey, 'base64');
    const continuity = await secureMemoryService.getSessionContinuity(userId, keyBuffer);

    return res.status(200).json({
      success: true,
      data: continuity
    });
  } catch (error) {
    console.error('Session continuity error:', error);
    return res.status(500).json({ message: 'Failed to get session continuity' });
  }
}

// Update memory
async function handleUpdateMemory(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { memoryId, updates, userEncryptionKey } = req.body;

  if (!memoryId || !updates || !userEncryptionKey) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const keyBuffer = Buffer.from(userEncryptionKey, 'base64');
    const updatedMemory = await secureMemoryService.updateMemory(memoryId, updates, keyBuffer);

    return res.status(200).json({
      success: true,
      data: { memory: updatedMemory }
    });
  } catch (error) {
    console.error('Memory update error:', error);
    return res.status(500).json({ message: 'Failed to update memory' });
  }
}

// Archive memory
async function handleArchiveMemory(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { memoryId } = req.body;

  if (!memoryId) {
    return res.status(400).json({ message: 'Missing memory ID' });
  }

  try {
    await secureMemoryService.archiveMemory(memoryId);

    return res.status(200).json({
      success: true,
      message: 'Memory archived successfully'
    });
  } catch (error) {
    console.error('Memory archive error:', error);
    return res.status(500).json({ message: 'Failed to archive memory' });
  }
}

export default withSecurity(authMiddleware(handler));
