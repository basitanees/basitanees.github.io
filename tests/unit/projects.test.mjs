import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDates, inSection, projectHref, sortProjects, withArea } from '../../src/lib/projects.ts';

const p = (id, data) => ({ id, data: { areas: [], links: [], summary: '', start: '2020', ...data } });
const hypergan = p('hypergan-clip', { title: 'HyperGAN-CLIP', section: 'research', form: 'page', order: 10, areas: ['generative-vision'] });
const koder = p('koder', { title: 'Koder', section: 'work', form: 'card', order: 40, areas: ['ai-agents'] });
const assess = p('candidate-assessment', { title: 'Candidate assessment', section: 'work', alsoIn: 'research', form: 'page', order: 20 });

test('formats month and year ranges with an en dash', () => {
  assert.equal(formatDates('2023-06', 'present'), 'Jun 2023 – present');
  assert.equal(formatDates('2019-09', '2020-07'), 'Sep 2019 – Jul 2020');
});

test('formats a single month or a bare year', () => {
  assert.equal(formatDates('2021-11'), 'Nov 2021');
  assert.equal(formatDates('2024'), '2024');
});

test('inSection includes entries listed in another section via alsoIn', () => {
  assert.deepEqual(inSection([hypergan, koder, assess], 'research').map((x) => x.id), ['hypergan-clip', 'candidate-assessment']);
  assert.deepEqual(inSection([hypergan, koder, assess], 'work').map((x) => x.id), ['koder', 'candidate-assessment']);
});

test('withArea keeps only entries tagged with the area', () => {
  assert.deepEqual(withArea([hypergan, koder], 'ai-agents').map((x) => x.id), ['koder']);
});

test('projectHref links pages and not cards', () => {
  assert.equal(projectHref(hypergan), '/research/hypergan-clip/');
  assert.equal(projectHref(koder), null);
});

test('sortProjects orders by order', () => {
  assert.deepEqual(sortProjects([koder, assess, hypergan]).map((x) => x.id), ['hypergan-clip', 'candidate-assessment', 'koder']);
});

test('formatDates returns nothing when no date is known', () => {
  assert.equal(formatDates(undefined), '');
});
