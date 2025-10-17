// CryptoPanic API utilities

export interface CryptoPanicPost {
  id: number
  title: string
  url?: string
  published_at: string
  created_at: string
  domain?: string
  slug: string
  kind: string
  description?: string
  source?: {
    title: string
    region: string
    domain: string
  }
  currencies?: Array<{
    code: string
    title: string
    slug: string
    url: string
  }>
  votes?: {
    negative: number
    positive: number
    important: number
    liked: number
    disliked: number
    lol: number
    toxic: number
    saved: number
    comments: number
  }
  metadata?: {
    description?: string
  }
}

export interface CryptoPanicResponse {
  count: number
  next: string | null
  previous: string | null
  results: CryptoPanicPost[]
}

export type FilterType = 'hot' | 'rising' | 'important' | 'bullish' | 'bearish'

// Build CryptoPanic API URL
export function buildCryptoPanicUrl(
  filter: FilterType,
  assets: string[],
  page = 1
): string {
  // Use proxy to avoid CORS issues
  const baseUrl = 'https://cryptopanic.com/api/developer/v2/posts/'
  const params = new URLSearchParams()
  
  // Required parameters
  params.append('auth_token', getApiToken())
  params.append('filter', filter)
  params.append('kind', 'news')
  params.append('public', 'true')
  params.append('regions', 'en')
  
  // Currencies
  if (assets.length > 0) {
    params.append('currencies', assets.join(','))
  }
  
  // Pagination
  if (page > 1) {
    params.append('page', page.toString())
  }
  
  return `${baseUrl}?${params.toString()}`
}

// Get API token from environment
function getApiToken(): string {
  console.log('🔍 Environment variables check:', {
    env: (import.meta as any).env,
    token: (import.meta as any).env?.VITE_CRYPTOPANIC_TOKEN,
    allEnvKeys: Object.keys((import.meta as any).env || {})
  })
  
  const token = (import.meta as any).env?.VITE_CRYPTOPANIC_TOKEN || '3723635d4a6332021e486543490a5dfc19b5167a'
  if (!token) {
    console.error('❌ VITE_CRYPTOPANIC_TOKEN not found in environment variables')
    throw new Error('VITE_CRYPTOPANIC_TOKEN environment variable is required')
  }
  console.log('✅ Using CryptoPanic token:', token.substring(0, 8) + '...')
  return token
}

// Fetch posts from CryptoPanic API
export async function fetchCryptoPanicPosts(
  filter: FilterType,
  assets: string[],
  page = 1,
  signal?: AbortSignal
): Promise<CryptoPanicResponse> {
  // Try with assets first
  let url = buildCryptoPanicUrl(filter, assets, page)
  
  console.log('🔄 Attempting CryptoPanic API call:', {
    filter,
    assets,
    page,
    url: url.split('?')[0] // Log base URL without sensitive token
  })
  
  console.log('🌐 Full URL (with token):', url)
  
  let response = await fetch(url, {
    signal,
    headers: {
      'Accept': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`CryptoPanic API error: ${response.status} ${response.statusText}`)
  }
  let data = await response.json()
  console.log('🔍 CryptoPanic API Response:', data)

  // If no results with specific assets, try without asset filter
  if (data.results.length === 0 && assets.length > 0) {
    console.log('⚠️ No results with specific assets, trying without asset filter...')
    
    url = buildCryptoPanicUrl(filter, [], page)
    response = await fetch(url, {
      signal,
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`CryptoPanic API error: ${response.status} ${response.statusText}`)
    }
    
    data = await response.json()
  }
  
  // Log successful API call
  console.log('✅ CryptoPanic API Success:', {
    filter,
    assets,
    page,
    postsCount: data.results?.length || 0,
    totalCount: data.count || 0,
    url: url.split('?')[0], // Log base URL without sensitive token
    usedAssetFilter: assets.length > 0 && data.results?.length > 0,
    samplePost: data.results?.[0] ? {
      id: data.results[0].id,
      title: data.results[0].title,
      published_at: data.results[0].published_at
    } : null
  })
  
  return data
}

// Extract hostname from URL
export function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'unknown'
  }
}

// Format date to localized string
export function formatPublishedDate(publishedAt: string): string {
  const date = new Date(publishedAt)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date)
}

// Extract tags from post
export function extractTags(post: CryptoPanicPost): string[] {
  const tags: string[] = []
  
  // Add currency tags
  if (post.currencies) {
    tags.push(...post.currencies.map(c => c.code))
  }
  
  // Add source tag
  tags.push(post.source?.title?.toLowerCase().replace(/\s+/g, '_') ?? 'unknown')
  
  // Add region tag
  if (post.source?.region) {
    tags.push(post.source.region.toLowerCase())
  }
  
  return tags
}
