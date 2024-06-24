import { PLAYLIST_UPDATE } from "../../events-constants";
import { logError, logInfo } from "../../utils/logger";
import { showNotification } from "../../utils/notify";
import { t } from "../stores/i18n.svelte";
import { settings } from "../stores/settings.svelte";

/**
 * Sends a notification when the your position in the queue
 * is equal (or lower) than the value user set in the settings.
 *
 * examples:
 * if you want to be notified when you're next you would use position 1.
 * if you want to be notified when you started playing you would use position 0.
 * @param {{startTime: number}} e
 * @returns
 */
function djNotificationCheck(e) {
  const currentPosition = parseInt(
    document.querySelector(".queue-position")?.textContent,
    10
  );
  if (isNaN(currentPosition)) {
    // this is important. if we can't parse it then we can't do anything
    logError(
      "dj-notification",
      "Could not parse current position:",
      currentPosition
    );
    return;
  }

  let parseSetting = parseInt(settings.options["dj-notification"].value, 10);
  if (isNaN(parseSetting)) {
    // if this is NaN then we should default to 2
    parseSetting = 2;
    logInfo("djNotification", "Could not parse setting, defaulting to 2");
  }

  if (currentPosition <= parseSetting) {
    showNotification({
      title: t("dj-notification.notification.title"),
      content: t("dj-notification.notification.content"),
      ignoreActiveTab: true,
      wait: 10000,
    });
    window.QueUp.room.chat.mentionChatSound.play();
  }
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const djNotification = {
  id: "dj-notification",
  label: "dj-notification.label",
  description: "dj-notification.description",
  category: "general",
  custom: {
    id: "dj-notification",
    title: "dj-notification.modal.title",
    content: "dj-notification.modal.content",
    placeholder: "2",
    maxlength: 2,
    onConfirm: (value) => {
      if (/[^0-9]+/.test(value.trim())) {
        window.alert(t("dj-notification.modal.validation"));
        return false;
      }
      return true;
    },
  },
  turnOn() {
    window.QueUp.Events.bind(PLAYLIST_UPDATE, djNotificationCheck);
  },
  turnOff() {
    window.QueUp.Events.unbind(PLAYLIST_UPDATE, djNotificationCheck);
  },
};
