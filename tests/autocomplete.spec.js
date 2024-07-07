import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // open the menu
  await page.click('button.dubplus-icon');
});

async function turnOnAutoComplete(page) {
  const autoComplete = page.getByRole('switch', { name: 'Autocomplete Emoji' });
  autoComplete.click();
  await expect(autoComplete).toHaveAttribute('aria-checked', 'true');

  // close the menu
  await page.click('button.dubplus-icon');
  return autoComplete;
}

test.describe('Autocomplete preview popup', () => {
  test.beforeEach(async ({ page }) => {
    await turnOnAutoComplete(page);
  });

  test('Should popup emoji preview up if chat input contains colon+text', async ({
    page,
  }) => {
    await page.locator('#chat-txt-message').pressSequentially(':smile');

    await expect(page.locator('#autocomplete-preview')).toBeVisible();

    // typing the right-hand colon should hide the preview
    await page.locator('#chat-txt-message').pressSequentially(':');

    await expect(page.locator('#autocomplete-preview')).not.toBeVisible();
  });

  test('Should show emoji preview when going back to a partial emoji', async ({
    page,
  }) => {
    // this will popup the preview when :cat is typed, but then it will disappear
    // when the space is typed
    await page
      .locator('#chat-txt-message')
      .pressSequentially('this :cat was at the bar');

    await expect(page.locator('#autocomplete-preview')).not.toBeVisible();

    // but we can bring it back by going back to the partial emoji
    for (let i = 0; i < ' was at the bar'.length; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    await expect(page.locator('#autocomplete-preview')).toBeVisible();

    const firstPrewiewElement = page
      .locator('#autocomplete-preview li')
      .first();
    await expect(firstPrewiewElement).toHaveClass(/selected/);
    await expect(firstPrewiewElement).toHaveText(
      'cat press enter or tab to select'
    );
  });

  test('Should navigate the emoji preview with the arrow keys - down', async ({
    page,
  }) => {
    await page.locator('#chat-txt-message').pressSequentially(':cat');

    await expect(page.locator('#autocomplete-preview')).toBeVisible();

    // go down 2 items in the preview
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    const selectedElement = page
      .locator('#autocomplete-preview li.selected')
      .first();
    await expect(selectedElement).toHaveText(/crying_cat_face/);
  });

  test('Should navigate the emoji preview with the arrow keys - up', async ({
    page,
  }) => {
    await page.locator('#chat-txt-message').pressSequentially(':cat');

    await expect(page.locator('#autocomplete-preview')).toBeVisible();

    // go up 2 items in the preview, this wraps around to the bottom
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');

    const selectedElement = page
      .locator('#autocomplete-preview li.selected')
      .first();
    await expect(selectedElement).toHaveText(/smiley_cat/);
  });
});

test.describe('Selecting emoji', () => {
  test.beforeEach(async ({ page }) => {
    await turnOnAutoComplete(page);
    await page.locator('#chat-txt-message').pressSequentially(':cat');
    await expect(page.locator('#autocomplete-preview')).toBeVisible();

    // go down 3 items in the preview
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
  });

  test('Pressing Tab should insert selected emoji', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator('#chat-txt-message')).toHaveValue(
      ':heart_eyes_cat:'
    );
  });

  test('Pressing Enter should insert selected emoji', async ({ page }) => {
    await page.keyboard.press('Enter');
    await expect(page.locator('#chat-txt-message')).toHaveValue(
      ':heart_eyes_cat:'
    );
  });

  test('Should insert emoji when clicking on it', async ({ page }) => {
    await page.locator('#autocomplete-preview li.selected').click();
    await expect(page.locator('#chat-txt-message')).toHaveValue(
      ':heart_eyes_cat:'
    );
  });

  test('Should replace emoji when going back to a partially type emoji', async ({
    page,
  }) => {
    // clear the chat input
    await page.locator('#chat-txt-message').fill('');

    await page
      .locator('#chat-txt-message')
      .pressSequentially('This emoji :cat is incomplete');

    // lets go back to the partial emoji so we can complete it
    for (let i = 0; i < ' is incomplete'.length; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    // go down 3 items in the preview
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // select it
    await page.keyboard.press('Enter');

    // should have inserted the emoji properly
    await expect(page.locator('#chat-txt-message')).toHaveValue(
      'This emoji :heart_eyes_cat: is incomplete'
    );
  });
});
