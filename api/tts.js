import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/**
 * Vercel Serverless Function: Microsoft Edge / Azure Neural TTS Synthesizer
 * Provides high-speed, studio-grade neural voice synthesis for MyLala PWA.
 */
export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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

    // Format rate & pitch for SSML
    const formattedRate = rate.startsWith('+') || rate.startsWith('-') ? rate : `+0%`;
    const formattedPitch = pitch.startsWith('+') || pitch.startsWith('-') ? pitch : `+0Hz`;

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text.trim(), {
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
