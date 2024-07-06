import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // open the menu
  await page.click('button.dubplus-icon');
});

test('Should popup emoji preview up if chat input contains colon+text', async ({
  page,
}) => {
  // turn it on
  const autoComplete = page.getByRole('switch', { name: 'Autocomplete Emoji' });
  autoComplete.click();

  await expect(autoComplete).toHaveAttribute('aria-checked', 'true');

  await page.locator('#chat-txt-message').pressSequentially(':smile');

  await expect(page.locator('#autocomplete-preview')).toBeVisible();

  await page.locator('#chat-txt-message').pressSequentially(':');

  await expect(page.locator('#autocomplete-preview')).not.toBeVisible();
});
