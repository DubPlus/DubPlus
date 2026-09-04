import { notifyCheckPermission, showNotification } from '../../utils/notify';
import { settings } from '../stores/settings.svelte';
import { activeTabState } from '../stores/activeTabState.svelte';
import { queupEvents, CHAT_MESSAGE } from '../../utils/events.js';
import { getMentionRegex } from '../../utils/mention-helpers.js';
import { getUserName } from '../queup.v2';

/**
 *
 * @param {import("../../types/events").ChatMessageEvent} e
 */
function notifyOnMention(e) {
  const content = e.message;
  const user = getUserName();
  let mentionTriggers = [user];

  // is custom mentions enabled AND user has entered text in the custom mentions modal
  if (
    settings.options['custom-mentions'] &&
    settings.custom['custom-mentions']
  ) {
    //add custom mention triggers to array
    mentionTriggers = mentionTriggers
      .concat(settings.custom['custom-mentions'].split(','))
      .map((v) => v.trim())
      .filter(Boolean);
  }

  const bigRegex = getMentionRegex(mentionTriggers);

  if (
    bigRegex.test(content) &&
    !activeTabState.isActive && // notifications only if you're not focused on the tab
    window.dubplus.userId !== e.user.userInfo.userid
  ) {
    showNotification({
      title: `Message from ${e.user.username}`,
      content,
    });
  }
}

/**
 * Mention Notifications
 * When a chat message comes in that contains a @mention to the user's username,
 * a browser notification will be triggered.
 * @type {import("./module").DubPlusModule}
 */
export const mentionNotifications = {
  id: 'mention-notifications',
  label: 'mention-notifications.label',
  description: 'mention-notifications.description',
  category: 'general',

  turnOn() {
    notifyCheckPermission()
      .then(() => {
        queupEvents.on(CHAT_MESSAGE, notifyOnMention);
      })
      .catch(() => {
        // turn back off until it's granted
        settings.options[this.id] = false;
      });
  },

  turnOff() {
    queupEvents.off(CHAT_MESSAGE, notifyOnMention);
  },
};
