"use strict";
import beginReplace, {
  processTextNode,
  getTextNodesUnder,
  getLatestChatNode,
  getImageDataForEmote
} from "@/utils/emotes/chat-replace.js";

test("getImageDataForEmote test", ()=> {
  let data = getImageDataForEmote(':Kappa:');
  expect(data.type).toEqual('twitch');
  expect(data.src).toEqual('//static-cdn.jtvnw.net/emoticons/v1/25/1.0');
  expect(data.name).toEqual('Kappa');
});

test("getLatestChatNode gets last chat node", () => {
  document.body.innerHTML = `
    <ul class="chat-main">
      <li class="chat-welcome-message">Hi! Welcome to Chillout Mixer. We love instrumental trip-hop, downtempo, psychill, ambient, and some future chill
      sounds. We don't dig EDM, lyrics, or acoustic. Ask any mod for guidance on what to play. Have fun!</li>
      <li>
        <div class="text"><p>1</p><p>2</p><p>3</p><p>test</p></div>
        <div class="text"><p>nothing is happpening</p></div>
        <div class="text"><p>chat chat</p></div>
      </li>
    </ul>
  `;

  let chatNode = getLatestChatNode();
  expect(chatNode.childNodes[0].textContent).toEqual("chat chat");
});

test("getTextNodesUnder returns an array of text nodes", () => {
  document.body.innerHTML = `
    <ul class="chat-main">
      <li class="chat-welcome-message">Hi! Welcome to Chillout Mixer. We love instrumental trip-hop, downtempo, psychill, ambient, and some future chill sounds. We don't dig EDM, lyrics, or acoustic. Ask any mod for guidance on what to play. Have fun!</li>
      <li>
        <div class="text"><p>1</p><p>2</p><p>3</p><p>test</p></div>
        <div class="text"><p>nothing is happpening</p></div>
        <div class="text"><p>chat chat</p></div>
      </li>
    </ul>
  `;

  let texts = getTextNodesUnder(document.querySelector(".chat-main"));
  expect(Array.isArray(texts)).toEqual(true);
});

test("getLatestChatNode returns undefined when chat is empty", () => {
  document.body.innerHTML = `
    <ul class="chat-main">
    </ul>
  `;

  let chatNode = getLatestChatNode();
  expect(chatNode).toBeNull();
});

test("processTextNode test", () => {
  document.body.innerHTML = '<p id="test">Who is this :Kappa: guy anyways?</p>';
  processTextNode(document.querySelector('#test').childNodes[0], [':Kappa:']);
  expect(document.querySelector('.emoji')).toBeDefined();
});

test("emote Embed replaces emote with an img tag", () => {
  document.body.innerHTML = `
    <ul class="chat-main">
      <li>
        <div class="text">
          <p>
            Who is this :Kappa: guy anyways?
          </p>
        </div>
      </li>
    </ul>
  `;

  beginReplace(document.querySelector(".chat-main"));
  let imgs = document.querySelectorAll(".emoji");
  expect(imgs.length).toEqual(1);
  expect(imgs[0].src).toEqual("http://static-cdn.jtvnw.net/emoticons/v1/25/1.0");
  expect(document.querySelector(".text p").childNodes.length).toEqual(3);
});
