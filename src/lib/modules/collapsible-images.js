import { logError } from '../../utils/logger';
import { waitFor } from '../../utils/waitFor';
import { getChatContainer, getImagesInChat } from '../queup.ui';

const COLLAPSED = 'dubplus-collapsed';
const COLLAPSIBLE = 'dubplus-collapsible-image';
const COLLAPSER = 'dubplus-collapser';
const IMAGE_CONTAINER = 'autolink-image';

/**
 *
 * @param {HTMLButtonElement} button the button element we inserted into each
 * chat message near each image which will collapse/expand the image
 */
function handleCollapseButtonClick(button) {
  // the <a class="autolink-image"> element that wraps both the image and the button
  const imageContainer = /**@type {HTMLAnchorElement | null}*/ (
    button.parentElement
  );
  const image = imageContainer?.querySelector('img');
  if (!imageContainer || !image) return;

  if (!imageContainer.classList.contains(COLLAPSED)) {
    imageContainer.classList.add(COLLAPSED);
    button.title = 'expand image';
    button.setAttribute('aria-label', 'Expand image');
    image.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
  } else {
    imageContainer.classList.remove(COLLAPSED);
    button.title = 'collapse image';
    button.setAttribute('aria-label', 'Collapse image');
    image.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
  }
}

/**
 * This is the handler that should be attached to the chat container.
 * @param {Event} event
 */
function eventDelegatorHandler(event) {
  if (
    event.target instanceof HTMLButtonElement &&
    event.target.classList.contains(COLLAPSER)
  ) {
    event.stopPropagation();
    event.preventDefault();
    handleCollapseButtonClick(event.target);
  }
}

/**
 * @param {HTMLAnchorElement} [autolinkImage]
 */
function addCollapserToImage(autolinkImage) {
  if (!autolinkImage) return;
  if (!autolinkImage.classList.contains(COLLAPSIBLE)) {
    autolinkImage.classList.add(COLLAPSIBLE);

    const button = document.createElement('button');
    button.type = 'button';
    button.title = 'collapse image';
    button.setAttribute('aria-label', 'Collapse image');
    button.setAttribute('aria-expanded', 'true');
    button.classList.add(COLLAPSER);
    autolinkImage.appendChild(button);
  }
}

function processAllChatMessages() {
  const chatImages = getImagesInChat();
  chatImages.forEach(addCollapserToImage);
}

function reset() {
  // remove all classes added
  document.querySelectorAll(`.${COLLAPSIBLE}`).forEach((el) => {
    el.classList.remove(COLLAPSIBLE, COLLAPSED);
  });
  // remove all buttons from the UI. They will be added back when user
  // turns this feature back on
  document.querySelectorAll(`.${COLLAPSER}`).forEach((el) => {
    el.remove();
  });
  // remove all attributes added
  getImagesInChat().forEach((el) => el.removeAttribute('aria-hidden'));
}

/**
 *
 * @param {Element} container
 * @returns {HTMLAnchorElement[]}
 */
function findUnProcessedImages(container) {
  const images = /** @type {NodeListOf<HTMLAnchorElement>} */ (
    container.querySelectorAll(`.${IMAGE_CONTAINER}`)
  );
  return Array.from(images).filter((el) => !el.classList.contains(COLLAPSIBLE));
}

/**
 *
 * @param {MutationRecord[]} mutations
 */
function observerCallback(mutations) {
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') {
      continue;
    }
    // Inspect the nodes that were actually added rather than gating on the
    // mutation target being the `.text` element. QueUp can insert an
    // autolink-image directly (when it autolinks a URL after the message is
    // already in the DOM) or as part of a larger subtree (a whole new chat
    // <li>); checking the added nodes catches both cases.
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      const el = /** @type {HTMLElement} */ (node);
      if (
        el.classList.contains(IMAGE_CONTAINER) &&
        !el.classList.contains(COLLAPSIBLE)
      ) {
        addCollapserToImage(/** @type {HTMLAnchorElement} */ (el));
      }
      findUnProcessedImages(el).forEach(addCollapserToImage);
    }
  }
}

/** @type {MutationObserver | null} */
let observer = null;

/**
 * Tracks whether the feature is currently enabled so that async setup scheduled
 * by waitFor() in turnOn() doesn't re-attach the observer/listener after
 * turnOff() has already torn everything down.
 * @type {boolean}
 */
let enabled = false;

/**
 * @type {import("./module").DubPlusModule}
 */
export const collapsibleImages = {
  id: 'collapsible-images',
  label: 'collapsible-images.label',
  description: 'collapsible-images.description',
  category: 'general',
  turnOn() {
    /**
     * When this feature is turned on we:
     *
     * 1. Add a MutationObserver to the chat container to detect new chat
     * messages. This works better than QueUp's chat-message event, which could
     * fire before the message was in the DOM (race condition), leaving new
     * messages without a collapse button.
     *
     * 2. Attach a single delegated click listener to the chat container so the
     * collapse buttons are easy to clean up when the feature is turned off.
     *
     * 3. Process any images already in chat.
     *
     * All of this waits for the chat container to exist, and the async callback
     * is guarded with `enabled` so toggling the feature off while we're still
     * waiting doesn't re-attach everything after turnOff() has already run.
     */
    enabled = true;

    waitFor(() => Boolean(getChatContainer()))
      .then(() => {
        if (!enabled) {
          return;
        }
        const chatContainer = getChatContainer();
        if (!chatContainer) {
          logError('Collapsible Images: No chat container found');
          return;
        }

        observer = new MutationObserver(observerCallback);
        chatContainer.addEventListener('click', eventDelegatorHandler);
        observer.observe(chatContainer, {
          childList: true,
          subtree: true,
          attributes: false,
        });
        // Add collapse buttons to any images already present on load. The
        // observer above handles everything added afterwards, so there's no
        // need to wait for images to exist (the old code did, which rejected in
        // every room that had no images in chat yet).
        processAllChatMessages();
      })
      .catch(() => {
        logError('Collapsible Images: chat container never appeared.');
      });
  },
  turnOff() {
    enabled = false;
    if (observer) {
      observer.disconnect();
    }
    getChatContainer()?.removeEventListener('click', eventDelegatorHandler);
    reset();
  },
};
