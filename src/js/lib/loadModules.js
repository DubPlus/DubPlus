'use strict';
var options = require('../utils/options.js');
var dubPlus_modules = require('../modules/index.js');

var menuObj = {
  'General' : '',
  'User Interface' : '',
  'Settings' : '',
  'Customize' : ''
};

/**
 * Loads all the modules in /modules and initliazes them
 * @param  {Object} globalObject The target global object that modules will be added to.  In our case it will be window.dubplus
 */
var loadAllModulesTo = function(globalObject){
  if (typeof window[globalObject] === "undefined") {
    window[globalObject] = {};
  }

  dubPlus_modules.forEach(function(mod){
    // add each module to the new global object
    window[globalObject][mod.id] = mod;
    // add the toggleAndSave function as a member of each module
    window[globalObject][mod.id].toggleAndSave = options.toggleAndSave;
    
    // add event listener
    if (typeof mod.go === 'function'){
      var selector = '#'+mod.id+' dp-switch-activator';
      $('body').on('click', selector, mod.go.bind(mod) );
    }

    // This is run only once, when the script is loaded.
    // this is also where you should check stored settings 
    // to see if an option should be automatically turned on
    if (typeof mod.init === 'function') { 
      mod.init.bind(mod); 
    }

    // add the menu item to the appropriate category section
    if (mod.menuHTML && mod.category && typeof menuObj[mod.category] === "string") {
      menuObj[mod.category] += mod.menuHTML;
    }

  });

  return menuObj;
};

module.exports = {
  loadAllModulesTo : loadAllModulesTo
};