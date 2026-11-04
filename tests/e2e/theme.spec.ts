import { test, expect } from '@playwright/test';

const theme = (page) => page.locator('html').getAttribute('data-theme');

test('follows a dark device', async ({ browser }) => {
  const page = await browser.newPage({ colorScheme: 'dark' });
  await page.goto('/');
  expect(await theme(page)).toBe('dark');
});

test('defaults to dark even on a light device', async ({ browser }) => {
  const page = await browser.newPage({ colorScheme: 'light' });
  await page.goto('/');
  expect(await theme(page)).toBe('dark');
});

test('the switch flips the theme and remembers it', async ({ browser }) => {
  const page = await browser.newPage({ colorScheme: 'dark' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  expect(await theme(page)).toBe('light');
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  await page.reload();
  expect(await theme(page)).toBe('light');
});

test('a bad stored theme falls back to dark', async ({ browser }) => {
  const page = await browser.newPage({ colorScheme: 'light' });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem('theme', 'blue'));
  await page.goto('/');
  expect(await theme(page)).toBe('dark');
  expect(errors).toEqual([]);
});
