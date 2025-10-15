// localStorage utilities for crypto news preferences and reactions

export type FilterType = 'hot' | 'rising' | 'important' | 'bullish' | 'bearish'
export type ReactionType = 'like' | 'dislike'

export interface PersonalizationWeights {
  assets: Record<string, number>
  tags: Record<string, number>
  sources: Record<string, number>
}

export interface CryptoPreferences {
  filter: FilterType
  assets: string[]
  weights: PersonalizationWeights
}

// localStorage keys
const KEYS = {
  FILTER: 'crypto:filter',
  ASSETS: 'crypto:assets', 
  REACTIONS: 'crypto:reactions',
  WEIGHTS: 'crypto:weights'
} as const

// Safe localStorage helpers
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to save ${key}:`, error)
  }
}

// Filter preferences
export function getFilter(): FilterType {
  return safeGet(KEYS.FILTER, 'hot')
}

export function setFilter(filter: FilterType): void {
  safeSet(KEYS.FILTER, filter)
}

// Asset preferences
export function getAssets(): string[] {
  return safeGet(KEYS.ASSETS, [])
}

export function setAssets(assets: string[]): void {
  safeSet(KEYS.ASSETS, assets)
}

// Reactions
export function getReactions(): Record<string, ReactionType> {
  return safeGet(KEYS.REACTIONS, {})
}

export function setReactions(reactions: Record<string, ReactionType>): void {
  safeSet(KEYS.REACTIONS, reactions)
}

export function setReaction(postId: string, reaction: ReactionType | null): void {
  const reactions = getReactions()
  if (reaction === null) {
    delete reactions[postId]
  } else {
    reactions[postId] = reaction
  }
  setReactions(reactions)
}

// Personalization weights
export function getWeights(): PersonalizationWeights {
  return safeGet(KEYS.WEIGHTS, {
    assets: {},
    tags: {},
    sources: {}
  })
}

export function setWeights(weights: PersonalizationWeights): void {
  safeSet(KEYS.WEIGHTS, weights)
}

// Combined preferences
export function getPreferences(): CryptoPreferences {
  return {
    filter: getFilter(),
    assets: getAssets(),
    weights: getWeights()
  }
}

export function setPreferences(prefs: Partial<CryptoPreferences>): void {
  if (prefs.filter !== undefined) setFilter(prefs.filter)
  if (prefs.assets !== undefined) setAssets(prefs.assets)
  if (prefs.weights !== undefined) setWeights(prefs.weights)
}

// Reset to defaults
export function resetPreferences(): void {
  localStorage.removeItem(KEYS.FILTER)
  localStorage.removeItem(KEYS.ASSETS)
  localStorage.removeItem(KEYS.REACTIONS)
  localStorage.removeItem(KEYS.WEIGHTS)
}
