import { settings } from '../stores/settings.svelte';
import { t } from '../stores/i18n.svelte';
import { CHAT_MESSAGE } from '../../events-constants';
import { sendChatMessage } from '../../utils/chat-message';
/**
 * AFK -  Away from Keyboard
 * Toggles the afk auto response on/off
 * including adding a custom message
 */

let canSend = true;

/**
 *
 * @param {import("../../events").ChatMessageEvent} e
 * @returns {void}
 */
function afk_chat_respond(e) {
  if (!canSend) {
    return; // do nothing until it's back to true
  }
  const content = e.message;
  const user = window.QueUp.session.get('username');

  if (
    content.includes(`@${user}`) &&
    window.QueUp.session.id !== e.user.userInfo.userid
  ) {
    let chatMessage = '';
    if (settings.custom.afk) {
      chatMessage = `[AFK] ${settings.custom.afk}`;
    } else {
      chatMessage = `[AFK] ${t('afk.modal.placeholder')}`;
    }

    sendChatMessage(chatMessage);
    canSend = false;

    // prevent spamming. 30 seconds between messages
    setTimeout(() => {
      canSend = true;
    }, 30000);
  }
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const afk = {
  id: 'afk',
  label: 'afk.label',
  description: 'afk.description',
  category: 'general',
  turnOn() {
    window.QueUp.Events.bind(CHAT_MESSAGE, afk_chat_respond);
  },
  turnOff() {
    window.QueUp.Events.unbind(CHAT_MESSAGE, afk_chat_respond);
  },
  custom: {
    title: 'afk.modal.title',
    content: 'afk.modal.content',
    placeholder: 'afk.modal.placeholder',
    defaultValue: 'afk.modal.placeholder',
    maxlength: 255,
  },
};
