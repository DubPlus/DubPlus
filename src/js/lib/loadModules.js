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

    // add the menu item to the appropriate category section
    // if the module doesn't have the menuHTML defined then we can
    // define it here.  This way we can get rid of boilterplate code
    if (!mod.menuHTML) {
      menuObj[mod.category] += menu.makeOptionMenu(mod.moduleName, {
        id : mod.id,
        desc : mod.description,
        state : mod.optionState
      });
    } else {
      menuObj[mod.category] += mod.menuHTML;
    }

  });

  return menuObj;
};

export default loadAllModules;