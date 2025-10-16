import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { SignupSchema, LoginSchema } from '../schemas/auth.schemas';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

export function createAuthRoutes(authService: AuthService): Router {
  const router = Router();

  router.post('/signup', async (req: Request, res: Response) => {
    try {
      const data = SignupSchema.parse(req.body);
      const result = await authService.signup(data);

      res.status(201).json(result);
    } catch (error) {
      logger.error('Signup failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (error instanceof Error && error.message === 'User with this email already exists') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Signup failed' });
      }
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const data = LoginSchema.parse(req.body);
      const result = await authService.login(data);

      res.json(result);
    } catch (error) {
      logger.error('Login failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Login failed' });
      }
    }
  });

  router.post('/refresh', async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        res.status(401).json({ error: 'No refresh token provided' });
        return;
      }

      const result = await authService.refresh(refreshToken);

      res.json(result);
    } catch (error) {
      logger.error('Token refresh failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  });

  router.post('/logout', async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.clearCookie('refresh_token', { path: '/auth' });
      res.json({ ok: true });
    } catch (error) {
      logger.error('Logout failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  return router;
}
