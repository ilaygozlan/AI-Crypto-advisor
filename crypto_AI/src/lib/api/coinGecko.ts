import { COINGECKO_API_URL, COINGECKO_API_KEY } from '@/config';

// Types for CoinGecko API responses
export interface CoinGeckoPrice {
  [coinId: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
}

export interface CoinGeckoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

/**
 * Makes a request to CoinGecko API with proper headers
 */
async function coinGeckoRequest<T>(endpoint: string): Promise<T> {
  console.log('🔑 CoinGecko API Key:', COINGECKO_API_KEY ? `Present (${COINGECKO_API_KEY.substring(0, 8)}...)` : 'Using Free API');
  console.log('🌐 CoinGecko API URL:', COINGECKO_API_URL);
  console.log('📍 Endpoint:', endpoint);
  
  const url = `${COINGECKO_API_URL}${endpoint}`;
  console.log('🔗 Full API URL:', url);
  
  // Conditionally include Pro API header
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  // Only add Pro API key header if using Pro API
  if (COINGECKO_API_KEY && COINGECKO_API_KEY.startsWith('CG-')) {
    headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;
  }
  
  console.log('📋 Request headers:', headers);
  
  const response = await fetch(url, {
    headers,
  });

  console.log('📡 Response status:', response.status, response.statusText);

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches simple price data for multiple coins
 * @param ids Comma-separated list of CoinGecko IDs
 * @param vsCurrency Currency to compare against (default: usd)
 * @returns Price data with 24h change
 */
export async function getPrices(
  ids: string[], 
  vsCurrency: string = 'usd'
): Promise<CoinGeckoPrice> {
  const idsParam = ids.join(',');
  const endpoint = `/simple/price?ids=${idsParam}&vs_currencies=${vsCurrency}&include_24hr_change=true`;
  
  return coinGeckoRequest<CoinGeckoPrice>(endpoint);
}

/**
 * Fetches market data for multiple coins with enriched information
 * @param ids Comma-separated list of CoinGecko IDs
 * @param vsCurrency Currency to compare against (default: usd)
 * @returns Market data with prices, market cap, and percentage changes
 */
export async function getMarkets(
  ids: string[], 
  vsCurrency: string = 'usd'
): Promise<CoinGeckoMarket[]> {
  const idsParam = ids.join(',');
  const endpoint = `/coins/markets?ids=${idsParam}&vs_currency=${vsCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d`;
  
  return coinGeckoRequest<CoinGeckoMarket[]>(endpoint);
}

/**
 * Fetches chart data for a specific coin
 * @param coinId CoinGecko ID of the coin
 * @param vsCurrency Currency to compare against (default: usd)
 * @param days Number of days for the chart (1, 7, 30, 90, 365)
 * @returns Chart data with prices, market caps, and volumes
 */
export async function getChart(
  coinId: string, 
  vsCurrency: string = 'usd', 
  days: number = 7
): Promise<CoinGeckoChartData> {
  const endpoint = `/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`;
  
  return coinGeckoRequest<CoinGeckoChartData>(endpoint);
}
