export type OnboardingPayload = {
  success: boolean;
  data: {
    id: string;
    userId: string;
    investorType: "day_trader" | "investor" | "conservative" | string;
    selectedAssets: string[];
    selectedContentTypes: string[];
    completedAt: string;
  };
  message: string;
};

// This is the sample provided by the product:
export const onboarding: OnboardingPayload = {
  success: true,
  data: {
    id: "1",
    userId: "1",
    investorType: "conservative",
    selectedAssets: ["BTC", "ETH"],
    selectedContentTypes: ["news", "prices"],
    completedAt: new Date().toISOString(),
  },
  message: "Onboarding completed successfully",
};
