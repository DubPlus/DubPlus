/**
 * Flip Interface
 *
 * This module allows you to swap the position of the chat and video elements.
 */

import { logDebug, logError } from '../../utils/logger';
import { waitFor } from '../../utils/waitFor';

/**
 * @type {import("./module").DubPlusModule}
 */
export const flipInterface = {
  id: 'flip-interface',
  label: 'flip-interface.label',
  description: 'flip-interface.description',
  category: 'user-interface',
  turnOn() {
    logDebug('flipInterface: turning on');
    waitFor(() => !!document.querySelector('main')?.parentElement)
      .then(() => {
        const el = document.querySelector('main')?.parentElement;
        if (el) {
          el.style.flexDirection = 'row-reverse';
          document.body.classList.add('dubplus-flip-interface');
        }
      })
      .catch(() => {
        logError('flipInterface: could not find main element to flip');
      });
  },
  turnOff() {
    document.body.classList.remove('dubplus-flip-interface');
    const el = document.querySelector('main')?.parentElement;
    if (el) {
      el.style.flexDirection = '';
    }
  },
};
