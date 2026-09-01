import { logDebug } from './logger';

/**
 * When the song changes.
 * This one is a custom event from Dub+ and not a Queup event.
 * It is triggered by a MutationObserver on the song title element
 */
export const PLAYER_ADVANCE = 'dubplus:playerAdvance';

/**
 * When a user in the room up/down dubs a song
 */
export const DUB = 'room_playlist-dub';

/**
 * When user in the room grabs a song
 */
export const GRAB = 'room_playlist-queue-update-grabs';

/**
 * When a user leaves the room
 */
export const USER_LEAVE = 'user-leave';

/**
 * When the room playlist updates. Many things can trigger this.
 * - the next track plays
 * - someone joins the queue
 * - someone leaves the queue
 * - someone changes the order of the queue
 * - someone changes their song in the queue
 *
 * Each time it still only gives you information about currently playing song
 */
export const PLAYLIST_UPDATE = 'room_playlist-update';

/**
 * When any chat message arrives in the chat
 */
export const CHAT_MESSAGE = 'chat-message';

/**
 * When user receives a private message
 */
export const NEW_PM_MESSAGE = 'new-message';

/*********************************************************
 * This is a fragile hack that depends on Queup continuing to console.log
 * all of their events. If they stop doing that, this will stop working.
 * If they change the format of the log, this will break. If they change the
 * text of the log, this will break. But for now this is the only way to get
 * the events we need, so until Queup exposes a public API for this,
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
      this.handlers.get(eventName)?.forEach((handler) => {
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

// Wrap console.log and look for any log that starts with "RealtimeManager"
// Store the true native console.log on window.dubplus to prevent repeated dev
// rebuilds (which re-run this module while the page's window persists) from
// re-wrapping the console.log on every rebuild.
window.dubplus.__originalConsoleLog =
  window.dubplus.__originalConsoleLog || console.log;

const originalConsoleLog = window.dubplus.__originalConsoleLog;

console.log = function (...args) {
  originalConsoleLog.apply(console, args);
  if (
    typeof args[0] === 'string' &&
    args[0].trim().startsWith('RealtimeManager:')
  ) {
    if (args[0].includes('RealtimeManager: connected to real channel room:')) {
      const roomId = args[0].split('room:')[1].trim();
      logDebug('Room ID:', roomId);
      window.dubplus.roomId = roomId;
    } else if (args[0].includes('RealtimeManager: real time response')) {
      logDebug('RealtimeManager event log detected:', args[1]);
      if (args[1]?.name) {
        // using the one on the window.dubplus object to make sure we
        // reading the latest version during development, since hot reloading
        // can cause the module to be reloaded and the instance to be replaced
        window.dubplus?.queupEvents?.emit(args[1].name, args[1].data);
      }
    }
  }
};

export { queupEvents };
