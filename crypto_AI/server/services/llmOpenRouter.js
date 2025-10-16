export async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY');

  const model = process.env.OPENROUTER_MODEL || 'openrouter/auto';

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      max_tokens: 1200,
      messages,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`OpenRouter ${res.status}: ${txt}`);
  }

  const data = await res.json();
  return {
    content: data?.choices?.[0]?.message?.content ?? '',
    usage: data?.usage ?? null,
    model: data?.model || model,
  };
}
