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

    const p = document.createElement('p');
    p.classList.add('dubplus-collapser-message');
    p.textContent = 'image collapsed';
    autolinkImage.parentElement.appendChild(p);
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
  document
    .querySelectorAll('.dubplus-collapser-message')
    .forEach((el) => el.remove());
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
    // if the module is turned from a page load the UI can sometimes not
    // be ready yet with messages so the switch will be on but you wont
    // see the collapse buttons in chat. So the work around is to run it twice
    // to make sure the buttons are added. This won't cause a problem because
    // we check to make sure the buttons aren't already added before adding them.
    if (!onLoad) processChat();
    window.QueUp.Events.bind(CHAT_MESSAGE, processChat);
    setTimeout(() => {
      processChat();
    }, 1000);
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, processChat);
    reset();
  },
};
