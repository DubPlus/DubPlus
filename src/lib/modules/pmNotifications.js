import { notifyCheckPermission, showNotification } from '../../utils/notify';
import { settings } from '../stores/settings.svelte';
import { t } from '../stores/i18n.svelte';
import { NEW_PM_MESSAGE } from '../../events-constants';
import { getPrivateMessage, getPrivateMessageButton } from '../queup.ui';
import { bindEvent, getSessionId, unbindEvent } from '../queup';

/**
 *
 * @param {import("../../events").NewMessageEvent} e
 * @returns
 */
function pmNotify(e) {
  if (getSessionId() === e.userid) {
    return;
  }
  showNotification({
    title: t('pm-notifications.notification.title'),
    ignoreActiveTab: true,
    callback: function () {
      const openPmButton = getPrivateMessageButton();
      openPmButton?.click();
      setTimeout(function () {
        const messageItem = getPrivateMessage(e.messageid);
        messageItem?.click();
      }, 500);
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
        bindEvent(NEW_PM_MESSAGE, pmNotify);
      })
      .catch(() => {
        // turn back off until it's granted
        settings.options[this.id] = false;
      });
  },
  turnOff() {
    unbindEvent(NEW_PM_MESSAGE, pmNotify);
  },
};
