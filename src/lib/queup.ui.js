/**
 * Anything that access the UI for QueUp should go here so that when there's any
 * future changes to the UI, we'll just need to update this file.
 */

/**
 * @returns {HTMLTextAreaElement | null}
 */
export function getChatInput() {
  return document.querySelector('#chat-txt-message');
}

export function getChatContainer() {
  return document.querySelector('ul.chat-main');
}

/**
 * @param {string} [extra] example: ":not([data-emote-processed])"
 * @returns {NodeListOf<HTMLLIElement>}
 */
export function getChatMessages(extra = '') {
  return document.querySelectorAll(`ul.chat-main > li${extra}`);
}

/**
 * @returns {NodeListOf<HTMLAnchorElement>}
 */
export function getImagesInChat() {
  return document.querySelectorAll('.chat-main > li .autolink-image');
}

/**
 * @returns {HTMLImageElement | null}
 */
export function getBackgroundImage() {
  return document.querySelector('.backstretch img');
}

/**
 * @returns {HTMLSpanElement | null}
 */
export function getQueuePosition() {
  return document.querySelector('.queue-position');
}

/**
 * @returns {HTMLSpanElement | null}
 */
export function getQueueTotal() {
  return document.querySelector('.queue-total');
}

/**
 * @returns {HTMLIFrameElement | null}
 */
export function getPlayerIframe() {
  return document.querySelector('.player_container iframe');
}

/**
 *
 * @returns {HTMLDivElement | null}
 */
export function getPrivateMessageButton() {
  return document.querySelector('.user-messages');
}

/**
 * @param {string} messageId
 * @returns {HTMLLIElement | null}
 */
export function getPrivateMessage(messageId) {
  return document.querySelector(`.message-item[data-messageid="${messageId}"]`);
}

/**
 * @returns {HTMLAnchorElement | null}
 */
export function getDubUp() {
  return document.querySelector('.dubup');
}

/**
 * @returns {HTMLAnchorElement | null}
 */
export function getDubDown() {
  return document.querySelector('.dubdown');
}

/**
 * @returns {HTMLLIElement | null}
 */
export function getAddToPlaylist() {
  return document.querySelector('.add-to-playlist');
}

/**
 * @returns {HTMLSpanElement | null}
 */
export function getCurrentSongMinutes() {
  return document.querySelector('div.currentTime span.min');
}

/**
 * Selectors for some elements
 */

export const CHAT_INPUT_CONTAINER = '.pusher-chat-widget-input';

/**
 * This is the location where the DubPlus menu will be placed.
 */
export const DUBPLUS_MENU_CONTAINER = '.header-right-navigation';

/**
 * This is where the ETA, Snooze, and Snooze Video buttons are placed.
 */
export const PLAYER_SHARING_CONTAINER = '.player_sharing';
