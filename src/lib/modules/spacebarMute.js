import { toggleMute } from '../queup';

/**
 * @param {KeyboardEvent} e
 */
function handleMute(e) {
  const el = /**@type {HTMLElement}*/ (e.target);
  const tag = el.tagName.toLowerCase();
  if (
    e.key === ' ' &&
    tag !== 'input' &&
    tag !== 'textarea' &&
    tag !== 'button' &&
    tag !== 'a' &&
    el.getAttribute('contenteditable') !== 'true'
  ) {
    toggleMute();
  }
}

/**
 * Spacebar Mute
 * Turn on/off the ability to mute current song with the spacebar
 *
 * @type {import("./module").DubPlusModule}
 */
export const spacebarMute = {
  id: 'spacebar-mute',
  label: 'spacebar-mute.label',
  description: 'spacebar-mute.description',
  category: 'settings',
  turnOn() {
    document.addEventListener('keypress', handleMute);
  },
  turnOff() {
    document.removeEventListener('keypress', handleMute);
  },
};
