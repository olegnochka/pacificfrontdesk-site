// Favicon set from the day/night split mark (src/assets/brand/mark.svg).
// Runs before `astro build`; outputs to public/ (gitignored).
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const markPath = path.join(root, 'src', 'assets', 'brand', 'mark.svg');
const publicDir = path.join(root, 'public');

const svg = await readFile(markPath);

const sizes = [
  { size: 16, file: 'favicon-16.png' },
  { size: 32, file: 'favicon-32.png' },
  { size: 180, file: 'apple-touch-icon.png' },
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
];

const pngs = {};
for (const { size, file } of sizes) {
  const buf = await sharp(svg, { density: 300 }).resize(size, size).png().toBuffer();
  pngs[size] = buf;
  await writeFile(path.join(publicDir, file), buf);
}

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + 16 * images.length;
  for (const { size, buf } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.buf)]);
}

await writeFile(
  path.join(publicDir, 'favicon.ico'),
  buildIco([
    { size: 16, buf: pngs[16] },
    { size: 32, buf: pngs[32] },
  ]),
);
await copyFile(markPath, path.join(publicDir, 'favicon.svg'));
console.log('favicons: favicon.ico, favicon.svg, 5 PNG sizes');
