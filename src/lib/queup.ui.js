/**
 * Anything that access the UI for QueUp should go here so that when there's any
 * future changes to the UI, we'll just need to update this file.
 */

import { logError } from '../utils/logger';

// The chat input is actually a contenteditable div and is the only contenteditable
// element on the page. if that ever changes, we can add `[aria-label="Type a message..."]`
export const CHAT_INPUT_CONTAINER = '[contenteditable="true"]';

/**
 * @returns {HTMLDivElement | null}
 */
export function getChatInput() {
  return /** @type {HTMLDivElement | null} */ (
    document.querySelector(CHAT_INPUT_CONTAINER)
  );
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
  return getBottomBar()?.querySelector('button:has(> .lucide-chevron-up)');
}

/**
 * @returns {HTMLButtonElement | null | undefined}
 */
export function getDubDown() {
  return getBottomBar()?.querySelector('button:has(> .lucide-chevron-down)');
}

/**
 * aka the Grab button
 * @returns {HTMLButtonElement | null | undefined}
 */
export function getAddToPlaylist() {
  return getBottomBar()?.querySelector('button:has(> .lucide-heart)');
}

export function getPlayerButtonsContainer() {
  // start from the iFrame and go up the DOM tree until we reach a parent element
  // that contains the '.lucide-refresh-cw' icon. Then find it and return its parent element.
  const iframe = document.querySelector('iframe');
  if (iframe?.parentElement) {
    /**
     * @type {HTMLElement | null}
     */
    let currentNode = iframe.parentElement;
    while (
      currentNode &&
      !currentNode?.querySelector('.lucide-refresh-cw') &&
      currentNode !== document.body
    ) {
      currentNode = currentNode.parentElement;
    }
    // if we've reached the body we've gone too far and didn't find the element
    if (!currentNode || currentNode === document.body) {
      logError('Could not find the player buttons container');
      return null;
    }
    return (
      currentNode.querySelector('.lucide-refresh-cw')?.parentElement
        ?.parentElement || null
    );
  }
  return null;
}

export function getBottomBar() {
  const selector =
    'header ~ div:has(.lucide-users):has(.lucide-heart):has(.lucide-chevron-up):has(.lucide-chevron-down)';
  return document.querySelector(selector);
}

export function getCurrentDjEl() {
  // div: bottom bar
  //   [0] div DJ pic
  //   [1] div everything else (bottomBarRight)
  //     [0] div DJ and Song title (djAndSongInfo)
  //       [0] div
  //         [0] div DJ info
  //           [0] span Name <--- this is the one we want
  //           [1] span "is playing"
  //     [1] div track time
  //     [2] div buttons
  const bottomBar = getBottomBar();
  const bottomBarRight = bottomBar?.children[1];
  const djAndSongInfo = bottomBarRight?.children[0];
  const djNameEl = djAndSongInfo?.children[0]?.children[0]?.children[0];
  return djNameEl;
}

export function getCurrentlyPlayingSong() {
  // div: bottom bar
  //   [0] div DJ pic
  //   [1] div everything else (bottomBarRight)
  //     [0] div DJ and Song title (djAndSongInfo)
  //       [0] div
  //         [0] div DJ info
  //         [1] div song title
  //     [1] div track time
  //     [2] div buttons
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
 * How many people are curretly in the queue.
 * @returns {HTMLElement | null | undefined}
 */
export function getQueueTotal() {
  return getBottomBar()?.querySelector('.lucide-users')?.parentElement;
}
