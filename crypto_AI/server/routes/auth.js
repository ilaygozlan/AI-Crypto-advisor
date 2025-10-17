import express from 'express';
import cookieParser from 'cookie-parser';
import { pool } from '../DB.js';
import { createUser, findUserByEmail, verifyPassword } from '../services/user.service.js';
import { signAccessToken, generateRefreshToken } from '../services/token.service.js';
import { sha256Base64 } from '../utils/crypto.js';
import { saveUserData } from '../services/userData.service.js';
import { loginLimiter, signupLimiter } from '../security/rateLimit.js';

const router = express.Router();

// Attach cookie-parser locally (or in app)
router.use(cookieParser());

// Helpers
function setRefreshCookie(res, token, maxAgeMs) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/auth',
    maxAge: maxAgeMs
  });
}

// POST /auth/signup
router.post('/signup', signupLimiter, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    if (password.length < 8) return res.status(400).json({ error: 'password must be at least 8 chars' });

    const exists = await findUserByEmail(email);
    if (exists) return res.status(409).json({ error: 'email already in use' });

    const user = await createUser({ email, password, firstName, lastName });

if (req.body.data) {
  const { investorType, selectedAssets, selectedContentTypes } = req.body.data;
  await saveUserData({
    userId: user.id,
    investorType,
    selectedAssets,
    selectedContentTypes
  });
}

    // tokens
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const { token: refreshToken, hash: refreshHash, expiresAt } = generateRefreshToken();

    // persist refresh (rotation-ready)
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refreshHash, expiresAt]
    );

    // set cookie
    setRefreshCookie(res, refreshToken, expiresAt.getTime() - Date.now());

    return res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (err) {
  console.error('signup error:', {
    message: err?.message,
    code: err?.code,
    detail: err?.detail,
    stack: err?.stack
  });
  return res.status(500).json({ error: 'signup_failed', reason: err?.message, code: err?.code });
}

});

// POST /auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const { token: refreshToken, hash: refreshHash, expiresAt } = generateRefreshToken();

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refreshHash, expiresAt]
    );

    setRefreshCookie(res, refreshToken, expiresAt.getTime() - Date.now());

    return res.json({
      accessToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'login_failed' });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const cookie = req.cookies?.refresh_token;
    if (!cookie) return res.status(401).json({ error: 'no_refresh_token' });

    const hash = sha256Base64(cookie);
    const { rows } = await pool.query(
      `SELECT id, user_id AS "userId", expires_at AS "expiresAt", revoked_at AS "revokedAt"
       FROM refresh_tokens WHERE token_hash = $1`,
      [hash]
    );
    const rt = rows[0];
    if (!rt || rt.revokedAt) return res.status(401).json({ error: 'invalid_refresh' });
    if (new Date(rt.expiresAt).getTime() <= Date.now()) return res.status(401).json({ error: 'refresh_expired' });

    // rotate
    await pool.query(`UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1 AND revoked_at IS NULL`, [rt.id]);

    // fetch user for new access token
    const { rows: userRows } = await pool.query(
      `SELECT id, email FROM users WHERE id = $1`,
      [rt.userId]
    );
    const user = userRows[0];
    if (!user) return res.status(401).json({ error: 'user_not_found' });

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const { token: newRefresh, hash: newHash, expiresAt } = generateRefreshToken();

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, newHash, expiresAt]
    );

    setRefreshCookie(res, newRefresh, expiresAt.getTime() - Date.now());
    return res.json({ accessToken });
  } catch (err) {
    console.error('refresh error', err);
    return res.status(500).json({ error: 'refresh_failed' });
  }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  try {
    const cookie = req.cookies?.refresh_token;
    if (cookie) {
      const hash = sha256Base64(cookie);
      await pool.query(
        `UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL`,
        [hash]
      );
    }
    res.clearCookie('refresh_token', { path: '/auth' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('logout error', err);
    return res.status(500).json({ error: 'logout_failed' });
  }
});

export default router;
