import { expect, test } from '@playwright/test';

test('homepage renders the quiz calendar', async ({ page }) => {
  await page.goto('/wellington-quizzes/');
  await expect(page.getByRole('heading', { name: 'Wellington Quizzes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'All quizzes by day' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Gibbons Hotel/ }).first()).toBeVisible();
});

test('day filter narrows the by-day listing', async ({ page }) => {
  await page.goto('/wellington-quizzes/');
  await page.getByRole('button', { name: 'Thursday', exact: true }).click();
  await expect(page.getByRole('button', { name: /Hotel Bristol/ }).first()).toBeVisible();
});

test('opening a quiz shows its details', async ({ page }) => {
  await page.goto('/wellington-quizzes/');
  await page
    .getByRole('button', { name: /Gibbons Hotel/ })
    .first()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('52 Taranaki Street, Te Aro, Wellington 6011')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
