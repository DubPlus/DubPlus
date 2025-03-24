import { PLAYLIST_UPDATE } from '../../events-constants';
import { logError, logInfo } from '../../utils/logger';
import { notifyCheckPermission, showNotification } from '../../utils/notify';
import { getQueuePosition, getQueueTotal } from '../queup.ui';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

const MODULE_ID = 'dj-notification';

/**
 * Sends a notification when the your position in the queue
 *
 * examples:
 * if you want to be notified when you're next you would use position 1.
 * if you want to be notified when you started playing you would use position 0.
 * @param {{ startTime: number }} [e]
 * @returns {void}
 */
function djNotificationCheck(e) {
  if (e && e.startTime > 2) return;

  // we rely on the queue position to be updated in the DOM and sometimes this
  // event is fired before the DOM is updated, so we wait a bit before checking
  // the queue position
  setTimeout(() => {
    const quePositionText = getQueuePosition()?.textContent?.trim();
    if (!quePositionText) {
      // if the user is NOT in the queue then we don't need to do anything
      return;
    }

    const position = parseInt(quePositionText, 10);
    if (isNaN(position)) {
      logError(MODULE_ID, 'Could not parse current position:', quePositionText);
      return;
    }

    let parseSetting = parseInt(settings.custom[MODULE_ID], 10);
    if (isNaN(parseSetting)) {
      // default to 2
      parseSetting = 2;
      logInfo(MODULE_ID, 'Could not parse setting, defaulting to 2');
    }

    // when you are actively DJing, the UI will show you at the end of the
    // the queue total. So if 4 people are in the queue and you are DJing,
    // the UI will show you as position 4 of 4. If user sets the notification
    // threshold to 0, we need to check if the queue total is equal to the position
    // to trigger the notification

    const queueTotalText = getQueueTotal()?.textContent?.trim();
    if (
      (queueTotalText === quePositionText && parseSetting === 0) ||
      position === parseSetting
    ) {
      showNotification({
        title: t(`${MODULE_ID}.notification.title`),
        content: t(`${MODULE_ID}.notification.content`),
        ignoreActiveTab: true,
        wait: 10000,
      });
      window.QueUp.room.chat.mentionChatSound.play();
      return;
    }
  }, 1000);
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const djNotification = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'general',
  custom: {
    title: `${MODULE_ID}.modal.title`,
    content: `${MODULE_ID}.modal.content`,
    placeholder: '2',
    defaultValue: '2',
    maxlength: 3,
    validation(val) {
      // we can allow empty value which will just disable the feature
      if (val.trim() === '') return true;

      const num = parseInt(val, 10);
      if (val.includes('.') || isNaN(num) || num < 0) {
        return t(`${MODULE_ID}.modal.validation`);
      }
      return true;
    },
    onConfirm: () => {
      if (settings.options[MODULE_ID]) {
        djNotificationCheck();
      }
    },
  },
  turnOn() {
    notifyCheckPermission().then(() => {
      djNotificationCheck();
      window.QueUp.Events.bind(PLAYLIST_UPDATE, djNotificationCheck);
    });
  },
  turnOff() {
    window.QueUp.Events.unbind(PLAYLIST_UPDATE, djNotificationCheck);
  },
};
