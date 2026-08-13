/**
 * Show downvotes in chat
 * only mods can use this
 */

import { insertQueupChat } from '../../utils/chat-message';
import { t } from '../stores/i18n.svelte';
import {
  bindEvent,
  getActiveSongName,
  getActiveSongUserId,
  getDisplayUserGrab,
  getSessionId,
  unbindEvent,
} from '../queup';

/**
 * @param {{ user: { username: string } }} e
 */
function grabChatWatcher(e) {
  const isUserTheDJ = getSessionId() === getActiveSongUserId();

  // The owner of the room can set if grabs show in chat or not. If it is
  // disabled, we only show grabs in chat if the user is the DJ.
  if (isUserTheDJ) {
    insertQueupChat(
      'dubplus-chat-system-grab',
      t('grabs-in-chat.chat-message', {
        username: e.user.username,
        song_name: getActiveSongName(),
      }),
    );
  }
}

export const grabsInChat = {
  id: 'grabs-in-chat',
  label: 'grabs-in-chat.label',
  description: 'grabs-in-chat.description',
  category: 'general',
  turnOn() {
    if (!getDisplayUserGrab()) {
      bindEvent('realtime:room_playlist-queue-update-grabs', grabChatWatcher);
    }
  },

  turnOff() {
    if (!getDisplayUserGrab()) {
      unbindEvent('realtime:room_playlist-queue-update-grabs', grabChatWatcher);
    }
  },
};
