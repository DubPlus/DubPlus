import { logError, logInfo } from '../../utils/logger';
import { waitFor } from '../../utils/waitFor';
import { getChatContainer, getImagesInChat } from '../queup.ui';

const COLLAPSED = 'dubplus-collapsed';
const COLLAPSIBLE = 'dubplus-collapsible-image';
const COLLAPSER = 'dubplus-collapser';
const IMAGE_SELECTOR = 'autolink-image';

/**
 *
 * @param {HTMLButtonElement} button the button element we inserted into each
 * chat message near each image which will collapse/expand the image
 */
function handleCollapseButtonClick(button) {
  /**
   * @type {HTMLElement} this will be the <p class="dubplus-collapsible-image">
   * element that the button is inside of
   */
  const parentElement = button.parentElement;

  // the <a class="autolink-image"> element inside the parent.
  // there should only be 1 autolink-image per parent. There is the possibility
  // that there are img tags for emojis within the same parent.
  const imageContainer = /**@type {HTMLAnchorElement}*/ (
    parentElement.querySelector(`.${IMAGE_SELECTOR}`)
  );

  if (imageContainer) {
    if (!parentElement.classList.contains(COLLAPSED)) {
      parentElement.classList.add(COLLAPSED);
      button.title = 'expand image';
      imageContainer.setAttribute('aria-hidden', 'true');
      button.setAttribute('aria-expanded', 'false');
    } else {
      parentElement.classList.remove(COLLAPSED);
      button.title = 'collapse image';
      imageContainer.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-expanded', 'true');
    }
  } else {
    logInfo('No image container found in:', parentElement);
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
    handleCollapseButtonClick(event.target);
  }
}

/**
 * @param {HTMLAnchorElement} [autolinkImage]
 */
function addCollapserToImage(autolinkImage) {
  if (!autolinkImage) return;
  if (!autolinkImage.parentElement.classList.contains(COLLAPSIBLE)) {
    autolinkImage.parentElement.classList.add(COLLAPSIBLE);

    const button = document.createElement('button');
    button.type = 'button';
    button.title = 'collapse image';
    button.setAttribute('aria-expanded', 'true');
    button.classList.add(COLLAPSER);
    // button.addEventListener('click', handleCollapseButtonClick);
    autolinkImage.parentElement.appendChild(button);
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
  const images = container.querySelectorAll(`.${IMAGE_SELECTOR}`);
  return Array.from(images).filter(
    (el) => !el.parentElement.classList.contains(COLLAPSIBLE),
  );
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
