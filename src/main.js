import './dubplus.css';
import { mount, unmount } from 'svelte';
import DubPlus from './DubPlus.svelte';
import { loadDubPlusCSSforBookmarklet } from './utils/css';
import { logDebug, logInfo, logWarn } from './utils/logger';
import { getRoomSlug, onRouteChange } from './utils/route';
import { waitFor } from './utils/waitFor';
import { getChatInput } from './lib/queup.ui';
import { resolveQueupIds, waitForQueupIds } from './utils/queup-ids';
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
 * Dub+ only makes sense inside a room, but as of QueUp v2 we can be loaded
 * anywhere on the site: the content script now matches every path so the
 * realtime tap gets installed before QueUp's bundle runs, no matter which page
 * the user lands on first.
 *
 * Every module's turnOn/turnOff already runs from MenuSwitch's
 * onMount/onDestroy, so mounting and unmounting the app is all it takes to
 * bind and rebind the whole feature set. That's also what makes room ->room
 * navigation work: modules that captured a DOM node in turnOn get a fresh one.
 * ========================================================================== */

/**
 * The room we're mounted in, or the one we're in the middle of mounting into.
 * Null when neither. Mounting is async - it waits for QueUp to render the room
 * - so this has to be claimed up front: two route events can land before the
 * first mount finishes, and without it the second would start a mount of its
 * own and we'd end up with two apps.
 * @type {string | null}
 */
let currentRoom = null;

/**
 * Bumped on every mount and unmount so a pending mount can tell it's stale.
 * `currentRoom` alone isn't enough: leaving a room and coming straight back
 * re-claims the same slug, and the first mount would happily finish into it.
 */
let mountToken = 0;

/** @type {Record<string, any> | null} */
let app = null;

function unmountDubPlus() {
  // Also cancels any mount still waiting on the room UI.
  mountToken++;

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
  const token = ++mountToken;
  logDebug(`mounting in room "${roomSlug}" mountToken=${token}`);
  currentRoom = roomSlug;

  try {
    // On an SPA navigation the room UI is rendered after the route commits,
    // and turnOn handlers assume it's there.
    await waitFor(() => !!getChatInput(), { seconds: 30 });
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

  if (!window.dubplus.roomId) {
    resolveQueupIds();
  }
  if (window.dubplus.roomId) {
    setupModCheck(window.dubplus.roomId);
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

  if (roomSlug === currentRoom) return;

  if (currentRoom) {
    logInfo(`leaving room "${currentRoom}"`);
    unmountDubPlus();
  }

  if (!roomSlug) return;

  // The room id changes with the room. The RealtimeManager bridge re-syncs it
  // on reconnect, but the bookmarklet has no bridge, so clear it and let
  // queup-ids find the new one.
  window.dubplus.roomId = undefined;
  waitForQueupIds();

  mountDubPlus(roomSlug);
}

/* --------------------------------------------------------------------------
 * Taking over from a previous load.
 *
 * A bookmarklet clicked twice, or a dev rebuild, evaluates a whole new bundle
 * against a page that still has the old one running. Module scope doesn't
 * survive that, but the page does - and so does the old bundle's route
 * listener, which would keep mounting apps this bundle can't see or unmount.
 * So the previous load leaves a teardown on `window.dubplus` (the same pattern
 * as `__detachRealtimeBridge`) and we call it before installing our own.
 * ------------------------------------------------------------------------ */

window.dubplus.__teardown?.();

// A load that predates __teardown can only be cleaned up by hand.
document.getElementById('dubplus-container')?.remove();

const stopRouteListener = onRouteChange(syncToRoute);

window.dubplus.__teardown = () => {
  stopRouteListener();
  unmountDubPlus();
};

syncToRoute();
