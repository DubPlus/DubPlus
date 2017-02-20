const options = require('../utils/options.js');
const dubPlus_modules = require('../modules/index.js');
const settings = require("../lib/settings.js");
const menu = require('../lib/menu.js');

var menuObj = {
  'General' : '',
  'User Interface' : '',
  'Settings' : '',
  'Customize' : ''
};

/**
 * Loads all the modules and initliazes them
 */
var loadAllModules = function(){
  window.dubplus = {};

  dubPlus_modules.forEach(function(mod){
    // add each module to the new global object
    window.dubplus[mod.id] = mod;
    // add the toggleAndSave function as a member of each module
    window.dubplus[mod.id].toggleAndSave = options.toggleAndSave;
    
    // add event listener
    if (typeof mod.go === 'function' || typeof mod.extra === 'function'){
      $('body').on('click', '#'+mod.id, function(ev) {
        // if clicking on the "extra-icon", run module's "extra" function
        if (ev.target.classList.contains('extra-icon') && typeof mod.extra === 'function') {
          mod.extra.call(mod);
        } else if (mod.go) {
          mod.go.call(mod);
        }
      });
    }

    // check stored settings for module's initial state
    mod.optionState = settings.options[mod.id] || false;

    // This is run only once, when the script is loaded.
    // this is also where you should check stored settings 
    // to see if an option should be automatically turned on
    if (typeof mod.init === 'function') { 
      mod.init.bind(mod)(); 
    }

    var _extraIcon = null;
    // setting a default extraIcon to 'pencil' if .extra is defined not extraIcon
    if (typeof mod.extra === 'function' && !mod.extraIcon) {
      _extraIcon = 'pencil';
    }

    // generate the html for the menu option and add it to the
    // appropriate category
    menuObj[mod.category] += menu.makeOptionMenu(mod.moduleName, {
      id : mod.id,
      desc : mod.description,
      state : mod.optionState,
      extraIcon : mod.extraIcon || _extraIcon,
      cssClass : mod.menuCssClass || '',
      altIcon : mod.altIcon || null
    });

  });

  return menuObj;
};

export default loadAllModules;