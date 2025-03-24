import { GRAB } from '../../events-constants';
import { settings } from '../stores/settings.svelte';
import { sendChatMessage } from '../../utils/chat-message';

/**
 *
 * @param {import("../../events").GrabEvent} e
 */
function onGrab(e) {
  if (e.user._id === window.QueUp.session.id) {
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
    window.QueUp.Events.bind(GRAB, onGrab);
  },
  turnOff() {
    window.QueUp.Events.unbind(GRAB, onGrab);
  },
  custom: {
    title: 'grab-response.modal.title',
    content: 'grab-response.modal.content',
    placeholder: 'grab-response.modal.placeholder',
    maxlength: 255,
  },
};
