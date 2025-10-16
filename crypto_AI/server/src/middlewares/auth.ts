import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class AuthMiddleware {
  constructor(private tokenService: TokenService) {}

  authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization header' });
        return;
      }

      const token = authHeader.substring(7);
      const payload = this.tokenService.verifyAccessToken(token);
      
      req.user = {
        id: payload.sub,
        email: payload.email,
      };

      next();
    } catch (error) {
      logger.warn('Authentication failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        res.status(401).json({ 
          error: 'Token expired',
          code: 'token_expired'
        });
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    }
  };
}
