import { logDebug, logError } from '../utils/logger';
import { waitFor } from '../utils/waitFor';
import { getCurrentDjEl, getCurrentlyPlayingSong } from './queup.ui';
import { PLAYER_ADVANCE, queupEvents } from '../utils/events';

/**
 * This file is a bunch of temporary hacks because Queup v2 (remix) removed their
 * public API.
 */

/**
 * Get the name of the currently logged in user.
 * @returns {string}
 */
export function getUserName() {
  // there are 2 links with href="/user/username" in the header,
  //  one for the avatar and one for the username. The user name just has text,
  // the avatar has an img inside it, so we can use that to differentiate between the two.
  return (
    document
      .querySelector('a[href^="/user/"]:not(:has(img))')
      ?.textContent?.trim() || ''
  );
}

/**
 *
 * @returns {string}
 */
export function getCurrentDjName() {
  return getCurrentDjEl()?.textContent?.trim() || '';
}

/**
 * Every MutationObserver created by this "instance" of the script, so they
 * can all be torn down by {@link teardownPlayerAdvance}.
 * @type {Set<MutationObserver>}
 */
const playerAdvanceObservers = new Set();

function teardownPlayerAdvance() {
  playerAdvanceObservers.forEach((observer) => observer.disconnect());
  playerAdvanceObservers.clear();
}

/**
 * On a dev hot reload, the whole bundle re-executes in the same page, so this
 * module gets a brand new scope with no memory of the observers the previous
 * instance created, they're still connected and still firing. Save the
 * teardown on `window`, which does persist across hot reload, so each new
 * instance can dispose of whatever the last one left running before it sets
 * up its own observers.
 */
const PLAYER_ADVANCE_CLEANUP_KEY = '__dubplusTeardownPlayerAdvance';
/** @type {Record<string, (() => void) | undefined>} */
const globalCleanupRegistry = /** @type {any} */ (window);

// teardown any observers the last instance left running
globalCleanupRegistry[PLAYER_ADVANCE_CLEANUP_KEY]?.();

// then register this instance's teardown so the next one can clean up after it
globalCleanupRegistry[PLAYER_ADVANCE_CLEANUP_KEY] = teardownPlayerAdvance;

/**
 * Watches the currently-playing-song element's text for changes, which
 * signals the player advanced to the next song.
 * @param {Element} songElement the element returned by {@link getCurrentlyPlayingSong}
 */
function observeCurrentlyPlayingSong(songElement) {
  const observer = new MutationObserver((records) => {
    logDebug('playerAdvance detected', records);
    // the song title text changed, which means the player advanced to the next song
    // get new text from records, which is the new song title, and pass it to the handlers
    const songTitle = records[0]?.target?.textContent || '';
    queupEvents.emit(PLAYER_ADVANCE, songTitle);
  });
  // subtree is required even though songElement only contains text: the
  // mutation target is the child text node, not songElement itself.
  observer.observe(songElement, { characterData: true, subtree: true });
  playerAdvanceObservers.add(observer);
}

function setupPlayerAdvance() {
  waitFor(
    () => !!getCurrentlyPlayingSong(),
    // setting up an infinite poll every 10s to wait for someone to start DJing.
    { interval: 10000, seconds: Number.POSITIVE_INFINITY },
  )
    .then(() => {
      const songElement = getCurrentlyPlayingSong();
      if (songElement) {
        // it's definitely available but need this conditional because TS doesn't know that
        observeCurrentlyPlayingSong(songElement);
      }
    })
    .catch((err) => {
      logError('setupPlayerAdvance: wait for DJing failed', err);
    });
}
setupPlayerAdvance();
