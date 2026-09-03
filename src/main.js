import './dubplus.css';
import { mount, unmount } from 'svelte';
import DubPlus from './DubPlus.svelte';
import { loadDubPlusCSSforBookmarklet } from './utils/css';
import { logDebug, logInfo } from './utils/logger';
import { getRoomSlug, onRouteChange } from './utils/route';
import { waitFor } from './utils/waitFor';
import { getChatInput } from './lib/queup.ui';
import { waitForQueupIds } from './utils/queup-ids';

window.dubplus = window.dubplus || {};

const loadedAsExtension = 'dubplusExtensionLoaded' in window;

logInfo('loaded as extension:', loadedAsExtension);

// We only load the CSS when Dub+ is loaded from a bookmarklet.
if (!import.meta.env.DEV && !loadedAsExtension) {
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
 * The room we're currently mounted in, or null when we aren't mounted.
 * @type {string | null}
 */
let mountedRoom = null;

/** Bumped on every mount/unmount so a pending mount can tell it's stale. */
let mountToken = 0;

/**
 * The mounted app is stashed on the container element rather than in this
 * module, because the module scope doesn't survive what we need it to: a
 * bookmarklet clicked twice, or a dev rebuild, evaluates a whole new bundle
 * against a page that still has the old app mounted. The container outlives
 * both, and Svelte 5's `unmount` needs the component instance - removing the
 * container's children would strand every module with its `turnOff` unrun.
 * @typedef {HTMLElement & { _dubplusApp?: Record<string, any> }} DubPlusContainer
 */

/**
 * @returns {DubPlusContainer}
 */
function getContainer() {
  let container = /** @type {DubPlusContainer | null} */ (
    document.getElementById('dubplus-container')
  );
  if (!container) {
    container = document.createElement('div');
    container.id = 'dubplus-container';
    document.body.appendChild(container);
  }
  return container;
}

function unmountDubPlus() {
  mountToken++;
  mountedRoom = null;

  const container = /** @type {DubPlusContainer | null} */ (
    document.getElementById('dubplus-container')
  );
  if (!container) return;

  if (container._dubplusApp) {
    try {
      unmount(container._dubplusApp);
    } catch (err) {
      logDebug('could not unmount the previous Dub+ instance', err);
    }
    container._dubplusApp = undefined;
  }

  container.replaceChildren();
  // Menu.svelte adds this on mount and has no matching teardown.
  document.querySelector('html')?.classList.remove('dubplus');
}

/**
 * @param {string} roomSlug
 */
async function mountDubPlus(roomSlug) {
  const token = mountToken;

  try {
    // On an SPA navigation the room UI is rendered after the route commits,
    // and turnOn handlers assume it's there.
    await waitFor(() => !!getChatInput(), { seconds: 30 });
  } catch {
    logInfo(`room UI never showed up for "${roomSlug}", not mounting`);
    return;
  }

  // The user can navigate again while we're waiting.
  if (token !== mountToken || getRoomSlug() !== roomSlug) {
    logDebug(`skipping a stale mount for "${roomSlug}"`);
    return;
  }

  const container = getContainer();
  container._dubplusApp = mount(DubPlus, { target: container });
  mountedRoom = roomSlug;
  logInfo(`mounted in room "${roomSlug}"`);
}

function syncToRoute() {
  const roomSlug = getRoomSlug();

  if (roomSlug === mountedRoom) return;

  if (mountedRoom) {
    logInfo(`leaving room "${mountedRoom}"`);
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

// Clear out anything a previous load left behind before taking over.
unmountDubPlus();

onRouteChange(syncToRoute);
syncToRoute();
