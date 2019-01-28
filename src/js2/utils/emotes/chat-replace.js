/*
 * This is a collection of functions that will handle replacing custom emotes
 * in chat with img tags
 *
 * What it does is grabs the last ".text" chat element and processes it
 * by only looking at TextNodes. This way we can avoid any clashes with
 * existing emoji in image tag titles/alt attributes
 */

import twitch from "./twitch.js";
import bttv from "./bttv.js";
import parser from "./parser.js";

/**
 * return the last chat item in the chat area
 * this item could have a collection of <p> tags or just one
 */
export function getLatestChatNode() {
  var list = document.querySelectorAll(".chat-main .text");
  if (list.length > 0) {
    return list[list.length - 1];
  }
  return null;
}

/**
 * Searchs for all text nodes starting at a given Node
 * src: https://stackoverflow.com/a/10730777/395414
 * @param {HTMLElement} el parent node to begin searching for text nodes from
 * @returns {array} of text nodes
 */
export function getTextNodesUnder(el) {
  let n;
  let a = [];
  let walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  while ((n = walk.nextNode())) {
    a.push(n);
  }
  return a;
}

export function makeEmoteImg({ type, src, name, w, h }) {
  let img = document.createElement("img");
  if (w) {
    img.width = w;
  }
  if (h) {
    img.height = h;
  }
  img.className = `emoji ${type}-emote`;
  img.title = name;
  img.alt = name;
  img.src = src;
  return img;
}

/**
 * Search our stored emote data for matching emotes. Grab first match and return
 * it. It checks in this specific order:  twitch, bttv, tasty
 * @param {String} emote the emote to look for
 * @returns {Object} the emote data {type: String, src: String, name: String}
 */
export function getImageDataForEmote(emote) {
  // search emotes in order of preference
  let key = emote.replace(/^:|:$/g, "");

  if (twitch.emotes[key]) {
    return {
      type: "twitch",
      src: twitch.template(twitch.emotes[key]),
      name: key
    };
  }

  if (bttv.emotes[key]) {
    return {
      type: "bttv",
      src: bttv.template(bttv.emotes[key]),
      name: key
    };
  }

  return false;
}

/**
 * Take a text node and converts it into a complex mix of text and img nodes
 * @param {Node_Text} textNode a DOM text node
 * @param {Array} emoteMatches Array of matching emotes found in the string
 */
export function processTextNode(textNode, emoteMatches) {
  let parent = textNode.parentNode;
  let textNodeVal = textNode.nodeValue.trim();
  let fragment = document.createDocumentFragment();

  // wrap emotes within text node value with a random & unique string that will
  // be removed by string.split
  let splitter = "-0wrap__emote0-";

  // Search matches emotes from one of the apis
  // and setup the textNodeVal to make it easy to find them
  emoteMatches.forEach(m => {
    let imgData = getImageDataForEmote(m);
    if (imgData) {
      let d = JSON.stringify(imgData);
      textNodeVal = textNodeVal.replace(m, `${splitter}${d}${splitter}`);
    }
  });

  // split the new string, create either text nodes or new img nodes
  let nodeArr = textNodeVal.split(splitter);
  nodeArr.forEach(t => {
    try {
      // if it is a json object then we convert to image
      var imgdata = JSON.parse(t);
      let img = makeEmoteImg(imgdata);
      fragment.appendChild(img);
    } catch (e) {
      // otherwise it's just a normal text node
      fragment.appendChild(document.createTextNode(t));
    }
  });

  parent.replaceChild(fragment, textNode);
}

export default function beginReplace(nodeStart) {
  if (!nodeStart.nodeType) {
    nodeStart = getLatestChatNode();
  }

  if (!nodeStart) {
    return;
  }

  let texts = getTextNodesUnder(nodeStart);

  texts.forEach(t => {
    let val = t.nodeValue.trim();
    if (val === "") {
      return;
    }
    let found = parser(val);
    if (found.length === 0) {
      return;
    }
    processTextNode(t, found);
  });
}
