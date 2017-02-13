var settings = require("../lib/settings.js");
/**
 * Save an option to localStorage. 
 * 
 * @param  {String} selector    the name of the option
 * @param  {String} value       'true' or 'false'
 */
var saveOption = function(optionName, value) {
  localStorage.setItem(optionName,value);

  // new options
  if ( /^draw/i.test(optionName) ) {
    settings.menu[optionName] = value;
  } else if (/(css|customAfkMessage)/i.test(optionName)) {
    settings.custom[optionName] = value;
  } else {
    settings.options[optionName] = value;
  }
  localStorage.setItem( 'dubplusUserSettings', JSON.stringify(settings) );
};

var saveMenuOption = function(optionName, value){
  settings.menu[optionName] = value;
  localStorage.setItem( 'dubplusUserSettings', JSON.stringify(settings) );
};

var getAllOptions = function(){
  var _stored = localStorage.dubplusUserSettings;
  if (_stored) {
    return JSON.parse(_stored);
  } else {
    return settings;
  }
};

/**
 * Updates the on/off state of the option in the dubplus menu
 * @param  {String} selector name of the selector to be updated
 * @param  {Bool} state      true for "on", false for "off"
 * @return {undefined}         
 */
var toggle = function(selector, state){
  var item = document.querySelector(selector + ' .for_content_off i');
  
  if (state === true) {
    item.classList.remove('fi-x');
    item.classList.add('fi-check');
  } else {
    item.classList.remove('fi-check');
    item.classList.add('fi-x');
  }
};

/**
 * TODO: go through all the files and replace .on and .off with the new toggle
 */
// deprecating these 2 eventually, for now they are pass-throughs
var on = function(selector) {
  // $(selector + ' .for_content_off i').replaceWith('<i class="fi-check"></i>');
  toggle(selector, true);
};
var off = function(selector) {
  // $(selector + ' .for_content_off i').replaceWith('<i class="fi-x"></i>');
  toggle(selector, false);
};

var toggleAndSave = function(optionName, state){
  toggle("."+optionName, state);
  return saveOption(optionName, state.toString());
};

module.exports = {
  on: on,
  off: off,
  toggle: toggle,
  toggleAndSave: toggleAndSave,
  saveMenuOption: saveMenuOption,
  getAllOptions: getAllOptions
};