/* global Dubtrack */

import { notifyCheckPermission, showNotification } from "../../utils/notify";
import { settings } from "../stores/settings.svelte";
import { activeTabState } from "../stores/activeTabState.svelte";
import { CHAT_MESSAGE } from "../../events-constants";

function notifyOnMention(e) {
  const content = e.message;
  const user = window.QueUp.session.get("username").toLowerCase();
  let mentionTriggers = ["@" + user];

  // is custom mentions enabled AND user has entered text in the custom mentions modal
  if (settings.options.custom_mentions && settings.custom.custom_mentions) {
    //add custom mention triggers to array
    mentionTriggers = mentionTriggers
      .concat(settings.custom.custom_mentions.split(","))
      .map((v) => v.trim());
  }

  const mentionTriggersTest = mentionTriggers.some(function (v) {
    const reg = new RegExp("\\b" + v + "\\b", "i");
    return reg.test(content);
  });

  if (
    mentionTriggersTest &&
    !activeTabState.isActive &&
    window.QueUp.session.id !== e.user.userInfo.userid
  ) {
    showNotification({
      title: `Message from ${e.user.username}`,
      content: content,
    });
  }
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const chatNotifications = {
  id: "mention_notifications",
  label: "mention_notifications.label",
  description: "mention_notifications.description",
  category: "General",

  turnOn() {
    notifyCheckPermission()
      .then(() => {
        window.QueUp.Events.bind(CHAT_MESSAGE, notifyOnMention);
      })
      .catch(() => {
        // turn back off until it's granted
        settings.options[this.id] = false;
      });
  },

  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, notifyOnMention);
  },
};
