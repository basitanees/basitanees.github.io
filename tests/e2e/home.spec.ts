import { test, expect } from '@playwright/test';

const view = (page, name) => page.locator(`[data-view="${name}"]`);

test('Map is shown first and the tabs switch views', async ({ page }) => {
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

test('a Map area opens its project list', async ({ page }) => {
  await page.goto('/');
  await view(page, 'map').getByRole('link', { name: /Retrieval & search/ }).first().click();
  await expect(page).toHaveURL(/\/areas\/retrieval-search\/$/);
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

  test('tabs still switch and the theme follows the device', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('html').getAttribute('data-theme')).toBeNull();
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(233, 236, 245)');
    await page.locator('label[for="view-ask"]').click();
    await expect(view(page, 'ask')).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

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

  test('the Map becomes a list and nothing scrolls sideways', async ({ page }) => {
    await page.goto('/');
    await expect(view(page, 'map').locator('.map-list')).toBeVisible();
    await expect(view(page, 'map').locator('.graph')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
});
