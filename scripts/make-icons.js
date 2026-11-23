// 產生 App 圖示（PNG）。執行：node scripts/make-icons.js
// 圖案：夜間攝影棚深藍底，霓虹青色螢幕外框＋播放鍵，右上角琥珀色錄影燈。
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const BG = [0x07, 0x0d, 0x14], BG2 = [0x10, 0x22, 0x2e], CYAN = [0x3f, 0xe0, 0xf6], AMBER = [0xff, 0xa0, 0x47];
const sdRR = (x, y, x0, y0, x1, y1, r) => { const cx=(x0+x1)/2, cy=(y0+y1)/2, hx=(x1-x0)/2-r, hy=(y1-y0)/2-r; const dx=Math.max(Math.abs(x-cx)-hx,0), dy=Math.max(Math.abs(y-cy)-hy,0); return Math.hypot(dx,dy)-r; };
const inTri = (x, y, a, b, c) => { const s=(p,q,r)=>(p[0]-r[0])*(q[1]-r[1])-(q[0]-r[0])*(p[1]-r[1]); const d1=s([x,y],a,b), d2=s([x,y],b,c), d3=s([x,y],c,a); return !((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0)); };
const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function render(size, { content = 1, rounded = false } = {}) {
  const S = 4, px = Buffer.alloc(size * size * 4), m = t => 0.5 + (t - 0.5) * content;
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let sj = 0; sj < S; sj++) for (let si = 0; si < S; si++) {
      const x = (i + (si + .5) / S) / size, y = (j + (sj + .5) / S) / size;
      if (rounded && sdRR(x, y, 0, 0, 1, 1, .22) > 0) continue;
      let c = mixc(BG2, BG, Math.min(1, Math.hypot(x - .5, y - .35) * 1.6));
      const d = sdRR(x, y, m(.16), m(.24), m(.84), m(.76), .07 * content);
      const w = .035 * content;
      if (Math.abs(d) < w) c = CYAN;
      else if (Math.abs(d) < w * 2.6) c = mixc(c, CYAN, .35 * (1 - (Math.abs(d) - w) / (w * 1.6)));
      if (inTri(x, y, [m(.43), m(.38)], [m(.43), m(.62)], [m(.63), m(.5)])) c = [0xf2, 0xfb, 0xff];
      const rd = Math.hypot(x - m(.8), y - m(.22));
      if (rd < .065 * content) c = AMBER; else if (rd < .1 * content) c = mixc(c, AMBER, .4 * (1 - (rd - .065 * content) / (.035 * content)));
      r += c[0]; g += c[1]; b += c[2]; a += 255;
    }
    const n = S * S, o = (j * size + i) * 4, cov = a / n;
    px[o] = cov ? Math.round(r / (a / 255)) : 0; px[o + 1] = cov ? Math.round(g / (a / 255)) : 0; px[o + 2] = cov ? Math.round(b / (a / 255)) : 0; px[o + 3] = Math.round(cov);
  }
  return encodePNG(size, px);
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = buf => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function encodePNG(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

const out = path.join(__dirname, '..', 'icons');
fs.mkdirSync(out, { recursive: true });
const write = (name, buf) => { fs.writeFileSync(path.join(out, name), buf); console.log(name, buf.length, 'bytes'); };
write('icon-192.png', render(192, { rounded: true }));
write('icon-512.png', render(512, { rounded: true }));
write('maskable-512.png', render(512, { content: 0.78 }));
write('apple-touch-icon.png', render(180));
write('favicon-32.png', render(32, { rounded: true }));
