import { CHAT_MESSAGE } from "../../events-constants";
import { settings } from "../stores/settings.svelte";
/**
 * Custom Mentions
 *
 * When enabled, you can set custom text that triggers the mention chat sound
 * when it is mentioned in chat.
 */

/**
 *
 * @param {{message: string, user: import('../../global.d.ts').QueUpUser}} e
 */
function customMentionCheck(e) {
  if (
    settings.custom.custom_mentions &&
    // we only want to play the sound if the message is not from the current user
    window.QueUp.session.id !== e.user.userInfo.userid
  ) {
    const customMentions = settings.custom.custom_mentions.split(",");
    const shouldPlaySound = customMentions.some(function (v) {
      const reg = new RegExp("\\b" + v.trim() + "\\b", "i");
      return reg.test(e.message);
    });

    if (shouldPlaySound) {
      window.QueUp.room.chat.mentionChatSound.play();
    }
  }
}

/**
 * @type {import('./module').DubPlusModule}
 */
export const customMentions = {
  id: "custom_mentions",
  label: "custom_mentions.label",
  description: "custom_mentions.description",
  category: "General",
  custom: {
    id: "custom_mentions",
    title: "custom_mentions.modal.title",
    content: "custom_mentions.modal.content",
    placeholder: "custom_mentions.modal.placeholder",
    maxlength: 255,
  },

  turnOn() {
    window.QueUp.Events.bind(CHAT_MESSAGE, customMentionCheck);
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, customMentionCheck);
  },
};
