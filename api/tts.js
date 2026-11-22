import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/**
 * Vercel Serverless Function: Microsoft Edge / Azure Neural TTS Synthesizer
 * Provides high-speed, studio-grade neural voice synthesis for MyLala PWA.
 * Hardened with Origin-based CORS and strict text length limits.
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

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (origin && !isAllowedOrigin) {
    return res.status(403).json({ error: 'Forbidden: Origin is not authorized' });
  }

  // 2. HTTP Method restriction
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let text = '';
    let voice = 'en-US-JennyNeural';
    let rate = '+0%';
    let pitch = '+0Hz';

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      text = body.text || '';
      voice = body.voice || voice;
      rate = body.rate || rate;
      pitch = body.pitch || pitch;
    } else {
      text = req.query?.text || '';
      voice = req.query?.voice || voice;
      rate = req.query?.rate || rate;
      pitch = req.query?.pitch || pitch;
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    // 3. Strict Character Length Limit (Prevents proxy abuse)
    const MAX_TEXT_LENGTH = 500;
    const cleanText = text.trim();
    if (cleanText.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        error: `Text length exceeds maximum allowed limit of ${MAX_TEXT_LENGTH} characters.`,
      });
    }

    // 4. Format rate & pitch for SSML
    const formattedRate = rate.startsWith('+') || rate.startsWith('-') ? rate : `+0%`;
    const formattedPitch = pitch.startsWith('+') || pitch.startsWith('-') ? pitch : `+0Hz`;

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(cleanText, {
      rate: formattedRate,
      pitch: formattedPitch,
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    // Enable long-term caching: 1 year public cache on Vercel Edge CDN & browser
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');

    audioStream.pipe(res);
  } catch (error) {
    console.error('[API Edge TTS Error]:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'TTS synthesis failed', details: error.message });
    }
  }
}
