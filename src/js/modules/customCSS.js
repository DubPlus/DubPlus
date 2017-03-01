/**
 * Custom CSS
 * Add custom CSS
 */

var css = require('../utils/css.js');
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "dubplus-custom-css";
myModule.moduleName = "Custom CSS";
myModule.description = "Add your own custom CSS.";
myModule.category = "Customize";
myModule.extraIcon = 'pencil';

var css_import = function() {
  $('.dubplus-custom-css').remove();
  var css_to_import = $('.dp-modal textarea').val();
  options.saveOption('custom', 'css', css_to_import);

  if (css_to_import && css_to_import !== '') {
    css.loadExternal(css_to_import, 'dubplus-custom-css');
  }
};

myModule.extra = function(){
  modal.create({
    title: 'Custom CSS',
    content: 'Enter a url location for your custom css',
    value : settings.custom.css || '',
    placeholder: 'https://example.com/example.css',
    maxlength: '500',
    confirmCallback: css_import
  });
};

myModule.turnOn = function() {
  if (settings.custom.css && settings.custom.css !== "") {
    css.loadExternal(settings.custom.css, 'dubplus-custom-css');
  } else {
    this.extra();
  }
};

myModule.turnOff = function() {
  $('.dubplus-custom-css').remove();
};

module.exports = myModule;