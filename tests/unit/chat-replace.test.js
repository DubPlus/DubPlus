"use strict";
import beginReplace, {
  processTextNode,
  getTextNodesUnder,
  getLatestChatNode
} from "@/utils/emotes/chat-replace.js";

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

test("getLatestChatNode returns undefined when chat is empty", () => {
  document.body.innerHTML = `
    <ul class="chat-main">
    </ul>
  `;

  let chatNode = getLatestChatNode();
  expect(chatNode).toBeNull();
});

test("emoteEmbed replaces emote with an img tag", () => {
  document.body.innerHTML = `
    <ul class="chat-main">
      <li>
        <div class="text">
          <p>
            Who is this :kappa: guy anyways?
          </p>
        </div>
      </li>
    </ul>
  `;
  // <img src="//static-cdn.jtvnw.net/emoticons/v1/25/3.0" title="kappa" alt="kappa">

  beginReplace();
  let imgs = document.querySelectorAll(".emoji");
  expect(imgs.length).toEqual(1);
  expect(imgs[0].src).toEqual("//static-cdn.jtvnw.net/emoticons/v1/25/3.0");
  expect(document.querySelector(".text p").childNodes.length).toEqual(3);
});

afterAll(done => {
  localStorage.clear();
  let rq = indexedDB.deleteDatabase("d2");
  rq.onerror = function(event) {
    console.log("Error deleting database.");
  };
  rq.onsuccess = done;
});
