// The chat input is actually a contenteditable div and is the only contenteditable
// element on the page. if that ever changes, we can add `[aria-label="Type a message..."]`
export const CHAT_INPUT_CONTAINER =
  '[data-queup="chat-input-container"] [contenteditable]';

const CHAT_CONTAINER_SELECTOR = '[data-queup="chat-message-scroll-area"]';

/**
 * @returns {HTMLDivElement | null}
 */
export function getChatInput() {
  return /** @type {HTMLDivElement | null} */ (
    document.querySelector(CHAT_INPUT_CONTAINER)
  );
}

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
 * @returns {HTMLDivElement | null}
 */
export function getBackgroundImage() {
  return document.querySelector(
    'body > div:nth-child(2) > div > div:first-child',
  );
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
 * @returns {HTMLDivElement | null}
 */
export function getPrivateMessageButton() {
  return document.querySelector('button:has(> .lucide-mail)');
}

/**
 * @returns {HTMLButtonElement | null | undefined}
 */
export function getDubUp() {
  return document.querySelector('[data-queup="updub-button"]');
}

/**
 * @returns {HTMLButtonElement | null | undefined}
 */
export function getDubDown() {
  return document.querySelector('[data-queup="downdub-button"]');
}

/**
 * aka the Grab button
 * @returns {HTMLButtonElement | null | undefined}
 */
export function getAddToPlaylist() {
  return document.querySelector('[data-queup="grab-button"]');
}

export function getPlayerButtonsContainer() {
  return document.querySelector(
    '[data-queup="player-controls"] > div > div:last-child',
  );
}
