import 'dotenv/config';
import cron from 'node-cron';
import { pgPool } from '../memeDB/memeDB.js';

const CRYPTOPANIC_BASE_URL = 'https://cryptopanic.com/api/developer/v2';
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
const DEFAULT_CURRENCIES = ['BTC', 'ETH', 'SOL']; // More reliable default

// In-memory cache to avoid rate limits
const cache = new Map();

/**
 * Build CryptoPanic API URL with parameters
 */
function buildCryptoPanicUrl(params = {}) {
  const {
    filter = 'important',
    kind = 'news',
    public: isPublic = 'true',
    regions = 'en',
    currencies = DEFAULT_CURRENCIES,
    page = 1
  } = params;

  const urlParams = new URLSearchParams();
  urlParams.append('auth_token', process.env.CRYPTOPANIC_TOKEN);
  urlParams.append('filter', filter);
  urlParams.append('kind', kind);
  urlParams.append('public', isPublic);
  urlParams.append('regions', regions);
  
  if (currencies && currencies.length > 0) {
    urlParams.append('currencies', currencies.join(','));
  }
  
  if (page > 1) {
    urlParams.append('page', page.toString());
  }

  return `${CRYPTOPANIC_BASE_URL}/posts/?${urlParams.toString()}`;
}

/**
 * Fetch news from CryptoPanic API
 */
export async function fetchNewsFromUpstream(params = {}) {
  const url = buildCryptoPanicUrl(params);
  console.log('url: ',url);
  console.log(`[news] Fetching from CryptoPanic: ${url.split('?')[0]}...`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoAI-Advisor/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`CryptoPanic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[news] Fetched ${data.results?.length || 0} items from CryptoPanic`);
    
    return data;
  } catch (error) {
    console.error('[news] Error fetching from CryptoPanic:', error.message);
    throw error;
  }
}

/**
 * Normalize CryptoPanic data to our internal format
 */
export function normalizeNews(upstreamJson) {
  if (!upstreamJson.results || !Array.isArray(upstreamJson.results)) {
    return [];
  }

  return upstreamJson.results.map(item => ({
    source_id: String(item.id),
    title: item.title || '',
    url: item.url || '',
    published_at: new Date(item.published_at || item.created_at),
    currencies: item.currencies?.map(c => c.code) || [],
    is_important: item.votes?.important > 0 || false,
    source: 'cryptopanic',
    raw: item
  }));
}

/**
 * Save news items to database (UPSERT)
 */
export async function saveNewsBatch(items) {
  if (!items || items.length === 0) {
    return { saved: 0, errors: 0 };
  }

  let saved = 0;
  let errors = 0;

  for (const item of items) {
    try {
      const sql = `
        INSERT INTO news_items (source_id, title, url, published_at, currencies, is_important, source, raw)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (source, url) DO UPDATE SET
          title = EXCLUDED.title,
          published_at = EXCLUDED.published_at,
          currencies = EXCLUDED.currencies,
          is_important = EXCLUDED.is_important,
          raw = EXCLUDED.raw
      `;
      
      const values = [
        item.source_id,
        item.title,
        item.url,
        item.published_at,
        item.currencies,
        item.is_important,
        item.source,
        JSON.stringify(item.raw)
      ];

      await pgPool.query(sql, values);
      saved++;
    } catch (error) {
      console.warn(`[news] Error saving item ${item.source_id}:`, error.message);
      errors++;
    }
  }

  console.log(`[news] Saved ${saved} items, ${errors} errors`);
  return { saved, errors };
}

/**
 * Get news from database with pagination and filtering
 */
export async function getNewsFromDb({ 
  limit = 24, 
  cursor = null, 
  currencies = null, 
  important = null 
} = {}) {
  const params = [];
  const whereConditions = [];

  // Add currency filter
  if (currencies && currencies.length > 0) {
    params.push(currencies);
    whereConditions.push(`currencies && $${params.length}`);
  }

  // Add importance filter
  if (important !== null) {
    params.push(important);
    whereConditions.push(`is_important = $${params.length}`);
  }

  // Add cursor for pagination
  if (cursor && !isNaN(new Date(cursor).getTime())) {
    params.push(new Date(cursor).toISOString());
    whereConditions.push(`published_at < $${params.length}::timestamptz`);
  }

  // Add limit
  params.push(Math.min(limit, 100));

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const query = `
    SELECT 
      id,
      source_id,
      title,
      url,
      published_at,
      currencies,
      is_important,
      source,
      raw,
      created_at
    FROM news_items
    ${whereClause}
    ORDER BY published_at DESC
    LIMIT $${params.length}
  `;

  try {
    const { rows } = await pgPool.query(query, params);
    return rows;
  } catch (error) {
    console.error('[news] Error fetching from database:', error.message);
    throw error;
  }
}

/**
 * Initial seed if database is empty
 */
export async function initialSeedIfEmpty() {
  try {
    const { rows } = await pgPool.query('SELECT COUNT(*) as count FROM news_items');
    const count = parseInt(rows[0].count);

    if (count === 0) {
      console.log('[news] Database is empty, performing initial seed...');
      await refreshDaily();
    } else {
      console.log(`[news] Database has ${count} items, skipping initial seed`);
    }
  } catch (error) {
    console.error('[news] Error checking database count:', error.message);
  }
}

/**
 * Refresh news daily (fetch latest and save to DB)
 */
export async function refreshDaily() {
  try {
    console.log('[news] Starting daily refresh...');
    
    // Fetch with default parameters
    const upstreamData = await fetchNewsFromUpstream({
      filter: 'hot',
      currencies: DEFAULT_CURRENCIES
    });

    // Normalize and save
    const normalizedItems = normalizeNews(upstreamData);
    const { saved, errors } = await saveNewsBatch(normalizedItems);

    console.log(`[news] Daily refresh completed: ${saved} saved, ${errors} errors`);
    return { saved, errors };
  } catch (error) {
    console.error('[news] Daily refresh failed:', error.message);
    throw error;
  }
}

/**
 * Get cached data or fetch fresh
 */
async function getCachedOrFresh(cacheKey, fetchFn) {
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.ts) < CACHE_TTL_MS) {
    console.log(`[news] Returning cached data for key: ${cacheKey}`);
    return cached.data;
  }

  console.log(`[news] Cache miss or expired for key: ${cacheKey}, fetching fresh data`);
  const freshData = await fetchFn();
  
  cache.set(cacheKey, {
    data: freshData,
    ts: now
  });

  return freshData;
}

/**
 * Main function to get news (with caching and fallback)
 */
export async function getNews(params = {}) {
  const {
    filter = 'important',
    currencies = DEFAULT_CURRENCIES,
    limit = 24,
    cursor = null,
    important = null
  } = params;

  const cacheKey = `news_${filter}_${currencies.sort().join(',')}_${limit}_${cursor || 'null'}_${important || 'null'}`;

  try {
    // Try to get fresh data from upstream
    const result = await getCachedOrFresh(cacheKey, async () => {
      const upstreamData = await fetchNewsFromUpstream({
        filter,
        currencies,
        page: 1
      });

      const normalizedItems = normalizeNews(upstreamData);
      
      // Save to database in background (don't wait)
      saveNewsBatch(normalizedItems).catch(err => 
        console.warn('[news] Background save failed:', err.message)
      );

      return normalizedItems;
    });

    // Apply additional filtering and pagination
    let filteredResults = result;

    if (important !== null) {
      filteredResults = filteredResults.filter(item => item.is_important === important);
    }

    if (cursor) {
      const cursorDate = new Date(cursor);
      filteredResults = filteredResults.filter(item => 
        new Date(item.published_at) < cursorDate
      );
    }

    return filteredResults.slice(0, limit);
  } catch (error) {
    console.warn('[news] Upstream fetch failed, falling back to database:', error.message);
    
    // Fallback to database
    try {
      const dbResults = await getNewsFromDb({
        limit,
        cursor,
        currencies,
        important
      });

      return dbResults.map(row => ({
        source_id: row.source_id,
        title: row.title,
        url: row.url,
        published_at: row.published_at,
        currencies: row.currencies,
        is_important: row.is_important,
        source: row.source,
        raw: row.raw
      }));
    } catch (dbError) {
      console.error('[news] Database fallback also failed:', dbError.message);
      throw new Error('Failed to fetch news from both upstream and database');
    }
  }
}

/**
 * Start the news cron job
 */
export function startNewsCron() {
  const schedule = process.env.NEWS_CRON_SCHEDULE || '0 9 * * *'; // Default: daily at 09:00
  
  console.log(`[news] Starting cron with schedule: ${schedule}`);
  
  cron.schedule(schedule, async () => {
    try {
      console.log('[news] Cron job triggered - refreshing news...');
      const result = await refreshDaily();
      console.log(`[news] Cron job completed: ${result.saved} items saved`);
    } catch (error) {
      console.error('[news] Cron job failed:', error.message);
    }
  }, {
    timezone: 'Asia/Jerusalem'
  });

  console.log('[news] News cron job started successfully');
}
