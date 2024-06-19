/**
 * Emotes
 * Adds additional Twitch, BTTV, and FrankerFaceZ emotes to chat.
 * Tasty emotes are not supported at this time.
 */
import { dubplus_emoji } from "../../utils/emoji.js";

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
  const width = w ? `width="${w}"` : "";
  const height = h ? `height="${h}"` : "";
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
    if (dubplus_emoji.twitch.emotesMap[key]) {
      const id = dubplus_emoji.twitch.emotesMap[key];
      const src = dubplus_emoji.twitch.template(id);
      return makeImage("twitch", src, key);
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
    if (dubplus_emoji.bttv.emotesMap[key]) {
      const id = dubplus_emoji.bttv.emotesMap[key];
      const src = dubplus_emoji.bttv.template(id);
      return makeImage("bttv", src, key);
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
    if (dubplus_emoji.frankerFacez.emotesMap[key]) {
      const id = dubplus_emoji.frankerFacez.emotesMap[key];
      const src = dubplus_emoji.frankerFacez.template(id);
      return makeImage("frankerFacez", src, key);
    } else {
      return matched;
    }
  });
  return emoted;
}

function replaceTextWithEmote() {
  const chatTarget = document.querySelector(".chat-main li:last-child .text");

  if (!chatTarget?.innerHTML) {
    return;
  } // nothing to do

  // Twitch first
  let processedHTML = replaceTwitch(chatTarget.innerHTML);
  processedHTML = replaceBttv(processedHTML);
  processedHTML = replaceFranker(processedHTML);
  chatTarget.innerHTML = processedHTML;
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const emotes = {
  id: "dubplus-emotes",
  label: "Emotes",
  description: "Adds twitch and bttv emotes in chat.",
  category: "General",
  turnOn() {
    dubplus_emoji
      .loadTwitchEmotes()
      .then(() => dubplus_emoji.loadBTTVEmotes())
      .then(() => dubplus_emoji.loadFrankerFacez())
      .then(() => {
        replaceTextWithEmote();
      });
    window.QueUp.Events.bind("realtime:chat-message", replaceTextWithEmote);
  },

  turnOff() {
    window.QueUp.Events.unbind("realtime:chat-message", replaceTextWithEmote);
  },
};
