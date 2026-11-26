/**
 * Vercel Serverless Function: Lala AI Secure Proxy
 * Proxies AI queries to Groq Cloud without leaking API keys to client bundles.
 * Robust multi-model fallback starting with universally accessible llama-3.1-8b-instant.
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
        error: 'AI Serverless Key belum disetel di Vercel Settings (GROQ_API_KEY).',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      messages,
      model = 'llama-3.1-8b-instant',
      temperature = 0.7,
      max_tokens = 1000,
      response_format,
      mode = 'chat', // 'chat' | 'test'
    } = body;

    // Real live ping test against Groq models API
    if (mode === 'test') {
      try {
        const testRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${serverApiKey}` },
        });

        if (!testRes.ok) {
          let errDetail = '';
          try {
            const errJson = await testRes.json();
            errDetail = errJson?.error?.message || errJson?.message || '';
          } catch (_) {
            errDetail = await testRes.text();
          }
          return res.status(testRes.status).json({
            error: `Groq Auth Error (${testRes.status}): ${errDetail || 'API key tidak valid.'}`,
          });
        }

        const modelsData = await testRes.json();
        const availableModels = (modelsData?.data || []).map((m) => m.id);
        const selectedModel = availableModels.includes('llama-3.1-8b-instant')
          ? 'llama-3.1-8b-instant'
          : (availableModels[0] || 'llama-3.1-8b-instant');

        return res.status(200).json({
          success: true,
          reply: 'PONG',
          model: selectedModel,
          provider: 'Groq Cloud (Server Secure)',
          availableModelsCount: availableModels.length,
        });
      } catch (testErr) {
        return res.status(500).json({
          error: `Gagal menguji endpoint Groq: ${testErr.message}`,
        });
      }
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    // Determine initial preferred model
    // llama-3.1-8b-instant is universally free, ultra-fast, and supported on 100% of Groq accounts
    const preferredModel =
      model &&
      model !== 'llama-3.3-70b-versatile' &&
      model !== 'openai/gpt-oss-120b'
        ? model
        : 'llama-3.1-8b-instant';

    // Resilient fallback ladder in case a specific model is deprecated or tier-restricted
    const fallbackLadder = [
      preferredModel,
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'gemma2-9b-it',
      'mixtral-8x7b-32768',
      'llama-3.3-70b-versatile',
    ];
    const candidateModels = [...new Set(fallbackLadder)];

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
          break; // Succeeded!
        }

        // If error is 404 (model does not exist or tier restricted), attempt fallback to next model
        if (groqRes.status === 404) {
          const errJson = await groqRes.json().catch(() => ({}));
          const errMsg = errJson?.error?.message || `Model ${tryModel} tidak dapat diakses.`;
          lastError = { status: 404, message: errMsg };
          console.warn(`[Groq Fallback]: Model ${tryModel} 404 (${errMsg}). Trying next candidate...`);
          continue;
        }

        // For other non-404 status codes (e.g. 401 Unauthorized, 429 Rate Limit), return immediately
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

