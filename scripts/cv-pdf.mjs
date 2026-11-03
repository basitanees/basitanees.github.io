import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { chromium } from '@playwright/test';

const DIST = 'dist';
const OUT = join(DIST, 'abdul-basit-anees-cv.pdf');
const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

// A minimal static server over dist, so the page prints with its real CSS.
const server = createServer((req, res) => {
  let path = normalize(join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(DIST)) return res.writeHead(403).end();
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: 'networkidle' });
  await page.pdf({ path: OUT, format: 'A4', printBackground: true });
  console.log(`pdf: wrote ${OUT}`);
} finally {
  await browser.close();
  server.close();
}
