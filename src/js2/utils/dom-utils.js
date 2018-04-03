/*
 * Utils to manipulate the DOM outside of Menu
 */


function makeEmoteImg(type, src, name, w, h) {
  let img = document.createElement('img');
  if (w) { img.width = w; }
  if (h) { img.height = h; }
  img.className = `emoji ${type}-emote`;
  img.title = name;
  img.alt = name;
  img.src = src;
  return img;
}

function decorateTextNode(textNode, search, parent, ) {
  /*
    For example, we would like to convert this TextNode:
        "some text and an :emoji: and then more text"
    into this:
        "some text and an" <img src="emoji.jpg"/> "and then more text"
   */

  let text = textNode.nodeValue;
  let pos = text.indexOf(search);

  if (pos >= 0) {
    /*
      first we create an empty fragement
      <> </>
    */
    let fragment = document.createDocumentFragment();

    if (pos > 0) {
      /*
        since :emoji: is in the middle, we need to break it up
        <> 
          "some text and an"
        </>
       */
      fragment.appendChild(document.createTextNode(text.substr(0, pos)));
    }

    /* 
      Append the new element
      <>
        "some text and an"
        <img src="emoji.jpg" />
      </>
    */
    fragment.appendChild(newElem);

    // is there more text?
    if ((pos + search.length + 1) < text.length) {
      /* 
        yes, so add it as another textNode to the fragment
        <>
          "some text and an"
          <img src="emoji.jpg" />
          "and then more text"
        </>
      */
      fragment.appendChild(document.createTextNode(text.substr(pos + search.length + 1)));
    }

    /*
      replace textNode with the fragment and return it
     */
    parent.replaceChild(fragment, textNode);
    return parent;
  }

}

// recursively look through 
function replaceText(rootNode, search) {
  if (!rootNode.hasChildNodes()) { return; }

  let fragment = document.createDocumentFragment();

  for (let i = rootNode.childNodes.length; i--;) {
    let childNode = rootNode.childNodes[i];
    if (childNode.nodeType !== 3) { continue; } // 3 => a Text Node
    
  }

}