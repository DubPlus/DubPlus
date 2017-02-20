var defaults = {
  our_version : '0.1.0',
  // this will store all the on/off states
  options : {},
  // this will store the open/close state of the menu sections
  menu : {
    "general" : "open",
    "user-interface" : "open",
    "settings" : "open",
    "customize" : "open",
    "contact" : "open"
  },
  // this will store custom strings for options like custom css, afk message, etc
  custom: {}
};

var savedSettings = {};
var _storageRaw = localStorage.getItem('dubplusUserSettings');
if (_storageRaw) {
  savedSettings = JSON.parse(_storageRaw);
}

var exportSettings = $.extend({}, defaults, savedSettings);

// this is stored in localStorage but we don't want that, we always want it fresh
exportSettings.srcRoot = `https://rawgit.com/${CURRENT_REPO}/DubPlus/${CURRENT_BRANCH}`;

module.exports = exportSettings;
