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

test('search narrows the by-day listing', async ({ page }) => {
  await page.goto('/wellington-quizzes/');
  await page.getByLabel('Search quizzes').fill('Petone');
  await expect(page.getByRole('button', { name: /Speight's Ale House/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Gibbons Hotel/ })).toHaveCount(0);
});

test('compare shows selected quizzes side by side', async ({ page }) => {
  await page.goto('/wellington-quizzes/');
  await page.getByRole('checkbox', { name: 'Compare Hotel Bristol' }).check();
  await page.getByRole('checkbox', { name: 'Compare Southern Cross' }).check();
  await page.getByRole('button', { name: 'Compare' }).click();
  await expect(page.getByRole('heading', { name: 'Compare quizzes' })).toBeVisible();
  await expect(page.getByText('$100 Star Points 1st, $75 2nd, $25 3rd').first()).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).last().click();
});

test('detail sheet links to add a review', async ({ page }) => {
  await page.goto('/wellington-quizzes/');
  await page
    .getByRole('button', { name: /Hotel Bristol/ })
    .first()
    .click();
  await expect(page.getByRole('link', { name: 'Add your review' })).toHaveAttribute(
    'href',
    /issues\/new/
  );
});
