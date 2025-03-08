import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

// store original sound from QueUp before we alter it
let DubtrackDefaultSound;

/**
 * @type {import("./module").DubPlusModule}
 */
export const customNotificationSound = {
  id: 'custom-notification-sound',
  label: 'custom-notification-sound.label',
  description: 'custom-notification-sound.description',
  category: 'customize',
  custom: {
    title: 'custom-notification-sound.modal.title',
    content: 'custom-notification-sound.modal.content',
    placeholder: 'custom-notification-sound.modal.placeholder',
    maxlength: 500,
    validation(value) {
      // we can allow empty value which will just disable the feature
      if (value.trim() === '') return true;

      if (!window.soundManager.canPlayURL(value)) {
        return t('custom-notification-sound.modal.validation');
      }

      return true;
    },
    onConfirm(value) {
      if (!value) {
        // a blank value means the user wanted to remove the custom notification sound
        // so we default back to the QueUp sound
        window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
        settings.options[customNotificationSound.id] = false; // turn it back off
      } else {
        window.QueUp.room.chat.mentionChatSound.url = value;
      }
    },
  },
  turnOn() {
    // store original sound
    DubtrackDefaultSound = window.QueUp.room.chat.mentionChatSound.url;

    // show modal if no image is in settings
    if (settings.custom[this.id]) {
      window.QueUp.room.chat.mentionChatSound.url = settings.custom[this.id];
    }
  },

  turnOff() {
    window.QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
  },
};
