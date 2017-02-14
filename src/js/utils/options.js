'use strict';
var settings = require("../lib/settings.js");

/**
 * Update settings and save all options to localStorage
 * @param  {String} where      Location in the settings object to save to
 * @param  {String} optionName 
 * @param  {String|Number|Boolean} value      
 */
var saveOption = function(where, optionName, value) {
  settings[where][optionName] = value;
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
  var $item = $(selector);
  if (!$item.length) { return; }

  if (state === true) {
    $item.addClass('dubplus-switch-on');
  } else {
    $item.removeClass('dubplus-switch-on');
  }
};

var toggleAndSave = function(optionName, state){
  toggle("#"+optionName, state);
  return saveOption('options', optionName, state);
};

module.exports = {
  toggle: toggle,
  toggleAndSave: toggleAndSave,
  getAllOptions: getAllOptions,
  saveOption : saveOption
};