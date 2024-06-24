import { notifyCheckPermission, showNotification } from "../../utils/notify";
import { settings } from "../stores/settings.svelte";
import { t } from "../stores/i18n.svelte";
import { NEW_PM_MESSAGE } from "../../events-constants";

/**
 *
 * @param {{userid: string, messageid: string}} e
 * @returns
 */
function pmNotify(e) {
  const userid = window.QueUp.session.get("_id");
  if (userid === e.userid) {
    return;
  }
  showNotification({
    title: t("pm-notifications.notification.title"),
    ignoreActiveTab: true,
    callback: function () {
      /**
       * @type {HTMLSpanElement}
       */
      const openPmButton = document.querySelector(".user-messages");
      openPmButton?.click();
      setTimeout(function () {
        /**
         * @type {HTMLLIElement}
         */
        const messageItem = document.querySelector(
          `.message-item[data-messageid="${e.messageid}"]`
        );
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
  id: "pm-notifications",
  label: "pm-notifications.label",
  description: "pm-notifications.description",
  category: "general",
  turnOn() {
    notifyCheckPermission()
      .then(() => {
        window.QueUp.Events.bind(NEW_PM_MESSAGE, pmNotify);
      })
      .catch((err) => {
        // turn back off until it's granted
        settings.options[this.id].enabled = false;
      });
  },
  turnOff() {
    window.QueUp.Events.unbind(NEW_PM_MESSAGE, pmNotify);
  },
};
