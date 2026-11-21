const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const logosDir = path.join(__dirname, '..', 'public', 'assets', 'logos');

const logos = [
  { name: 'logo-concept-1-flashcards', svg: 'logo-concept-1-flashcards.svg' },
  { name: 'logo-concept-2-monogram', svg: 'logo-concept-2-monogram.svg' },
  { name: 'logo-concept-3-mascot', svg: 'logo-concept-3-mascot.svg' },
];

async function generatePngs() {
  console.log('Rendering SVGs to high-resolution PNGs with Sharp...');
  for (const item of logos) {
    const svgPath = path.join(logosDir, item.svg);
    const svgBuffer = fs.readFileSync(svgPath);

    // 512x512 high-res PNG
    const png512Path = path.join(logosDir, `${item.name}-512.png`);
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(png512Path);

    // 192x192 mobile icon PNG
    const png192Path = path.join(logosDir, `${item.name}-192.png`);
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(png192Path);

    console.log(`Generated: ${item.name}-512.png & ${item.name}-192.png`);
  }
  console.log('All PNGs generated successfully!');
}

generatePngs().catch(console.error);
