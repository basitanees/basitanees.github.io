import { test, expect } from '@playwright/test';

test('work lists every work entry', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.locator('[data-project]')).toHaveCount(10);
});

test('research lists every research entry plus the EACL work', async ({ page }) => {
  await page.goto('/research/');
  await expect(page.locator('[data-project]')).toHaveCount(9);
  await expect(page.locator('[data-project="candidate-assessment"]')).toBeVisible();
});

for (const path of ['/work/air-retrieval-service/', '/work/candidate-assessment/', '/research/hypergan-clip/', '/research/clipinverter/']) {
  test(`detail page ${path} exists`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}

test('the CLIPInverter demo links the Hugging Face space from the sources', async ({ page }) => {
  await page.goto('/research/clipinverter/');
  await expect(page.getByRole('main').getByRole('link', { name: /Demo/ }).first()).toHaveAttribute(
    'href',
    'https://huggingface.co/spaces/johnberg/CLIPInverter',
  );
});

test('the Koder card links the product page', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.locator('[data-project="koder"]').getByRole('link', { name: /Product page/ })).toHaveAttribute('href', 'https://www.aixplain.com/koder');
});
