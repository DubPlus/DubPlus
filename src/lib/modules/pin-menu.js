import IconLeftRight from '../svg/IconLeftRight.svelte';
import { saveSetting, settings } from '../stores/settings.svelte';

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
  id: 'pin-menu',
  label: 'pin-menu.label',
  description: 'pin-menu.description',
  category: 'user-interface',
  turnOn() {
    const side = settings.custom[this.id] || 'right';
    // get initial side from state or default to right
    document.body.classList.add(`dubplus-pin-menu-${side}`);
  },
  turnOff() {
    document.body.classList.remove('dubplus-pin-menu-left');
    document.body.classList.remove('dubplus-pin-menu-right');
  },
  secondaryAction: {
    description: 'pin-menu.secondaryAction.description',
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
