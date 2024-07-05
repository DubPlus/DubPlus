import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('snooze icon is visible', async ({ page }) => {
  await expect(page.locator('.snooze_btn')).toBeVisible();
});

test('clicking on snooze mutes for 1 song', async ({ page }) => {
  let muteCalled = false;
  let setVolumeCalled = false;

  function mutePlayer() {
    muteCalled = true;
  }
  function setVolume() {
    setVolumeCalled = true;
  }

  await page.exposeFunction('mutePlayer', mutePlayer);
  await page.exposeFunction('setVolume', setVolume);

  await page.evaluate(() => {
    window.QueUp.room.player.mutePlayer = mutePlayer();
    window.QueUp.room.player.setVolume = setVolume();
  });

  await page.click('.snooze_btn');

  expect(muteCalled).toBe(true);

  // snoozing sets up a one time listener for the next song and will
  // unmute when the next song starts
  await page.evaluate(() => {
    window.triggerEvent('realtime:room_playlist-update', {
      startTime: 0,
    });
  });

  expect(setVolumeCalled).toBe(true);
});

test('if muted, clicking snooze will unmute', async ({ page }) => {
  let muteCalled = false;
  let setVolumeCalled = false;

  function mutePlayer() {
    muteCalled = true;
  }
  function setVolume() {
    setVolumeCalled = true;
  }

  await page.exposeFunction('mutePlayer', mutePlayer);
  await page.exposeFunction('setVolume', setVolume);

  await page.evaluate(() => {
    window.QueUp.room.player.mutePlayer = mutePlayer();
    window.QueUp.room.player.setVolume = setVolume();
  });

  await page.click('.snooze_btn');

  expect(muteCalled).toBe(true);

  // clicking on snooze again should unmute
  await page.click('.snooze_btn');

  expect(setVolumeCalled).toBe(true);
});
