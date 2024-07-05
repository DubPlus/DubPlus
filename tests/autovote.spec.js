import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // open the menu
  await page.click('button.dubplus-icon');
});

test('Off state should not autovote', async ({ page }) => {
  // in these test, all features start in the off state

  // setup spy to check if voteUp is called when next song starts
  let voteUpClicked = false;
  function voteUp() {
    voteUpClicked = true;
  }

  await page.exposeFunction('voteUp', voteUp);

  await page.evaluate(() => {
    window.QueUp.playerController.voteUp.click = voteUp;
  });

  // trigger a playlist update to test if voteUp is called
  await page.evaluate(() => {
    window.triggerEvent('realtime:room_playlist-update', {
      startTime: 0,
    });
  });

  expect(voteUpClicked).toBe(false);
});

test('Turning on autovote', async ({ page }) => {
  const autovote = page.getByRole('switch', { name: 'AutoVote' });

  await autovote.click();

  await expect(autovote).toHaveAttribute('aria-checked', 'true');

  // setup spy to check if voteUp is called when next song starts
  let voteUpClicked = false;
  function voteUp() {
    voteUpClicked = true;
  }

  await page.exposeFunction('voteUp', voteUp);

  await page.evaluate(() => {
    window.QueUp.playerController.voteUp.click = voteUp;
  });

  // trigger a playlist update to test if voteUp is called
  await page.evaluate(() => {
    window.triggerEvent('realtime:room_playlist-update', {
      startTime: 0,
    });
  });

  expect(voteUpClicked).toBe(true);
});
