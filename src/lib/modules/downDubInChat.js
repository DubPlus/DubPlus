/**
 * Show downvotes in chat
 * only mods can use this
 */
import { isMod } from '../../utils/modcheck';
import { insertQueupChat } from '../../utils/chat-message';
import { t } from '../stores/i18n.svelte';
import { DUB } from '../../events-constants';
import {
  bindEvent,
  getActiveSongName,
  getActiveSongUserId,
  getSessionId,
  unbindEvent,
} from '../queup';

/**
 * @param {{ dubtype: string, user: { username: string } }} e
 */
function downdubWatcher(e) {
  const isUserTheDJ = getSessionId() === getActiveSongUserId();

  if (isUserTheDJ && e.dubtype === 'downdub') {
    insertQueupChat(
      'dubplus-chat-system-downdub',
      t('downdubs-in-chat.chat-message', {
        username: e.user.username,
        song_name: getActiveSongName(),
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
    if (isMod(getSessionId())) {
      bindEvent(DUB, downdubWatcher);
    }
  },

  turnOff() {
    unbindEvent(DUB, downdubWatcher);
  },
};
