import { t } from "../stores/i18n.svelte";
import { settings } from "../stores/settings.svelte";

// store original sound from QueUp before we alter it
const DubtrackDefaultSound = window.QueUp.room.chat.mentionChatSound.url;

/**
 * @type {import("./module").DubPlusModule}
 */
export const customNotificationSound = {
  id: "custom-notification-sound",
  label: "custom-notification-sound.label",
  description: "custom-notification-sound.description",
  category: "customize",
  custom: {
    id: "custom-notification-sound",
    title: "custom-notification-sound.modal.title",
    content: "custom-notification-sound.modal.content",
    placeholder: "custom-notification-sound.modal.placeholder",
    maxlength: 500,
    validation(value) {
      if (!value) {
        // we allow blank value to remove the custom notification sound
        return true;
      }
      if (!window.soundManager.canPlayURL(value)) {
        return t("custom-notification-sound.modal.validation");
      }

      return true;
    },
    onConfirm(value) {
      if (!value) {
        // a blank value means the user wanted to remove the custom notification sound
        // so we default back to the QueUp sound
        window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
        settings.options[this.id].enabled = false; // turn it back off
      } else {
        window.QueUp.room.chat.mentionChatSound.url = value;
      }
    },
  },
  turnOn() {
    // show modal if no image is in settings
    if (settings.options[this.id]?.value) {
      window.QueUp.room.chat.mentionChatSound.url =
        settings.options[this.id]?.value;
    }
  },

  turnOff() {
    window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
  },
};
