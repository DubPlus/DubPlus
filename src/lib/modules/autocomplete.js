/**
 * Autocomplete Emojis/Emotes
 */
import { dubplus_emoji } from '../emoji/emoji';
import {
  decrement,
  emojiState,
  increment,
  setEmojiList,
  reset,
} from '../emoji/emojiState.svelte';
import { settings } from '../stores/settings.svelte';

const KEYS = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  enter: 'Enter',
  esc: 'Escape',
  tab: 'Tab',
  backspace: 'Backspace',
  del: 'Delete',
  space: ' ',
};

const keyCharMin = 3; // when to start showing previews
let acPreview = document.querySelector('#autocomplete-preview');
let originalKeyDownEventHandler;

/**
 * @param {HTMLInputElement} inputEl
 */
function getSelection(inputEl) {
  const currentText = inputEl.value;
  const cursorPos = inputEl.selectionStart;
  let goLeft = cursorPos - 1;
  while (currentText[goLeft] !== ' ' && goLeft > 0) {
    goLeft--;
  }
  if (goLeft > 0 && currentText[goLeft] === ' ') {
    goLeft += 1;
  }

  let goRight = cursorPos;
  while (currentText[goRight] !== ' ' && goRight < currentText.length) {
    goRight++;
  }

  if (goRight !== currentText.length && currentText[goRight] === ' ') {
    goRight -= 1;
  }
  return [goLeft, goRight];
}

/**
 *
 * @param {HTMLInputElement} inputEl
 * @param {number} index
 */
export function insertEmote(inputEl, index) {
  const selected = emojiState.emojiList[index];
  const [start, end] = getSelection(inputEl);
  const target = inputEl.value.substring(start, end);
  inputEl.value = inputEl.value.replace(target, `:${selected.text}:`);
  reset();
}

/**
 * @param {KeyboardEvent | MouseEvent} e
 */
function checkInput(e) {
  const inputEl = /**@type {HTMLInputElement}*/ (e.target);
  const currentText = inputEl.value;
  const cursorPos = inputEl.selectionStart;

  let str = '';
  let goLeft = cursorPos - 1;
  while (currentText[goLeft] !== ' ' && goLeft >= 0) {
    str = currentText[goLeft] + str;
    goLeft--;
  }
  let goRight = cursorPos;
  while (currentText[goRight] !== ' ' && goRight < currentText.length) {
    str = str + currentText[goRight];
    goRight++;
  }

  if (str.startsWith(':') && str.length >= keyCharMin && !str.endsWith(':')) {
    // start filtering emojis
    const list = dubplus_emoji.findMatchingEmotes(
      str.substring(1).trim(),
      settings.options.autocomplete
    );
    setEmojiList(list);
  } else {
    reset();
  }
}

/**
 *
 * @param {KeyboardEvent} e
 * @returns
 */
function chatInputKeyupFunc(e) {
  acPreview = acPreview || document.querySelector('#autocomplete-preview');
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
    e.stopImmediatePropagation();
    const inputEl = /**@type {HTMLInputElement}*/ (e.target);
    insertEmote(inputEl, emojiState.selectedIndex);
    return;
  }

  // just clear the preview if we hit escape
  if (e.key === KEYS.esc && hasItems) {
    reset();
    return;
  }

  checkInput(e);
}

/**
 *
 * @param {KeyboardEvent} e
 * @returns
 */
function chatInputKeydownFunc(e) {
  acPreview = acPreview || document.querySelector('#autocomplete-preview');
  const emptyPreview = acPreview.children.length === 0;
  const isValidKey = [KEYS.tab, KEYS.enter, KEYS.up, KEYS.down].includes(e.key);
  const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;

  if (!isModifierKey && !emptyPreview && isValidKey) {
    e.preventDefault();
    return;
  }

  // temporary fix to restore enter key functionality for sending messages
  // due to the new multiline chat textarea
  if (!isModifierKey && e.key === KEYS.enter) {
    window.QueUp.room.chat.sendMessage();
    window.QueUp.room.chat.resizeTextarea();
  } else if (!isModifierKey) {
    window.QueUp.room.chat.ncKeyDown(e);
  }
}

/**
 * Autocomplete
 * This module will allow users to autocomplete emojis/emotes in chat by presenting
 * a popup window above the chat that users can navigate with the arrow keys and select
 * @type {import("./module").DubPlusModule}
 */
export const autocomplete = {
  id: 'autocomplete',
  label: 'autocomplete.label',
  category: 'general',
  description: 'autocomplete.description',
  turnOn() {
    acPreview = document.querySelector('#autocomplete-preview');
    reset();

    originalKeyDownEventHandler =
      window.QueUp.room.chat.events['keydown #chat-txt-message'];

    const newEventsObject = { ...window.QueUp.room.chat.events };
    delete newEventsObject['keydown #chat-txt-message'];
    window.QueUp.room.chat.delegateEvents(newEventsObject);

    const chatInput = document.getElementById('chat-txt-message');
    chatInput.addEventListener('keydown', chatInputKeydownFunc);
    chatInput.addEventListener('keyup', chatInputKeyupFunc);
    chatInput.addEventListener('click', checkInput);
  },

  turnOff() {
    reset();
    window.QueUp.room.chat.events['keydown #chat-txt-message'] =
      originalKeyDownEventHandler;
    window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
    const chatInput = document.getElementById('chat-txt-message');
    chatInput.removeEventListener('keydown', chatInputKeydownFunc);
    chatInput.removeEventListener('keyup', chatInputKeyupFunc);
    chatInput.removeEventListener('click', checkInput);
  },
};
