/**
 * Hide the Chat box and only show the video
 */

var myModule = {};
myModule.id = "dubplus-video-only";
myModule.moduleName = "Hide Chat";
myModule.description = "Toggles hiding the chat box";
myModule.category = "User Interface";

myModule.turnOn = function(){
  $('body').addClass('dubplus-video-only');
};

myModule.turnOff = function() {
  $('body').removeClass('dubplus-video-only');
};

module.exports = myModule;