const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const mascotBirdSvgPath = path.join(publicDir, 'assets', 'logos', 'logo-concept-mascot-bird.svg');

async function applyMascotBird() {
  console.log('Applying Mascot Bird (Lala the Chatter Bird) across the project...');

  // 1. Read Mascot Bird SVG source
  const svgContent = fs.readFileSync(mascotBirdSvgPath, 'utf8');

  // 2. Overwrite public/logo.svg and public/favicon.svg
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  console.log('Updated: public/logo.svg & public/favicon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // 3. Generate pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated: public/pwa-512x512.png');

  // 4. Generate pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated: public/pwa-192x192.png');

  // 5. Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated: public/apple-touch-icon.png');

  // 6. Generate maskable-icon-512x512.png with safe padding (80% safe zone on #FFFDF0 background)
  const innerIconBuffer = await sharp(svgBuffer)
    .resize(410, 410)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 253, b: 240, alpha: 1 }, // #FFFDF0 warm cream
    },
  })
    .composite([
      {
        input: innerIconBuffer,
        gravity: 'center',
      },
    ])
    .png()
    .toFile(path.join(publicDir, 'maskable-icon-512x512.png'));
  console.log('Generated: public/maskable-icon-512x512.png (with safe-zone)');

  console.log('All mascot bird logo and icon assets successfully applied!');
}

applyMascotBird().catch((err) => {
  console.error('Error applying mascot bird logo:', err);
  process.exit(1);
});
