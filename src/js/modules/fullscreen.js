/**
 * Fullscreen video
 * Toggle fullscreen video mode
 */

var menu = require('../lib/menu.js');

var myModule = {};

myModule.id = "fs";
myModule.moduleName = "Fullscreen Video";
myModule.description = "Toggle fullscreen video mode";
myModule.optionState = false;
myModule.category = "ui";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, 'fs', myModule.moduleName);


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