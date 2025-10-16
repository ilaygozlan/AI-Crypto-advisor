import { Router } from 'express';
import { healthHandler } from './health';
import { versionHandler } from './version';
import { dbHealthHandler } from './db';
import { createAuthRoutes } from './auth';
import { createMeRoutes } from './me';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { OnboardingService } from '../services/onboarding.service';
import { UserRepository } from '../repos/user.repo';
import { OnboardingRepository } from '../repos/onboarding.repo';
import { RefreshTokenRepository } from '../repos/refresh-token.repo';

const router = Router();

// Health check routes
router.get('/health', healthHandler);
router.get('/version', versionHandler);
router.get('/db/health', dbHealthHandler);

// Initialize services
const userRepo = new UserRepository();
const onboardingRepo = new OnboardingRepository();
const refreshTokenRepo = new RefreshTokenRepository();
const tokenService = new TokenService();
const userService = new UserService(userRepo);
const onboardingService = new OnboardingService(onboardingRepo);
const authService = new AuthService(userService, onboardingService, tokenService, refreshTokenRepo);

// Auth routes
router.use('/auth', createAuthRoutes(authService));

// Protected routes
router.use('/me', createMeRoutes(userService));

export { router };
