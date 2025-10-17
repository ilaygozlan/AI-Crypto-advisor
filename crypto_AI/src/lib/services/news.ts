// Client-side news service for fetching from our server
export interface NewsItem {
  id: string
  title: string
  url: string
  published_at: string
  currencies: string[]
  is_important: boolean
  source: string
  raw?: any
}

export interface NewsParams {
  filter?: string
  kind?: string
  public?: string
  regions?: string
  currencies?: string
  page?: string
  limit?: string
  cursor?: string
  important?: string
}

/**
 * Fetch news from our server API
 */
export async function fetchNews(params: NewsParams = {}): Promise<NewsItem[]> {
  const qs = new URLSearchParams({
    filter: params.filter ?? 'important',
    kind: params.kind ?? 'news',
    public: params.public ?? 'true',
    regions: params.regions ?? 'en',
    currencies: params.currencies ?? 'BTC,ETH,SOL',
    ...(params.page ? { page: params.page } : {}),
    ...(params.limit ? { limit: params.limit } : {}),
    ...(params.cursor ? { cursor: params.cursor } : {}),
    ...(params.important !== undefined ? { important: params.important } : {}),
  }).toString();

  // Import the authenticated request function
  const { request } = await import('@/lib/api');
  
  return request<NewsItem[]>(`/api/news?${qs}`);
}

/**
 * Refresh news manually (admin/debug endpoint)
 */
export async function refreshNews(): Promise<{ ok: boolean; saved: number; errors: number }> {
  const { request } = await import('@/lib/api');
  return request<{ ok: boolean; saved: number; errors: number }>('/api/news/refresh', {
    method: 'POST'
  });
}

/**
 * Check news service health
 */
export async function checkNewsHealth(): Promise<{ status: string; timestamp: string; service: string }> {
  const { request } = await import('@/lib/api');
  return request<{ status: string; timestamp: string; service: string }>('/api/news/health');
}
