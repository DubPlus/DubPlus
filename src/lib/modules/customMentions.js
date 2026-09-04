/**
 * Custom Mentions
 *
 * When enabled, you can set custom text that triggers the mention chat sound
 * when it is mentioned in chat.
 *
 * This works with or without the "@". So if you set your custom mention to
 * be dubplus, it will trigger the sound when someone says "dubplus" or "@dubplus".
 */
import { settings } from '../stores/settings.svelte';
import { playSound } from '../../utils/play-sound.js';
import { queupEvents, CHAT_MESSAGE } from '../../utils/events.js';
import { getMentionRegex, split } from '../../utils/mention-helpers.js';

const MODULE_ID = 'custom-mentions';

/**
 * @param {import("../../types/events").ChatMessageEvent} e
 */
function customMentionCheck(e) {
  const enabled = settings.options[MODULE_ID];
  const custom = settings.custom[MODULE_ID];
  if (
    typeof custom === 'string' &&
    custom.trim() !== '' &&
    enabled &&
    // we only want to play the sound if the message is not from the current user
    window.dubplus.userId !== e.user.userInfo.userid
  ) {
    const namesForRegex = split(custom);

    if (namesForRegex.length === 0) return;

    const reg = getMentionRegex(namesForRegex);
    const shouldPlaySound = reg.test(e.message);

    if (shouldPlaySound) {
      playSound();
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
    queupEvents.on(CHAT_MESSAGE, customMentionCheck);
  },
  turnOff() {
    queupEvents.off(CHAT_MESSAGE, customMentionCheck);
  },
};
