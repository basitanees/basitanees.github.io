import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { findViolations } from '../../src/lib/guard.mjs';
import { flattenGraph, graphProblems, graphStrings, projectAreas } from '../../src/lib/graph.ts';

const DIR = new URL('../../src/content/projects/', import.meta.url);

export function readProjects() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const fm = readFileSync(new URL(f, DIR), 'utf8').split('---')[1];
      const list = fm.match(/^areas:\s*\[(.*)\]\s*$/m)?.[1] ?? '';
      return { slug: f.slice(0, -3), areas: list.split(',').map((s) => s.trim()).filter(Boolean) };
    });
}

const forbiddenFile = new URL('../../.guard-forbidden', import.meta.url);
const forbidden = (process.env.GUARD_FORBIDDEN ?? (existsSync(forbiddenFile) ? readFileSync(forbiddenFile, 'utf8') : ''))
  .split(/[\n,]/)
  .map((t) => t.trim())
  .filter(Boolean);

test('the graph has no problems against the real projects', () => {
  assert.deepEqual(graphProblems(readProjects().map((p) => p.slug)), []);
});

test("every project's areas match the areas it sits under in the graph", () => {
  for (const p of readProjects()) assert.deepEqual(projectAreas(p.slug), p.areas, p.slug);
});

test('every graph string passes the guard', () => {
  const bad = graphStrings().flatMap((s) => findViolations(s, { forbidden }).map((v) => `${v.rule} "${v.match}" in: ${s}`));
  assert.deepEqual(bad, []);
});

test('empty drafts are not rendered', () => {
  assert.equal(flattenGraph().some((e) => e.id === 'courses'), false);
});

test('deep learning lists its sub-entries in order', () => {
  assert.deepEqual(flattenGraph().find((e) => e.id === 'dl').children, ['dnn', 'cnn', 'rnn', 'transformers', 'dlgans']);
});

test('the graph renders 50 entries', () => {
  assert.equal(flattenGraph().length, 50);
});

test('a project in no entry has no areas', () => {
  assert.deepEqual(projectAreas('radity-backend'), []);
  assert.deepEqual(projectAreas('differentiable-sorting'), []);
});

test('graphProblems reports unknown slugs', () => {
  assert.ok(graphProblems(['koder']).some((p) => p.includes('air-retrieval-service')));
});
