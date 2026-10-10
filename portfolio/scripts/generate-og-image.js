#!/usr/bin/env node
/**
 * Generates public/og-image.png (1200x630, 1x) with the Node standard
 * library only (zlib for PNG DEFLATE). Draws:
 *   - dark navy background with a subtle diagonal gradient
 *   - faint grid lines (matches the hero aesthetic)
 *   - accent-colored monogram tile with "HAJ"
 *   - name, title, and location lines rendered with a tiny built-in
 *     5x7 bitmap font (uppercase, digits, basic punctuation)
 *
 * No external image dependencies are required.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const W = 1200;
const H = 630;

// ---------------------------------------------------------------------------
// Tiny 5x7 bitmap font. Each glyph is 7 rows of 5 bits (MSB left).
// Only the characters we render on the card are included.
// ---------------------------------------------------------------------------
const FONT = {
  'A': [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'C': [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  'D': [0x1e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x1e],
  'E': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  'F': [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  'G': [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
  'H': [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  'I': [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  'J': [0x07, 0x02, 0x02, 0x02, 0x12, 0x12, 0x0c],
  'K': [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  'L': [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  'M': [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  'N': [0x11, 0x11, 0x19, 0x15, 0x13, 0x11, 0x11],
  'O': [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'P': [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  'R': [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  'S': [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  'T': [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  'U': [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  'V': [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  'W': [0x11, 0x11, 0x11, 0x15, 0x15, 0x1b, 0x11],
  'Y': [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
  'Z': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
  '+': [0x00, 0x04, 0x04, 0x1f, 0x04, 0x04, 0x00],
  '2': [0x0e, 0x11, 0x01, 0x02, 0x04, 0x08, 0x1f],
  '5': [0x1f, 0x10, 0x10, 0x1e, 0x01, 0x01, 0x1e],
  '0': [0x0e, 0x11, 0x19, 0x15, 0x13, 0x11, 0x0e],
  '-': [0x00, 0x00, 0x00, 0x1f, 0x00, 0x00, 0x00],
  '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x0c],
  ',': [0x00, 0x00, 0x00, 0x00, 0x0c, 0x04, 0x08],
  ':': [0x00, 0x0c, 0x0c, 0x00, 0x0c, 0x0c, 0x00],
  '/': [0x01, 0x01, 0x02, 0x04, 0x08, 0x10, 0x10],
  '&': [0x0e, 0x11, 0x10, 0x0e, 0x15, 0x12, 0x0d],
};

// Lowercase uses the same glyphs (uppercase) — acceptable for this graphic.
function glyphFor(ch) {
  return FONT[ch] || FONT[ch.toUpperCase()] || FONT[' '];
}

// ---------------------------------------------------------------------------
// Canvas: flat RGBA buffer
// ---------------------------------------------------------------------------
const buf = Buffer.alloc(W * H * 4);

function blendPixel(x, y, color, alpha) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  const a = alpha / 255;
  buf[i] = Math.round(color[0] * a + buf[i] * (1 - a));
  buf[i + 1] = Math.round(color[1] * a + buf[i + 1] * (1 - a));
  buf[i + 2] = Math.round(color[2] * a + buf[i + 2] * (1 - a));
  buf[i + 3] = 255;
}

function fillRect(x0, y0, w, h, color) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) blendPixel(x, y, color, 255);
  }
}

function fillRectAA(x0, y0, w, h, color, alpha) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) blendPixel(x, y, color, alpha);
  }
}

// ---------------------------------------------------------------------------
// Background: diagonal gradient between two dark navy tones
// ---------------------------------------------------------------------------
const BG_TOP = [10, 12, 20]; // #0a0c14
const BG_BOT = [16, 24, 44]; // #10182c
for (let y = 0; y < H; y++) {
  const t = y / (H - 1);
  const c = [
    Math.round(BG_TOP[0] + (BG_BOT[0] - BG_TOP[0]) * t),
    Math.round(BG_TOP[1] + (BG_BOT[1] - BG_TOP[1]) * t),
    Math.round(BG_TOP[2] + (BG_BOT[2] - BG_TOP[2]) * t),
  ];
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    buf[i] = c[0];
    buf[i + 1] = c[1];
    buf[i + 2] = c[2];
    buf[i + 3] = 255;
  }
}

// Subtle grid (1px lines every 40px, very faint)
for (let x = 0; x <= W; x += 40) fillRectAA(x, 0, 1, H, [255, 255, 255], 8);
for (let y = 0; y <= H; y += 40) fillRectAA(0, y, W, 1, [255, 255, 255], 8);

// Accent glow behind the monogram tile
const ACCENT = [31, 95, 224]; // #1F5FE0
const ACCENT_LIGHT = [76, 141, 255]; // #4C8DFF
for (let r = 150; r > 0; r -= 2) {
  const a = Math.round(26 * (1 - r / 150));
  const cx = 175, cy = 315;
  // approximate circle
  for (let dy = -r; dy <= r; dy++) {
    const dx = Math.round(Math.sqrt(r * r - dy * dy));
    fillRectAA(cx - dx, cy + dy, dx * 2, 1, ACCENT, a);
  }
}

// Monogram tile: 150x150 rounded-ish square at (100, 240)
const TX = 100, TY = 240, TS = 150;
fillRect(TX, TY, TS, TS, ACCENT);
// rounded corners (cut 24px radius)
const R = 24;
for (let y = 0; y < R; y++) {
  const limit = R - Math.round(Math.sqrt(R * R - (R - y) * (R - y)));
  for (let x = 0; x < limit; x++) {
    blendPixel(TX + x, TY + y, BG_TOP, 0); // clear corner
    blendPixel(TX + TS - 1 - x, TY + y, BG_TOP, 0);
    blendPixel(TX + x, TY + TS - 1 - y, BG_TOP, 0);
    blendPixel(TX + TS - 1 - x, TY + TS - 1 - y, BG_TOP, 0);
  }
}
// "HAJ" in the tile, 5x7 font scaled 4x
function drawText(x, y, text, scale, color) {
  let cx = x;
  for (const ch of text) {
    const g = glyphFor(ch);
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (g[row] & (1 << (4 - col))) {
          fillRect(cx + col * scale, y + row * scale, scale, scale, color);
        }
      }
    }
    cx += (5 + 1) * scale; // advance: 5px glyph + 1px spacing
  }
  return cx - scale * 1; // remove trailing spacing
}

const MONO_SCALE = 7; // 5x7 glyph -> 35x49 per char
const monoW = 3 * 5 * MONO_SCALE + 2 * 1 * MONO_SCALE; // "HAJ"
drawText(TX + Math.round((TS - monoW) / 2), TY + Math.round((TS - 7 * MONO_SCALE) / 2), 'HAJ', MONO_SCALE, [255, 255, 255]);

// Name: "HIRWA AIME JOSPIN" large
const NAME_SCALE = 10; // 5x7 -> 50x70 per char
drawText(320, 200, 'HIRWA AIME JOSPIN', NAME_SCALE, [255, 255, 255]);

// Title: "FULL-STACK DEVELOPER" in accent light
const TITLE_SCALE = 5;
drawText(320, 300, 'FULL-STACK DEVELOPER', TITLE_SCALE, ACCENT_LIGHT);

// Location line
const LOC_SCALE = 4;
drawText(320, 380, 'RUSIZI, RWANDA', LOC_SCALE, [148, 163, 184]);

// Decorative accent bar
fillRect(320, 430, 240, 6, ACCENT);

// Corner ticks (matches the site's corner-accent motif)
const TICK = [76, 141, 255];
fillRect(40, 40, 48, 3, TICK);
fillRect(40, 40, 3, 48, TICK);
fillRect(W - 40 - 48, 40, 48, 3, TICK);
fillRect(W - 40 - 3, 40, 3, 48, TICK);
fillRect(40, H - 40 - 3, 48, 3, TICK);
fillRect(40, H - 40 - 48, 3, 48, TICK);
fillRect(W - 40 - 48, H - 40 - 3, 48, 3, TICK);
fillRect(W - 40 - 3, H - 40 - 48, 3, 48, TICK);

// ---------------------------------------------------------------------------
// PNG encode
// ---------------------------------------------------------------------------
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

// Add per-row filter bytes (filter type 0 = None)
const raw = Buffer.alloc((W * 4 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0;
  buf.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4);
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

import { fileURLToPath } from 'node:url';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'og-image.png');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log(`og-image.png written — ${W}x${H} (${(png.length / 1024).toFixed(1)} kB) → ${out}`);
