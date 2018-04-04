/*
 * Utils to manipulate the DOM outside of Menu
 */


export function makeEmoteImg(type, src, name, w, h) {
  let img =  {
    node: "IMG",
    attributes : {
      class: `emoji ${type}-emote`,
      title: name,
      alt: name,
      src: src
    }
  }
  if (w) { img.attributes.width = w; }
  if (h) { img.attributes.height = h; }
  return img;
}


export function getLatestChatNode(){
  var list = document.querySelectorAll('.chat-main .text');
  if (list.length > 0) {
    return list[list.length - 1];
  }
}

function handleElemNode(currentNode) {
  let domObj = {};
  domObj.children = [];
  domObj.node = currentNode.nodeName;
  
  if (currentNode.attributes.length > 0){
    domObj.attributes = {};
    Array.prototype.slice.call(currentNode.attributes).forEach(a => {
      domObj.attributes[a.name] = a.value;
    });
  }
  
  // lets get recursive
  if (currentNode.childNodes.length > 0) {
    let _children = convertDOMtoObj(currentNode.childNodes);
    if (_children) domObj.children = _children;
  }
  
  return domObj;
}

function convertDOMtoObj(nodes) {
  if (nodes.length === 0) { 
    return;
  }

  let rootChildren = [];

  for (let i = 0; i < nodes.length; i++) {
    let currentNode = nodes[i];

    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      rootChildren.push( handleElemNode(currentNode) );
    }
  
    if (currentNode.nodeType === Node.TEXT_NODE) {
      let val = currentNode.nodeValue.trim();
      if (val === '') { continue; }
      rootChildren.push({
        node : 'text',
        value : val
      });
    }
  }

  return rootChildren
}

function createElement(virtDom) {
  let { node, children, attributes} = virtDom;

  if (node === 'text' && virtDom.value) {
    return document.createTextNode(virtDom.value);
  }
  var el = document.createElement(node);
  if (attributes) {
    for (var attr in attributes) {
      el.setAttribute(attr, attributes[attr]);
    }
  }
  if (children && children.length > 0) {
    children.forEach(function(c){
      el.appendChild(createElement(c));
    });
  }
  return el;
}

/**
 * in a given dom node, search through the text nodes and
 * replace matching :emotes: with img tags
 * @param {Element} node should be the last index of `.chat-main .text`
 */
export function emoteEmbed(vdom, regex, emotesObj) {
  for (let key in vdom) {
    if (key === 'node' && vdom.node === "text") {
      handleText(vdom)
      continue;
    }
    if (key === "children" && vdom.children.length > 0) {
      vdom.children.forEach(()=>{ emoteEmbed(vdom, regex, emotesObj); })
    }
  }
}

/*
  take a parent element and grab its children and convert them into 
  an array of objects that represent them (my version of the virtual dom)

  iterate through them and search for text nodes

  if current node is a text node, process the text
    - search text with regex to find matchs
      - replace matches with new image node objects
      - so now need to split up the 

  if current node is html element, does it have children?
    - if so, recurse!
*/