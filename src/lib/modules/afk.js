import { settings } from "../stores/settings.svelte";
import { t } from "../stores/i18n.svelte";
import { CHAT_MESSAGE } from "../../events-constants";
/**
 * AFK -  Away from Keyboard
 * Toggles the afk auto response on/off
 * including adding a custom message
 */

let canSend = true;

/**
 *
 * @param {{message: string, user : { userInfo: { userid: string}}}} e
 * @returns {void}
 */
function afk_chat_respond(e) {
  if (!canSend) {
    return; // do nothing until it's back to true
  }
  const content = e.message;
  const user = window.QueUp.session.get("username");

  if (
    content.includes(`@ ${user}`) &&
    window.QueUp.session.id !== e.user.userInfo.userid
  ) {
    /**
     * @type {HTMLInputElement}
     */
    const chatInput = document.querySelector("#chat-txt-message");

    if (settings.custom.customAfkMessage) {
      chatInput.value = `[AFK] ${settings.custom.customAfkMessage}`;
    } else {
      chatInput.value = `[AFK] ${t("dubplus-afk.modal.placeholder")}`;
    }

    window.QueUp.room.chat.sendMessage();
    canSend = false;

    // prevent spamming. 30 seconds between messages
    setTimeout(() => {
      canSend = true;
    }, 30000);
  }
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const afk = {
  id: "dubplus-afk",
  label: "dubplus-afk.label",
  description: "dubplus-afk.description",
  category: "General",
  turnOn() {
    window.QueUp.Events.bind(CHAT_MESSAGE, afk_chat_respond);
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, afk_chat_respond);
  },
  custom: {
    id: "customAfkMessage",
    title: "dubplus-afk.modal.title",
    content: "dubplus-afk.modal.content",
    placeholder: "dubplus-afk.modal.placeholder",
    maxlength: 255,
  },
};
