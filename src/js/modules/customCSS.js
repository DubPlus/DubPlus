/**
 * Custom CSS
 * Add custom CSS
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var css = require('../utils/css.js');
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "css_modal";
myModule.moduleName = "Custom CSS";
myModule.description = "Add custom CSS.";
myModule.optionState = false;
myModule.category = "customize";
myModule.menuHTML = menu.makeOtherMenuHTML('unlink', myModule.id, myModule.description, '', myModule.moduleName);

myModule.init = function(){
  if (settings.custom.css !== null) {
    css.loadExternal(settings.custom.css, 'css_import');
  }
};

var css_import = function() {
    $('.css_import').remove();
    var css_to_import = $('.input').val();
    options.saveOption('css',css_to_import);
    
    if (css_to_import && css_to_import !== '') {
        $('head').append('<link class="css_import" href="'+css_to_import+'" rel="stylesheet" type="text/css">');
        css.loadExternal(css_to_import, 'css_import');
    }
};

myModule.go = function() {
  var current = settings.custom.css || "";

  modal.create({
      title: 'CSS',
      content: current,
      placeholder: 'https://example.com/example.css',
      confirmButtonClass: 'confirm-for313',
      maxlength: '999',
      confirmCallback: css_import
  });
};

module.exports = myModule;