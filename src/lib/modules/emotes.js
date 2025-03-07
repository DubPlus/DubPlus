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
 * @returns {string}
 */
function makeImage(type, src, name, w, h) {
  const width = w ? `width="${w}"` : '';
  const height = h ? `height="${h}"` : '';
  return `<img class="emoji ${type}-emote" ${width} ${height} title="${name}" alt="${name}" src="${src}" />`;
}

/**
 * @param {string} html
 * @returns {string}
 */
function replaceTwitch(html) {
  if (!dubplus_emoji.twitchJSONSLoaded) {
    return html;
  }
  const _regex = dubplus_emoji.twitch.chatRegex;
  const emoted = html.replace(_regex, function (matched, p1) {
    const key = p1.toLowerCase();
    if (dubplus_emoji.twitch.emotesMap.has(key)) {
      const id = dubplus_emoji.twitch.emotesMap.get(key);
      const src = dubplus_emoji.twitch.template(id);
      return makeImage('twitch', src, key);
    } else {
      return matched;
    }
  });
  return emoted;
}

/**
 * @param {string} html
 * @returns {string}
 */
function replaceBttv(html) {
  if (!dubplus_emoji.bttvJSONSLoaded) {
    return html;
  }
  const _regex = dubplus_emoji.bttv.chatRegex;
  const emoted = html.replace(_regex, function (matched, p1) {
    const key = p1.toLowerCase();
    if (dubplus_emoji.bttv.emotesMap.has(key)) {
      const id = dubplus_emoji.bttv.emotesMap.get(key);
      const src = dubplus_emoji.bttv.template(id);
      return makeImage('bttv', src, key);
    } else {
      return matched;
    }
  });
  return emoted;
}

/**
 * @param {string} html
 * @returns {string}
 */
function replaceFranker(html) {
  if (!dubplus_emoji.frankerfacezJSONLoaded) {
    return html;
  }
  const _regex = dubplus_emoji.frankerFacez.chatRegex;
  const emoted = html.replace(_regex, function (matched, p1) {
    const key = p1.toLowerCase();
    if (dubplus_emoji.frankerFacez.emotesMap.has(key)) {
      const id = dubplus_emoji.frankerFacez.emotesMap.get(key);
      const src = dubplus_emoji.frankerFacez.template(id);
      return makeImage('frankerFacez', src, key);
    } else {
      return matched;
    }
  });
  return emoted;
}

/**
 * run this when a new chat message is received
 * and only replaces emotes in the last message
 */
function replaceTextWithEmote() {
  const chats = getChatMessages(':not([data-emote-processed])');
  if (!chats?.length) {
    return;
  }
  chats.forEach((li) => {
    li.setAttribute('data-emote-processed', 'true');
    const text = li.querySelector('.text');
    if (text?.innerHTML) {
      let processedHTML = replaceTwitch(text.innerHTML);
      processedHTML = replaceBttv(processedHTML);
      processedHTML = replaceFranker(processedHTML);
      text.innerHTML = processedHTML;
    }
  });
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
