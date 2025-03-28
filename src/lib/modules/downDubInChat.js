/**
 * Show downvotes in chat
 * only mods can use this
 */
import { isMod } from '../../utils/modcheck';
import { insertQueupChat } from '../../utils/chat-message';
import { t } from '../stores/i18n.svelte';
import { DUB } from '../../events-constants';

function downdubWatcher(e) {
  const isUserTheDJ =
    window.QueUp.session.id ===
    window.QueUp.room.player.activeSong.attributes.song.userid;

  if (isUserTheDJ && e.dubtype === 'downdub') {
    insertQueupChat(
      'dubplus-chat-system-downdub',
      t('downdubs-in-chat.chat-message', {
        username: e.user.username,
        song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name,
      }),
    );
  }
}

export const downdubsInChat = {
  id: 'downdubs-in-chat',
  label: 'downdubs-in-chat.label',
  description: 'downdubs-in-chat.description',
  category: 'general',
  modOnly: true,
  turnOn() {
    if (isMod(window.QueUp.session.id)) {
      window.QueUp.Events.bind(DUB, downdubWatcher);
    }
  },

  turnOff() {
    window.QueUp.Events.unbind(DUB, downdubWatcher);
  },
};
