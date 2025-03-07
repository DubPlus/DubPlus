/**
 * Show downvotes in chat
 * only mods can use this
 */

import { DUB } from '../../events-constants';
import { insertQueupChat } from '../../utils/chat-message';
import { t } from '../stores/i18n.svelte';

function updubWatcher(e) {
  const isUserTheDJ =
    window.QueUp.session.id ===
    window.QueUp.room.player.activeSong.attributes.song.userid;

  if (isUserTheDJ && e.dubtype === 'updub') {
    insertQueupChat(
      'dubplus-chat-system-updub',
      t('updubs-in-chat.chat-message', {
        username: e.user.username,
        song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name,
      }),
    );
  }
}

export const upDubInChat = {
  id: 'updubs-in-chat',
  label: 'updubs-in-chat.label',
  description: 'updubs-in-chat.description',
  category: 'general',
  turnOn() {
    window.QueUp.Events.bind(DUB, updubWatcher);
  },
  turnOff() {
    window.QueUp.Events.unbind(DUB, updubWatcher);
  },
};
