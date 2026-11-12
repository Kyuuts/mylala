/**
 * Predefined Curated Character Avatars for MyLala & Image Compression Utility.
 * High-definition self-contained SVG Data URIs + Canvas Compressor for uploaded photos.
 */

// 1. Five Stylish Predefined Avatars (SVG Data URIs)
export const PRESET_AVATARS = [
  {
    id: 'fox',
    name: 'Atlas Fox',
    role: 'The Smart Explorer',
    emoji: '🦊',
    bgColor: '#FFF7ED',
    borderColor: '#F97316',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="foxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23FB923C"/>
          <stop offset="100%" stop-color="%23EA580C"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="%23FFF7ED" stroke="%23F97316" stroke-width="4"/>
      <!-- Ears -->
      <polygon points="30,22 48,50 22,46" fill="url(%23foxGrad)"/>
      <polygon points="32,28 44,48 26,46" fill="%23FED7AA"/>
      <polygon points="90,22 72,50 98,46" fill="url(%23foxGrad)"/>
      <polygon points="88,28 76,48 94,46" fill="%23FED7AA"/>
      <!-- Head -->
      <ellipse cx="60" cy="66" rx="34" ry="28" fill="url(%23foxGrad)"/>
      <!-- Cheeks -->
      <path d="M30,68 Q40,84 60,86 Q80,84 90,68 Q75,76 60,76 Q45,76 30,68 Z" fill="%23FFFFFF"/>
      <!-- Snout & Nose -->
      <polygon points="56,76 64,76 60,82" fill="%231E293B"/>
      <!-- Eyes -->
      <circle cx="46" cy="60" r="4.5" fill="%231E293B"/>
      <circle cx="47.5" cy="58.5" r="1.5" fill="%23FFFFFF"/>
      <circle cx="74" cy="60" r="4.5" fill="%231E293B"/>
      <circle cx="75.5" cy="58.5" r="1.5" fill="%23FFFFFF"/>
    </svg>`,
  },
  {
    id: 'owl',
    name: 'Athena Owl',
    role: 'The Mastermind Scholar',
    emoji: '🦉',
    bgColor: '#F5F3FF',
    borderColor: '#8B5CF6',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="owlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23A78BFA"/>
          <stop offset="100%" stop-color="%237C3AED"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="%23F5F3FF" stroke="%238B5CF6" stroke-width="4"/>
      <!-- Ear Tufts -->
      <polygon points="34,22 46,44 26,40" fill="url(%23owlGrad)"/>
      <polygon points="86,22 74,44 94,40" fill="url(%23owlGrad)"/>
      <!-- Body/Head -->
      <ellipse cx="60" cy="64" rx="36" ry="32" fill="url(%23owlGrad)"/>
      <!-- Eye Rings -->
      <circle cx="44" cy="58" r="14" fill="%23EDE9FE"/>
      <circle cx="76" cy="58" r="14" fill="%23EDE9FE"/>
      <!-- Eyes -->
      <circle cx="44" cy="58" r="8" fill="%231E1B4B"/>
      <circle cx="76" cy="58" r="8" fill="%231E1B4B"/>
      <circle cx="46" cy="56" r="2.5" fill="%23FFFFFF"/>
      <circle cx="78" cy="56" r="2.5" fill="%23FFFFFF"/>
      <!-- Beak -->
      <polygon points="56,66 64,66 60,76" fill="%23F59E0B"/>
      <!-- Scholar Glasses bridge -->
      <path d="M52,56 Q60,54 68,56" stroke="%23F59E0B" stroke-width="3" fill="none"/>
    </svg>`,
  },
  {
    id: 'astro',
    name: 'Aero Scout',
    role: 'The Cosmic Voyager',
    emoji: '🚀',
    bgColor: '#F0F9FF',
    borderColor: '#0284C7',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23E0F2FE"/>
          <stop offset="100%" stop-color="%23BAE6FD"/>
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%2338BDF8"/>
          <stop offset="100%" stop-color="%230284C7"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="%23F0F9FF" stroke="%230284C7" stroke-width="4"/>
      <!-- Helmet Outer -->
      <circle cx="60" cy="62" r="36" fill="url(%23helmetGrad)" stroke="%230369A1" stroke-width="3"/>
      <!-- Side Earphones -->
      <rect x="20" y="52" width="6" height="20" rx="3" fill="%230284C7"/>
      <rect x="94" y="52" width="6" height="20" rx="3" fill="%230284C7"/>
      <!-- Visor -->
      <ellipse cx="60" cy="62" rx="26" ry="19" fill="url(%23visorGrad)"/>
      <!-- Visor Reflection -->
      <path d="M42,54 Q54,48 68,50" stroke="%23FFFFFF" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.8"/>
      <!-- Mini Star Badge -->
      <polygon points="60,28 62,33 67,33 63,36 65,41 60,38 55,41 57,36 53,33 58,33" fill="%23F59E0B"/>
    </svg>`,
  },
  {
    id: 'lion',
    name: 'Leo Champion',
    role: 'The Bold Leader',
    emoji: '🦁',
    bgColor: '#FEF3C7',
    borderColor: '#D97706',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="maneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23F59E0B"/>
          <stop offset="100%" stop-color="%23B45309"/>
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="%23FEF3C7" stroke="%23D97706" stroke-width="4"/>
      <!-- Mane Outer Petals -->
      <circle cx="60" cy="62" r="40" fill="url(%23maneGrad)"/>
      <!-- Face -->
      <circle cx="60" cy="64" r="26" fill="%23FDE68A"/>
      <!-- Ears -->
      <circle cx="40" cy="38" r="8" fill="%23F59E0B"/>
      <circle cx="40" cy="38" r="4" fill="%23FDE68A"/>
      <circle cx="80" cy="38" r="8" fill="%23F59E0B"/>
      <circle cx="80" cy="38" r="4" fill="%23FDE68A"/>
      <!-- Eyes -->
      <circle cx="49" cy="58" r="4" fill="%2378350F"/>
      <circle cx="50" cy="57" r="1.5" fill="%23FFFFFF"/>
      <circle cx="71" cy="58" r="4" fill="%2378350F"/>
      <circle cx="72" cy="57" r="1.5" fill="%23FFFFFF"/>
      <!-- Snout -->
      <ellipse cx="60" cy="71" rx="10" ry="7" fill="%23FFFFFF"/>
      <polygon points="57,67 63,67 60,72" fill="%23B45309"/>
    </svg>`,
  },
  {
    id: 'panda',
    name: 'Panda Zen',
    role: 'The Calm Polyglot',
    emoji: '🐼',
    bgColor: '#ECFDF5',
    borderColor: '#059669',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="58" fill="%23ECFDF5" stroke="%23059669" stroke-width="4"/>
      <!-- Ears -->
      <circle cx="34" cy="34" r="11" fill="%231E293B"/>
      <circle cx="86" cy="34" r="11" fill="%231E293B"/>
      <!-- Head -->
      <circle cx="60" cy="64" r="34" fill="%23FFFFFF" stroke="%23CBD5E1" stroke-width="2"/>
      <!-- Eye Patches -->
      <ellipse cx="44" cy="58" rx="11" ry="8" fill="%231E293B" transform="rotate(-15 44 58)"/>
      <ellipse cx="76" cy="58" rx="11" ry="8" fill="%231E293B" transform="rotate(15 76 58)"/>
      <!-- Eyes -->
      <circle cx="45" cy="58" r="3" fill="%23FFFFFF"/>
      <circle cx="75" cy="58" r="3" fill="%23FFFFFF"/>
      <circle cx="45" cy="58" r="1.5" fill="%230F172A"/>
      <circle cx="75" cy="58" r="1.5" fill="%230F172A"/>
      <!-- Nose & Mouth -->
      <ellipse cx="60" cy="71" rx="4.5" ry="3" fill="%230F172A"/>
      <path d="M56,76 Q60,79 64,76" stroke="%230F172A" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
];

/**
 * Compresses an uploaded image File using client-side HTML5 Canvas.
 * Outputs a compact Base64 Data URL (max 256x256, ~15-25KB)
 * Safe for offline localStorage and instant Supabase syncing.
 */
export function compressImageFile(file, maxWidth = 256, maxHeight = 256) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar yang valid.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compact WebP (or JPEG fallback)
        try {
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.82);
          resolve(compressedDataUrl);
        } catch {
          const fallbackDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(fallbackDataUrl);
        }
      };

      img.onerror = () => reject(new Error('Gagal memproses file gambar.'));
      img.src = readerEvent.target.result;
    };

    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}
