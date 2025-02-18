/**
 * Show downvotes in chat
 * only mods can use this
 */

import { insertQueupChat } from '../../utils/chat-message';
import { t } from '../stores/i18n.svelte';

function grabChatWatcher(e) {
  const isUserTheDJ =
    window.QueUp.session.id ===
    window.QueUp.room.player.activeSong.attributes.song.userid;

  // The owner of the room can set if grabs show in chat or not. If it is
  // disabled, we only show grabs in chat if the user is the DJ.
  if (isUserTheDJ) {
    insertQueupChat(
      'dubplus-chat-system-grab',
      t('grabs-in-chat.chat-message', {
        username: e.user.username,
        song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name,
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
    if (!window.QueUp.room.model.get('displayUserGrab')) {
      window.QueUp.Events.bind(
        'realtime:room_playlist-queue-update-grabs',
        grabChatWatcher,
      );
    }
  },

  turnOff() {
    if (!window.QueUp.room.model.get('displayUserGrab')) {
      window.QueUp.Events.unbind(
        'realtime:room_playlist-queue-update-grabs',
        grabChatWatcher,
      );
    }
  },
};
