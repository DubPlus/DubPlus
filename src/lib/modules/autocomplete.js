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
import { getSelection, isEdge, getCaretOffset } from '../emoji/helpers';
import { getChatInput } from '../queup.ui';
import { waitFor } from '../../utils/waitFor';
import { logError } from '../../utils/logger';
import { submitChatMessage } from '../../utils/chat-message';

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
const MIN_CHAR = 2;

/**
 *
 * @returns {HTMLUListElement | null}
 */
function getAutocompletePreview() {
  return document.querySelector('#autocomplete-preview');
}

/**
 *
 * @param {HTMLDivElement} inputEl
 * @param {number} index
 */
export function insertEmote(inputEl, index) {
  const selected = emojiState.emojiList[index];
  if (!selected) return;
  const [start, end] = getSelection(
    inputEl.textContent,
    getCaretOffset(inputEl),
  );
  // Splice in the emote using the exact [start, end] range of the partial at the
  // cursor. Using String.replace(target, ...) would rewrite the FIRST matching
  // substring anywhere in the input (e.g. a ":ca" inside an earlier ":cats:"),
  // not necessarily the token the cursor is actually on.
  inputEl.textContent =
    inputEl.textContent.slice(0, start) +
    `:${selected.text}:` +
    inputEl.textContent.slice(end);
  reset();
}

/**
 * @param {KeyboardEvent | MouseEvent} e
 */
function checkInput(e) {
  const inputEl = /**@type {HTMLDivElement}*/ (e.target);
  const currentText = inputEl.textContent;
  const cursorPos = getCaretOffset(inputEl);

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
    const searchStr = str.substring(1).trim();
    // start filtering emojis
    const list = dubplus_emoji.findMatchingEmotes(
      searchStr,
      settings.options.emotes,
    );
    setEmojiList(list, searchStr);
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
  const acPreview = getAutocompletePreview();
  if (!acPreview) {
    return;
  }
  const hasItems = acPreview.children.length > 0;
  const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;

  if (isModifierKey) {
    // do nothing if a modifier key is pressed
    return;
  }

  if (e.key === KEYS.up && hasItems) {
    decrement();
    return;
  }

  if (e.key === KEYS.down && hasItems) {
    increment();
    return;
  }

  // handle selecting the emoji/emote and replacing the text in chat input
  if ((e.key === KEYS.enter || e.key === KEYS.tab) && hasItems) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const inputEl = /**@type {HTMLDivElement}*/ (e.target);
    insertEmote(inputEl, emojiState.selectedIndex);
    return;
  }

  if (e.key === KEYS.enter && !hasItems) {
    // let Queup handle submitting the message
    // but we need to resize the textarea after the message is sent
    // setTimeout(() => {
    //   resizeChatTextarea();
    // }, 10);
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
  const acPreview = getAutocompletePreview();
  if (!acPreview) {
    return;
  }
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
    submitChatMessage();
    // resizeChatTextarea();
  } else if (!isModifierKey) {
    // chatNcKeyDown(e);
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
    reset();

    // Wait until both the chat input and QueUp's chat view exist before we swap
    // out QueUp's native keydown handler.
    waitFor(() => Boolean(getChatInput()))
      .then(() => {
        const chatInput = getChatInput();
        if (chatInput) {
          // need this to satisfy TypeScript that chatInput is not null.
          chatInput.addEventListener('keydown', chatInputKeydownFunc);
          chatInput.addEventListener('keyup', chatInputKeyupFunc);
          chatInput.addEventListener('click', checkInput);
        }
      })
      .catch(() => {
        logError(
          'Autocomplete: chat input never appeared; module not enabled.',
        );
      });
  },

  turnOff() {
    reset();
    const chatInput = getChatInput();
    if (chatInput) {
      chatInput.removeEventListener('keydown', chatInputKeydownFunc);
      chatInput.removeEventListener('keyup', chatInputKeyupFunc);
      chatInput.removeEventListener('click', checkInput);
    }
  },
};
