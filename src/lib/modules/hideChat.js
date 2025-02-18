/**
 * Hide the Chat box and only show the video
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const hideChat = {
  id: 'hide-chat',
  label: 'hide-chat.label',
  description: 'hide-chat.description',
  category: 'user-interface',
  turnOn() {
    document.body.classList.add('dubplus-video-only');
  },
  turnOff() {
    document.body.classList.remove('dubplus-video-only');
  },
};
