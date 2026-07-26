// Build: JSX → JS, then emit both a static site (docs/, for GitHub Pages) and a
// single self-contained HTML file (docs/linguamap-standalone.html) that runs from
// a file:// path or a Claude artifact with no server and no network.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import * as babel from '@babel/core';
import { minify } from 'terser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'docs');
const DEV = process.argv.includes('--dev');

// Load order matters: each file attaches to window for the next one.
const PLAIN = ['data/clusters-a.js', 'data/clusters-b.js', 'data/clusters-c.js', 'data/clusters-d.js',
  'data/grammar-en.js', 'data/grammar-hu.js', 'data/grammar-hu2.js'];
const JSX = ['core.jsx', 'store.jsx', 'views.jsx', 'voice.jsx', 'lab.jsx', 'lucy.jsx', 'shell.jsx'];

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');

async function bundle() {
  const parts = [];
  for (const f of PLAIN) parts.push(`/* ${f} */\n` + read(f));
  for (const f of JSX) {
    const { code } = babel.transformSync(read(f), {
      filename: f,
      presets: [[require_preset(), { runtime: 'classic', pragma: 'React.createElement', pragmaFrag: 'React.Fragment' }]],
      compact: false, babelrc: false, configFile: false
    });
    parts.push(`/* ${f} */\n` + code);
  }
  let js = '(function(){"use strict";\n' + parts.join('\n;\n') + '\n})();';
  if (!DEV) {
    const res = await minify(js, { compress: { passes: 2 }, mangle: true, format: { comments: false } });
    if (res.code) js = res.code;
  }
  return js;
}
function require_preset() {
  // @babel/preset-react resolved lazily so the ESM entry stays clean.
  return path.join(ROOT, 'node_modules', '@babel', 'preset-react');
}

const VERSION = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');

function shell({ inlineJs, inlineCss, fontCss, standalone }) {
  // connect-src has to stay open: the whole point is that you choose the model
  // endpoint, including a local one on your own network. Everything else that
  // could execute code is locked to this origin.
  const CSP = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",   // React writes inline style attributes
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src *",
    "base-uri 'none'",
    "object-src 'none'",
    "form-action 'none'"
  ].join('; ');
  const head = standalone
    ? `<style>${fontCss}\n${inlineCss}</style>`
    : `<meta http-equiv="Content-Security-Policy" content="${CSP}">
  <link rel="stylesheet" href="assets/app.css?v=${VERSION}">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" href="assets/icon.svg" type="image/svg+xml">`;
  const scripts = standalone
    ? `<script>${fs.readFileSync(path.join(OUT, 'vendor', 'react.production.min.js'), 'utf8')}</script>
<script>${fs.readFileSync(path.join(OUT, 'vendor', 'react-dom.production.min.js'), 'utf8')}</script>
<script>${inlineJs}</script>`
    // No inline script on the hosted build, so script-src can stay 'self' —
    // an injected <script> tag has nothing to execute under that policy.
    : `<script src="vendor/react.production.min.js"></script>
<script src="vendor/react-dom.production.min.js"></script>
<script src="assets/app.js?v=${VERSION}"></script>
<script src="assets/sw-register.js?v=${VERSION}"></script>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LinguaMap — Grammar Studio</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="A grammar map, sentence lab, AI tutor and spaced-repetition trainer for learning European languages. Works offline, bring your own model.">
<meta name="theme-color" content="#020617">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="LinguaMap">
${head}
</head>
<body>
<div id="root"></div>
<noscript style="color:#94a3b8;font:15px sans-serif;display:block;padding:40px;text-align:center">
LinguaMap needs JavaScript to run.</noscript>
${scripts}
</body>
</html>`;
}

const BASE_CSS = `html,body{margin:0;padding:0;background:#020617}
*{box-sizing:border-box}
::selection{background:#0ea5e955}
a{color:#38bdf8}a:hover{color:#7dd3fc}
input::placeholder,textarea::placeholder{color:#64748b}
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-thumb{background:#33415577;border-radius:6px}
::-webkit-scrollbar-track{background:transparent}
select{-webkit-appearance:none;appearance:none;cursor:pointer}
button{font-family:inherit}
input,textarea,select{font-family:inherit;max-width:100%}
@media (max-width:720px){input,textarea,select{font-size:16px !important}}
@media print{body{background:#fff}}`;

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" rx="96" fill="#020617"/>
<rect x="96" y="112" width="130" height="96" rx="16" fill="#0f172a" stroke="#38bdf8" stroke-width="8"/>
<rect x="286" y="112" width="130" height="96" rx="16" fill="#0f172a" stroke="#f59e0b" stroke-width="8"/>
<rect x="191" y="292" width="130" height="96" rx="16" fill="#0f172a" stroke="#2dd4bf" stroke-width="8"/>
<path d="M161 208 Q 200 292 240 292" stroke="#475569" stroke-width="8" fill="none" stroke-dasharray="14 12"/>
<path d="M351 208 Q 310 292 272 292" stroke="#475569" stroke-width="8" fill="none" stroke-dasharray="14 12"/>
</svg>`;

// ── Minimal PNG writer ───────────────────────────────────────────────────────
// Chrome on Android is happiest installing a PWA when the manifest offers real
// PNG icons at 192/512. Rasterising the SVG would mean pulling in a rendering
// dependency, so the icon — flat rounded rectangles — is drawn directly instead.
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = c ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function pngFromRGBA(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;                                     // filter: none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;  // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}
function drawIcon(size) {
  const px = Buffer.alloc(size * size * 4);
  const S = size / 512;                                    // design grid is 512
  const hex = (s) => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)];
  const set = (x, y, [r,g,b]) => { const i = (y*size+x)*4; px[i]=r; px[i+1]=g; px[i+2]=b; px[i+3]=255; };
  // A rounded rect, filled or stroked, in design-grid coordinates.
  const rrect = (x0, y0, w, h, rad, color, strokeW) => {
    const c = hex(color);
    const X0=x0*S, Y0=y0*S, W=w*S, H=h*S, R=rad*S, SW=(strokeW||0)*S;
    for (let y = Math.max(0,Math.floor(Y0)); y < Math.min(size,Math.ceil(Y0+H)); y++) {
      for (let x = Math.max(0,Math.floor(X0)); x < Math.min(size,Math.ceil(X0+W)); x++) {
        const dx = Math.max(X0+R-x, 0, x-(X0+W-R));
        const dy = Math.max(Y0+R-y, 0, y-(Y0+H-R));
        const d = Math.hypot(dx, dy);
        if (d > R) continue;                                        // outside corner
        if (SW) {                                                   // stroke only
          const ix = x-(X0+SW), iy = y-(Y0+SW), iw = W-2*SW, ih = H-2*SW, ir = Math.max(R-SW,0);
          const idx = Math.max(ir-ix, 0, ix-(iw-ir)), idy = Math.max(ir-iy, 0, iy-(ih-ir));
          const inside = ix>=0 && iy>=0 && ix<iw && iy<ih && Math.hypot(idx,idy)<=ir;
          if (inside) continue;
        }
        set(x, y, c);
      }
    }
  };
  rrect(0, 0, 512, 512, 96, '#020617');
  rrect(96, 112, 130, 96, 16, '#0f172a');
  rrect(96, 112, 130, 96, 16, '#38bdf8', 8);
  rrect(286, 112, 130, 96, 16, '#0f172a');
  rrect(286, 112, 130, 96, 16, '#f59e0b', 8);
  rrect(191, 292, 130, 96, 16, '#0f172a');
  rrect(191, 292, 130, 96, 16, '#2dd4bf', 8);
  return pngFromRGBA(size, size, px);
}

async function main() {
  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  const js = await bundle();
  const fontCss = fs.readFileSync(path.join(SRC, 'fonts.css'), 'utf8');

  // ── static site ──
  fs.writeFileSync(path.join(OUT, 'assets', 'app.js'), js);
  fs.writeFileSync(path.join(OUT, 'assets', 'app.css'), fontCss + '\n' + BASE_CSS);
  fs.writeFileSync(path.join(OUT, 'assets', 'icon.svg'), ICON_SVG);
  fs.writeFileSync(path.join(OUT, 'assets', 'icon-192.png'), drawIcon(192));
  fs.writeFileSync(path.join(OUT, 'assets', 'icon-512.png'), drawIcon(512));
  fs.writeFileSync(path.join(OUT, 'assets', 'sw-register.js'),
    `if('serviceWorker' in navigator){addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}\n`);
  fs.writeFileSync(path.join(OUT, 'index.html'), shell({ standalone: false }));
  fs.writeFileSync(path.join(OUT, '404.html'), shell({ standalone: false })); // SPA fallback on Pages
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
  fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
    name: 'LinguaMap — Grammar Studio', short_name: 'LinguaMap',
    description: 'Grammar map, sentence lab, AI tutor and spaced repetition for European languages.',
    start_url: './', scope: './', display: 'standalone',
    background_color: '#020617', theme_color: '#020617', orientation: 'any',
    categories: ['education', 'productivity'],
    icons: [
      { src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: 'assets/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
    ],
    shortcuts: [
      { name: 'Review', url: './#/review' },
      { name: 'Lucy', url: './#/lucy' },
      { name: 'Reader', url: './#/reader' }
    ]
  }, null, 2));

  // Precache list: everything needed to run with no network.
  const fonts = fs.readdirSync(path.join(OUT, 'assets', 'fonts')).map(f => 'assets/fonts/' + f);
  const precache = ['./', 'index.html', `assets/app.js?v=${VERSION}`, `assets/app.css?v=${VERSION}`,
    `assets/sw-register.js?v=${VERSION}`, 'assets/icon.svg',
    'assets/icon-192.png', 'assets/icon-512.png', 'manifest.webmanifest',
    'vendor/react.production.min.js', 'vendor/react-dom.production.min.js', ...fonts];
  fs.writeFileSync(path.join(OUT, 'sw.js'), swSource(VERSION, precache));

  // ── single-file build ──
  fs.writeFileSync(path.join(OUT, 'linguamap-standalone.html'),
    shell({ standalone: true, inlineJs: js, inlineCss: BASE_CSS, fontCss: inlineFonts(fontCss) }));

  const kb = (p) => (fs.statSync(path.join(OUT, p)).size / 1024).toFixed(0) + ' KB';
  console.log('built:',
    '\n  docs/assets/app.js            ', kb('assets/app.js'),
    '\n  docs/linguamap-standalone.html', kb('linguamap-standalone.html'));
}

// Fonts become data: URIs in the standalone build so it works from file://.
function inlineFonts(css) {
  return css.replace(/url\("assets\/fonts\/([^"]+)"\)/g, (m, f) => {
    const b = fs.readFileSync(path.join(OUT, 'assets', 'fonts', f));
    return `url("data:font/woff2;base64,${b.toString('base64')}")`;
  });
}

function swSource(version, precache) {
  return `// LinguaMap service worker — offline-first shell, network-first for APIs.
const CACHE = 'linguamap-${version}';
const PRECACHE = ${JSON.stringify(precache, null, 2)};

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Never touch model providers — those must always hit the network.
  if (url.origin !== location.origin) return;

  // Navigations are network-first so a new deploy is picked up immediately,
  // with the cached shell as the offline fallback.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Assets: serve from cache for instant loads, refresh in the background.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
`;
}

main().catch(e => { console.error(e); process.exit(1); });
