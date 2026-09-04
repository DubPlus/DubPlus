import { logDebug, logInfo } from './logger';
import { waitForQueupIds } from './queup-ids';

// Event name constants live in one place now. Re-exported here because most
// modules already import them from this file.
export * from '../events-constants';

/**
 * Dub+'s own event bus. Everything QueUp's RealtimeManager emits gets
 * re-emitted here under the same name, alongside Dub+'s synthetic events
 * (PLAYER_ADVANCE), so modules only ever talk to this one emitter.
 */
export class QueupEvents {
  /**
   * @type {Map<string, Set<(data: any) => void>>}
   */
  handlers = new Map();

  constructor() {
    logDebug('QueupEvents initialized');
  }

  /**
   * @template T
   * @param {string} eventName
   * @param {(data: T) => void} handler
   */
  on(eventName, handler) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }
    this.handlers.get(eventName)?.add(handler);
  }

  /**
   *
   * @param {string} eventName
   * @param {(data: any) => void} handler
   */
  off(eventName, handler) {
    if (this.handlers.has(eventName)) {
      this.handlers.get(eventName)?.delete(handler);
    }
  }

  /**
   * @template T
   * @param {string} eventName
   * @param {(data: T) => void} handler
   */
  once(eventName, handler) {
    /**
     * @param {T} data
     */
    const wrapper = (data) => {
      handler(data);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  /**
   * @template T
   * @param {string} eventName
   * @param {T} data
   */
  emit(eventName, data) {
    logDebug(`QueupEvents: emitting event ${eventName} with data:`, data);
    if (this.handlers.has(eventName)) {
      const handlers = this.handlers.get(eventName);
      handlers?.forEach((handler) => {
        handler(data);
      });
    }
  }

  clear() {
    this.handlers.clear();
  }
}

window.dubplus = window.dubplus || {};
const queupEvents = new QueupEvents();
window.dubplus.queupEvents = queupEvents;

/* ==========================================================================
 * Getting QueUp's events
 *
 * Primary source: QueUp's RealtimeManager singleton, which
 * extension/register-dubplus.js digs out of their Turbopack module registry at
 * document_start. It's an event emitter, so a single '*' listener gives us every
 * event, already parsed, already normalized (QueUp resolves the
 * `user_update_<id>` / `user-update-<id>` types down to `user_update` /
 * `user-avatar-update` before emitting), and already named the way our
 * constants are.
 *
 * Fallback: scraping console.log. This is what Dub+ did before the tap
 * existed, and it's still the only option when Dub+ is loaded as a bookmarklet
 * rather than as an extension - there's no document_start script in that case,
 * so nothing ever intercepted the module registry. It stays installed either
 * way and simply stands down once the bridge is live.
 * ========================================================================== */

/** Set once we're bridged to the RealtimeManager, so the console.log fallback
 * knows to stand down instead of double-emitting every event. */
let bridged = false;

/**
 * QueUp knows the room and user ids before we do, so take them from the
 * RealtimeManager rather than parsing them back out of log lines.
 * @param {import('../types/global').QueupRealtime} realtime
 */
function syncIds(realtime) {
  try {
    const snapshot = realtime.getDebugSnapshot();
    if (snapshot.roomId) window.dubplus.roomId = snapshot.roomId;
    if (snapshot.currentUserId) window.dubplus.userId = snapshot.currentUserId;
  } catch (err) {
    logDebug('could not read the RealtimeManager snapshot', err);
  }
}

/**
 * @param {import('../types/global').QueupRealtime} realtime
 */
function bridgeRealtime(realtime) {
  // A dev rebuild re-runs this module against a page (and a RealtimeManager)
  // that's still alive, so drop the previous listener before adding another.
  window.dubplus.__detachRealtimeBridge?.();

  /**
   * @param {string} type
   * @param {any} data
   */
  const onAnyEvent = (type, data) => {
    if (!window.dubplus.roomId || !window.dubplus.userId) syncIds(realtime);
    queupEvents.emit(type, data);
  };

  const onConnected = () => syncIds(realtime);

  realtime.on('*', onAnyEvent);
  realtime.on('connected', onConnected);
  syncIds(realtime);
  bridged = true;

  window.dubplus.__detachRealtimeBridge = () => {
    realtime.off('*', onAnyEvent);
    realtime.off('connected', onConnected);
    bridged = false;
    window.dubplus.__detachRealtimeBridge = undefined;
  };

  logInfo('listening to QueUp events via RealtimeManager');
}

window.dubplus.onQueupRealtime?.(bridgeRealtime);

// Both id sources above are extension-only: the bridge needs the
// document_start tap, and the console.log lines below were printed while the
// room connected, which for a bookmarklet is long before we loaded. Recover
// them from the page itself instead. Fills gaps only, so it's a no-op once the
// bridge has supplied both.
waitForQueupIds();

/* ---- fallback: scrape console.log --------------------------------------- */

// Store the true native console.log on window.dubplus to prevent repeated dev
// rebuilds (which re-run this module while the page's window persists) from
// re-wrapping the console.log on every rebuild.
window.dubplus.__originalConsoleLog =
  window.dubplus.__originalConsoleLog || console.log;

const originalConsoleLog = window.dubplus.__originalConsoleLog;

/**
 * QueUp logs the raw channel message, whose `data` is sometimes still a JSON
 * string - `normalizeMessageData` is what parses it on their side.
 * @param {any} raw
 * @returns {any}
 */
function parseMessageData(raw) {
  if (typeof raw !== 'string') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

console.log = function (...args) {
  originalConsoleLog.apply(console, args);

  if (
    typeof args[0] !== 'string' ||
    !args[0].trim().startsWith('RealtimeManager:')
  ) {
    return;
  }

  if (args[0].includes('RealtimeManager: setting current user')) {
    const userId = args[0].trim().split(' ').at(-1);
    if (userId) window.dubplus.userId = userId;
  } else if (
    args[0].includes('RealtimeManager: connected to real channel room:')
  ) {
    window.dubplus.roomId = args[0].split('room:')[1].trim();
  } else if (args[0].includes('RealtimeManager: real time response')) {
    // The bridge is the source of truth when it's up; emitting here too would
    // fire every handler twice.
    if (bridged) return;

    const data = parseMessageData(args[1]?.data);
    if (!data?.type) return;

    // QueUp routes on the payload's `type`, not the channel message's `name`,
    // and rewrites the two id-suffixed types before emitting. Mirror that so
    // the fallback delivers the same event names the bridge does.
    const events = { [`realtime:${data.type}`]: data };

    if (data.type.startsWith('user_update_')) {
      events['realtime:user_update'] = {
        ...data,
        type: 'user_update',
        userid: data.type.slice(12),
      };
    } else if (data.type.startsWith('user-update-')) {
      events['realtime:user-avatar-update'] = {
        ...data,
        type: 'user-avatar-update',
        userid: data.type.slice(12),
      };
    }

    for (const [name, payload] of Object.entries(events)) {
      // Read the instance off window rather than closing over it: a dev
      // rebuild replaces the module's instance but not this console wrapper.
      window.dubplus?.queupEvents?.emit(name, payload);
    }
  }
};

export { queupEvents };
