import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Asset = 'BTC' | 'ETH' | 'SOL' | 'ADA' | 'DOT' | 'MATIC' | 'AVAX' | 'LINK'
export type InvestorType = 'HODLer' | 'Day Trader' | 'NFT Collector'
export type ContentType = 'Market News' | 'Charts' | 'Social' | 'Fun'

interface PreferencesState {
  assets: Asset[]
  investorType: InvestorType | null
  contentTypes: ContentType[]
  setAssets: (assets: Asset[]) => void
  setInvestorType: (type: InvestorType) => void
  setContentTypes: (types: ContentType[]) => void
}

export const usePrefsStore = create<PreferencesState>()(
  persist(
    (set, _get) => ({
      assets: [],
      investorType: null,
      contentTypes: [],
      setAssets: (assets) => set({ assets }),
      setInvestorType: (investorType) => set({ investorType }),
      setContentTypes: (contentTypes) => set({ contentTypes }),
    }),
    {
      name: 'prefs-storage',
    }
  )
)
