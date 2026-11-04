import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGraphPayload } from '../../src/lib/graph-payload.ts';
import { highlightSet, onBackgroundClick, onNodeClick, visibleGraph } from '../../src/lib/graph-state.ts';
import { fixtureProjects } from './graph-payload.test.mjs';

const p = buildGraphPayload(fixtureProjects());
const ids = (g) => g.nodes.map((n) => n.id);
const linkIds = (g, kind) => g.links.filter((l) => l.kind === kind).map((l) => l.id);

test('folded: me, seven areas, seven tree links and nine related links', () => {
  const g = visibleGraph(p, new Set());
  assert.equal(g.nodes.length, 8);
  assert.equal(linkIds(g, 'tree').length, 7);
  assert.deepEqual(linkIds(g, 'related').sort(), [
    'related:area:agentic-systems|area:ai-agents',
    'related:area:agentic-systems|area:ml-foundations',
    'related:area:agentic-systems|area:retrieval-rag',
    'related:area:ai-agents|area:knowledge-graphs',
    'related:area:ai-agents|area:ml-infrastructure',
    'related:area:generative-vision|area:ml-foundations',
    'related:area:generative-vision|area:retrieval-rag',
    'related:area:knowledge-graphs|area:retrieval-rag',
    'related:area:ml-infrastructure|area:retrieval-rag',
  ]);
});

test('opening an area shows its entries and moves related ends down to them', () => {
  const g = visibleGraph(p, new Set(['area:retrieval-rag']));
  assert.equal(ids(g).filter((id) => id.startsWith('entry:')).length, 6);
  assert.ok(linkIds(g, 'related').includes('related:area:agentic-systems|entry:rerank'));
});

test('a project under two open entries appears once with two links', () => {
  const g = visibleGraph(p, new Set(['area:retrieval-rag', 'entry:hybrid', 'entry:rerank']));
  assert.equal(ids(g).filter((id) => id === 'project:air-retrieval-service').length, 1);
  const tree = linkIds(g, 'tree');
  assert.ok(tree.includes('tree:entry:hybrid>project:air-retrieval-service'));
  assert.ok(tree.includes('tree:entry:rerank>project:air-retrieval-service'));
});

test('related links resolve to the deepest visible node, and drafts stay hidden', () => {
  const g = visibleGraph(p, new Set(['area:ml-foundations', 'entry:dl']));
  assert.ok(linkIds(g, 'related').includes('related:area:generative-vision|entry:dlgans'));
  assert.equal(ids(g).includes('entry:courses'), false);
});

test('click sequence opens, focuses and folds', () => {
  const start = { expanded: new Set(), focus: null };
  const run = () => {
    let s = onNodeClick(p, start, 'area:retrieval-rag');
    assert.deepEqual([...s.expanded], ['area:retrieval-rag']);
    assert.equal(s.focus, 'area:retrieval-rag');
    s = onNodeClick(p, s, 'entry:rerank');
    assert.deepEqual([...s.expanded].sort(), ['area:retrieval-rag', 'entry:rerank']);
    assert.equal(s.focus, 'entry:rerank');
    s = onNodeClick(p, s, 'area:retrieval-rag');
    assert.deepEqual([...s.expanded].sort(), ['area:retrieval-rag', 'entry:rerank']);
    assert.equal(s.focus, 'area:retrieval-rag');
    s = onNodeClick(p, s, 'area:retrieval-rag');
    assert.deepEqual([...s.expanded], []);
    assert.equal(s.focus, null);
    assert.equal(ids(visibleGraph(p, s.expanded)).some((id) => id.startsWith('project:')), false);
    return s;
  };
  assert.deepEqual(run(), run());
  assert.equal(start.expanded.size, 0);
  assert.equal(start.focus, null);
});

test('leaves only take focus; me and the background clear it', () => {
  let s = onNodeClick(p, { expanded: new Set(['area:retrieval-rag', 'entry:rerank']), focus: null }, 'project:air-retrieval-service');
  assert.equal(s.focus, 'project:air-retrieval-service');
  assert.equal(s.expanded.size, 2);
  assert.equal(onNodeClick(p, s, 'me').focus, null);
  assert.equal(onBackgroundClick(s).focus, null);
});

test('highlight covers ancestors, descendants, neighbours and related ends', () => {
  const g = visibleGraph(p, new Set(['area:retrieval-rag', 'entry:rerank']));
  const h = highlightSet(g, 'entry:rerank');
  for (const id of ['me', 'area:retrieval-rag', 'entry:rerank', 'project:air-retrieval-service', 'area:agentic-systems']) assert.ok(h.has(id), id);
  assert.equal(h.has('area:knowledge-graphs'), false);
  assert.equal(highlightSet(g, null), null);
});

test('a shared project stays bright under its second parent', () => {
  const g = visibleGraph(p, new Set(['area:retrieval-rag', 'entry:prodrag', 'area:knowledge-graphs', 'entry:graphrag']));
  const h = highlightSet(g, 'area:knowledge-graphs');
  assert.ok(h.has('project:air-retrieval-service'));
  assert.ok(h.has('entry:graphrag'));
  const hp = highlightSet(g, 'project:air-retrieval-service');
  for (const id of ['entry:prodrag', 'entry:graphrag', 'area:retrieval-rag', 'area:knowledge-graphs']) assert.ok(hp.has(id), id);
});
