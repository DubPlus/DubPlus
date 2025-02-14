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
import { getSelection, isEdge } from '../emoji/helpers';

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

/**
 * Minimum number of characters to start filtering emojis.
 * Includes the ":" character so ":sm" is 3 characters.
 */
const MIN_CHAR = 3;
let acPreview = document.querySelector('#autocomplete-preview');
let originalKeyDownEventHandler;

/**
 *
 * @param {HTMLTextAreaElement} inputEl
 * @param {number} index
 */
export function insertEmote(inputEl, index) {
  const selected = emojiState.emojiList[index];
  const [start, end] = getSelection(inputEl.value, inputEl.selectionStart);
  const target = inputEl.value.substring(start, end);
  inputEl.value = inputEl.value.replace(target, `:${selected.text}:`);
  reset();
}

/**
 * @param {KeyboardEvent | MouseEvent} e
 */
function checkInput(e) {
  const inputEl = /**@type {HTMLTextAreaElement}*/ (e.target);
  const currentText = inputEl.value;
  const cursorPos = inputEl.selectionStart;

  /*  
    In here we are finding the nearest incomplete emoji/emote to the cursor position
    
    For example, if we have the following chat message:
    "Smelly :cat"
    and the cursor is at the end of the message,
    It will find the string ":cat"

    if the word is a complete emoji (starts and ends in a colon), like ":cat:",
    it will ignore it. This only cares about incomplete possible emojis/emotes

    It will use that partial emoji/emote to filter the list of emojis/emotes 
    that show in the autocomplete preview panel
  */

  let str = '';
  let goLeft = cursorPos - 1;
  while (!isEdge(currentText[goLeft]) && goLeft >= 0) {
    str = currentText[goLeft] + str;
    goLeft--;
  }

  let goRight = cursorPos;
  while (!isEdge(currentText[goRight]) && goRight < currentText.length) {
    str = str + currentText[goRight];
    goRight++;
  }

  if (str.startsWith(':') && str.length >= MIN_CHAR && !str.endsWith(':')) {
    // start filtering emojis
    const list = dubplus_emoji.findMatchingEmotes(
      str.substring(1).trim(),
      settings.options.emotes
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
  const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;

  if (isModifierKey) {
    // do nothing if a modifier key is pressed
    return;
  }

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
    const inputEl = /**@type {HTMLTextAreaElement}*/ (e.target);
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
