/**
 * Autocomplete Emojis/Emotes
 */
import { dubplus_emoji } from "../../utils/emoji";
import {
  decrement,
  emojiState,
  increment,
  setEmojiList,
} from "../emoji/emojiState.svelte";
import { settings } from "../settings.svelte";

const KEYS = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  enter: "Enter",
  esc: "Escape",
  tab: "Tab",
  backspace: "Backspace",
  del: "Delete",
  space: " ",
};

const keyCharMin = 3; // when to start showing previews

/**
 *
 * @param {HTMLInputElement} inputEl
 */
function checkInput(inputEl) {
  const currentText = inputEl.value;
  const cursorPos = inputEl.selectionStart;

  let str = "";
  let goLeft = cursorPos - 1;
  while (currentText[goLeft] !== " " && goLeft >= 0) {
    str = currentText[goLeft] + str;
    goLeft--;
  }
  let goRight = cursorPos;
  while (currentText[goRight] !== " " && goRight < currentText.length) {
    str = str + currentText[goRight];
    goRight++;
  }

  if (str.startsWith(":") && str.length >= keyCharMin && !str.endsWith(":")) {
    // start filtering emojis
    const list = dubplus_emoji.findMatchingEmotes(
      str.substring(1).trim(),
      settings.options["dubplus-autocomplete"]
    );
    setEmojiList(list);
  }
}

/**
 *
 * @param {KeyboardEvent} e
 * @returns
 */
function chatInputKeyupFunc(e) {
  const acPreview = document.querySelector("#autocomplete-preview");
  const hasItems = acPreview.children.length > 0;

  if (e.key === KEYS.up && hasItems) {
    e.preventDefault();
    decrement();
    return;
  }

  if (e.key === KEYS.down && hasItems) {
    e.preventDefault();
    increment();
    return;
  }

  // handle selecting the emoji/emote and replacing the text in chat input
  if ((e.key === KEYS.enter || e.key === KEYS.tab) && hasItems) {
    e.preventDefault();
    const selected = emojiState.emojiList[emojiState.selectedIndex];
    // previewList.updateChatInput();
    setEmojiList([]);
    return;
  }

  // just clear the preview if we hit escape
  if (e.key === KEYS.esc && hasItems) {
    setEmojiList([]);
    return;
  }

  checkInput(/** @type {HTMLInputElement} */ (e.target));
}

/**
 *
 * @param {KeyboardEvent} e
 * @returns
 */
function chatInputKeydownFunc(e) {
  const emptyPreview =
    document.querySelector("#autocomplete-preview").children.length === 0;

  const isValidKey = [KEYS.tab, KEYS.enter, KEYS.up, KEYS.down].includes(e.key);

  // Manually send the keycodes if the preview popup isn't visible
  if (isValidKey && emptyPreview) {
    return window.QueUp.room.chat.ncKeyDown({ which: e.keyCode });
  }

  // stop default behaviors of special keys so we can use them in preview
  if (isValidKey && !emptyPreview) {
    e.preventDefault();
  }
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const autocomplete = {
  id: "dubplus-autocomplete",
  label: "Autocomplete Emoji",
  category: "General",
  description:
    "Toggle autocompleting emojis and emotes. Shows a preview box in the chat",
  turnOn() {
    // Only remove keydown for Dubtrack native autocomplete to work
    const omitted = structuredClone(window.QueUp.room.chat.events);
    delete omitted["keydown #chat-txt-message"];
    window.QueUp.room.chat.delegateEvents(omitted);
    const chatInput = document.getElementById("chat-txt-message");
    chatInput.addEventListener("keydown", chatInputKeydownFunc);
    chatInput.addEventListener("keyup", chatInputKeyupFunc);
  },

  turnOff() {
    // previewList.stop();
    window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
    const chatInput = document.getElementById("chat-txt-message");
    chatInput.removeEventListener("keydown", chatInputKeydownFunc);
    chatInput.removeEventListener("keyup", chatInputKeyupFunc);
  },
};
