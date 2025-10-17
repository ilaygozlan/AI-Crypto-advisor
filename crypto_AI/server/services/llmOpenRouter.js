export async function callOpenRouter(messages) {
  const apiKey = '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';
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
