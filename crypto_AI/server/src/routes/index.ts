import { Router } from 'express';
import { healthHandler } from './health';
import { versionHandler } from './version';
import { dbHealthHandler } from './db';

const router = Router();

router.get('/health', healthHandler);
router.get('/version', versionHandler);
router.get('/db/health', dbHealthHandler);

export { router };
