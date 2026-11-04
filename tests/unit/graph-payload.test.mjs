import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGraphPayload } from '../../src/lib/graph-payload.ts';
import { AREA_IDS } from '../../src/data/areas.ts';
import { readProjects } from './graph.test.mjs';

const PAGES = new Set(['air-retrieval-service', 'candidate-assessment', 'voice-agent', 'hypergan-clip', 'clipinverter']);
const RESEARCH = new Set(['hypergan-clip', 'clipinverter', 'blockgan-implementation', 'bridgerank-implementation', 'differentiable-sorting', 'gpu-stencil', 'ml-from-scratch', 'restaurant-recommender', 'visual-inertial-navigation']);

export const fixtureProjects = () =>
  readProjects().map(({ slug }) => ({
    id: slug,
    data: {
      title: slug, section: RESEARCH.has(slug) ? 'research' : 'work', form: PAGES.has(slug) ? 'page' : 'card',
      areas: [], links: [], summary: `Summary of ${slug}.`, order: 1, org: 'aiXplain', start: '2023-06', end: 'present',
    },
  }));

const payload = buildGraphPayload(fixtureProjects());

test('page projects link to their page', () => {
  assert.equal(payload.projects['air-retrieval-service'].href, '/work/air-retrieval-service/');
});

test('card projects have no page and point to their section', () => {
  assert.equal(payload.projects.koder.href, null);
  assert.equal(payload.projects.koder.listHref, '/work/');
});

test('a project lists every entry it sits under', () => {
  assert.ok(payload.projects['air-retrieval-service'].under.includes('rerank'));
  assert.ok(payload.projects['air-retrieval-service'].under.includes('scaling'));
});

test('areas come in ring order with their pages', () => {
  assert.deepEqual(payload.areas.map((a) => a.id), [...AREA_IDS]);
  assert.equal(payload.areas[0].href, '/areas/retrieval-rag/');
});

test('meta joins organisation and dates; overrides and papers apply', () => {
  assert.equal(payload.projects.koder.meta, 'aiXplain · Jun 2023 – present');
  assert.equal(payload.projects['voice-agent'].label, 'Voice agents & call center studio');
  assert.equal(payload.projects['hypergan-clip'].paper, true);
  assert.equal(payload.projects.koder.paper, false);
});

test('projects outside the graph are left out', () => {
  assert.equal(payload.projects['radity-backend'], undefined);
});

test('the payload survives JSON', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(payload)), payload);
});
