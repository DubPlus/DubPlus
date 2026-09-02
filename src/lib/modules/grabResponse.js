import { settings } from '../stores/settings.svelte';
import { sendChatMessage } from '../../utils/chat-message';
import { queupEvents, GRAB } from '../../utils/events.js';

/**
 *
 * @param {import("../../events").GrabEvent} e
 */
function onGrab(e) {
  if (e.user._id === window.dubplus.userId) {
    const message = settings.custom['grab-response'];
    if (message) {
      sendChatMessage(message);
    }
  }
}

/**
 * Grab Response
 *
 * Sends a chat message when you grab a song
 * @type {import("./module").DubPlusModule}
 */
export const grabResponse = {
  id: 'grab-response',
  label: 'grab-response.label',
  description: 'grab-response.description',
  category: 'general',
  turnOn() {
    queupEvents.on(GRAB, onGrab);
  },
  turnOff() {
    queupEvents.off(GRAB, onGrab);
  },
  custom: {
    title: 'grab-response.modal.title',
    content: 'grab-response.modal.content',
    placeholder: 'grab-response.modal.placeholder',
    maxlength: 255,
  },
};
