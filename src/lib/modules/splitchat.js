/**
 * Split Chat
 * Toggle Split chat mode
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const splitChat = {
  id: 'split-chat',
  label: 'split-chat.label',
  description: 'split-chat.description',
  category: 'user-interface',
  turnOn() {
    document.body.classList.add('dubplus-split-chat');
  },
  turnOff() {
    document.body.classList.remove('dubplus-split-chat');
  },
};
