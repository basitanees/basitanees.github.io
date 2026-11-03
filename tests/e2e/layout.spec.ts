import { test, expect } from '@playwright/test';

test('no sideways scroll on a phone', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('/');
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(375);
});

test('has a skip link', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCount(1);
});

test('nothing animates under reduced motion', async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto('/');
  const animated = await page.evaluate(() =>
    [...document.querySelectorAll('*')].filter((el) => getComputedStyle(el).animationName !== 'none').length,
  );
  expect(animated).toBe(0);
});

test('the nav links every section', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  for (const [name, href] of [['Home', '/'], ['Work', '/work/'], ['Research', '/research/'], ['CV', '/cv/'], ['Contact', '/contact/']]) {
    await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  }
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
});
