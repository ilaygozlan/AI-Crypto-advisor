import { Router, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthMiddleware, AuthenticatedRequest } from '../middlewares/auth';
import { TokenService } from '../services/token.service';
import { logger } from '../utils/logger';

export function createMeRoutes(userService: UserService): Router {
  const router = Router();
  const tokenService = new TokenService();
  const authMiddleware = new AuthMiddleware(tokenService);

  router.get('/', authMiddleware.authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = await userService.findById(req.user.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      });
    } catch (error) {
      logger.error('Get current user failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({ error: 'Failed to get user information' });
    }
  });

  return router;
}
