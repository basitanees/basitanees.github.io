import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findViolations, visibleText } from '../src/lib/guard.mjs';

const dir = process.argv[2] ?? 'dist';

// Extra terms to reject: GUARD_FORBIDDEN (one per line or comma-separated) or a local .guard-forbidden file.
const listSource = process.env.GUARD_FORBIDDEN ?? (existsSync('.guard-forbidden') ? readFileSync('.guard-forbidden', 'utf8') : '');
const forbidden = listSource.split(/[\n,]/).map((t) => t.trim()).filter(Boolean);
if (!forbidden.length) console.log('guard: no extra term list found; that rule is skipped');

function htmlFiles(d) {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = join(d, e.name);
    if (e.isDirectory()) return htmlFiles(p);
    return e.name.endsWith('.html') ? [p] : [];
  });
}

// Text people read that lives in attributes: meta descriptions, alt text, tooltips, labels.
const attributeText = (html) =>
  [...html.matchAll(/\s(?:content|alt|title|aria-label)="([^"]*)"/gi)].map((m) => m[1]).join(' \n ');

const files = htmlFiles(dir);
let count = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const v of findViolations(`${visibleText(html)} \n ${visibleText(attributeText(html))}`, { forbidden })) {
    console.error(`${relative(dir, file)}: ${v.rule} "${v.match}"`);
    count++;
  }
}
if (count) {
  console.error(`guard: ${count} violation(s)`);
  process.exit(1);
}
console.log(`guard: ${files.length} files clean`);
