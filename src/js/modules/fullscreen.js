/**
 * Fullscreen video
 * Toggle fullscreen video mode
 */

var menu = require('../lib/menu.js');

var myModule = {};

myModule.id = "fullscreen";
myModule.moduleName = "Fullscreen Video";
myModule.description = "Toggle fullscreen video mode";
myModule.optionState = false;
myModule.category = "User Interface";
myModule.menuHTML = menu.makeOptionMenu(myModule.moduleName, {
    id : 'dubplus-fullscreen',
    desc : myModule.description
  });

myModule.go = function(e) {
    var elem = document.querySelector('.playerElement iframe');
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
};

module.exports = myModule;