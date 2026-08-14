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

const CHAT_CONTAINER_SELECTOR =
  'main ~ div > div > div > div > div:nth-child(2) > div > div > div > div';

export function getChatContainer() {
  return document.querySelector(CHAT_CONTAINER_SELECTOR);
}

/**
 * @param {string} [extra] additional css selector or pseudo class. example: ":not([data-emote-processed])"
 * @returns {HTMLDivElement[]}
 */
export function getChatMessages(extra = '') {
  const selector = `${CHAT_CONTAINER_SELECTOR} > div${extra}`;
  return Array.from(document.querySelectorAll(selector));
}

/**
 * @returns {HTMLAnchorElement[]}
 */
export function getImagesInChat() {
  return Array.from(
    document.querySelectorAll('.chat-main > li .autolink-image'),
  );
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
  // there's only 1 iframe on the page but just in case I'm adding the
  // `main` parent selector
  return document.querySelector('main iframe');
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

// The chat input is actually a contenteditable div and is the only contenteditable
// element on the page. if that ever changes, we can add `[aria-label="Type a message..."]`
export const CHAT_INPUT_CONTAINER = '[contenteditable="true"]';

/**
 * This is the location where the DubPlus menu will be placed.
 */
export const DUBPLUS_MENU_CONTAINER = 'header > div:last-child';

/**
 * This is where the ETA, Snooze, and Snooze Video buttons are placed.
 */
export const PLAYER_BUTTONS_CONTAINER =
  'main > div > div > div > div > div > div > div:last-child > div:last-child';
