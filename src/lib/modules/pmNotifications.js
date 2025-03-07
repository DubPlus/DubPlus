import { notifyCheckPermission, showNotification } from '../../utils/notify';
import { settings } from '../stores/settings.svelte';
import { t } from '../stores/i18n.svelte';
import { NEW_PM_MESSAGE } from '../../events-constants';
import { getPrivateMessage, getPrivateMessageButton } from '../queup.ui';

/**
 *
 * @param {import("../../events").NewMessageEvent} e
 * @returns
 */
function pmNotify(e) {
  if (window.QueUp.session.id === e.userid) {
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
        window.QueUp.Events.bind(NEW_PM_MESSAGE, pmNotify);
      })
      .catch((err) => {
        // turn back off until it's granted
        settings.options[this.id] = false;
      });
  },
  turnOff() {
    window.QueUp.Events.unbind(NEW_PM_MESSAGE, pmNotify);
  },
};
