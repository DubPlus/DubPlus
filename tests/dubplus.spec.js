// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('loading component shows while QueUp loads', async ({ page }) => {
  // technically this is faked in the mock environment, but we can still test it
  // there is 2000ms delay in the mock page before the menu can be loaded

  // expect the loading component to be visible
  await expect(page.locator('.dubplus-waiting')).toBeInViewport();
});

test('dubplus menu loads', async ({ page }) => {
  // expect the dubplus button to be visible and the menu to be in the DOM
  await expect(page.locator('button.dubplus-icon')).toBeVisible();
  await expect(page.locator('.dubplus-menu')).toBeVisible();
});

test('dubplus menu toggles open/closed', async ({ page }) => {
  // click the dubplus button
  await page.click('button.dubplus-icon');

  // expect the menu to be visible
  await expect(page.locator('.dubplus-menu')).toBeInViewport();

  // click the dubplus button again to close it
  await page.click('button.dubplus-icon');

  // expect the menu to be visible
  await expect(page.locator('.dubplus-menu')).not.toBeInViewport();
});

test('Error modal should show if not logged in', async ({ page }) => {
  await page.evaluate(() => {
    // @ts-ignore this is a test-only property
    window.test_forceLogout = true;
  });

  await expect(page.locator('#dubplus-dialog')).toBeVisible();
});
