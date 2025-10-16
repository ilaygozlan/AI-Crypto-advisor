import { SERVER_URL } from '@/config';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  try {
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
  } catch {}
}

export function getAccessToken() {
  if (accessToken) return accessToken;
  try {
    const t = localStorage.getItem('accessToken');
    if (t) accessToken = t;
  } catch {}
  return accessToken;
}

export async function request<T>(
  path: string,
  opts: RequestInit & { retry?: boolean } = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as any),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${SERVER_URL}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body,
    credentials: 'include', // important for refresh cookie
  });

  if (res.status === 401 && !opts.retry) {
    // try a one-time refresh
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(path, { ...opts, retry: true });
    }
  }

  if (!res.ok) {
    let errJson: any = null;
    try { errJson = await res.json(); } catch {}
    const errorMessage = errJson?.error || errJson?.message || errJson?.details || `HTTP ${res.status}`;
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

export async function signup(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  // onboarding form shape
  data: {
    investorType: 'day_trader' | 'investor' | 'conservative' | string;
    selectedAssets: string[];
    selectedContentTypes: string[];
    completedAt: string; // ISO string
  };
}) {
  const res = await request<{ accessToken: string; user: any }>(
    '/auth/signup',
    { method: 'POST', body: JSON.stringify(data) }
  );
  setAccessToken(res.accessToken);
  return res;
}

export async function login(data: { email: string; password: string }) {
  const res = await request<{ accessToken: string; user: any }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify(data) }
  );
  setAccessToken(res.accessToken);
  return res;
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await request<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      retry: true,
    });
    if (res?.accessToken) {
      setAccessToken(res.accessToken);
      return true;
    }
  } catch {
    setAccessToken(null);
  }
  return false;
}

export async function logout() {
  await request('/auth/logout', { method: 'POST' });
  setAccessToken(null);
}

export async function getMe() {
  return request<{ user: { id: string; email: string } }>('/me');
}

export async function getMyData() {
  return request<{ data: Array<{
    id: string;
    userId: string;
    investorType: string;
    selectedAssets: string[];
    selectedContentTypes: string[];
    completedAt: string;
  }> }>('/me/data');
}
