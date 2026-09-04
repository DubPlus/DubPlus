import { logDebug } from './logger';

/**
 * Recovering the current room id and user id at any moment.
 *
 * As an extension we get these from QueUp's RealtimeManager the instant we
 * bridge to it. As a bookmarklet we can't: the module-registry tap has to be
 * installed at document_start, and the console.log lines we used to scrape
 * ("setting current user", "connected to real channel room:") were printed
 * while the room was connecting, which may have been many minutes before the
 * user clicked the bookmarklet. Scraping a log you missed is not an option, so
 * we read the ids back out of the page instead.
 *
 * Three sources, cheapest first. Each one is independently verified before
 * being trusted, so a source going stale degrades to the next rather than
 * handing us a wrong id.
 */

/** ID Regex */
const OBJECT_ID = /^[0-9a-f]{24}$/;

/**
 * @typedef {object} QueupIds
 * @property {string | null} roomId
 * @property {string | null} userId
 */

/**
 * Source 1: the RealtimeManager, when the document_start tap got hold of it.
 * @returns {QueupIds}
 */
function fromRealtime() {
  /** @type {QueupIds} */
  const ids = { roomId: null, userId: null };
  try {
    const snapshot = window.dubplus.getQueupRealtime?.()?.getDebugSnapshot();
    if (snapshot?.roomId) ids.roomId = snapshot.roomId;
    if (snapshot?.currentUserId) ids.userId = snapshot.currentUserId;
  } catch (err) {
    logDebug('could not read ids from the RealtimeManager', err);
  }
  return ids;
}

/**
 * Source 2: the `queup_last_room` cookie, which QueUp writes as
 * `encodeURIComponent(JSON.stringify({ roomUrl, roomId }))` every time it
 * opens a room - before it connects, so it's already there by the time any
 * room UI exists.
 *
 * It's a year-long cookie, so it also survives into rooms it no longer
 * describes. Hence the roomUrl check against the address bar.
 * @returns {string | null}
 */
export function getRoomIdFromCookie() {
  const match = document.cookie.match(/(?:^|; )queup_last_room=([^;]*)/);
  if (!match) return null;

  try {
    const { roomUrl, roomId } = JSON.parse(decodeURIComponent(match[1]));
    if (!OBJECT_ID.test(roomId)) return null;

    const slug = window.location.pathname.split('/').filter(Boolean).pop();
    if (roomUrl && slug && roomUrl !== slug) {
      logDebug(`ignoring queup_last_room cookie: ${roomUrl} is not ${slug}`);
      return null;
    }
    return roomId;
  } catch (err) {
    logDebug('could not parse the queup_last_room cookie', err);
    return null;
  }
}

/* ---- Source 3: React's fiber tree ---------------------------------------
 * QueUp is a React app and React hangs a `__reactFiber$<random>` property off
 * every host DOM node. Walking up from one of those to the root and back down
 * gives us every context provider on the page, and a provider's current value
 * is just sitting on `memoizedProps.value`.
 *
 * We can't match providers by name - they're minified - so we match on the
 * shape of the data instead: an object holding a `user` that looks like
 * QueUp's user model, or a `roomInfo` with an ObjectId. Those property names
 * come from QueUp's own data model (the same shapes their API returns), which
 * is far more stable than anything in their component code.
 * ------------------------------------------------------------------------ */

/**
 * @param {Element} node
 * @returns {any}
 */
function getFiber(node) {
  const key = Object.keys(node).find(
    (k) => k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$'),
  );
  return key ? /** @type {any} */ (node)[key] : null;
}

/**
 * @returns {any} the HostRoot fiber, or null if React isn't reachable
 */
function getRootFiber() {
  const candidates = [document.body, ...document.body.querySelectorAll('div')];
  // React only tags nodes it rendered, and the first few divs in the body are
  // usually Next.js's own containers, so this finds one almost immediately.
  for (const node of candidates.slice(0, 50)) {
    let fiber = getFiber(node);
    if (!fiber) continue;
    while (fiber.return) fiber = fiber.return;
    return fiber;
  }
  return null;
}

/**
 * @param {any} value a context provider's current value
 * @returns {string | null}
 */
function readUserId(value) {
  const user = value.user;
  if (!user || typeof user !== 'object') return null;
  if (!OBJECT_ID.test(user._id)) return null;
  // Guard against matching some other object that happens to have a `user`:
  // QueUp's user model always carries these.
  if (!user.username && !user.userInfo) return null;
  return user._id;
}

/**
 * @param {any} value a context provider's current value
 * @returns {string | null}
 */
function readRoomId(value) {
  const room = value.roomInfo;
  if (!room || typeof room !== 'object') return null;
  return OBJECT_ID.test(room._id) ? room._id : null;
}

/**
 * @returns {QueupIds}
 */
export function scanFiberTree() {
  /** @type {QueupIds} */
  const ids = { roomId: null, userId: null };
  const root = getRootFiber();
  if (!root) {
    logDebug('no React fiber found on the page');
    return ids;
  }

  // Providers sit near the top of the tree, so this exits long before the
  // budget in practice. The budget is only there so we don't lock up the page.
  let budget = 20000;
  const stack = [root];

  while (stack.length > 0 && budget-- > 0) {
    const fiber = stack.pop();
    const value = fiber.memoizedProps?.value;

    if (value && typeof value === 'object') {
      ids.userId = ids.userId || readUserId(value);
      ids.roomId = ids.roomId || readRoomId(value);
      if (ids.userId && ids.roomId) break;
    }

    if (fiber.child) stack.push(fiber.child);
    if (fiber.sibling) stack.push(fiber.sibling);
  }

  return ids;
}

/**
 * Fills in whichever of `window.dubplus.roomId` / `window.dubplus.userId` are
 * still missing, from the cheapest source that can supply them.
 * @returns {boolean} true once both ids are known
 */
export function resolveQueupIds() {
  if (window.dubplus.roomId && window.dubplus.userId) return true;

  const realtime = fromRealtime();
  window.dubplus.roomId = window.dubplus.roomId || realtime.roomId || undefined;
  window.dubplus.userId = window.dubplus.userId || realtime.userId || undefined;

  if (!window.dubplus.roomId) {
    window.dubplus.roomId = getRoomIdFromCookie() || undefined;
  }

  if (!window.dubplus.roomId || !window.dubplus.userId) {
    const scanned = scanFiberTree();
    window.dubplus.roomId =
      window.dubplus.roomId || scanned.roomId || undefined;
    window.dubplus.userId =
      window.dubplus.userId || scanned.userId || undefined;
  }

  return Boolean(window.dubplus.roomId && window.dubplus.userId);
}

/**
 * Same as {@link resolveQueupIds}, but keeps retrying: the bookmarklet can be
 * clicked before the room has finished loading, and a logged out user has no
 * user id to find until they log in.
 * @param {object} [options]
 * @param {number} [options.interval] ms between attempts
 * @param {number} [options.attempts] how many times to try before giving up
 * @returns {Promise<boolean>} whether both ids were found
 */
export function waitForQueupIds({ interval = 1000, attempts = 30 } = {}) {
  return new Promise((resolve) => {
    if (resolveQueupIds()) {
      resolve(true);
      return;
    }

    let remaining = attempts;
    const timer = setInterval(() => {
      if (resolveQueupIds() || --remaining <= 0) {
        clearInterval(timer);
        const found = Boolean(window.dubplus.roomId && window.dubplus.userId);
        logDebug(
          `resolved QueUp ids: room=${window.dubplus.roomId} user=${window.dubplus.userId}`,
        );
        resolve(found);
      }
    }, interval);
  });
}
