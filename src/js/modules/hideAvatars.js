/**
 * Hide Avatars
 * Toggle hiding user avatars in the chat box.
 */
var myModule = {};

myModule.id = "dubplus-hide-avatars";
myModule.moduleName = "Hide Avatars";
myModule.description = "Toggle hiding user avatars in the chat box.";
myModule.category = "User Interface";

myModule.turnOn = function(){
  $('body').addClass('dubplus-hide-avatars');
};

myModule.turnOff = function() {
  $('body').removeClass('dubplus-hide-avatars');
};

module.exports = myModule;