import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { brokenLinks } from '../../scripts/check-links.mjs';

function site(files) {
  const dir = mkdtempSync(join(tmpdir(), 'links-'));
  for (const [path, html] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), html);
  }
  return dir;
}

test('reports an internal link with no built page', () => {
  const dir = site({ 'index.html': '<a href="/a/">a</a><a href="/b/">b</a>', 'a/index.html': '' });
  assert.deepEqual(brokenLinks(dir, []), [{ from: 'index.html', href: '/b/' }]);
});

test('resolves files, the root, fragments and query strings', () => {
  const dir = site({ 'index.html': '<a href="/">home</a><a href="/a/#x">a</a><img src="/img.png"><a href="/a/?q=1">q</a>', 'a/index.html': '', 'img.png': '' });
  assert.deepEqual(brokenLinks(dir, []), []);
});

test('ignores external links and listed paths', () => {
  const dir = site({ 'index.html': '<a href="https://x.org/">x</a><a href="//cdn.x/">c</a><a href="mailto:a@b.c">m</a><a href="/later.pdf">p</a>' });
  assert.deepEqual(brokenLinks(dir, ['/later.pdf']), []);
});
