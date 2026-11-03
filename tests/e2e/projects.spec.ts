import { test, expect } from '@playwright/test';

test('a page-form project card links to its detail page', async ({ page }) => {
  await page.goto('/research/');
  const card = page.locator('[data-project="hypergan-clip"]');
  await expect(card.getByRole('link', { name: /HyperGAN-CLIP/ })).toHaveAttribute('href', '/research/hypergan-clip/');
  await card.getByRole('link', { name: /HyperGAN-CLIP/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^HyperGAN-CLIP/);
});

test('a card-form project has no detail link', async ({ page }) => {
  await page.goto('/work/');
  const card = page.locator('[data-project="koder"]');
  await expect(card).toBeVisible();
  await expect(card.locator('h3 a')).toHaveCount(0);
});

test('an area page lists projects from that area', async ({ page }) => {
  await page.goto('/areas/generative-models/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Generative models');
  await expect(page.locator('[data-project="hypergan-clip"]')).toBeVisible();
});

test('a card-form project has no detail page', async ({ request }) => {
  const res = await request.get('/work/koder/');
  expect(res.status()).toBe(404);
});
