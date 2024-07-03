const options = require('../utils/options.js');

/**
 * handles opening and closing of a menu section
 * @param  {string} id The id of the section to toggle
 */
export function toggleMenuSection(id) {
  const sectionHeader = document.getElementById(id);
  const icon = sectionHeader.querySelector('.fa');
  const sectionUL = sectionHeader.nextElementSibling;

  const menuName = sectionHeader.textContent
    .trim()
    .replace(' ', '-')
    .toLowerCase();

  const closedClass = 'dubplus-menu-section-closed';
  sectionUL.classList.toggle(closedClass);
  const isClosed = sectionUL.classList.contains(closedClass);

  icon.classList.toggle('fa-angle-down');
  icon.classList.toggle('fa-angle-right');

  options.saveOption('menu', menuName, isClosed ? 'closed' : 'open');
}

/**
 * handles the pencil icon click
 * @param {string} id
 */
export function onMenuEdit(id) {
  const mod = window.dubplus[id];
  if (!mod) {
    return;
  }
  if (mod.extra) {
    mod.extra.call(mod);
  }
}

/**
 * handles the toggling of the switch
 * @param {string} id
 */
export function onMenuToggle(id) {
  const mod = window.dubplus[id];
  if (!mod) {
    return;
  }
  if (mod.turnOn && mod.turnOff) {
    // if it was off
    if (!mod.optionState) {
      mod.turnOn.call(mod);
    } else {
      mod.turnOff.call(mod);
    }

    mod.optionState = !mod.optionState;
    options.toggleAndSave(mod.id, mod.optionState);
  }
}

/**
 * handles the action of the menu item (like full screen, etc)
 * @param {string} id
 */
export function onMenuAction(id) {
  const mod = window.dubplus[id];
  if (!mod) {
    return;
  }
  if (mod.go) {
    mod.go.call(mod);
  }
}

export function toggleMenu() {
  document.querySelector('.dubplus-menu').classList.toggle('dubplus-menu-open');
}
