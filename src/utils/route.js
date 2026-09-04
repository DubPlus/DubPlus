import { logDebug, logWarn } from './logger';

/**
 * QueUp v2 is a React SPA: clicking from /lobby into a room is a client side
 * route change, not a page load. Content scripts only inject on real
 * navigations, so Dub+ has to notice route changes itself and mount/unmount
 * around them. The Navigation API reports SPA pushes, back/forward and
 * fragment changes as one event, which is all we need.
 */

const ROOM_PATH = /^\/join\/([^/]+)/;

/** Fired on window whenever the SPA finishes navigating. */
const ROUTE_EVENT = 'dubplus:routechange';

/**
 * @param {string} [url] defaults to the current location
 * @returns {string | null} the room slug, or null when we're not in a room
 */
export function getRoomSlug(url = window.location.href) {
  try {
    const { pathname } = new URL(url, window.location.origin);
    return pathname.match(ROOM_PATH)?.[1] ?? null;
  } catch (err) {
    logDebug('could not parse the url', url, err);
    return null;
  }
}

/**
 * @param {string} [url]
 * @returns {boolean}
 */
export function isRoomPage(url) {
  return getRoomSlug(url) !== null;
}

/**
 * Republishes the Navigation API's `navigatesuccess` as our own event, so
 * subscribers don't touch the API directly. Guarded on window because a dev
 * rebuild re-runs this module against a page that's still alive.
 *
 * `navigatesuccess` rather than `navigate`: it fires after the transition
 * commits, so location is already up to date when we read it.
 */
function installRouteEmitter() {
  if (window.dubplus.__routeEmitterInstalled) return;

  const navigation = /** @type {any} */ (window).navigation;
  if (!navigation?.addEventListener) {
    // Chrome 102+, Firefox 147+, Safari 26.2+ - which is what the manifest
    // now requires. Without it we can't see SPA navigations at all, so Dub+
    // only works when the page is loaded directly into a room.
    logWarn('no Navigation API - route changes will not be detected');
    return;
  }

  window.dubplus.__routeEmitterInstalled = true;
  navigation.addEventListener('navigatesuccess', () => {
    window.dispatchEvent(new CustomEvent(ROUTE_EVENT));
  });
}

/**
 * @param {(roomSlug: string | null) => void} callback runs after every route
 * change with the new room slug, or null if the new route isn't a room.
 * @returns {() => void} call it to stop listening
 */
export function onRouteChange(callback) {
  window.dubplus = window.dubplus || {};
  installRouteEmitter();

  const handler = () => callback(getRoomSlug());
  window.addEventListener(ROUTE_EVENT, handler);
  return () => window.removeEventListener(ROUTE_EVENT, handler);
}
