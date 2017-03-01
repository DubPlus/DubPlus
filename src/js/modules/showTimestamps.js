/**
 * Show Timestamps
 * Toggle always showing chat message timestamps.
 */

var myModule = {};
myModule.id = "dubplus-show-timestamp";
myModule.moduleName = "Show Timestamps";
myModule.description = "Toggle always showing chat message timestamps.";
myModule.category = "User Interface";

myModule.turnOn = function() {
  $('body').addClass('dubplus-show-timestamp');
};

myModule.turnOff = function() {
  $('body').removeClass('dubplus-show-timestamp');
};

module.exports = myModule;