import 'dotenv/config';
import fetch from 'node-fetch';

const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token'; // This is always www
const OAUTH_BASE = 'https://oauth.reddit.com';                  // Note: without www

function ensureEnv(keys) {
  for (const k of keys) if (!process.env[k]) throw new Error(`Missing env ${k}`);
}
ensureEnv(['REDDIT_CLIENT_ID','REDDIT_USER_AGENT','REDDIT_REFRESH_TOKEN']);
// secret can be empty if the application is an "installed app"
const useBasicAuth = !!process.env.REDDIT_CLIENT_SECRET;

let cached = { accessToken: null, exp: 0 };

async function getAccessToken() {
  const now = Math.floor(Date.now()/1000);
  if (cached.accessToken && now < cached.exp - 30) return cached.accessToken;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: process.env.REDDIT_REFRESH_TOKEN,
  });

  const headers = {
    'User-Agent': process.env.REDDIT_USER_AGENT,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (useBasicAuth) {
    const basic = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
    headers['Authorization'] = `Basic ${basic}`;
  } else {
    // installed app flow (no secret): client_id in body
    body.set('client_id', process.env.REDDIT_CLIENT_ID);
  }

  const resp = await fetch(TOKEN_URL, { method: 'POST', headers, body });
  if (!resp.ok) throw new Error(`token exchange failed: ${resp.status} ${await resp.text()}`);
  const data = await resp.json();

  cached.accessToken = data.access_token;
  cached.exp = now + (data.expires_in || 3600);
  return cached.accessToken;
}

export async function redditGetJson(path, { params = {} } = {}) {
  const token = await getAccessToken();
  const url = new URL(OAUTH_BASE + path);
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, String(v)));

  const resp = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': process.env.REDDIT_USER_AGENT,
    },
  });
  if (!resp.ok) throw new Error(`reddit GET ${url.pathname} failed: ${resp.status}`);
  return resp.json();
}