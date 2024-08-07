const options = require('../utils/options.js');
const dubPlus_modules = require('../modules/index.js');
const settings = require('../lib/settings.js');
const menu = require('../lib/menu.js');

var menuObj = {
  General: '',
  'User Interface': '',
  Settings: '',
  Customize: '',
};

/**
 * Loads all the modules and initliazes them
 */
function loadAllModules() {
  // window.dubplus was created in the init module

  dubPlus_modules.forEach(function (mod) {
    // add each module to the new global object
    window.dubplus[mod.id] = mod;
    // add the toggleAndSave function as a member of each module
    window.dubplus[mod.id].toggleAndSave = options.toggleAndSave;
    // check stored settings for module's initial state
    mod.optionState = settings.options[mod.id] || false;

    // This is run only once, when the script is loaded.
    // put anything you want ALWAYS run on Dub+ script load here
    if (typeof mod.init === 'function') {
      mod.init.call(mod);
    }

    // if module's localStorage option state is ON, we turn it on!
    if (mod.optionState && typeof mod.turnOn === 'function') {
      mod.turnOn.call(mod);
    }

    var _extraIcon = null;
    // if module has a defined .extra {function} but does not define the .extraIcon {string}
    // then we use 'pencil' as the default icon
    if (typeof mod.extra === 'function' && !mod.extraIcon) {
      _extraIcon = 'pencil';
    }

    if (!menuObj[mod.category]) {
      menuObj[mod.category] = new DocumentFragment();
    }

    // generate the html for the menu option and add it to the
    // appropriate category
    menuObj[mod.category].appendChild(
      menu.makeOptionMenu(mod.moduleName, {
        id: mod.id,
        desc: mod.description,
        state: mod.optionState,
        extraIcon: mod.extraIcon || _extraIcon,
        cssClass: mod.menuCssClass || '',
        altIcon: mod.altIcon || null,
      })
    );
  });

  return menuObj;
}

export default loadAllModules;
