import { logDebug, logInfo } from '../../utils/logger';
import { notifyCheckPermission, showNotification } from '../../utils/notify';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';
import { QUEUP_EVENT } from '../../events-constants';
import { playSound } from '../../utils/play-sound';
import { getUserName, onQueup, offQueup } from '../queup.v2';

const MODULE_ID = 'dj-notification';

function notify() {
  showNotification({
    title: t(`${MODULE_ID}.notification.title`),
    content: t(`${MODULE_ID}.notification.content`),
    ignoreActiveTab: true,
    wait: 10000,
  });
  playSound();
}

/**
 * Sends a notification when the your position in the queue
 *
 * examples:
 * if you want to be notified when you're next you would use position 1.
 * if you want to be notified when you started playing you would use position 0.
 */
function djNotificationCheck() {
  // we rely on the queue position to be updated in the DOM and sometimes this
  // event is fired before the DOM is updated, so we wait a bit before checking
  // the queue position
  setTimeout(() => {
    const position = window.QueUp.room.queue.getMyPosition();
    const total = window.QueUp.room.queue.getRoomQueue().length;

    // if the user is NOT in the queue, position will be missing or 0
    if (typeof position !== 'number' || position <= 0) {
      logDebug(MODULE_ID, 'User it not in the queue');
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
    // the UI will show you as position 4 of 4. So if the user sets their setting
    // to "0", that means they want to be notified when they start playing,
    // However, if someone joins the queue while you're DJ-ing, you're no longer the
    // last person in the queue anymore. But the likelyhood of someone joining just
    // after the DJs changed is low.

    // user wants a notification when they start playing (position 0)
    // to accurately get this info we check the current DJ element in the DOM
    // against the currently logged in user name
    if (parseSetting === 0) {
      const currentDj = window.QueUp.room
        .getCurrentDJ()
        ?.username?.toLowerCase();
      const user = getUserName().toLowerCase();
      if (currentDj && user && currentDj === user) {
        notify();
      } else if (position === total) {
        logDebug(MODULE_ID, 'Falling back to end of the queue check', {
          currentDj,
          user,
        });
        notify();
      }
      return;
    }

    if (position === parseSetting) {
      notify();
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
      onQueup(QUEUP_EVENT.SONG_CHANGED, djNotificationCheck);
    });
  },
  turnOff() {
    offQueup(QUEUP_EVENT.SONG_CHANGED, djNotificationCheck);
  },
};
