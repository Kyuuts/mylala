const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const logosDir = path.join(__dirname, '..', 'public', 'assets', 'logos');

const proLogos = [
  { name: 'logo-concept-pro-1', svg: 'logo-concept-pro-1.svg' },
  { name: 'logo-concept-pro-2', svg: 'logo-concept-pro-2.svg' },
];

async function generateProPngs() {
  console.log('Rendering Pro SVGs to high-resolution PNGs with Sharp...');
  for (const item of proLogos) {
    const svgPath = path.join(logosDir, item.svg);
    const svgBuffer = fs.readFileSync(svgPath);

    // 512x512
    const png512Path = path.join(logosDir, `${item.name}-512.png`);
    await sharp(svgBuffer).resize(512, 512).png().toFile(png512Path);

    // 192x192
    const png192Path = path.join(logosDir, `${item.name}-192.png`);
    await sharp(svgBuffer).resize(192, 192).png().toFile(png192Path);

    console.log(`Generated: ${item.name}-512.png & ${item.name}-192.png`);
  }
  console.log('Pro PNGs generated successfully!');
}

generateProPngs().catch(console.error);
