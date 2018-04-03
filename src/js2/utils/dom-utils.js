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

function createElement(virtDom) {
  let { node, children, attributes} = virtDom;

  if (node === 'text' && virtDom.text) {
    return document.createTextNode(virtDom.text);
  }
  var el = document.createElement(node);
  if (attributes) {
    for (var attr in attributes) {
      el.setAttribute(attr, attributes[attr]);
    }
  }
  if (children.length > 0) {
    children.forEach(function(c){
      el.appendChild(createElement(c));
    });
  }
  return el;
}


/**
 * Takes a single node and converts all of its children into a virtual dom object
 * @param {Element} elem the parent element who's child nodes will get converting into a virtual dom object
 */
export function convertDOMtoObj(elem) {
  if (!elem.hasChildNodes()) { 
    return;
  }

  let rootChildren = [];

  for (let i = 0; i < elem.childNodes.length; i++) {
    let currentNode = elem.childNodes[i];
    console.log(currentNode);

    if (currentNode.nodeType === Node.ELEMENT_NODE) {
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
      if (currentNode.hasChildNodes()) {
        Array.prototype.slice.call(currentNode.childNodes).forEach(n => {
          let _children = convertDOMtoObj(n);
          if (_children) domObj.children = _children;
        });
      }
      
      rootChildren.push(domObj);
    }
  
    if (currentNode.nodeType === Node.TEXT_NODE) {
      let val = currentNode.nodeValue.trim();
      if (val === '') { continue; }
      rootChildren.push({
        node : 'text',
        text : val
      });
    }
  }

  return rootChildren
}
convertDOMtoObj($0)

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
