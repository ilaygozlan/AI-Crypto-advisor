import rateLimit from 'express-rate-limit';
export const authLimiter = rateLimit({
  windowMs: 1*60*1000, // 15 min break
  max: 3,               //max login/signup 
  standardHeaders: true,
  legacyHeaders: false,
});