import { getChatContainer, getChatInput } from '../lib/queup.ui';
import { submitChatMessage } from '../lib/queup';
import { logError } from './logger';

/**
 * This inserts a chat message row into the chat.
 * @param {string} className
 * @param {string} textContent
 */
export function insertQueupChat(className, textContent) {
  const chatContainer = getChatContainer();
  if (!chatContainer) {
    logError(
      'insertQueupChat: Chat container not found, can not insert message',
      { className, textContent },
    );
    return;
  }
  const li = document.createElement('li');
  li.className = `dubplus-chat-system ${className}`;

  const chatDelete = document.createElement('div');
  chatDelete.className = 'chatDelete';
  chatDelete.onclick = function (e) {
    /**@type {HTMLDivElement}*/ (e.target).parentElement?.remove();
  };

  const span = document.createElement('span');
  span.className = 'icon-close';

  chatDelete.appendChild(span);
  li.appendChild(chatDelete);

  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = textContent;
  li.appendChild(text);
  chatContainer.appendChild(li);
}

/**
 * This inserts text into the chat input and programmatically
 * submits the chat message.
 * @param {string} message
 */
export function sendChatMessage(message) {
  const chatInput = getChatInput();
  if (chatInput) {
    // store original message
    const messageOriginal = chatInput.value;
    chatInput.value = message;
    submitChatMessage();
    // restore original message
    if (messageOriginal) chatInput.value = messageOriginal;
  } else {
    logError('sendChatMessage: Chat input not found, can not send message', {
      message,
    });
  }
}
