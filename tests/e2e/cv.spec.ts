import { test, expect } from '@playwright/test';

test('the CV lists the aiXplain role', async ({ page }) => {
  await page.goto('/cv/');
  await expect(page.getByText('Research Engineer, aiXplain')).toBeVisible();
});

test('the CV PDF downloads', async ({ page, request }) => {
  await page.goto('/cv/');
  await expect(page.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('href', '/abdul-basit-anees-cv.pdf');
  const res = await request.get('/abdul-basit-anees-cv.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
});

test('contact links Google Scholar', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.getByRole('main').getByRole('link', { name: 'Google Scholar' })).toHaveAttribute(
    'href',
    'https://scholar.google.com/citations?user=pbmJc-MAAAAJ&hl=en',
  );
});

test('an unknown page shows the 404 page', async ({ page }) => {
  await page.goto('/nope/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

test('in print, a long role can split across pages but a bullet cannot', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  await page.goto('/cv/');
  const [role, bullet] = await page.evaluate(() => [
    getComputedStyle(document.querySelector('.role')).breakInside,
    getComputedStyle(document.querySelector('.role li')).breakInside,
  ]);
  expect(role).toBe('auto');
  expect(bullet).toBe('avoid');
});

test('the printed CV hides the site header and footer', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  await page.goto('/cv/');
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
  await expect(page.locator('footer')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: 'Abdul Basit Anees' })).toBeVisible();
});
