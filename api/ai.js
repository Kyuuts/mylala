/**
 * Vercel Serverless Function: Lala AI Secure Proxy
 * Proxies AI queries to Groq Cloud without leaking API keys to client bundles.
 * Dynamically queries https://api.groq.com/openai/v1/models to use only active, accessible models.
 * Automatically falls back if any model is deprecated, decommissioned, or tier-restricted.
 */

// In-memory cache for discovered models from Groq API (5 min TTL per serverless container)
let cachedModels = null;
let cacheExpiry = 0;

async function getActiveGroqModels(apiKey) {
  const now = Date.now();
  if (cachedModels && Array.isArray(cachedModels) && cachedModels.length > 0 && now < cacheExpiry) {
    return cachedModels;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const chatModels = (data?.data || [])
        .map((m) => m.id)
        .filter(
          (id) =>
            typeof id === 'string' &&
            !id.includes('whisper') &&
            !id.includes('guard') &&
            !id.includes('orpheus')
        );

      if (chatModels.length > 0) {
        cachedModels = chatModels;
        cacheExpiry = now + 5 * 60 * 1000;
        return chatModels;
      }
    }
  } catch (err) {
    console.warn('[Groq Dynamic Models]: Failed to fetch /models:', err.message);
  }

  // Safe fallback if /models fetch fails
  return [
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
  ];
}

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
        error: 'AI Serverless Key belum disetel di Vercel Settings (GROQ_API_KEY).',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      messages,
      model,
      temperature = 0.7,
      max_tokens = 1000,
      response_format,
      mode = 'chat', // 'chat' | 'test'
    } = body;

    // Discover active models dynamically from the user's Groq account
    const activeModels = await getActiveGroqModels(serverApiKey);

    // Ping / Test endpoint
    if (mode === 'test') {
      const selectedModel =
        activeModels.find((m) => m === 'llama-3.1-8b-instant') ||
        activeModels.find((m) => m === 'llama-3.3-70b-versatile') ||
        activeModels[0] ||
        'llama-3.1-8b-instant';

      return res.status(200).json({
        success: true,
        reply: 'PONG',
        model: selectedModel,
        provider: 'Groq Cloud (Server Secure)',
        activeModels,
      });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    // Build candidate models order
    const priorityPreference = [
      'llama-3.1-8b-instant',
      'llama-3.3-70b-versatile',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
    ];

    const candidateModels = [];

    // 1. If requested model is in activeModels, try it first
    if (model && activeModels.includes(model)) {
      candidateModels.push(model);
    }

    // 2. Add priority models that exist in activeModels
    for (const p of priorityPreference) {
      if (activeModels.includes(p) && !candidateModels.includes(p)) {
        candidateModels.push(p);
      }
    }

    // 3. Add any other active models discovered
    for (const m of activeModels) {
      if (!candidateModels.includes(m)) {
        candidateModels.push(m);
      }
    }

    // Fallback safeguard
    if (candidateModels.length === 0) {
      candidateModels.push('llama-3.1-8b-instant', 'llama-3.3-70b-versatile');
    }

    let lastError = null;
    let successData = null;

    for (const tryModel of candidateModels) {
      const requestPayload = {
        model: tryModel,
        messages,
        temperature,
        max_tokens,
      };

      if (response_format) {
        requestPayload.response_format = response_format;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${serverApiKey}`,
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (groqRes.ok) {
          successData = await groqRes.json();
          break; // Success!
        }

        let errDetail = '';
        try {
          const errorJson = await groqRes.json();
          errDetail = errorJson?.error?.message || errorJson?.message || '';
        } catch (_) {
          errDetail = await groqRes.text();
        }

        const isModelIssue =
          groqRes.status === 404 ||
          (groqRes.status === 400 &&
            (errDetail.toLowerCase().includes('decommissioned') ||
             errDetail.toLowerCase().includes('not supported') ||
             errDetail.toLowerCase().includes('does not exist') ||
             errDetail.toLowerCase().includes('access') ||
             errDetail.toLowerCase().includes('model')));

        if (isModelIssue) {
          console.warn(`[Groq Fallback]: Model ${tryModel} rejected (${groqRes.status}: ${errDetail}). Trying next candidate...`);
          lastError = { status: groqRes.status, message: errDetail };
          continue;
        }

        // For other non-model errors (e.g. 401 Invalid Key, 429 Rate Limit), return immediately
        return res.status(groqRes.status).json({
          error: `Groq Cloud error (${groqRes.status}): ${errDetail}`,
        });
      } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
          return res.status(504).json({ error: 'AI request timed out after 25 seconds.' });
        }
        lastError = { status: 500, message: err.message };
      }
    }

    if (successData) {
      return res.status(200).json(successData);
    }

    return res.status(lastError?.status || 500).json({
      error: `Groq Cloud error (${lastError?.status || 500}): ${lastError?.message || 'Gagal memproses dengan model yang tersedia'}`,
    });
  } catch (err) {
    console.error('[API AI Proxy Error]:', err);
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'AI request timed out after 25 seconds.' });
    }
    return res.status(500).json({ error: 'Internal AI proxy error', details: err.message });
  }
}
