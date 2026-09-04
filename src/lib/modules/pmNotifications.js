import { notifyCheckPermission, showNotification } from '../../utils/notify';
import { settings } from '../stores/settings.svelte';
import { t } from '../stores/i18n.svelte';
import { NEW_PM_MESSAGE } from '../../events-constants';
import { getPrivateMessageButton } from '../queup.ui';
import { queupEvents } from '../../utils/events.js';

/**
 *
 * @param {import("../../types/events").NewMessageEvent} e
 * @returns
 */
function pmNotify(e) {
  if (window.dubplus.userId === e.userid) {
    return;
  }
  showNotification({
    title: t('pm-notifications.notification.title'),
    ignoreActiveTab: true,
    callback: function () {
      getPrivateMessageButton()?.click();
    },
    wait: 10000,
  });
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const pmNotifications = {
  id: 'pm-notifications',
  label: 'pm-notifications.label',
  description: 'pm-notifications.description',
  category: 'general',
  turnOn() {
    notifyCheckPermission()
      .then(() => {
        queupEvents.on(NEW_PM_MESSAGE, pmNotify);
      })
      .catch(() => {
        // turn back off until it's granted
        settings.options[this.id] = false;
      });
  },
  turnOff() {
    queupEvents.off(NEW_PM_MESSAGE, pmNotify);
  },
};
