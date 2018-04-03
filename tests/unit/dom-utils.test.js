'use strict';
import {
  decorateTextNode,
  replaceText,
  makeEmoteImg,
  getLatestChatNode,
  convertDOMtoObj
} from '../../src/js2/utils/dom-utils.js';

test('getLatestChatNode gets last chat node', () => {
  document.body.innerHTML = `
    <div class="chat-main">
      <div class="text"><p>1</p><p>2</p><p>3</p><p>test</p></div>
      <div class="text"><p>nothing is happpening</p></div>
      <div class="text"><p>chat chat</p></div>
    </div>
  `;

  let chatNode = getLatestChatNode();
  expect(chatNode.childNodes[0].textContent).toEqual('chat chat');
});

test('getLatestChatNode returns undefined when chat is empty', () => {
  document.body.innerHTML = `
    <div class="chat-main">
    </div>
  `;

  let chatNode = getLatestChatNode();
  expect(chatNode).toBeUndefined();
});

test('convertDOMtoObj creates dom obj tree', () => {
  document.body.innerHTML = `
    <div class="chat-main">
      <div class="text">
        <p>
          Who is this :kappa: guy anyways?
        </p>
      </div>
    </div>
  `;

  let chatNode = getLatestChatNode();
  let virtDom = convertDOMtoObj(chatNode);
  expect(virtDom).toHaveProperty('node', 'children', 'attributes');
  expect(virtDom.children.length).toBe(1);
  
});

test('emoteEmbed replaces emote with an img tag', () => {
  document.body.innerHTML = `
    <div class="chat-main">
      <div class="text">
        <p>
          Who is this :kappa: guy anyways?
        </p>
      </div>
    </div>
  `;
  // <img src="//static-cdn.jtvnw.net/emoticons/v1/25/3.0" title="kappa" alt="kappa">
  var emotesObj = { kappa : '//static-cdn.jtvnw.net/emoticons/v1/25/3.0' };
  
  let chatNode = getLatestChatNode();
  let virtDom = emoteEmbed(chatNode, regex, allEmotes);
  let newNode = createElement(virtDom);
  
});
