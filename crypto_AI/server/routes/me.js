import express from 'express';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  // req.user is set by requireAuth
  res.json({ user: req.user });
});

export default router;