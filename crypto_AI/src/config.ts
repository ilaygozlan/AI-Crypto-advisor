export const SERVER_URL =
  (import.meta as any).env?.VITE_SERVER_URL ??
  'https://ai-crypto-advisor-2oxd.onrender.com';

// CoinGecko API Configuration
export const COINGECKO_API_KEY = (import.meta as any).env?.VITE_CG_API_KEY;

// Detect API key type and set base URL
const isProKey = COINGECKO_API_KEY && COINGECKO_API_KEY.startsWith('CG-');
export const COINGECKO_API_URL = isProKey 
  ? 'https://pro-api.coingecko.com/api/v3'
  : 'https://api.coingecko.com/api/v3';

// Log which API is being used
console.log(`🔧 Using CoinGecko ${isProKey ? 'Pro' : 'Free'} API`);
console.log('  - Base URL:', COINGECKO_API_URL);
console.log('  - API Key:', COINGECKO_API_KEY ? 'Present' : 'Missing');

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  PRICES: 30 * 1000, // 30 seconds
  MARKETS: 60 * 1000, // 1 minute
  CHARTS: 2 * 60 * 1000, // 2 minutes
} as const;
