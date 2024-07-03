import loadAllModules from './loadModules.js';
import css from '../utils/css.js';
import menu from './menu.js';
import snooze from '../modules/snooze.js';
import eta from '../modules/eta.js';
import {
  toggleMenuSection,
  toggleMenu,
  onMenuToggle,
  onMenuAction,
  onMenuEdit,
} from './menu-events.js';

module.exports = function () {
  window.dubplus = JSON.parse(PKGINFO);
  window.dubplus.toggleMenuSection = toggleMenuSection;
  window.dubplus.toggleMenu = toggleMenu;
  window.dubplus.onMenuToggle = onMenuToggle;
  window.dubplus.onMenuAction = onMenuAction;
  window.dubplus.onMenuEdit = onMenuEdit;

  // load our main CSS
  css.load('/css/dubplus.css', 'dubplus-css');

  // add a 'global' css class just in case we need more specificity in our css
  document.querySelector('html').classList.add('dubplus');

  // Get the opening html for the menu
  var menuContainer = menu.beginMenu();

  // load all our modules into the 'dubplus' global object
  // it also builds the menu dynamically
  // returns an object to be passed to menu.finish
  var menuObj = loadAllModules();

  // finalize the menu and add it to the UI
  menu.finishMenu(menuObj, menuContainer);

  // run non-menu related items here:
  snooze();
  eta();
};
