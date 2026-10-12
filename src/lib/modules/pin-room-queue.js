import { logError } from '../../utils/logger';
import { waitFor } from '../../utils/waitFor';
import {
  getRoomQueueButton,
  getRoomQueueContainer,
  getRoomQueueCloseButton,
} from '../queup.ui';
import { saveSetting } from '../stores/settings.svelte';

const MODULE_ID = 'pin-room-queue';
const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

/**
 * Pin Room Queue
 *
 * When this is turned on it sets up 2 event listeners
 * 1 - adds a click listener to the room queue close button
 * 2 - adds a media query listener for mobile breakpoints
 *
 * After this is turned on, there are multiple ways this can be turned off and each
 * way has to properly clean up the event listeners
 *
 * There are 4 things that need to cleaned up but not all 4 need to be done for all paths.
 * 1. Room queue close button click listener
 * 2. Media query listener for mobile breakpoints
 * 3. Virtually click the close button to close and reset the room queue
 * 4. Save the setting to turn off the switch in the menu
 *
 * Users manually turns it off in the Dub+ menu
 * - 1, 2, 3
 *
 * User clicks on the room queue close button
 * - 2, 4
 *
 * User changes width to a mobile breakpoint
 * - 1,2,3,4
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const pinRoomQueue = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'user-interface',
  async turnOn() {
    try {
      if (mobileMediaQuery.matches) {
        // turn immediately off if on mobile breakpoint
        saveSetting('options', MODULE_ID, false);
      } else {
        mobileMediaQuery.addEventListener('change', handleMobileBreakpoint);
        getRoomQueueButton()?.click();
        await waitFor(() => !!getRoomQueueContainer());
        const container = getRoomQueueContainer();
        container?.classList.remove('h-full');
        container?.setAttribute('data-room-queue', 'true');
        getRoomQueueCloseButton()?.addEventListener(
          'click',
          userClickedCloseButton,
          { once: true },
        );
      }
    } catch (error) {
      logError('pinRoomQueue', error);
    }
  },
  turnOff() {
    cleanup();
  },
};

function cleanup() {
  getRoomQueueCloseButton()?.removeEventListener(
    'click',
    userClickedCloseButton,
  );
  mobileMediaQuery.removeEventListener('change', handleMobileBreakpoint);
  getRoomQueueCloseButton()?.click();
}

/**
 * @param {MediaQueryListEvent} event
 */
function handleMobileBreakpoint(event) {
  if (event.matches) {
    cleanup();
    saveSetting('options', MODULE_ID, false);
  }
}

function userClickedCloseButton() {
  mobileMediaQuery.removeEventListener('change', handleMobileBreakpoint);
  saveSetting('options', MODULE_ID, false);
}
