import { CHAT_MESSAGE } from '../../events-constants';
import { settings } from '../stores/settings.svelte';
/**
 * Custom Mentions
 *
 * When enabled, you can set custom text that triggers the mention chat sound
 * when it is mentioned in chat.
 *
 * This works with or without the "@". So if you set your custom mention to
 * be dubplus, it will trigger the sound when someone says "dubplus" or "@dubplus".
 */

const MODULE_ID = 'custom-mentions';

/**
 * @param {import("../../events").ChatMessageEvent} e
 */
function customMentionCheck(e) {
  const enabled = settings.options[MODULE_ID];
  const custom = settings.custom[MODULE_ID];
  if (
    enabled &&
    // we only want to play the sound if the message is not from the current user
    window.QueUp.session.id !== e.user.userInfo.userid
  ) {
    const shouldPlaySound = custom.split(',').some(function (v) {
      const reg = new RegExp(`\\b@?${v.trim()}\\b`, 'ig');
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
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'general',
  custom: {
    title: `${MODULE_ID}.modal.title`,
    content: `${MODULE_ID}.modal.content`,
    placeholder: `${MODULE_ID}.modal.placeholder`,
    maxlength: 255,
  },

  turnOn() {
    window.QueUp.Events.bind(CHAT_MESSAGE, customMentionCheck);
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, customMentionCheck);
  },
};
