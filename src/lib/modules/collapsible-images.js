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
  const imageContainer = /**@type {HTMLAnchorElement}*/ (button.parentElement);
  const image = imageContainer.querySelector('img');

  if (!imageContainer.classList.contains(COLLAPSED)) {
    imageContainer.classList.add(COLLAPSED);
    button.title = 'expand image';
    image.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
  } else {
    imageContainer.classList.remove(COLLAPSED);
    button.title = 'collapse image';
    image.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
  }
}

/**
 * This is the handler should be attached the chat container.
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
 * @returns {Element[]}
 */
function findUnProcessedImages(container) {
  const images = container.querySelectorAll(`.${IMAGE_CONTAINER}`);
  return Array.from(images).filter((el) => !el.classList.contains(COLLAPSIBLE));
}

/**
 *
 * @param {MutationRecord[]} mutations
 */
function observerCallback(mutations) {
  for (const mutation of mutations) {
    if (
      mutation.type === 'childList' &&
      mutation.target.nodeType === Node.ELEMENT_NODE
    ) {
      const el = /** @type {HTMLElement} */ (mutation.target);
      if (el.classList.contains('text')) {
        const autoLinks = findUnProcessedImages(el);
        autoLinks.forEach(addCollapserToImage);
      }
    }
  }
}

let observer = null;

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
     * 3 things happen when this feature is turned on:
     *
     * 1. We add a mutation obsever to the chat container so we can detect when
     * new chat messages have been added. This works better than listening to
     * the QueUp's chat-message event because we kept running into race conditions
     * since that event would sometimes trigger before the chat message was in
     * the DOM and new chat messages would not get the collapse button.
     *
     * 2. We attached a single click event listener to the chat container and
     * use event delegation to handle clicks on the collapse buttons. This makes
     * it easier to clean up event listeners when the feature is turned off.
     *
     * 3. We process all existing chat messages to add the collapse buttons.
     */
    observer = new MutationObserver(observerCallback);

    waitFor(() => {
      return Boolean(getChatContainer());
    }).then(() => {
      const chatContainer = getChatContainer();
      if (chatContainer) {
        chatContainer.addEventListener('click', eventDelegatorHandler);
        observer.observe(chatContainer, {
          childList: true,
          subtree: true,
          attributes: false,
        });
      } else {
        logError('Collapsible Images: No chat container found');
      }
    });

    waitFor(() => {
      return Boolean(getImagesInChat().length);
    }).then(() => {
      processAllChatMessages();
    });
  },
  turnOff() {
    if (observer) {
      observer.disconnect();
    }
    getChatContainer()?.removeEventListener('click', eventDelegatorHandler);
    reset();
  },
};
