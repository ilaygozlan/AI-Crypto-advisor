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

  const BASE = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000';
  const res = await fetch(`${BASE}/api/news?${qs}`, {
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Accept': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error(`News fetch failed: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Refresh news manually (admin/debug endpoint)
 */
export async function refreshNews(): Promise<{ ok: boolean; saved: number; errors: number }> {
  const BASE = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000';
  const res = await fetch(`${BASE}/api/news/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error(`News refresh failed: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Check news service health
 */
export async function checkNewsHealth(): Promise<{ status: string; timestamp: string; service: string }> {
  const BASE = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000';
  const res = await fetch(`${BASE}/api/news/health`, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error(`News health check failed: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}
