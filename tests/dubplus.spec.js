// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
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
