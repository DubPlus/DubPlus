import { logInfo } from '../../utils/logger';
import IconFullscreen from '../svg/IconFullscreen.svelte';

/**
 * Fullscreen video
 * Toggle fullscreen video mode
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const fullscreen = {
  id: 'fullscreen',
  label: 'fullscreen.label',
  description: 'fullscreen.description',
  category: 'user-interface',
  altIcon: IconFullscreen,
  onClick() {
    const elem = /**@type{HTMLIFrameElement}*/ (
      document.querySelector('.player_container iframe')
    );
    if (!elem) {
      logInfo('Fullscreen: No video element found');
      return;
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      // @ts-ignore
    } else if (elem.msRequestFullscreen) {
      // @ts-ignore
      elem.msRequestFullscreen();
      // @ts-ignore
    } else if (elem.mozRequestFullScreen) {
      // @ts-ignore
      elem.mozRequestFullScreen();
      // @ts-ignore
    } else if (elem.webkitRequestFullscreen) {
      // @ts-ignore
      elem.webkitRequestFullscreen();
    }
  },
};
