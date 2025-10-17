import { verifyAccessToken } from '../services/token.service.js';

export function requireAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || '';
    const [, token] = hdr.split(' ');
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });
    const payload = verifyAccessToken(token);
    req.user = { 
      id: payload.sub, 
      email: payload.email, 
      firstName: payload.firstName, 
      lastName: payload.lastName 
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid/expired token' });
  }
}