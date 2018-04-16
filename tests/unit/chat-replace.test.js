'use strict';
import beginReplace, {
  checkForEmotes,
  processTextNode,
  getTextNodesUnder,
  getLatestChatNode
} from '../../src/js2/utils/emotes/chat-replace.js';

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
  
  beginReplace();
  let imgs = document.querySelectorAll('.emoji');
  expect(imgs.length).toEqual(1);
  expect(imgs[0].src).toEqual('//static-cdn.jtvnw.net/emoticons/v1/25/3.0');
  expect(document.querySelector('.text p').childNodes.length).toEqual(3);
});
