import { CHAT_MESSAGE } from '../../events-constants';
import { getChatMessages } from '../queup.ui';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

const MODULE_ID = 'chat-cleaner';

/**
 * @param {number} limit
 */
function cleanChat(limit) {
  // these will be ordered from oldest to newest
  const chatMessages = getChatMessages();

  if (!chatMessages?.length || isNaN(limit) || chatMessages.length < limit) {
    return;
  }

  // if our limit is 100 and we have 110 message, we want to remove the first 10,
  // deleting elements at index 0 -> 9
  for (let i = 0; i < chatMessages.length - limit; i++) {
    chatMessages[i].remove();
  }
}

function onChatMessage() {
  const limit = settings.custom[MODULE_ID];
  if (typeof limit === 'number') {
    cleanChat(limit);
  } else if (typeof limit === 'string' && limit.trim() !== '') {
    const num = parseInt(limit, 10);
    cleanChat(num);
  }
}

/**
 * @type {import('./module').DubPlusModule}
 */
export const chatCleaner = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'general',
  custom: {
    title: `${MODULE_ID}.modal.title`,
    content: `${MODULE_ID}.modal.content`,
    placeholder: `${MODULE_ID}.modal.placeholder`,
    maxlength: 5,
    validation(val) {
      // we can allow empty value which will just disable the feature
      if (val.trim() === '') return true;

      const num = parseInt(val, 10);
      if (val.includes('.') || isNaN(num) || num < 1) {
        return t(`${MODULE_ID}.modal.validation`);
      }
      return true;
    },
    onConfirm: (value) => {
      if (settings.options[MODULE_ID]) {
        cleanChat(parseInt(value, 10));
      }
    },
  },
  turnOn() {
    cleanChat(undefined);
    window.QueUp.Events.bind(CHAT_MESSAGE, onChatMessage);
  },

  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, onChatMessage);
  },
};
