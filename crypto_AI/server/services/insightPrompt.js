export function buildMessages(prefs, facts) {
  const sys = `You are an unbiased financial & tech insight engine. You must:
- Always respond in English, regardless of locale.
- If facts are provided, use ONLY those facts; do not invent numbers.
- First output a SINGLE LINE JSON object EXACTLY matching the schema. NO code fences.
- Then output a line with three dashes: ---
- Then a short Markdown card in English derived from the JSON.
- Keep the JSON under 1500 characters.
Schema: {
  "title": "...",
  "tl_dr": "...",
  "detail_bullets": ["..."],
  "actionable": [
    {"type": "watch|read|learn", "what": "...", "why": "...", "url": "optional"}
  ],
  "confidence": 0.0,
  "time_horizon": "Depends on context",
  "sources": [{"title": "...", "url": "...", "source_name": "..."}],
  "disclaimer": "This is not financial advice."
}`;

  const ctx = facts?.length
    ? facts
        .map(f =>
          `- [${f.date_iso}] (${f.source_name}) ${f.title}` +
          (f.url ? `\n  URL: ${f.url}` : '') +
          (f.summary ? `\n  Summary: ${f.summary}` : '')
        )
        .join('\n')
    : '(no external facts today)';

  const user = `User profile:
- locale: ${prefs.locale}
- investor_type: ${prefs.investor_type}
- selected_assets: ${JSON.stringify(prefs.selected_assets || [])}
- selected_content_types: ${JSON.stringify(prefs.selected_content_types || [])}
Date (local): ${new Date().toISOString()}

Context (newest→oldest):
${ctx}

Produce:
1) JSON (exactly the schema)
2) ---
3) Markdown card in English`;

  return [
    { role: 'system', content: sys },
    { role: 'user', content: user },
  ];
}

export function splitJsonAndMarkdown(raw) {
  const sep = '\n---\n';
  if (raw.includes(sep)) {
    const [jsonStr, mdStr] = raw.split(sep);
    try {
      return { json: JSON.parse(jsonStr.trim()), md: mdStr.trim() };
    } catch {
      // fallback if JSON parse fails
    }
  }

  const first = raw.indexOf('{');
  const last = raw.lastIndexOf('}');
  if (first === -1 || last === -1) return { json: null, md: raw.trim() };

  const jsonPart = raw.slice(first, last + 1).trim();
  const mdPart = (raw.slice(last + 1).trim() || '')
    .replace(/^```(markdown|json)?|```$/g, '')
    .trim();

  try {
    return { json: JSON.parse(jsonPart), md: mdPart };
  } catch {
    return { json: null, md: raw.trim() };
  }
}
