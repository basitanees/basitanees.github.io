import { test, expect } from '@playwright/test';

test('home responds', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Abdul Basit Anees/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Abdul Basit Anees');
});
