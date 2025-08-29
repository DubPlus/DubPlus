// import { CHAT_MESSAGE } from '../../events-constants';
import { CHAT_MESSAGE } from '../../events-constants';
import { logInfo } from '../../utils/logger';
import { waitFor } from '../../utils/waitFor';
import { getChatContainer, getImagesInChat } from '../queup.ui';

const COLLAPSED = 'dubplus-collapsed';
const COLLAPSIBLE = 'dubplus-collapsible-image';
const COLLAPSER = 'dubplus-collapser';
const IMAGE_SELECTOR = 'autolink-image';

/**
 *
 * @param {HTMLButtonElement} expandButton
 */
function handleCollapseButtonClick(expandButton) {
  /**
   * @type {HTMLElement} this will be the <p class="dubplus-collapsible-image">
   * element that the button is inside of
   */
  const parentElement = expandButton.parentElement;

  // the <a class="autolink-image"> element inside the parent.
  // there should only be 1 autolink-image per parent. There is the possibility
  // that there are img tags for emojis within the same parent.
  const imageContainer = /**@type {HTMLAnchorElement}*/ (
    parentElement.querySelector(`.${IMAGE_SELECTOR}`)
  );

  if (imageContainer) {
    if (!parentElement.classList.contains(COLLAPSED)) {
      parentElement.classList.add(COLLAPSED);
      expandButton.title = 'expand image';
      imageContainer.setAttribute('aria-hidden', 'true');
      expandButton.setAttribute('aria-expanded', 'false');
    } else {
      parentElement.classList.remove(COLLAPSED);
      expandButton.title = 'collapse image';
      imageContainer.setAttribute('aria-hidden', 'false');
      expandButton.setAttribute('aria-expanded', 'true');
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

/**
 *
 * @param {import('../../events').ChatMessageEvent} e
 */
function processNewChatMessage(e) {
  if (e?.chatid) {
    const chatSelector = `.chat-id-${e.chatid}`;

    // sometimes the chat message isn't fully in the DOM yet when this event
    // fires, so we wait for it to appear
    waitFor(() => {
      return !!document.querySelector(chatSelector);
    }).then(() => {
      const chatMessage = document.querySelector(chatSelector);
      if (chatMessage) {
        const unprocessedImages = findUnProcessedImages(chatMessage);
        unprocessedImages.forEach(addCollapserToImage);
      }
    });
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
 * @type {import("./module").DubPlusModule}
 */
export const collapsibleImages = {
  id: 'collapsible-images',
  label: 'collapsible-images.label',
  description: 'collapsible-images.description',
  category: 'general',
  turnOn() {
    window.QueUp.Events.bind(CHAT_MESSAGE, processNewChatMessage);

    waitFor(() => {
      return Boolean(getImagesInChat().length);
    }).then(() => {
      processAllChatMessages();
    });

    waitFor(() => {
      return Boolean(getChatContainer());
    }).then(() => {
      getChatContainer()?.addEventListener('click', eventDelegatorHandler);
    });
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, processNewChatMessage);
    getChatContainer()?.removeEventListener('click', eventDelegatorHandler);
    reset();
  },
};
