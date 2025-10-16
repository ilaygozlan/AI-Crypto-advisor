import { OnboardingRepository, CreateOnboardingData } from '../repos/onboarding.repo';

export class OnboardingService {
  constructor(private onboardingRepo: OnboardingRepository) {}

  async saveAnswers(userId: string, answers: Record<string, any>): Promise<void> {
    const existing = await this.onboardingRepo.findByUserId(userId);
    
    if (existing) {
      await this.onboardingRepo.updateByUserId(userId, answers);
    } else {
      await this.onboardingRepo.create({ user_id: userId, answers });
    }
  }

  async getAnswers(userId: string): Promise<Record<string, any> | null> {
    const result = await this.onboardingRepo.findByUserId(userId);
    return result?.answers || null;
  }
}
