/**
 * Anything that access the UI for QueUp should go here so that when there's any
 * future changes to the UI, we'll just need to update this file.
 */

/**
 * @returns {HTMLTextAreaElement | null}
 */
export function getChatInput() {
  return document.querySelector('[role="textbox"]');
  // also '[contenteditable]' and '[aria-label="Type a message..."]'
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
 * Queup proxies every non-emoji image through images.queup.net,
 * so we can use that to find all images in the chat.
 * @returns {HTMLAnchorElement[]}
 */
export function getImagesInChat() {
  return Array.from(
    getChatContainer()?.querySelectorAll('img[src*="images.queup.net"]') ?? [],
  );
}

/**
 * @returns {HTMLImageElement | null}
 */
export function getBackgroundImage() {
  return document.querySelector('.bg-cover');
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
 * TODO: update this for queup v2
 * @returns {HTMLDivElement | null}
 */
export function getPrivateMessageButton() {
  return document.querySelector('.user-messages');
}

/**
 * TODO: update this for queup v2
 * @param {string} messageId
 * @returns {HTMLLIElement | null}
 */
export function getPrivateMessage(messageId) {
  return document.querySelector(`.message-item[data-messageid="${messageId}"]`);
}

/**
 * @returns {HTMLButtonElement | null | undefined}
 */
export function getDubUp() {
  return /** @type {HTMLButtonElement | null} */ (
    document.querySelector('.lucide-chevron-up')?.parentElement
  );
}

/**
 * @returns {HTMLButtonElement | null}
 */
export function getDubDown() {
  return /** @type {HTMLButtonElement | null} */ (
    document.querySelector('.lucide-chevron-down')?.parentElement
  );
}

/**
 * @returns {HTMLButtonElement | null}
 */
export function getAddToPlaylist() {
  return /** @type {HTMLButtonElement | null} */ (
    document.querySelector('.lucide-heart')?.parentElement
  );
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
  'main > div > div > div > div > div > div:last-child > div > div:last-child';

export function getBottomBar() {
  return document.querySelector(
    'body > div > div > div > div:last-child > div:last-child',
  );
}

export function getCurrentlyPlayingSong() {
  // bottom bar
  //     div DJ pic, div everything else
  //                     div song info, div track time, div buttons
  //                          div
  //                             div DJ, div title
  const bottomBar = getBottomBar();
  const bottomBarRight = bottomBar?.children[1];
  const songInfo = bottomBarRight?.children[0];
  const songTitleContainer = songInfo?.children[0];
  return songTitleContainer?.children[1];
}

/**
 * @returns {{ position?: number; total: number } | null}
 */
export function getQueuePosition() {
  const queueInfo = getBottomBar()
    ?.querySelector('.lucide-users')
    ?.parentElement?.textContent?.trim();
  if (!queueInfo) {
    return null;
  }
  // if user is not in the queue it will just be a single number by itself
  if (!queueInfo.includes('/')) {
    return { total: parseInt(queueInfo) };
  }
  // when user joins the queue it will be "3 / 5" format.
  const [position, total] = queueInfo.split('/').map(Number);
  return { position, total };
}

/**
 * Returns how long is left in seconds the currently playing song.
 * Returns null if it can't be determined.
 * @returns {[minutes: number, seconds: number] | null}
 */
export function getCurrentSongTime() {
  const bottomBar = getBottomBar();
  const bottomBarRight = bottomBar?.children[1];
  const countdown = bottomBarRight?.children[1];
  const timeParts = countdown?.textContent?.split(':');
  if (timeParts?.length === 2) {
    return [Number(timeParts[0]), Number(timeParts[1])];
  } else if (timeParts?.length === 3) {
    return [
      Number(timeParts[0]) * 3600 + Number(timeParts[1]) * 60,
      Number(timeParts[2]),
    ];
  }
  return null;
}

/**
 * @returns {HTMLSpanElement | null}
 */
export function getQueueTotal() {
  return document.querySelector('.queue-total');
}
