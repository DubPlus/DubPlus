import IconLeftRight from '../svg/IconLeftRight.svelte';
import { saveSetting, settings } from '../stores/settings.svelte';
import { mobileBreakpoint } from '../queup.ui';

const MODULE_ID = 'pin-menu';
const mobileMediaQuery = window.matchMedia(mobileBreakpoint);

/**
 * Pin Menu
 *
 * This module allows you to pin the dubplus menu into
 * the UI so it is always visible. It will push over
 * the player and chat UI.
 *
 * The action button will toggle which side the menu is pinned to.
 * default is to the right side.
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const pinMenu = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'user-interface',
  desktopOnly: true,
  turnOn() {
    if (mobileMediaQuery.matches) {
      // turn immediately off if on mobile breakpoint
      saveSetting('options', MODULE_ID, false);
    } else {
      const side = settings.custom[this.id] || 'right';
      mobileMediaQuery.addEventListener('change', handleMobileBreakpoint);
      // get initial side from state or default to right
      document.body.classList.add(`dubplus-pin-menu-${side}`);
    }
  },
  turnOff() {
    cleanup();
  },
  secondaryAction: {
    description: `${MODULE_ID}.secondaryAction.description`,
    icon: IconLeftRight,
    onClick: () => {
      // Get the current side from settings
      const currentSide = settings.custom[pinMenu.id] || 'right';
      // Toggle the other side
      const side = currentSide === 'left' ? 'right' : 'left';
      document.body.classList.toggle('dubplus-pin-menu-left', side === 'left');
      document.body.classList.toggle(
        'dubplus-pin-menu-right',
        side === 'right',
      );
      // Save the new side to settings
      saveSetting('custom', pinMenu.id, side);
    },
  },
};

function cleanup() {
  document.body.classList.remove('dubplus-pin-menu-left');
  document.body.classList.remove('dubplus-pin-menu-right');
  mobileMediaQuery.removeEventListener('change', cleanup);
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
