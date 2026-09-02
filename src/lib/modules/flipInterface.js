/**
 * Flip Interface
 *
 * This module allows you to swap the position of the chat and video elements.
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const flipInterface = {
  id: 'flip-interface',
  label: 'flip-interface.label',
  description: 'flip-interface.description',
  category: 'user-interface',
  turnOn() {
    document.body.classList.add('dubplus-flip-interface');
  },
  turnOff() {
    document.body.classList.remove('dubplus-flip-interface');
  },
};
