import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// Local dev server middleware for Microsoft Edge / Azure Neural TTS
function edgeTtsDevPlugin() {
  return {
    name: 'edge-tts-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');
          const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          const text = url.searchParams.get('text') || '';
          const voice = url.searchParams.get('voice') || 'en-US-JennyNeural';
          const rate = url.searchParams.get('rate') || '+0%';
          const pitch = url.searchParams.get('pitch') || '+0Hz';

          if (!text.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Text query parameter is required' }));
          }

          const tts = new MsEdgeTTS();
          await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
          const { audioStream } = tts.toStream(text.trim(), { rate, pitch });

          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Cache-Control', 'no-cache');
          audioStream.pipe(res);
        } catch (err) {
          console.error('[Vite Dev Edge TTS Error]:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    edgeTtsDevPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'MyLala - English Active Recall PWA',
        short_name: 'MyLala',
        description: 'Aplikasi micro-learning dan active recall flashcard bahasa Inggris terstruktur & siap offline.',
        theme_color: '#4F46E5',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB to allow Kokoro AI bundle precaching
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            // Network-First for Public Static Curriculum Data ONLY (modules & flashcards)
            // Hardened for VULN-09: Excludes all user PII endpoints (user_accounts, user_progress, user_weekly_stats)
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/(modules|flashcards)(\?.*)?$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-curriculum-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache-First for static font assets
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Stale-While-Revalidate for app images and icons
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-assets-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
