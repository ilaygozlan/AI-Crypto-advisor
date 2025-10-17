// Personalization scoring utilities

import type { CryptoPanicPost } from './cryptoPanic'
import type { PersonalizationWeights, ReactionType } from './cryptoPrefs'
import { extractTags } from './cryptoPanic'

export interface ScoredPost extends CryptoPanicPost {
  personalizationScore: number
  userReaction: ReactionType | null
}

// Calculate time decay bonus (newer posts get higher scores)
function calculateTimeDecay(publishedAt: string): number {
  const published = new Date(publishedAt).getTime()
  const now = Date.now()
  const hoursAgo = (now - published) / (1000 * 60 * 60)
  
  // Linear decay over 48 hours
  return Math.max(0, 10 - (hoursAgo / 48) * 10)
}

// Calculate popularity boost from votes
function calculatePopularityBoost(votes: CryptoPanicPost['votes']): number {
  const total = (votes?.positive ?? 0) + (votes?.negative ?? 0)
  if (total === 0) return 0
  
  const ratio = (votes?.positive ?? 0) / total
  // Small boost for positive sentiment
  return (ratio - 0.5) * 2
}

// Calculate personalization score for a post
export function calculatePersonalizationScore(
  post: CryptoPanicPost,
  weights: PersonalizationWeights,
  userReaction: ReactionType | null,
  onboardingAssets: string[],
  currentFilter: string,
  investorType: string
): number {
  let score = 0

  // Base popularity boost
  score += calculatePopularityBoost(post.votes)

  // Time decay bonus
  score += calculateTimeDecay(post.published_at)

  // Asset preference bonus
  if (post.currencies) {
    const matchingAssets = post.currencies.filter(currency => 
      onboardingAssets.includes(currency.code)
    )
    score += matchingAssets.length * 5

    // Weight-based asset bonus
    post.currencies.forEach(currency => {
      const assetWeight = weights.assets[currency.code] || 0
      score += assetWeight * 2
    })
  }

  // Source preference bonus
  const sourceKey = post.source?.title?.toLowerCase().replace(/\s+/g, '_') ?? 'unknown'
  const sourceWeight = weights.sources[sourceKey] || 0
  score += sourceWeight * 3

  // Tag preference bonus
  const tags = extractTags(post)
  tags.forEach(tag => {
    const tagWeight = weights.tags[tag] || 0
    score += tagWeight * 1.5
  })

  // User reaction bonus
  if (userReaction === 'like') {
    score += 15
  } else if (userReaction === 'dislike') {
    score -= 10
  }

  // Filter alignment bonus
  if (investorType === 'day_trader' && (currentFilter === 'hot' || currentFilter === 'rising')) {
    score += 3
  } else if (investorType !== 'day_trader' && currentFilter === 'important') {
    score += 3
  }

  // Important news bonus for conservative investors
  if (investorType === 'conservative' && (post.votes?.important ?? 0) > 0) {
    score += 5
  }

  return Math.max(0, score)
}

// Update weights based on user reaction
export function updateWeights(
  weights: PersonalizationWeights,
  post: CryptoPanicPost,
  reaction: ReactionType | null,
  previousReaction: ReactionType | null
): PersonalizationWeights {
  const newWeights = {
    assets: { ...weights.assets },
    tags: { ...weights.tags },
    sources: { ...weights.sources }
  }

  // Calculate weight change
  let weightChange = 0
  if (reaction === 'like') weightChange = 1
  else if (reaction === 'dislike') weightChange = -0.5
  
  // Reverse previous reaction if it exists
  if (previousReaction === 'like') weightChange -= 1
  else if (previousReaction === 'dislike') weightChange += 0.5

  // Update asset weights
  if (post.currencies) {
    post.currencies.forEach(currency => {
      const key = currency.code
      newWeights.assets[key] = (newWeights.assets[key] || 0) + weightChange * 0.5
    })
  }

  // Update source weight
  const sourceKey = post.source?.title?.toLowerCase().replace(/\s+/g, '_') ?? 'unknown'
  newWeights.sources[sourceKey] = (newWeights.sources[sourceKey] || 0) + weightChange

  // Update tag weights
  const tags = extractTags(post)
  tags.forEach(tag => {
    newWeights.tags[tag] = (newWeights.tags[tag] || 0) + weightChange * 0.3
  })

  return newWeights
}

// Sort posts by personalization score
export function sortPostsByScore(posts: ScoredPost[]): ScoredPost[] {
  return [...posts].sort((a, b) => b.personalizationScore - a.personalizationScore)
}
