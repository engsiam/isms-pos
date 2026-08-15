// Generates the Tauri application icons from scratch (zero dependencies).
// Uses Node's built-in zlib to produce valid RGBA PNGs, then wraps them
// into .ico (Windows) and .icns (macOS) containers.
//
// Usage: npm run tauri:icon

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICON_DIR = join(__dirname, "..", "src-tauri", "icons");

/** Brand palette: deep indigo gradient on a rounded-dot shape. */
const ACCENT = [124, 58, 237]; // violet-600
const ACCENT_2 = [79, 70, 229]; // indigo-600
const BG = [255, 255, 255];

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function rgbaPixel(x, y, size) {
  const cx = size / 2;
  const radius = size * 0.46;
  const dx = x - cx;
  const dy = y - cx;
  if (dx * dx + dy * dy > radius * radius) {
    return [...BG, 255];
  }
  // vertical blend of the two accents
  const t = (y / size) * 2.2 - 0.6;
  const r = Math.round(ACCENT[0] + (ACCENT_2[0] - ACCENT[0]) * Math.max(0, Math.min(1, t)));
  const g = Math.round(ACCENT[1] + (ACCENT_2[1] - ACCENT[1]) * Math.max(0, Math.min(1, t)));
  const b = Math.round(ACCENT[2] + (ACCENT_2[2] - ACCENT[2]) * Math.max(0, Math.min(1, t)));
  // draw a simple white "minus + register" glyph
  const inBar = y > size * 0.55 && y < size * 0.62 && Math.abs(dx) < radius * 0.55;
  const inDot = (dx + size * 0.2) ** 2 + (dy + size * 0.25) ** 2 < (size * 0.06) ** 2;
  if (inBar || inDot) return [255, 255, 255, 255];
  return [r, g, b, 255];
}

function makePng(size) {
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0; // filter type: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = rgbaPixel(x, y, size);
      row.writeUInt8(r, 1 + x * 4);
      row.writeUInt8(g, 2 + x * 4);
      row.writeUInt8(b, 3 + x * 4);
      row.writeUInt8(a, 4 + x * 4);
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function makeIco(png) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count
  header[6] = 0; // width 0 -> 256
  header[7] = 0; // height 0 -> 256
  header[10] = 1; // planes
  header.writeUInt16LE(32, 12); // bpp
  header.writeUInt32LE(png.length, 14); // size
  header.writeUInt32LE(22, 18); // offset
  return Buffer.concat([header, png]);
}

function makeIcns(png512) {
  const chunkSize = Buffer.alloc(4);
  chunkSize.writeUInt32BE(8 + png512.length, 0);
  const ic09 = Buffer.concat([Buffer.from("ic09", "ascii"), chunkSize, png512]);
  const total = Buffer.alloc(4);
  total.writeUInt32BE(8 + ic09.length, 0);
  return Buffer.concat([Buffer.from("icns", "ascii"), total, ic09]);
}

if (!existsSync(ICON_DIR)) mkdirSync(ICON_DIR, { recursive: true });

const png32 = makePng(32);
const png128 = makePng(128);
const png256 = makePng(256);
const png512 = makePng(512);
const png1024 = makePng(1024);

const artifacts = {
  "32x32.png": png32,
  "128x128.png": png128,
  "128x128@2x.png": png256,
  "icon.png": png512,
  "Square30x30Logo.png": png32,
  "Square44x44Logo.png": png128,
  "Square107x107Logo.png": png256,
  "icon.ico": makeIco(png256),
  "icon.icns": makeIcns(png512),
  "StoreLogo.png": makePng(128),
};

for (const [name, data] of Object.entries(artifacts)) {
  writeFileSync(join(ICON_DIR, name), data);
  console.log(`  generated src-tauri/icons/${name} (${data.length} bytes)`);
}

console.log("\nAll icons generated. Keeping png1024 for future resizes...");
writeFileSync(join(ICON_DIR, "icon.png"), png1024);
console.log("Done.");