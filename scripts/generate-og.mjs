// 1200x630 Open Graph cards: sharp + Pango with the vendored Archivo TTF.
// Day-side layout with a night panel on the right; text stays inside the
// central 1000x500 safe zone. Output: public/og/ (gitignored).
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'og');
const archivo = path.join(root, 'scripts', 'fonts', 'Archivo.ttf');

const W = 1200;
const H = 630;
const PAPER = '#F7F5F0';
const INK = '#0B0E12';
const TEXT = '#17222E';
const MUTED = '#5B6672';
const PACIFIC = '#0E6BA8';
const SODIUM = '#FFB74A';

const esc = (s) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

async function textLayer(markup, font, width) {
  const buf = await sharp({
    text: { text: markup, font, fontfile: archivo, rgba: true, width },
  })
    .png()
    .toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, width: meta.width, height: meta.height };
}

async function makeCard(file, title, subtitle) {
  const nightX = 1010; // night panel outside the right safe-zone edge
  const layers = [
    {
      input: Buffer.from(
        `<svg width="${W}" height="${H}">
          <rect x="${nightX}" width="${W - nightX}" height="${H}" fill="${INK}"/>
          <rect x="${nightX + 80}" y="120" width="26" height="26" fill="${SODIUM}"/>
          <circle cx="180" cy="120" r="34" fill="${SODIUM}"/>
        </svg>`,
      ),
      top: 0,
      left: 0,
    },
  ];

  const brand = await textLayer(
    `<span foreground="${PACIFIC}" letter_spacing="4096">PACIFIC FRONT DESK</span>`,
    'Archivo Bold 24',
    800,
  );
  layers.push({ input: brand.buf, left: 100, top: 210 });

  const titleLayer = await textLayer(
    `<span foreground="${TEXT}">${esc(title)}</span>`,
    'Archivo Semi-Bold 56',
    860,
  );
  layers.push({ input: titleLayer.buf, left: 100, top: 260 });

  if (subtitle) {
    const subLayer = await textLayer(
      `<span foreground="${MUTED}">${esc(subtitle)}</span>`,
      'Archivo Medium 28',
      860,
    );
    layers.push({ input: subLayer.buf, left: 100, top: 280 + titleLayer.height + 20 });
  }

  await sharp({ create: { width: W, height: H, channels: 4, background: PAPER } })
    .composite(layers)
    .png()
    .toFile(path.join(outDir, file));
  console.log('og:', file);
}

await mkdir(outDir, { recursive: true });
await makeCard(
  'default.png',
  'One founder. Two shifts.',
  'Pacific Front Desk by day. Nattskift Games by night.',
);
await makeCard(
  'answering-service.png',
  'Your business never misses another call.',
  'AI answering for home-service businesses in Los Angeles.',
);
