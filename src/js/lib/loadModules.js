'use strict';
var options = require('../utils/options.js');
var menu = require('../lib/menu.js');
var modules = require('../modules/index.js');
var storedSettings = options.getAllOptions();

/**
 * Loads all the modules in /modules and initliazes them
 * @param  {Object} globalObject The target global object that modules will be added to.  In our case it will be window.dubplus
 */
var loadAllModulesTo = function(globalObject){
    if (typeof window[globalObject] === "undefined") {
        window[globalObject] = {};
    }

    modules.forEach(function(mod, i, r){
        globalObject[mod.id] = mod;
        globalObject[mod.id].toggleAndSave = options.toggleAndSave;
        
        // add event listener
        if (typeof mod.go === 'function'){
          $('body').on('click', '#'+mod.id, mod.go.bind(mod) );
        }

        // if module has a definied init function, run that first
        if (typeof mod.init === 'function') { 
          mod.init.bind(mod); 
        }

        // add the menu item to the appropriate category section
        if (mod.menuHTML && mod.category) {
          menu.appendToSection(mod.category, mod.menuHTML.bind(mod) );
        }

        // check localStorage for saved settings and update modules optionState
        if (typeof storedSettings.options[mod.id] !== 'undefined') {
          mod.optionState = storedSettings.options[mod.id];

          // run module's go function if setting was true
          if ( (storedSettings.options[mod.id] === 'true' || storedSettings.options[mod.id] === true) && typeof mod.go === 'function' ) {
            mod.go.call(mod, "onLoad");
          }
        }
    
    });

};

module.exports = loadAllModulesTo;