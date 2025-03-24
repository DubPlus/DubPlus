/**
 * Hide Avatars
 * Toggle hiding user avatars in the chat box.
 * @type {import("./module").DubPlusModule}
 */
export const hideAvatars = {
  id: 'hide-avatars',
  label: 'hide-avatars.label',
  description: 'hide-avatars.description',
  category: 'user-interface',
  turnOn() {
    document.body.classList.add('dubplus-hide-avatars');
  },
  turnOff() {
    document.body.classList.remove('dubplus-hide-avatars');
  },
};
