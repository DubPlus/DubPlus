/**
 * Dubs in Chat
 * Show down o
 */

var myModule = {};
myModule.id = "dubplus-chat-only";
myModule.moduleName = "Hide Video";
myModule.description = "Toggles hiding the video box";
myModule.category = "User Interface";

myModule.turnOn = function(){
  $('body').addClass('dubplus-chat-only');
};

myModule.turnOff = function() {
  $('body').removeClass('dubplus-chat-only');
};

module.exports = myModule;