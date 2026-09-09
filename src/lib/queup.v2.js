/**
 * Wrappers around QueUp's internal API (window.QueUp)
 *
 * Queup extension API documentation:
 * https://gitlab.com/queup/extension-sdk/-/blob/main/README.md
 */

import { getDubUp } from './queup.ui';

// ----- Session -----

/**
 * The currently logged in user, or null when logged out.
 * @returns {{ id: string; username: string } | null}
 */
export function getUser() {
  return window.QueUp.session.getUser();
}

/**
 * The id of the currently logged in user.
 * @returns {string}
 */
export function getUserId() {
  return getUser()?.id || '';
}

/**
 * The name of the currently logged in user.
 * @returns {string}
 */
export function getUserName() {
  return getUser()?.username || '';
}

/**
 * @returns {boolean}
 */
export function isLoggedIn() {
  return window.QueUp.session.isLoggedIn();
}

// ----- Room -----

/**
 * @returns {string} the current room's id, or '' when we're not in a room
 */
export function getRoomId() {
  return window.QueUp.room.getRoomId() || '';
}

/**
 * @returns {string} the name of whoever is currently DJing
 */
export function getCurrentDjName() {
  return window.QueUp.room.getCurrentDJ()?.username || '';
}

/**
 * @returns {string} the user id of whoever is currently DJing
 */
export function getCurrentDjId() {
  return window.QueUp.room.getCurrentDJ()?.id || '';
}

/**
 * @returns {ReturnType<import('../types/global').QueUp['room']['getCurrentSong']>}
 */
export function getCurrentSong() {
  return window.QueUp.room.getCurrentSong();
}

// ----- Player -----

/**
 * @returns {number}
 */
export function getPlayerVolume() {
  return window.QueUp.room.player.getVolume();
}

/**
 * @param {number} volume
 */
export function setPlayerVolume(volume) {
  window.QueUp.room.player.setVolume(volume);
}

/**
 * @returns {boolean}
 */
export function isPlayerMuted() {
  return window.QueUp.room.player.isMuted();
}

export function toggleMute() {
  const player = window.QueUp.room.player;
  if (player.isMuted()) {
    player.unmute();
  } else {
    player.mute();
  }
}

/**
 * There's no vote in the official API yet, so this is still a DOM click.
 */
export function clickVoteUp() {
  getDubUp()?.click();
}

// ----- Queue -----

/**
 * @returns {number}
 */
export function getMyQueuePosition() {
  return window.QueUp.room.queue.getMyPosition();
}

/**
 * @returns {boolean}
 */
export function isInQueue() {
  return window.QueUp.room.queue.isInQueue();
}

/**
 * @returns {ReturnType<import('../types/global').QueUp['room']['queue']['getRoomQueue']>}
 */
export function getRoomQueue() {
  return window.QueUp.room.queue.getRoomQueue();
}

/**
 *
 * @returns {{ minutes: number, seconds: number }} time left in the currently playing song
 */
export function getRemainingTimeForCurrentSong() {
  const { durationSeconds, played } = getCurrentSong() || {};
  if (!played || !durationSeconds) {
    return { minutes: 0, seconds: 0 };
  }
  const now = Date.now();
  const remainingSeconds = Math.max(0, durationSeconds - (now - played) / 1000);
  return {
    minutes: Math.floor(remainingSeconds / 60),
    seconds: Math.floor(remainingSeconds % 60),
  };
}

// ----- Chat commands -----

/**
 * @param {Parameters<import('../types/global').QueUp['chat']['registerCommand']>[0]} command
 */
export function registerChatCommand(command) {
  window.QueUp.chat.registerCommand(command);
}

/**
 * @param {string} name
 */
export function unregisterChatCommand(name) {
  window.QueUp.chat.unregisterCommand(name);
}

/* ==========================================================================
 * Events
 * ========================================================================== */

/**
 * Store all attached handlers so that we can clear them later with {@link reset}
 * @type {Map<string, Set<(arg: any) => void>>}
 */
const event_handlers = new Map();

/**
 * QueUp's app lifecycle events, as opposed to the realtime socket feed.
 * @param {keyof import('../types/global').QueUpEventMap} eventName one of {@link QUEUP_EVENT}
 * @param {(data: any) => void} handler
 */
export function onQueup(eventName, handler) {
  if (!event_handlers.has(eventName)) {
    event_handlers.set(eventName, new Set());
  }
  event_handlers.get(eventName)?.add(handler);
  window.QueUp.on(eventName, handler);
}

/**
 * @param {keyof import('../types/global').QueUpEventMap} eventName one of {@link QUEUP_EVENT}
 * @param {(data: any) => void} handler must be the same reference passed to
 * {@link onQueup}
 */
export function offQueup(eventName, handler) {
  event_handlers.get(eventName)?.delete(handler);
  window.QueUp.off(eventName, handler);
}

/**
 * QueUp's realtime socket feed.
 * @param {string} eventName one of {@link REALTIME_EVENT}
 * @param {(data: any) => void} handler
 */
export function onRealtime(eventName, handler) {
  if (!event_handlers.has(eventName)) {
    event_handlers.set(eventName, new Set());
  }
  event_handlers.get(eventName)?.add(handler);
  window.QueUp.realtime.on(eventName, handler);
}

/**
 * @param {string} eventName one of {@link REALTIME_EVENT}
 * @param {(data: any) => void} handler must be the same reference passed to
 * {@link onRealtime}
 */
export function offRealtime(eventName, handler) {
  event_handlers.get(eventName)?.delete(handler);
  window.QueUp.realtime.off(eventName, handler);
}

export function clearAllEventHandlers() {
  for (const [eventName, handlers] of event_handlers) {
    for (const handler of handlers) {
      offRealtime(eventName, handler);
      // @ts-ignore
      offQueup(eventName, handler);
    }
  }
  event_handlers.clear();
}

/**
 * @return {boolean} true if QueUp is ready to be used, false if it's still booting
 */
export function isQueupReady() {
  return (
    window.QueUp?.session?.isLoggedIn() &&
    !!window.QueUp?.session?.getUser()?.id &&
    !!window.QueUp?.room?.getRoomId()
  );
}
