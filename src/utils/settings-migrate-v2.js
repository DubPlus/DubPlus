/**
 * @typedef {object} NewSettings
 * @property {{[key: string]: {enabled: boolean; value?: string}}} options
 * @property {{[key: string]: string}} menu will be either "open" or "closed"
 * @property {string} srcRoot
 */

import { logError, logInfo } from "./logger";

/**
 * @typedef {object} OldSettings
 * @property {{[key: string]: boolean}} options
 * @property {{[key: string]: string}} menu will be either "open" or "closed"
 * @property {{[key: string]: string}} custom
 * @property {string} srcRoot
 */

const optionsKeyMap = {
  "dubplus-autovote": "autovote",
  "dubplus-afk": "afk",
  "dubplus-emotes": "emotes",
  "dubplus-autocomplete": "autocomplete",
  custom_mentions: "custom-mentions",
  "chat-cleaner": "chat-cleaner",
  mention_notifications: "mention-notifications",
  dubplus_pm_notifications: "pm-notifications",
  dj_notification: "dj-notification",
  "dubplus-dubs-hover": "dubs-hover",
  "dubplus-downdubs": "downdubs-in-chat",
  "dubplus-updubs": "updubs-in-chat",
  "dubplus-grabschat": "grabs-in-chat",
  "dubplus-snow": "snow",
  "dubplus-rain": "rain",
  "dubplus-fullscreen": "fullscreen",
  "dubplus-split-chat": "split-chat",
  "dubplus-video-only": "hide-chat",
  "dubplus-chat-only": "hide-video",
  "dubplus-hide-avatars": "hide-avatars",
  "dubplus-hide-bg": "hide-bg",
  "dubplus-show-timestamp": "show-timestamps",
  "dubplus-spacebar-mute": "spacebar-mute",
  warn_redirect: "warn-redirect",
  "dubplus-comm-theme": "community-theme",
  "dubplus-custom-css": "custom-css",
  "dubplus-custom-bg": "custom-bg",
  "dubplus-custom-notification-sound": "custom-notification-sound",
};

const customKeyMap = {
  customAfkMessage: optionsKeyMap["dubplus-afk"],
  custom_mentions: optionsKeyMap["custom_mentions"],
  chat_cleaner: optionsKeyMap["chat-cleaner"],
  dj_notification: optionsKeyMap["dj_notification"],
  css: optionsKeyMap["dubplus-custom-css"],
  bg: optionsKeyMap["dubplus-custom-bg"],
  notificationSound: optionsKeyMap["dubplus-custom-notification-sound"],
  "dubplus-custom-notification-sound":
    optionsKeyMap["dubplus-custom-notification-sound"],
};

/**
 *
 * @param {OldSettings} oldSettings
 * @returns {NewSettings}
 */
export function migrate(oldSettings) {
  logInfo("Old Settings", oldSettings);

  /**
   * @type {NewSettings}
   */
  const newOptions = {
    options: {},
    menu: { ...oldSettings.menu },
    srcRoot: oldSettings.srcRoot,
  };

  for (const [oldKey, boolValue] of Object.entries(oldSettings.options)) {
    const newKey = optionsKeyMap[oldKey];
    try {
      newOptions.options[newKey] = { enabled: boolValue };
    } catch (e) {
      logError(
        "Error converting options",
        e.message,
        oldKey,
        newKey,
        boolValue
      );
    }
  }

  for (const [oldKey, stringValue] of Object.entries(oldSettings.custom)) {
    const newKey = customKeyMap[oldKey];
    try {
      newOptions.options[newKey] = {
        enabled: newOptions.options[newKey]?.enabled || false,
        value: stringValue,
      };
    } catch (e) {
      logError(
        "Error converting custom",
        e.message,
        oldKey,
        newKey,
        stringValue
      );
    }
  }

  return newOptions;
}
