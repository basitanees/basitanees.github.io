import { test, expect } from '@playwright/test';

test('work lists every work entry', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.locator('[data-project]')).toHaveCount(11);
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

test('the voice agent page covers the studio, evals and prompt optimization', async ({ page }) => {
  await page.goto('/work/voice-agent/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Voice agents and call center studio');
  const main = page.getByRole('main');
  for (const text of ['prompt versioning', 'text-to-speech', 'speech-to-text', 'production logs', 'GEPA']) {
    await expect(main).toContainText(text);
  }
  await expect(main.getByRole('link', { name: 'GEPA' })).toHaveAttribute('href', 'https://arxiv.org/abs/2507.19457');
});

test('the home page features the voice agent and asks about evals', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.more [data-project="voice-agent"]')).toBeVisible();
  await page.locator('label[for="view-ask"]').click();
  const ask = page.locator('[data-view="ask"]');
  await ask.getByText('How do you evaluate agents?').click();
  await expect(ask.getByRole('link', { name: /voice agent/i })).toHaveAttribute('href', '/work/voice-agent/');
});

test('the CV lists the voice agent', async ({ page }) => {
  await page.goto('/cv/');
  await expect(page.getByText(/voice customer-service agent/i).first()).toBeVisible();
});

test('the agents framework card describes the work', async ({ page }) => {
  await page.goto('/work/');
  await expect(page.locator('[data-project="agents-framework"]')).toContainText("I worked on aiXplain's AI agents framework");
});

test('the HR manager page covers the interviews and their analysis', async ({ page }) => {
  await page.goto('/work/candidate-assessment/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('HR manager');
  const main = page.getByRole('main');
  await expect(main).toContainText('AI avatar');
  await expect(main).toContainText('emotion analysis');
  await expect(main).toContainText('transcript analysis');
});
