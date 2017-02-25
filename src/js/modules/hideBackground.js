/**
 * Hide Background
 * toggle hiding background image
 */

var myModule = {};
myModule.id = "dubplus-hide-bg";
myModule.moduleName = "Hide Background";
myModule.description = "Toggle hiding background image.";
myModule.category = "User Interface";

myModule.turnOn = function() {
  $('body').addClass('dubplus-hide-bg');
};

myModule.turnOff = function() {
  $('body').removeClass('dubplus-hide-bg');
};

module.exports = myModule;