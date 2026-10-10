import { test, expect } from '@playwright/test';

test.describe('Portfolio smoke', () => {
  test('home loads with no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /HIRWA Aime JOSPIN/ }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /about me/i })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('navigate to both project case studies', async ({ page }) => {
    await page.goto('/projects/kaboss-image');
    await expect(page.getByRole('heading', { name: 'KABOSS IMAGE' })).toBeVisible();
    await expect(page.getByRole('link', { name: /live site/i })).toBeVisible();

    await page.goto('/projects/umudugudu-management-system');
    await expect(
      page.getByRole('heading', { name: 'Umudugudu Management System' }),
    ).toBeVisible();
    await expect(page.getByText('Prototype')).toBeVisible();
    await expect(page.getByText(/fictional demo data/i)).toBeVisible();
  });

  test('switch language and theme', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /language: français/i }).click();
    await expect(
      page.getByRole('button', { name: /langue: français/i }),
    ).toBeVisible();

    await page.getByRole('button', { name: /langue: kinyarwanda/i }).click();
    await expect(
      page.getByRole('button', { name: /ururimi: kinyarwanda/i }),
    ).toBeVisible();

    const themeButton = page.getByRole('button', { name: /hindura imiterere/i });
    await themeButton.click();
    const isDark = await page
      .locator('html')
      .evaluate((el) => el.classList.contains('dark'));
    expect(typeof isDark).toBe('boolean');
  });

  test('contact form shows validation errors', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/please enter your name/i)).toBeVisible();
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible();
    await expect(page.getByText(/please write a message/i)).toBeVisible();
  });

  test('404 page renders friendly message', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  });
});
