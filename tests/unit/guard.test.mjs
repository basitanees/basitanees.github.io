import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findViolations, visibleText } from '../../src/lib/guard.mjs';

const rules = (text, opts) => findViolations(text, opts).map((v) => v.rule);

test('flags a phone number', () => {
  assert.deepEqual(rules('Phone +1 555 0100 2000'), ['phone']);
});

test('flags an em dash in any spelling but not an en dash in a date range', () => {
  assert.deepEqual(rules('fast — really'), ['em-dash']);
  assert.deepEqual(rules('fast ― really'), ['em-dash']);
  assert.deepEqual(rules(visibleText('<p>fast &mdash; really</p>')), ['em-dash']);
  assert.deepEqual(rules('Jun 2023 – present'), []);
});

test('flags performance and scale figures', () => {
  const cases = [
    '87% of the time', '20–30× less', 'in 6 ms', '~0.5 s', '12,000 questions', '300+ collections',
    '87 percent', '2 times faster', 'in 0.5 s', '6 milliseconds', '12k questions', '1.5K docs', 'from 60 → 98', 'millions of vectors',
  ];
  for (const text of cases) assert.ok(rules(text).includes('figure'), text);
});

test('allows years, venues, course codes and placements', () => {
  for (const text of ['6+ years', 'SIGGRAPH Asia 2024', 'COMP106', '9th place', 'Jetson TX2', '2D stencil', '11 min walk']) {
    assert.ok(!rules(text).includes('figure'), text);
  }
});

test('flags a banned word and its inflections', () => {
  const [v] = findViolations('a robust system');
  assert.equal(v.rule, 'banned-word');
  assert.equal(v.match, 'robust');
  for (const text of ['leveraging', 'optimized', 'enhanced', 'aligned', 'highlights', 'robustness', 'scalability']) {
    assert.ok(rules(text).includes('banned-word'), text);
  }
});

test('allowlisted proper names pass the banned-word check', () => {
  assert.deepEqual(rules('Visual-Inertial Integrated Navigation System'), []);
});

test('flags a forbidden term from the private list, case-insensitively', () => {
  const [v] = findViolations('meet Zorblax today', { forbidden: ['zorblax'] });
  assert.equal(v.rule, 'forbidden-term');
  assert.equal(v.match, 'Zorblax');
});

test('flags a forbidden multi-word term', () => {
  assert.ok(rules('see Zorb Lax here', { forbidden: ['zorb lax'] }).includes('forbidden-term'));
});

test('allows saying a paper was co-authored', () => {
  assert.deepEqual(rules('I co-authored the paper'), []);
});

test('visibleText drops tags and scripts and decodes entities', () => {
  assert.equal(visibleText('<p>a&amp;b</p><script>x=1</script>'), 'a&b');
});

test('allows the technical term eval harnesses', () => {
  assert.deepEqual(rules('structured output · eval harnesses · text-to-SQL'), []);
});
