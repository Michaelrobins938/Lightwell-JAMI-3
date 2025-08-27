import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../services/authService';

export { verifyToken };

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
  };
}

export const authMiddleware = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = verifyToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { userId: decodedToken.userId };
    return handler(req, res);
  };
}; 