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
  const customMentionsSettings = settings.options["custom-mentions"];
  if (
    customMentionsSettings?.enabled &&
    // we only want to play the sound if the message is not from the current user
    window.QueUp.session.id !== e.user.userInfo.userid
  ) {
    const customMentions = customMentionsSettings.value.split(",");
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
  id: "custom-mentions",
  label: "custom-mentions.label",
  description: "custom-mentions.description",
  category: "general",
  custom: {
    id: "custom-mentions",
    title: "custom-mentions.modal.title",
    content: "custom-mentions.modal.content",
    placeholder: "custom-mentions.modal.placeholder",
    maxlength: 255,
  },

  turnOn() {
    window.QueUp.Events.bind(CHAT_MESSAGE, customMentionCheck);
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, customMentionCheck);
  },
};
