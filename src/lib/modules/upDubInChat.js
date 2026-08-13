/**
 * Show downvotes in chat
 * only mods can use this
 */

import { DUB } from '../../events-constants';
import { insertQueupChat } from '../../utils/chat-message';
import { t } from '../stores/i18n.svelte';
import {
  bindEvent,
  getActiveSongName,
  getActiveSongUserId,
  getSessionId,
  unbindEvent,
} from '../queup';

/**
 *
 * @param {import('../../events').DubEvent} e
 */
function updubWatcher(e) {
  const isUserTheDJ = getSessionId() === getActiveSongUserId();

  if (isUserTheDJ && e.dubtype === 'updub') {
    insertQueupChat(
      'dubplus-chat-system-updub',
      t('updubs-in-chat.chat-message', {
        username: e.user.username,
        song_name: getActiveSongName(),
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
    bindEvent(DUB, updubWatcher);
  },
  turnOff() {
    unbindEvent(DUB, updubWatcher);
  },
};
