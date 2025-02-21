// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // open the menu
  await page.click('button.dubplus-icon');
});

test('Menu section collapses and persits', async ({ page }) => {
  await page.click('.dubplus-menu-section-header:first-of-type');

  // transtion time is 0.3s so we wait for 400ms to be sure
  await page.waitForTimeout(400);

  let maxHeight = await page.evaluate(() => {
    const section = document.querySelector('.dubplus-menu-section');
    if (section) {
      return getComputedStyle(section).maxHeight;
    }
  });

  expect(maxHeight).toBe('0px');

  // now we reload the page to test that the state persists
  page.reload();
  await page.click('button.dubplus-icon');

  maxHeight = await page.evaluate(() => {
    const section = document.querySelector('.dubplus-menu-section');
    if (section) {
      return getComputedStyle(section).maxHeight;
    }
  });

  expect(maxHeight).toBe('0px');
});
