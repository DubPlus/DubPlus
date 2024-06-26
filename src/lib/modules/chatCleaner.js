import { CHAT_MESSAGE } from "../../events-constants";
import { t } from "../stores/i18n.svelte";
import { settings } from "../stores/settings.svelte";

const MODULE_ID = "chat-cleaner";

/**
 * @param {string} n
 */
function chatCleanerCheck(n) {
  // these will be ordered from oldest to newest
  const chatMessages = document.querySelectorAll("ul.chat-main > li");

  const limit = parseInt(n ?? settings.custom[MODULE_ID], 10);

  if (!chatMessages?.length || isNaN(limit) || chatMessages.length < limit) {
    return;
  }

  // if our limit is 100 and we have 110 message, we want to remove the first 10,
  // deleting elements at index 0 -> 9
  for (let i = 0; i < chatMessages.length - limit; i++) {
    chatMessages[i].remove();
  }
}

/**
 * @type {import('./module').DubPlusModule}
 */
export const chatCleaner = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: "general",
  custom: {
    title: `${MODULE_ID}.modal.title`,
    content: `${MODULE_ID}.modal.content`,
    placeholder: `${MODULE_ID}.modal.placeholder`,
    maxlength: 5,
    validation(val) {
      if (/[^0-9]+/g.test(val)) {
        return t(`${MODULE_ID}.modal.validation`);
      }
      return true;
    },
    onConfirm: (value) => {
      if (settings.options[MODULE_ID]) {
        chatCleanerCheck(value);
      }
    },
  },
  turnOn() {
    chatCleanerCheck(undefined);
    window.QueUp.Events.bind(CHAT_MESSAGE, chatCleanerCheck);
  },

  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, chatCleanerCheck);
  },
};
