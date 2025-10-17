import pool from '../db/index.js';

// ---- helpers (strict) ----
function safeJson(v) {
  if (v == null) return null;
  if (typeof v === 'string') {
    try { return JSON.parse(v); } catch { return null; }
  }
  return (typeof v === 'object') ? v : null; // plain object or array only
}

function safeJsonArray(v) {
  if (v == null) return [];
  if (typeof v === 'string') {
    // could be a stringified array or a stringified object
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.filter(x => x && typeof x === 'object');
      return (parsed && typeof parsed === 'object') ? [parsed] : [];
    } catch {
      return []; // bad string -> drop
    }
  }
  if (Array.isArray(v)) {
    return v.map(x => {
      if (x == null) return null;
      if (typeof x === 'string') {
        try { return JSON.parse(x); } catch { return null; }
      }
      return (typeof x === 'object') ? x : null;
    }).filter(Boolean);
  }
  // single object
  return (typeof v === 'object') ? [v] : [];
}

export async function insertInsight(n) {
  // 🔒 Coerce JSON fields BEFORE query
  const content_json = safeJson(n.content_json);
  const sources = safeJsonArray(n.sources);



  const q = `
    INSERT INTO insights
      (user_id, date_key, provider, model, prompt_tokens, completion_tokens,
       title, tl_dr, content_md, content_json, sources)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,($10)::jsonb,($11)::jsonb)
    RETURNING *;
  `;

  const vals = [
    n.user_id,
    n.date_key,
    n.provider ?? 'openrouter',
    n.model ?? process.env.OPENROUTER_MODEL ?? 'openrouter/auto',
    n.prompt_tokens ?? null,
    n.completion_tokens ?? null,
    n.title ?? null,
    n.tl_dr ?? null,
    n.content_md ?? null,
    JSON.stringify(content_json ?? null), // send as JSON text, cast to jsonb in SQL
    JSON.stringify(sources ?? []),        // send as JSON text, cast to jsonb in SQL
  ];

  const { rows } = await pool.query(q, vals);
  return rows[0];
}

export async function getLatestInsightByUserAndDate(user_id, date_key) {
  const q = `
    SELECT * FROM insights
    WHERE user_id=$1 AND date_key=$2
    ORDER BY generated_at DESC
    LIMIT 1;
  `;
  const { rows } = await pool.query(q, [user_id, date_key]);
  return rows[0] ?? null;
}
