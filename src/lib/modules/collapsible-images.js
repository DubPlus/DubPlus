import { CHAT_MESSAGE } from '../../events-constants';
import { getImagesInChat } from '../queup.ui';

/**
 *
 * @param {Event & { target: HTMLButtonElement }} event
 */
function handleCollapseButtonClick(event) {
  const parentElement = event.target.parentElement;
  const imageContaner = /**@type {HTMLAnchorElement}*/ (
    event.target.previousElementSibling
  );

  if (!parentElement.classList.contains('dubplus-collapsed')) {
    parentElement.classList.add('dubplus-collapsed');
    event.target.title = 'expand image';
    imageContaner.setAttribute('aria-hidden', 'true');
    event.target.setAttribute('aria-expanded', 'false');
  } else {
    parentElement.classList.remove('dubplus-collapsed');
    event.target.title = 'collapse image';
    imageContaner.setAttribute('aria-hidden', 'false');
    event.target.setAttribute('aria-expanded', 'true');
  }
}

/**
 * @param {HTMLAnchorElement} [autolinkImage]
 */
function addCollapserToImage(autolinkImage) {
  if (!autolinkImage) return;
  if (
    !autolinkImage.parentElement.classList.contains('dubplus-collapsible-image')
  ) {
    autolinkImage.parentElement.classList.add('dubplus-collapsible-image');

    const button = document.createElement('button');
    button.type = 'button';
    button.title = 'collapse image';
    button.classList.add('dubplus-collapser');
    button.addEventListener('click', handleCollapseButtonClick);
    autolinkImage.parentElement.appendChild(button);
  }
}

/**
 *
 * @param {import('../../events').ChatMessageEvent} [e]
 */
function processChat(e) {
  if (e?.chatid) {
    const chatMessage = document.querySelector(`.chat-id-${e.chatid}`);
    if (chatMessage) {
      addCollapserToImage(chatMessage.querySelector('.autolink-image'));
      return;
    }
  }
  const chatImages = getImagesInChat();
  chatImages.forEach(addCollapserToImage);
}

function reset() {
  document.querySelectorAll('.dubplus-collapsible-image').forEach((el) => {
    el.classList.remove('dubplus-collapsible-image');
    el.classList.remove('dubplus-collapsed');
  });
  document.querySelectorAll('.dubplus-collapser').forEach((el) => {
    el.removeEventListener('click', handleCollapseButtonClick);
    el.remove();
  });
  getImagesInChat().forEach((el) => el.removeAttribute('aria-hidden'));
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const collapsibleImages = {
  id: 'collapsible-images',
  label: 'collapsible-images.label',
  description: 'collapsible-images.description',
  category: 'general',
  turnOn(onLoad) {
    window.QueUp.Events.bind(CHAT_MESSAGE, processChat);

    if (onLoad) {
      // This is coming from a page load where Dub+ auto-enables this module
      // based on the saved user settings. Sometimes the chat message aren't
      // fully loaded yet so we need to wait a bit before processing the chat
      setTimeout(() => {
        processChat();
      }, 1000);
    } else {
      // when user turns it on while already on the page, we don't need to wait
      // to process the chat messages
      processChat();
    }
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, processChat);
    reset();
  },
};
