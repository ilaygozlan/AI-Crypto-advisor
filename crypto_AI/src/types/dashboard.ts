export interface NewsItem {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  votes: {
    up: number
    down: number
  }
  userVote?: 'up' | 'down'
}

export interface PriceData {
  id: string
  symbol: string
  name: string
  currentPrice: number
  priceChange24h: number
  priceChangePercentage24h: number
  sparkline: number[]
  votes: {
    up: number
    down: number
  }
  userVote?: 'up' | 'down'
}

export interface AIInsight {
  id: string
  title: string
  content: string
  generatedAt: string
  votes: {
    up: number
    down: number
  }
  userVote?: 'up' | 'down'
}

export interface MemeItem {
  id: string
  subreddit: string
  title: string
  score: number
  num_comments: number
  permalink: string
  source_url: string
  created_utc: string
  user_reaction?: 'like' | 'dislike' | null
}

export interface VoteRequest {
  section: 'news' | 'prices' | 'ai' | 'meme'
  itemId: string
  vote: 'up' | 'down' | null
}

export interface VoteResponse {
  success: boolean
  newVoteCount: {
    up: number
    down: number
  }
}

export interface InsightSource {
  title?: string
  source_name?: string
  url: string
}

export interface InsightActionable {
  what: string
  why: string
  url: string
}

export interface InsightContentJson {
  title: string
  tl_dr: string
  detail_bullets: string[]
  actionable: InsightActionable[]
  sources: InsightSource[]
}

export interface TodayInsight {
  id: string
  user_id: string
  date_key: string
  provider: string
  model: string
  prompt_tokens: number | null
  completion_tokens: number | null
  title: string
  tl_dr: string | null
  content_md: string
  content_json: InsightContentJson
  sources: InsightSource[]
  created_at: string
  updated_at: string
  generated_at: string
  user_reaction?: 'like' | 'dislike' | null
}