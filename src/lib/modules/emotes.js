import { CHAT_MESSAGE } from '../../events-constants';
import { dubplus_emoji } from '../emoji/emoji';
import { getChatMessages } from '../queup.ui';

/**
 *
 * @param {string} type
 * @param {string} src
 * @param {string} name
 * @param {number} [w]
 * @param {number} [h]
 * @returns {HTMLImageElement}
 */
function makeImage(type, src, name, w, h) {
  const img = document.createElement('img');
  img.className = `emoji ${type}-emote`;
  img.title = name;
  img.alt = name;
  img.src = src;
  if (w) {
    img.width = w;
  }
  if (h) {
    img.height = h;
  }
  return img;
}

/**
 * @param {string} text
 * @returns {Array<HTMLImageElement | Text>}
 */
function processChatText(text) {
  // find all occurrences of :emote: in text and split text up into chunks.
  // for example, if text is "hello :smile: world :wave:"
  // it will return ["hello ", ":smile:", " world ", ":wave:", ""]
  const regex = /(:[^: ]+:)/g;
  const chunks = text.split(regex);
  /**
   * @type {Array<HTMLImageElement | Text>}
   */
  const nodes = [];
  chunks.forEach((chunk) => {
    if (chunk.match(regex)) {
      // this is an emote so we need to check which kind and return img element
      const key = chunk.toLowerCase().replace(/^:/, '').replace(/:$/, '');
      if (
        dubplus_emoji.twitchJSONSLoaded &&
        dubplus_emoji.twitch.emotesMap.has(key)
      ) {
        const id = dubplus_emoji.twitch.emotesMap.get(key);
        const src = dubplus_emoji.twitch.template(id);
        const img = makeImage('twitch', src, key);
        nodes.push(img);
      } else if (
        dubplus_emoji.bttvJSONSLoaded &&
        dubplus_emoji.bttv.emotesMap.has(key)
      ) {
        const id = dubplus_emoji.bttv.emotesMap.get(key);
        const src = dubplus_emoji.bttv.template(id);
        const img = makeImage('bttv', src, key);
        nodes.push(img);
      } else if (
        dubplus_emoji.frankerfacezJSONLoaded &&
        dubplus_emoji.frankerFacez.emotesMap.has(key)
      ) {
        const id = dubplus_emoji.frankerFacez.emotesMap.get(key);
        const src = dubplus_emoji.frankerFacez.template(id);
        const img = makeImage('frankerFacez', src, key);
        nodes.push(img);
      } else {
        // if emote is not found, create a text node
        nodes.push(document.createTextNode(chunk));
      }
    } else {
      // if chunk is not an emote, create a text node
      nodes.push(document.createTextNode(chunk));
    }
  });
  return nodes;
}

/**
 * @param {HTMLLIElement} li
 * @return {void}
 */
function processChatLI(li) {
  const textElems = li.querySelectorAll('.text p');
  textElems.forEach((textElem) => {
    if (
      !textElem.hasAttribute('dubplus-emotes-processed') &&
      textElem?.textContent
    ) {
      const processedHTML = processChatText(textElem.textContent);
      textElem.replaceChildren(...processedHTML);
      textElem.setAttribute('dubplus-emotes-processed', 'true');
    }
  });
}

/**
 * run this when a new chat message is received
 * and only replaces emotes in the last message
 * @param {import('../../events').ChatMessageEvent} [e]
 * @returns {void}
 */
function replaceTextWithEmote(e) {
  if (e?.chatid) {
    /**
     * @type {HTMLLIElement}
     */
    const chatMessage = document.querySelector(`.chat-id-${e.chatid}`);
    if (chatMessage) {
      processChatLI(chatMessage);
      return;
    }
  }
  const chats = getChatMessages();
  if (!chats?.length) {
    return;
  }
  chats.forEach(processChatLI);
}

/**
 * Emotes
 * This module adds support for converting :emote: text into images.
 * Currently it only supports: Twitch, BTTV, and FrankerFaceZ emotes.
 * Tasty emotes are not supported at this time.
 * @type {import("./module").DubPlusModule}
 */
export const emotes = {
  id: 'emotes',
  label: 'emotes.label',
  description: 'emotes.description',
  category: 'general',
  turnOn() {
    dubplus_emoji
      .loadTwitchEmotes()
      .then(() => dubplus_emoji.loadBTTVEmotes())
      .then(() => dubplus_emoji.loadFrankerFacez())
      .then(() => {
        replaceTextWithEmote();
        window.QueUp.Events.bind(CHAT_MESSAGE, replaceTextWithEmote);
      });
  },

  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, replaceTextWithEmote);
  },
};
