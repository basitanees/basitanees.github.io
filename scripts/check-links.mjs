import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

function htmlFiles(d) {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = join(d, e.name);
    if (e.isDirectory()) return htmlFiles(p);
    return e.name.endsWith('.html') ? [p] : [];
  });
}

function resolves(dir, href) {
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  const target = join(dir, path);
  if (path.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) && statSync(target).isFile();
}

export function brokenLinks(dir, ignore) {
  const broken = [];
  for (const file of htmlFiles(dir)) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\s(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
      const href = m[1];
      if (ignore.includes(href) || resolves(dir, href)) continue;
      broken.push({ from: relative(dir, file), href });
    }
  }
  return broken;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2] ?? 'dist';
  // The CV PDF is printed after this check runs.
  const broken = brokenLinks(dir, ['/abdul-basit-anees-cv.pdf']);
  for (const b of broken) console.error(`${b.from}: broken link ${b.href}`);
  if (broken.length) {
    console.error(`links: ${broken.length} broken`);
    process.exit(1);
  }
  console.log('links: all internal links resolve');
}
