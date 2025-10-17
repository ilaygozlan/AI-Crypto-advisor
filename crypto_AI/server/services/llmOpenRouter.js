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
