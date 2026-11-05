import { test, expect } from '@playwright/test';

const view = (page, name) => page.locator(`[data-view="${name}"]`);

test('the graph view is shown first and the tabs switch views', async ({ page }) => {
  await page.goto('/');
  await expect(view(page, 'map')).toBeVisible();
  await expect(view(page, 'ask')).toBeHidden();
  await page.locator('label[for="view-ask"]').click();
  await expect(view(page, 'ask')).toBeVisible();
  await expect(view(page, 'map')).toBeHidden();
});

test('arrow keys move between views', async ({ page }) => {
  await page.goto('/');
  await page.focus('#view-map');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#view-ask')).toBeChecked();
  await expect(view(page, 'ask')).toBeVisible();
});

test('the hero shows proof lines and a Contact button', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero .proof dt')).toHaveText(['Now', 'Before', 'Published']);
  await expect(page.locator('.hero').getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact/');
});

const node = (page, id) => page.locator(`[data-view="map"] [data-node="${id}"]`);
// Nodes drift while the layout settles and can sit under the sticky header, so deeper clicks are dispatched.
const tap = (page, id) => node(page, id).dispatchEvent('click');

test('the graph is the first view and shows the seven areas', async ({ page }) => {
  await page.goto('/');
  await expect(view(page, 'map').locator('svg [data-node^="area:"]')).toHaveCount(7);
  await expect(view(page, 'map').locator('svg').getByText('hybrid search · re-ranking · benchmarking')).toBeVisible();
});

test('clicking an area grows its entries and shows its card', async ({ page }) => {
  await page.goto('/');
  await node(page, 'area:retrieval-rag').click();
  await expect(node(page, 'entry:rerank')).toBeVisible();
  await expect(view(page, 'map').locator('.kg-card')).toContainText('All projects in this area');
});

test('a project card links to its page', async ({ page }) => {
  await page.goto('/');
  await node(page, 'area:retrieval-rag').click();
  await tap(page, 'entry:rerank');
  await tap(page, 'project:air-retrieval-service');
  await expect(view(page, 'map').locator('.kg-card a[href="/work/air-retrieval-service/"]')).toBeVisible();
});

test('a card-only project points to the Work page', async ({ page }) => {
  await page.goto('/');
  await node(page, 'area:ai-agents').click();
  await tap(page, 'entry:coding');
  await tap(page, 'project:koder');
  await expect(view(page, 'map').locator('.kg-card a[href="/work/"]')).toBeVisible();
});

test('clicking empty space clears the highlight', async ({ page }) => {
  await page.goto('/');
  await node(page, 'area:retrieval-rag').click();
  await expect.poll(() => view(page, 'map').locator('.dim').count()).toBeGreaterThan(0);
  await view(page, 'map').locator('svg rect.kg-bg').click({ position: { x: 5, y: 5 } });
  await expect(view(page, 'map').locator('.dim')).toHaveCount(0);
});

test('full screen opens, keeps every node inside, and Esc closes it', async ({ page }) => {
  await page.goto('/');
  await node(page, 'area:retrieval-rag').click();
  await view(page, 'map').locator('.kg-full').click();
  await expect(page.locator('.kg.is-full')).toBeVisible();
  await page.waitForTimeout(1500);
  const box = await page.locator('.kg.is-full svg').boundingBox();
  for (const b of await page.locator('.kg.is-full [data-node] .dot').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()))) {
    expect(b.left).toBeGreaterThanOrEqual(box.x - 1);
    expect(b.right).toBeLessThanOrEqual(box.x + box.width + 1);
    expect(b.top).toBeGreaterThanOrEqual(box.y - 1);
    expect(b.bottom).toBeLessThanOrEqual(box.y + box.height + 1);
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('.kg.is-full')).toHaveCount(0);
});

test('full screen shows only the graph, above the hero text, tabs and nav', async ({ page }) => {
  await page.goto('/');
  await view(page, 'map').locator('.kg-full').click();
  const full = page.locator('.kg.is-full');
  await expect(full).toBeVisible();
  const covered = await full.evaluate((kg) => {
    const r = kg.getBoundingClientRect();
    const pts = [];
    for (let i = 1; i < 10; i++) for (let j = 1; j < 10; j++) pts.push([r.left + (r.width * i) / 10, r.top + (r.height * j) / 10]);
    pts.push([r.left + 30, r.top + 20]);
    return pts.filter(([x, y]) => !kg.contains(document.elementFromPoint(x, y))).length;
  });
  expect(covered).toBe(0);
  await expect(page.locator('.hero .seg')).toBeHidden();
});

test('full screen spreads the areas across the width', async ({ page }) => {
  await page.goto('/');
  await view(page, 'map').locator('.kg-full').click();
  await page.waitForTimeout(2000);
  const svg = await page.locator('.kg.is-full svg').boundingBox();
  const xs = await page.locator('.kg.is-full [data-node^="area:"] .dot').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().x));
  expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(svg.width * 0.5);
});

test('reset folds everything and clears the highlight and card', async ({ page }) => {
  await page.goto('/');
  await node(page, 'area:retrieval-rag').click();
  await expect(node(page, 'entry:rerank')).toBeVisible();
  await view(page, 'map').locator('.kg-reset').click();
  await expect(node(page, 'entry:rerank')).toHaveCount(0);
  await expect(view(page, 'map').locator('.dim')).toHaveCount(0);
  await expect(view(page, 'map').locator('.kg-card.on')).toHaveCount(0);
});

test('keyboard opens an area', async ({ page }) => {
  await page.goto('/');
  await node(page, 'area:ai-agents').focus();
  await page.keyboard.press('Enter');
  await expect(node(page, 'entry:support')).toBeVisible();
});

test('a keyboard-focused node shows a focus ring', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await node(page, 'area:ai-agents').focus();
  expect(await node(page, 'area:ai-agents').locator('.dot').evaluate((e) => getComputedStyle(e).strokeWidth)).toBe('3px');
});

test('a click with a tiny mouse wobble still opens an area', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const b = await node(page, 'area:ai-agents').locator('.dot').boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 + 2, b.y + b.height / 2 + 1);
  await page.mouse.up();
  await expect(node(page, 'entry:support')).toBeVisible();
});

test('the inline graph does not block touch scrolling', async ({ page }) => {
  await page.goto('/');
  expect(await view(page, 'map').locator('svg').evaluate((e) => getComputedStyle(e).touchAction)).not.toBe('none');
});

test('closing full screen re-fits the layout to the panel', async ({ page }) => {
  await page.goto('/');
  await view(page, 'map').locator('.kg-full').click();
  await tap(page, 'area:retrieval-rag');
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2500);
  const svg = await view(page, 'map').locator('svg').boundingBox();
  const me = await node(page, 'me').locator('.dot').boundingBox();
  const area = await node(page, 'area:ai-agents').locator('.dot').boundingBox();
  const d = Math.hypot(area.x - me.x, area.y - me.y);
  expect(d).toBeLessThan(Math.max(svg.width, svg.height) * 0.5);
});

test('node colours follow the theme', async ({ page }) => {
  await page.goto('/');
  const fill = () => node(page, 'area:retrieval-rag').locator('.dot').evaluate((e) => getComputedStyle(e).fill);
  const before = await fill();
  await page.locator('[data-theme-toggle], .theme-toggle, button[aria-label*="theme" i]').first().click();
  await expect.poll(fill).not.toBe(before);
});

test('picking an Ask question shows its answer', async ({ page }) => {
  await page.goto('/');
  await page.locator('label[for="view-ask"]').click();
  const answers = view(page, 'ask').locator('.answer');
  await expect(answers.nth(0)).toBeVisible();
  await view(page, 'ask').locator('label[for="ask-2"]').click();
  await expect(answers.nth(1)).toBeVisible();
  await expect(answers.nth(0)).toBeHidden();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, colorScheme: 'light' });

  test('tabs still switch and the theme is dark', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('html').getAttribute('data-theme')).toBeNull();
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(11, 13, 20)');
    await page.locator('label[for="view-ask"]').click();
    await expect(view(page, 'ask')).toBeVisible();
  });

  test('the graph falls back to the area list', async ({ page }) => {
    await page.goto('/');
    await expect(view(page, 'map').locator('.kg-list a')).toHaveCount(7);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('related lines do not animate', async ({ page }) => {
    await page.goto('/');
    await node(page, 'area:retrieval-rag').click();
    const names = await view(page, 'map').locator('path.x').evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n === 'none')).toBe(true);
  });

  test('the Reel shows every scene, still', async ({ page }) => {
    await page.goto('/');
    await page.locator('label[for="view-reel"]').click();
    const scenes = view(page, 'reel').locator('.scene');
    await expect(scenes).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(scenes.nth(i)).toBeVisible();
      const style = await scenes.nth(i).evaluate((el) => [getComputedStyle(el).opacity, getComputedStyle(el).animationName]);
      expect(style).toEqual(['1', 'none']);
    }
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('the graph becomes a list and nothing scrolls sideways', async ({ page }) => {
    await page.goto('/');
    const links = view(page, 'map').locator('.kg-list a');
    await expect(links).toHaveCount(7);
    await expect(links.first()).toHaveAttribute('href', '/areas/retrieval-rag/');
    await expect(view(page, 'map').locator('.kg-stage')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
    await view(page, 'map').locator('.kg-open').click();
    await expect(page.locator('.kg.is-full')).toBeVisible();
  });
});
