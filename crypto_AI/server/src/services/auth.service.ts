import { UserService } from './user.service';
import { OnboardingService } from './onboarding.service';
import { TokenService } from './token.service';
import { RefreshTokenRepository } from '../repos/refresh-token.repo';
import { SignupData, LoginData } from '../schemas/auth.schemas';
import { logger } from '../utils/logger';

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export class AuthService {
  constructor(
    private userService: UserService,
    private onboardingService: OnboardingService,
    private tokenService: TokenService,
    private refreshTokenRepo: RefreshTokenRepository
  ) {}

  async signup(data: SignupData): Promise<AuthResult> {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = await this.userService.createUser({
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    });

    await this.onboardingService.saveAnswers(user.id, data.onboarding);

    const { token: refreshToken, hash, expiresAt } = this.tokenService.generateRefreshToken();
    await this.refreshTokenRepo.create({
      user_id: user.id,
      token_hash: hash,
      expires_at: expiresAt,
    });

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    logger.info('User signed up successfully', { userId: user.id, email: user.email });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }

  async login(data: LoginData): Promise<AuthResult> {
    const user = await this.userService.verifyCredentials(data.email, data.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    await this.refreshTokenRepo.revokeByUserId(user.id);

    const { token: refreshToken, hash, expiresAt } = this.tokenService.generateRefreshToken();
    await this.refreshTokenRepo.create({
      user_id: user.id,
      token_hash: hash,
      expires_at: expiresAt,
    });

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const tokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const tokenRecord = await this.refreshTokenRepo.findByTokenHash(tokenHash);
    
    if (!tokenRecord) {
      throw new Error('Invalid refresh token');
    }

    await this.refreshTokenRepo.revokeById(tokenRecord.id);

    const { token: newRefreshToken, hash: newHash, expiresAt } = this.tokenService.generateRefreshToken();
    await this.refreshTokenRepo.create({
      user_id: tokenRecord.user_id,
      token_hash: newHash,
      expires_at: expiresAt,
    });

    const user = await this.userService.findById(tokenRecord.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    logger.info('Token refreshed successfully', { userId: user.id });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    if (refreshToken) {
      const tokenHash = this.tokenService.hashRefreshToken(refreshToken);
      await this.refreshTokenRepo.revokeByTokenHash(tokenHash);
    }
  }
}
