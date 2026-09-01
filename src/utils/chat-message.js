import { getChatInput } from '../lib/queup.ui';
import { logError, logDebug } from './logger';

/**
 *
 * @param {HTMLElement} el
 * @param {string} text
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
function replaceContent(el, text) {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  return text
    ? document.execCommand('insertText', false, text)
    : document.execCommand('delete');
}

/**
 *
 * @param {HTMLElement} el
 * @param {string} original
 * @param {number} [attempts]
 * @returns {void}
 */
function restoreWhenCleared(el, original, attempts = 20) {
  if (attempts <= 0) return;
  if (el.textContent === '' || el.textContent !== original) {
    // hasn't cleared yet if it still holds the sent message
  }
  requestAnimationFrame(() => {
    if (el.textContent.trim() === '') {
      replaceContent(el, original);
    } else {
      restoreWhenCleared(el, original, attempts - 1);
    }
  });
}

/**
 * Inserts text into the chat input and programmatically submits it.
 * @param {string} message
 */
export function sendChatMessage(message) {
  const chatInput = getChatInput();
  if (!chatInput) {
    logError('sendChatMessage: Chat input not found, can not send message', {
      message,
    });
    return;
  }

  const messageOriginal = chatInput.textContent;

  if (!replaceContent(chatInput, message)) {
    logError('sendChatMessage: insertText failed', { message });
    return;
  }

  logDebug('sendChatMessage: sending message', { message });
  setTimeout(() => {
    chatInput.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
        composed: true,
      }),
    );
  }, 0);

  if (messageOriginal) restoreWhenCleared(chatInput, messageOriginal);
}
