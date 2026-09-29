import { settings } from '../stores/settings.svelte';
import { sendChatMessage } from '../../utils/chat-message';
import { REALTIME_EVENT } from '../../events-constants.js';
import { getUserId, onRealtime, offRealtime } from '../queup.v2';

/**
 *
 * @param {import("../../types/events").GrabEvent} e
 */
function onGrab(e) {
  if (e.user._id === getUserId()) {
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
    onRealtime(REALTIME_EVENT.GRAB, onGrab);
  },
  turnOff() {
    offRealtime(REALTIME_EVENT.GRAB, onGrab);
  },
  custom: {
    title: 'grab-response.modal.title',
    content: 'grab-response.modal.content',
    placeholder: 'grab-response.modal.placeholder',
    maxlength: 255,
  },
};
