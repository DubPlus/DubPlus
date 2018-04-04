/*
 * This is a collection of functions that will handle replacing custom emotes
 * in chat with img tags
 * 
 * What it does is grabs the last ".text" chat element and processes it
 * by only looking at TextNodes. This way we can avoid any clashes with 
 * existing emoji in image tag titles/alt attributes
 */

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
  return makeEmoteImg ({type:'twith', src:'kappa.jpg', name: 'kappa'} );
}

/**
 * Take a text node and converts it into a complex mix of text and img nodes
 * @param {Node_Text} textNode a DOM text node
 * @param {Array} searchArr Array of matching emotes found in the string
 */
export function processTextNode(textNode, searchArr ) {
  let parent = textNode.parentNode;
  let text = textNode.nodeValue;
  let fragment = document.createDocumentFragment();
  
  let stringBuilder = '';

  text.split(' ').forEach((t,i)=>{
    if (searchArr.indexOf(t) >= 0 ) {
      if (stringBuilder !== '') { fragment.appendChild(document.createTextNode(stringBuilder)); }
      let img = getImageForEmote(t);
      fragment.appendChild(img);
      stringBuilder = ' ';
      return;
    }
    stringBuilder += t + ' ';
  });

  if (stringBuilder !== '') { fragment.appendChild(document.createTextNode(stringBuilder)); }
  

  parent.replaceChild(fragment, textNode);
}

function checkForEmotes(val) {
  let matches = val.match(/:[a-z0-9]+:/ig);
  console.log(matches);
  return matches;
}

function beginReplace() {
  let lastChat = getLatestChatNode();
  let texts = textNodesUnder(lastChat);

  texts.forEach(t => {
    let val = t.nodeValue.trim();
    if (val === '') { return; }
    let found = checkForEmotes(val);
    if (!found) { return; }
    processTextNode(t, found);
  });
}