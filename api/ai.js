/**
 * Vercel Serverless Function: Lala AI Secure Proxy
 * Proxies AI queries to Groq Cloud (or configured provider) without leaking API keys to client bundles.
 */

export default async function handler(req, res) {
  // 1. Strict Origin-based CORS Configuration
  const origin = req.headers.origin || '';
  const isAllowedOrigin =
    !origin ||
    origin === 'https://mylala.vercel.app' ||
    /^https:\/\/([a-zA-Z0-9-]+\.)?vercel\.app$/.test(origin) ||
    /^http:\/\/(localhost|127\.0.0\.1)(:\d+)?$/.test(origin);

  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', 'https://mylala.vercel.app');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (origin && !isAllowedOrigin) {
    return res.status(403).json({ error: 'Forbidden: Origin is not authorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const serverApiKey =
      process.env.GROQ_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.VITE_GROQ_API_KEY ||
      '';

    if (!serverApiKey) {
      return res.status(503).json({
        error: 'AI Serverless Key is not configured on the server environment. Please set GROQ_API_KEY in Vercel settings.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      messages,
      model = 'openai/gpt-oss-120b',
      temperature = 0.7,
      max_tokens = 1000,
      response_format,
      mode = 'chat', // 'chat' | 'test'
    } = body;

    // Minimal ping test
    if (mode === 'test') {
      return res.status(200).json({
        success: true,
        reply: 'PONG',
        model: 'groq/server-managed',
        provider: 'Groq Cloud (Server Secure)',
      });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const requestPayload = {
      model,
      messages,
      temperature,
      max_tokens,
    };

    if (response_format) {
      requestPayload.response_format = response_format;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const groqRes = await fetch(groqEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serverApiKey}`,
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!groqRes.ok) {
      let errDetail = '';
      try {
        const errorJson = await groqRes.json();
        errDetail = errorJson?.error?.message || errorJson?.message || '';
      } catch (_) {
        errDetail = await groqRes.text();
      }
      return res.status(groqRes.status).json({
        error: `Groq Cloud error (${groqRes.status}): ${errDetail}`,
      });
    }

    const data = await groqRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('[API AI Proxy Error]:', err);
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'AI request timed out after 25 seconds.' });
    }
    return res.status(500).json({ error: 'Internal AI proxy error', details: err.message });
  }
}
