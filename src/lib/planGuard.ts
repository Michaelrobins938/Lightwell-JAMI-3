import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { UserPlan } from '../contexts/AuthContext';

interface JWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  plan: UserPlan;
}

interface AuthenticatedRequest extends NextApiRequest {
  user: JWTPayload;
}

export function withPlanAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
  requiredPlan: UserPlan = UserPlan.FREE
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Check authentication
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'No token provided',
          requiredPlan: requiredPlan 
        });
      }

      const token = authHeader.substring(7);
      
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not configured');
        return res.status(500).json({ 
          error: 'Server configuration error',
          message: 'JWT secret not configured' 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      
      // Check if user's plan meets the requirement
      const planHierarchy = {
        [UserPlan.FREE]: 0,
        [UserPlan.PRO]: 1,
        [UserPlan.ENTERPRISE]: 2,
      };

      if (planHierarchy[decoded.plan] < planHierarchy[requiredPlan]) {
        return res.status(403).json({
          error: 'Plan Required',
          message: `This feature requires ${requiredPlan} plan or higher`,
          currentPlan: decoded.plan,
          requiredPlan: requiredPlan,
          upgradeUrl: '/pricing'
        });
      }

      // Add user to request object
      (req as AuthenticatedRequest).user = decoded;
      
      // Call the handler
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Plan auth error:', error);
      
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Your session has expired. Please log in again.' 
        });
      }
      
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          error: 'Token expired',
          message: 'Your session has expired. Please log in again.' 
        });
      }
      
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Authentication check failed' 
      });
    }
  };
}

// Convenience functions for common plan requirements
export const withFreeAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  withPlanAuth(handler, UserPlan.FREE);

export const withProAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  withPlanAuth(handler, UserPlan.PRO);

export const withEnterpriseAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  withPlanAuth(handler, UserPlan.ENTERPRISE);

// Feature-specific guards
export const withCustomInstructions = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  withPlanAuth(handler, UserPlan.PRO);

export const withLongContext = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  withPlanAuth(handler, UserPlan.PRO);

export const withTeamWorkspace = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  withPlanAuth(handler, UserPlan.ENTERPRISE);

export const withAdminAccess = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) =>
  withPlanAuth(handler, UserPlan.ENTERPRISE);
