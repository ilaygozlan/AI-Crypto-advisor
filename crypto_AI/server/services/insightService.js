import { buildMessages, splitJsonAndMarkdown } from './insightPrompt.js';
import { callOpenRouter } from './llmOpenRouter.js';
import { getLatestUserData } from '../repos/userDataRepo.js';
import { getLatestInsightByUserAndDate, insertInsight } from '../repos/insightsRepo.js';

function isObject(x) { return x && typeof x === 'object' && !Array.isArray(x); }
function normalizeJsonValue(v) {
  if (!v) return null;
  if (typeof v === 'string') { try { return JSON.parse(v); } catch { return null; } }
  return isObject(v) || Array.isArray(v) ? v : null;
}
function normalizeSources(src) {
  if (!src) return [];
  const arr = Array.isArray(src) ? src : [src];
  return arr.map(item => {
    if (typeof item === 'string') { try { return JSON.parse(item); } catch { return null; } }
    return isObject(item) ? item : null;
  }).filter(Boolean);
}

function getILDateKey() {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  return fmt.format(new Date()); // 'YYYY-MM-DD'
}
const today = getILDateKey();

export async function getOrCreateTodayInsight(user_id) {
  const today = getILDateKey();

  const existing = await getLatestInsightByUserAndDate(user_id, today);
  if (existing) return existing;

  const latest = await getLatestUserData(user_id);

  const prefs = latest
  ? {
      locale: process.env.APP_LOCALE || 'en-US',
      investor_type: latest.investor_type,
      selected_assets: latest.selected_assets || [],
      selected_content_types: latest.selected_content_types || [],
    }
  : {
      locale: process.env.APP_LOCALE || 'en-US',
      investor_type: 'investor',
      selected_assets: [],
      selected_content_types: [],
    };

  const messages = buildMessages(prefs, []);
  const { content, usage, model } = await callOpenRouter(messages);
  const { json, md } = splitJsonAndMarkdown(content);

  const safeSources = Array.isArray(json?.sources) ? json.sources : [];

const normalizedJson    = normalizeJsonValue(json);
const normalizedSources = normalizeSources(normalizedJson?.sources);

const saved = await insertInsight({
  user_id,
  date_key: today,
  provider: 'openrouter',
  model,
  prompt_tokens: usage?.prompt_tokens ?? null,
  completion_tokens: usage?.completion_tokens ?? null,
  title: normalizedJson?.title || 'Daily Insight',
  tl_dr: normalizedJson?.tl_dr || null,
  content_md: md,
  content_json: normalizedJson,     // object/array/null only
  sources: normalizedSources        // array of plain objects
});

  return saved;
}
