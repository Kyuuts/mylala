/**
 * AI Service for MyLala Language Learning PWA
 * Supports OpenAI-compatible free LLM providers (Groq, OpenRouter, Google Gemini, Custom)
 * Reference: https://github.com/open-free-llm-api/awesome-freellm-apis
 */

export const AI_PROVIDERS = {
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    tag: 'Rekomendasi Utama (Super Cepat & Gratis)',
    description: 'Respon secepat kilat (100+ token/detik). 100% gratis tanpa kartu kredit.',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'openai/gpt-oss-120b',
    keyUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'gsk_...',
    freeTierInfo: '30 request/menit, 14.400 request/hari (Gratis tanpa batas waktu)',
    requiresKey: true,
    models: [
      { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B (Sangat Cerdas & Lengkap)' },
      { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Cepat & Ringan)' },
      { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B (Ultra Cepat)' },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile' },
    ],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    tag: 'Banyak Pilihan Model Gratis',
    description: 'Akses banyak model open source & free tier terbaik lewat satu API.',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    keyUrl: 'https://openrouter.ai/keys',
    keyPlaceholder: 'sk-or-v1-...',
    freeTierInfo: 'Model dengan label :free dapat digunakan gratis tanpa biaya',
    requiresKey: true,
    models: [
      { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Meta Llama 3.3 70B (Free)' },
      { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 Reasoning (Free)' },
      { id: 'google/gemini-2.0-flash-exp:free', name: 'Google Gemini 2.0 Flash (Free)' },
      { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B Instruct (Free)' },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    tag: 'Resmi dari Google AI Studio',
    description: 'Menggunakan endpoint resmi OpenAI-compatible dari Google Gemini.',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-1.5-flash',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy...',
    freeTierInfo: '15 request/menit, gratis via Google AI Studio',
    requiresKey: true,
    models: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Cepat & Akurat)' },
      { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)' },
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom / Lokal',
    tag: 'Ollama, LM Studio, vLLM, Proxy',
    description: 'Hubungkan ke server LLM mandiri atau API proxy lokal Anda.',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3',
    keyUrl: '',
    keyPlaceholder: 'Opsional jika server lokal tidak butuh kunci',
    freeTierInfo: 'Dijalankan di perangkat atau server mandiri Anda',
    requiresKey: false,
    models: [],
  },
};

/**
 * System / Developer default fallback configuration from .env
 */
export const SYSTEM_FALLBACK_AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'groq',
  apiKey: import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_GROQ_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'llama-3.3-70b-versatile',
  baseUrl: import.meta.env.VITE_AI_BASE_URL || 'https://api.groq.com/openai/v1',
};

/**
 * Resolve effective AI config between user's custom preference and central developer key
 */
export function getEffectiveAiConfig(userConfig, systemConfig) {
  // If user explicitly enabled custom personal key
  if (userConfig?.useCustomKey && userConfig?.apiKey) {
    return {
      provider: userConfig.provider || 'groq',
      apiKey: userConfig.apiKey.trim(),
      model: userConfig.model || 'llama-3.3-70b-versatile',
      baseUrl: userConfig.baseUrl || 'https://api.groq.com/openai/v1',
      isEnabled: userConfig.isEnabled !== false,
      isCustom: true,
      hasKey: true,
    };
  }

  // Central Developer / App-provided key (from Supabase or .env)
  const sys = systemConfig || {};
  const provider = sys.provider || userConfig?.provider || SYSTEM_FALLBACK_AI_CONFIG.provider;
  const apiKey = (sys.apiKey || SYSTEM_FALLBACK_AI_CONFIG.apiKey || userConfig?.apiKey || '').trim();
  const model = sys.model || userConfig?.model || SYSTEM_FALLBACK_AI_CONFIG.model;
  const baseUrl = sys.baseUrl || userConfig?.baseUrl || SYSTEM_FALLBACK_AI_CONFIG.baseUrl;
  const isEnabled = userConfig?.isEnabled !== false;

  return {
    provider,
    apiKey,
    model,
    baseUrl,
    isEnabled,
    isCustom: false,
    hasKey: Boolean(apiKey),
  };
}

/**
 * Standardize and clean baseUrl
 */
const sanitizeBaseUrl = (url) => {
  if (!url) return '';
  let clean = url.trim();
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
};

/**
 * Test AI Connection
 * Pings the LLM with a minimal 5-token prompt to verify API Key & endpoint responsiveness.
 */
export async function testAiConnection(config) {
  const provider = config?.provider || 'groq';
  const providerInfo = AI_PROVIDERS[provider] || AI_PROVIDERS.custom;
  const baseUrl = sanitizeBaseUrl(config?.baseUrl || providerInfo.baseUrl);
  const apiKey = (config?.apiKey || '').trim();
  const model = (config?.model || providerInfo.defaultModel || '').trim();

  if (providerInfo.requiresKey && !apiKey) {
    return {
      success: false,
      error: `API Key ${providerInfo.name} belum dimasukkan. Silakan dapatkan API key gratis di ${providerInfo.keyUrl}`,
    };
  }

  if (!baseUrl) {
    return {
      success: false,
      error: 'Base URL API belum ditentukan.',
    };
  }

  if (!model) {
    return {
      success: false,
      error: 'Nama model belum dipilih atau kosong.',
    };
  }

  const endpoint = `${baseUrl}/chat/completions`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'https://mylala.app';
    headers['X-Title'] = 'MyLala Language PWA';
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an API connection tester. Reply strictly with the word: PONG',
          },
          {
            role: 'user',
            content: 'PING',
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      let errDetail = '';
      try {
        const errorJson = await response.json();
        errDetail = errorJson?.error?.message || errorJson?.message || '';
      } catch (_) {
        errDetail = await response.text();
      }

      if (response.status === 401) {
        return {
          success: false,
          error: `API Key tidak valid (Error 401). Pastikan API Key yang Anda salin sudah benar.`,
        };
      } else if (response.status === 429) {
        return {
          success: false,
          error: `Rate limit tercapai (Error 429). Tunggu beberapa saat atau coba model lain.`,
        };
      } else if (response.status === 404) {
        return {
          success: false,
          error: `Endpoint atau model "${model}" tidak ditemukan (Error 404). Periksa kembali nama model.`,
        };
      }

      return {
        success: false,
        error: `Server merespon error (${response.status}): ${errDetail || 'Gagal terhubung'}`,
      };
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || 'OK';

    return {
      success: true,
      latencyMs,
      reply,
      model,
      provider: providerInfo.name,
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Koneksi timeout setelah 12 detik. Periksa koneksi internet Anda atau coba provider lain.',
      };
    }
    return {
      success: false,
      error: `Gagal menghubungi API: ${err.message || 'Koneksi gagal / diblokir CORS'}.`,
      latencyMs,
    };
  }
}

/**
 * Ask Lala AI
 * Main completion helper with automatic CEFR level prompt injection.
 * 
 * @param {Object} options
 * @param {string} options.prompt - User message / query
 * @param {string} [options.systemPrompt] - Custom instructions for the AI
 * @param {string} [options.userCefrLevel] - Current CEFR level (A1, A2, B1, etc.)
 * @param {Object} [options.config] - Overridden aiConfig (or falls back to app store)
 * @param {number} [options.temperature=0.7] - Creativity parameter
 * @param {number} [options.maxTokens=800] - Token limit
 * @param {boolean} [options.jsonMode=false] - Force JSON return
 */
export async function askLalaAI({
  prompt,
  systemPrompt,
  userCefrLevel = 'A1',
  config,
  temperature = 0.7,
  maxTokens = 1200,
  jsonMode = false,
}) {
  const effective = getEffectiveAiConfig(config, config?._systemConfig);
  if (!effective.isEnabled) {
    throw new Error('Fitur Lala AI sedang dinonaktifkan di Pengaturan.');
  }

  const provider = effective.provider || 'groq';
  const providerInfo = AI_PROVIDERS[provider] || AI_PROVIDERS.custom;
  const baseUrl = sanitizeBaseUrl(effective.baseUrl || providerInfo.baseUrl);
  const apiKey = (effective.apiKey || '').trim();
  const model = (effective.model || providerInfo.defaultModel || '').trim();

  if (providerInfo.requiresKey && !apiKey) {
    throw new Error('Lala AI belum aktif karena API Key belum dikonfigurasi oleh admin. Hubungi admin atau atur di menu Lala AI.');
  }

  // Construct CEFR-aware system instructions
  const defaultSystem = `Kamu adalah Lala, asisten tutor bahasa Inggris profesional, cerdas, dan interaktif di aplikasi MyLala.
Prinsip utamamu:
1. Sangat to-the-point, padat, ringkas, dan terstruktur rapi.
2. DILARANG membuat salam pembuka atau basa-basi berulang (seperti "Hai aku Lala", "Mari kita bedah kartu ini"). Langsung mulai penjelasan dari materi.
3. Selalu format menggunakan Markdown standar (gunakan heading ###, bullet point teratur, atau tabel perbandingan bersih jika relevan).
4. Gunakan Bahasa Indonesia yang luwes, edukatif, serta contoh kalimat bahasa Inggris yang natural beserta artinya.`;

  const cefrGuideline = userCefrLevel
    ? `\n\n[PANDUAN TINGKAT CEFR: ${userCefrLevel.toUpperCase()}]
Pengguna saat ini berada di level kecakapan ${userCefrLevel.toUpperCase()}.
- Sesuaikan kosakata dan kompleksitas kalimat bahasa Inggris agar pas dengan level ${userCefrLevel.toUpperCase()}.
- Hindari istilah linguistik yang terlalu rumit tanpa penjelasan sederhana.
- Jika pengguna masih level A1-A2, selalu sertakan terjemahan kata per kata atau frasa penting.`
    : '';

  const finalSystemPrompt = `${systemPrompt || defaultSystem}${cefrGuideline}`;

  const endpoint = `${baseUrl}/chat/completions`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'https://mylala.app';
    headers['X-Title'] = 'MyLala Language PWA';
  }

  const requestBody = {
    model,
    messages: [
      { role: 'system', content: finalSystemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature,
    max_tokens: maxTokens,
  };

  if (jsonMode) {
    requestBody.response_format = { type: 'json_object' };
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for full completions

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify(requestBody),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errText = '';
      try {
        const errorJson = await response.json();
        errText = errorJson?.error?.message || errorJson?.message || '';
      } catch (_) {
        errText = await response.text();
      }
      throw new Error(`AI Error (${response.status}): ${errText || 'Gagal memproses permintaan'}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;

    return {
      content,
      usage: data?.usage || null,
      model,
      provider: providerInfo.name,
      latencyMs,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Permintaan ke AI timeout (lebih dari 25 detik). Silakan coba lagi.');
    }
    throw err;
  }
}
