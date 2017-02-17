/**
 * Fullscreen video
 * Toggle fullscreen video mode
 */
var fs_module = {};

fs_module.id = "dubplus-fullscreen";
fs_module.moduleName = "Fullscreen Video";
fs_module.description = "Toggle fullscreen video mode";
fs_module.category = "User Interface";
fs_module.altIcon = "arrows-alt";

fs_module.go = function(e) {
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

module.exports = fs_module;