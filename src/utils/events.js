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

class QueupEvents {
  /**
   * @type {Map<string, Set<(data: any) => void>>}
   */
  handlers = new Map();

  constructor() {}

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

const queupEvents = new QueupEvents();

// Wrap console.log and look for any log that starts with "RealtimeManager"
const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog.apply(console, args);
  if (
    typeof args[0] === 'string' &&
    args[0].includes('RealtimeManager: real time response')
  ) {
    logDebug('RealtimeManager log detected:', args[1]);
    if (args[1]?.name) {
      queupEvents.emit(args[1].name, args[1].data);
    }
  }
};

export { queupEvents };
