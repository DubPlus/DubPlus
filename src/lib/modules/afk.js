import { settings } from "../settings.svelte";
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
      chatInput.value = "[AFK] I'm not here right now.";
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
  label: "AFK Auto-respond",
  description: "Toggle Away from Keyboard and customize AFK message.",
  category: "General",
  turnOn() {
    window.QueUp.Events.bind("realtime:chat-message", afk_chat_respond);
  },
  turnOff() {
    window.QueUp.Events.unbind("realtime:chat-message", afk_chat_respond);
  },
  custom: {
    id: "customAfkMessage",
    title: "Custom AFK Message",
    content: "Enter a custom Away From Keyboard [AFK] message here",
    placeholder: "Be right back!",
    maxlength: 255,
  },
};
