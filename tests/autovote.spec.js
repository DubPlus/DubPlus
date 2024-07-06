import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // open the menu
  await page.click('button.dubplus-icon');
});

test('Off state should not autovote', async ({ page }) => {
  // in these test, all features start in the off state
  const autovote = page.getByRole('switch', { name: 'AutoVote' });
  await expect(autovote).toHaveAttribute('aria-checked', 'false');

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

test('Turning on should autovote current song and next', async ({ page }) => {
  let voteUpClicked = 0;

  function voteUp() {
    voteUpClicked += 1;
  }

  await page.exposeFunction('voteUp', voteUp);

  await page.evaluate(() => {
    window.QueUp.playerController.voteUp.click = voteUp;
  });

  const autovote = page.getByRole('switch', { name: 'AutoVote' });

  await autovote.click();

  await expect(autovote).toHaveAttribute('aria-checked', 'true');

  // it should immediately upvote the current song as soon as you turn it on
  expect(voteUpClicked).toBe(1);

  // trigger a playlist update to test if voteUp is called
  await page.evaluate(() => {
    window.triggerEvent('realtime:room_playlist-update', {
      startTime: 0,
    });
  });

  // it should vote again
  expect(voteUpClicked).toBe(2);
});
