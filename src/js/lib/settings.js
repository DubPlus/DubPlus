var defaults = {
  our_version : '0.1.0',
  srcRoot: `https://rawgit.com/FranciscoG/DubPlus/${CURRENT_BRANCH}`,
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
  custom: {

  }
};

var savedSettings = {};
var _storageRaw = localStorage.getItem('dubplusUserSettings');
if (_storageRaw) {
  savedSettings = JSON.parse(_storageRaw);
}

module.exports = $.extend({}, defaults, savedSettings);
