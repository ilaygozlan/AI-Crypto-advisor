import { Request, Response } from 'express';
import { testConnection } from '../utils/db';

export const dbHealthHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const isHealthy = await testConnection();
    if (isHealthy) {
      res.json({ db: 'ok' });
    } else {
      res.status(503).json({ db: 'error' });
    }
  } catch (error) {
    res.status(503).json({ db: 'error' });
  }
};
