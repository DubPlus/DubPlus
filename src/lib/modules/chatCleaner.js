import { CHAT_MESSAGE } from "../../events-constants";
import { t } from "../stores/i18n.svelte";
import { settings } from "../stores/settings.svelte";

function chatCleanerCheck() {
  const chatMessages = document.querySelectorAll("ul.chat-main > li");

  const limit = parseInt(settings.options["chat-cleaner"]?.value, 10);

  if (!chatMessages?.length || isNaN(limit) || chatMessages.length < limit) {
    return;
  }

  for (let i = 0; i < chatMessages.length - limit; i++) {
    chatMessages[i].remove();
  }
}

/**
 * @type {import('./module').DubPlusModule}
 */
export const chatCleaner = {
  id: "chat-cleaner",
  label: "chat-cleaner.label",
  description: "chat-cleaner.description",
  category: "general",
  custom: {
    id: "chat_cleaner",
    title: "chat-cleaner.modal.title",
    content: "chat-cleaner.modal.content",
    placeholder: "500",
    maxlength: 5,
    onConfirm: (value) => {
      if (/[^0-9]+/.test(value.trim())) {
        window.alert(t("chat-cleaner.modal.validation"));
        return false;
      }
      return true;
    },
  },
  turnOn() {
    window.QueUp.Events.bind(CHAT_MESSAGE, chatCleanerCheck);
  },

  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, chatCleanerCheck);
  },
};
