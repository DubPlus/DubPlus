/*
 * This is a collection of functions that will handle replacing custom emotes
 * in chat with img tags
 * 
 * What it does is grabs the last ".text" chat element and processes it
 * by only looking at TextNodes. This way we can avoid any clashes with 
 * existing emoji in image tag titles/alt attributes
 */

import twitch from './twitch.js';
import bttv from './bttv.js';
import tasty from './tasty.js';

/**
 * return the most last chat item in the chat area
 * this item could have a collection of <p> tags or just one
 */
export function getLatestChatNode(){
  var list = document.querySelectorAll('.chat-main .text');
  if (list.length > 0) {
    return list[list.length - 1];
  }
}

/**
 * Searchs for all text nodes starting in a given
 * src: https://stackoverflow.com/a/10730777/395414
 * @param {HTMLElement} el parent node to begin searching for text nodes from
 */
export function getTextNodesUnder(el){
  let n;
  let a=[]; 
  let walk = document.createTreeWalker( el, NodeFilter.SHOW_TEXT, null, false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

export function makeEmoteImg({type, src, name, w, h}) {
  let img = document.createElement('img');
  if (w) { img.width = w; }
  if (h) { img.height = h; }
  img.className = `emoji ${type}-emote`;
  img.title = name;
  img.alt = name;
  img.src = src;
  return img;
}

// TODO: finish this
export function getImageDataForEmote(emote) {
  // search emotes in order of preferences
  let key = emote.replace(/^:|:$/g, '');

  if (twitch.emotes[key]) {
    return {
      type:'twitch',
      src: twitch.template( twitch.emotes[key] ), 
      name: key
    }
  }

  if (bttv.emotes[key]) {
    return {
      type:'bttv',
      src: bttv.template( bttv.emotes[key] ), 
      name: key
    }
  }

  if (tasty.emotes[key]) {
    return {
      type:'tasty',
      src: tasty.template(key), 
      name: key
    }
  }
}

/**
 * Take a text node and converts it into a complex mix of text and img nodes
 * @param {Node_Text} textNode a DOM text node
 * @param {Array} emoteMatches Array of matching emotes found in the string
 */
export function processTextNode(textNode, emoteMatches ) {
  let parent = textNode.parentNode;
  let textNodeVal = textNode.nodeValue.replace(/^\s+|\s+$/g, '');
  let fragment = document.createDocumentFragment();
  
  // wrap emotes within text node value with a random & unique string that will 
  // be removed by string.split
  let splitter = '-0wrap__emote0-';

  // filter matches to only contain actual emotes from one of the apis
  // and setup the textNodeVal to make it easy to find them
  let realMatches = emoteMatches.filter(m => {
    let imgData = getImageDataForEmote(m);
    if (imgData) {
      let d = JSON.stringify(d);
      textNodeVal = textNodeVal.replace(m, `${splitter}${d}${splitter}`);
      return true;
    } else {
      return false;
    }
  });

  // split the new string, create either text nodes or new img nodes
  let nodeArr = textNodeVal.split(splitter);
  nodeArr.forEach(t => {
    if (realMatches.indexOf(t) < 0) {
      fragment.appendChild(document.createTextNode(t)); 
      return;
    }
    let img = makeEmoteImg(JSON.parse(t));
    fragment.appendChild(img);
  });

  parent.replaceChild(fragment, textNode);
  // console.log(parent.innerHTML);
}

export function checkForEmotes(val) {
  let matches = val.match(/:[^:\s]*(?:::[^:\s]*)*:/ig);
  return matches;
}

export default function beginReplace(nodeStart) {
  let root = nodeStart || getLatestChatNode();
  let texts = getTextNodesUnder(root);

  texts.forEach(t => {
    let val = t.nodeValue.replace(/^\s+|\s+$/g, '');
    if (val === '') { return; }
    let found = checkForEmotes(val);
    if (!found) { return; }
    processTextNode(t, found);
  });
}