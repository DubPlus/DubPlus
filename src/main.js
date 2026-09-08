import './dubplus.css';
import { mount, unmount } from 'svelte';
import DubPlus from './DubPlus.svelte';
import { loadDubPlusCSSforBookmarklet } from './utils/css';
import { logDebug, logInfo, logWarn } from './utils/logger';
import { getRoomSlug, onRouteChange } from './utils/route';
import { waitFor } from './utils/waitFor';
import { getChatInput } from './lib/queup.ui';
import { getRoomId, isQueupReady } from './lib/queup.v2';
import { setupModCheck, teardownModCheck } from './utils/modcheck';

window.dubplus = window.dubplus || {};

const loadedAsExtension = 'dubplusExtensionLoaded' in window;

logInfo('loaded as extension:', loadedAsExtension);

// We only load the CSS when Dub+ is loaded from a bookmarklet.
if (!loadedAsExtension) {
  loadDubPlusCSSforBookmarklet();
}

/* ==========================================================================
 * Mounting
 *
 * Dub+ only works inside a room. But as of QueUp v2, we've updated the content
 * script to match any page on the site so it can load in the lobby if the user
 * lands there first. In this file we unmount Dub+ when a user leaves a room
 * and mount it when they enter one, and we also handle the case where a user
 * navigates to a room before Dub+ has finished loading.
 * ========================================================================== */

/**
 * The room we're mounted in, or the one we're in the middle of mounting into.
 * Null when neither.
 * @type {string | null}
 */
let currentRoom = null;

/**
 * Bumped on every mount and unmount so a pending mount can tell it's stale.
 */
let mountToken = 0;

/** @type {Record<string, any> | null} */
let app = null;

function unmountDubPlus() {
  // Also cancels any mount still waiting on the room UI.
  mountToken = mountToken += 1;

  logDebug(`unmounting from room "${currentRoom}" mountToken=${mountToken}`);
  currentRoom = null;

  if (app) {
    unmount(app);
    app = null;
  }

  teardownModCheck();
  document.getElementById('dubplus-container')?.remove();
}

/**
 * @param {string} roomSlug
 */
async function mountDubPlus(roomSlug) {
  const token = (mountToken += 1);
  logDebug(`mounting in room "${roomSlug}" mountToken=${token}`);
  currentRoom = roomSlug;

  try {
    // On an SPA navigation the room UI is rendered after the route commits,
    // and turnOn handlers assume it's there.
    await waitFor(() => isQueupReady() && !!getChatInput(), { seconds: 10 });
  } catch {
    // Nothing retries after this: no further route event fires while we sit in
    // the room, so Dub+ stays down until the next navigation.
    logWarn(`room UI never showed up for "${roomSlug}", not mounting`);
    if (token === mountToken) currentRoom = null;
    return;
  }

  // The user can navigate again while we're waiting.
  if (token !== mountToken || getRoomSlug() !== roomSlug) {
    logDebug(`skipping a stale mount for "${roomSlug}"`);
    return;
  }

  // isQueupReady guarantees that getRoomId() returns a non-empty string,
  // and the conditional just above checks to see if user has navigated away from the room,
  // so this should always succeed. But if it doesn't, we don't want to leave the mod check hanging.
  const roomId = getRoomId();
  if (roomId) {
    setupModCheck(roomId);
  } else {
    logWarn(
      `Failed to resolve room ID for "${roomSlug}", mod check not set up`,
    );
  }

  // A fresh container every time. Svelte 5's `unmount` is async, so reusing one
  // element would race the previous app's teardown against the new app's nodes.
  const container = document.createElement('div');
  container.id = 'dubplus-container';
  document.body.appendChild(container);

  app = mount(DubPlus, { target: container });
  logInfo(`mounted in room "${roomSlug}"`);
}

function syncToRoute() {
  const roomSlug = getRoomSlug();

  if (roomSlug === currentRoom) {
    logDebug(`already mounted in room "${roomSlug}"`);
    return;
  }

  if (currentRoom) {
    logInfo(`leaving room "${currentRoom}"`);
    unmountDubPlus();
  }

  if (!roomSlug) {
    logDebug('not in a room, not mounting');
    return;
  }

  mountDubPlus(roomSlug);
}

/* --------------------------------------------------------------------------
 * Taking over from a previous load.
 *
 * A bookmarklet clicked twice, or a dev rebuild, evaluates a whole new bundle
 * against a page that still has the old one running. Module scope doesn't
 * survive that, but the page does - and so does the old bundle's route
 * listener, which would keep mounting apps this bundle can't see or unmount.
 * So the previous load leaves a teardown on `window.dubplus` and we call it
 * before installing our own. Unmounting also runs every module's turnOff,
 * which is what detaches their `window.QueUp` listeners.
 * ------------------------------------------------------------------------ */

window.dubplus.__teardown?.();

// A load that predates __teardown can only be cleaned up by hand.
document.getElementById('dubplus-container')?.remove();

const stopRouteListener = onRouteChange(syncToRoute);

window.dubplus.__teardown = () => {
  logDebug('tearing down Dub+');
  stopRouteListener();
  unmountDubPlus();
};

syncToRoute();
