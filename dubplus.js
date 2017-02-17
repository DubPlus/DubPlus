(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*
     /$$$$$$$            /$$                
    | $$__  $$          | $$          /$$   
    | $$  \ $$ /$$   /$$| $$$$$$$    | $$   
    | $$  | $$| $$  | $$| $$__  $$ /$$$$$$$$
    | $$  | $$| $$  | $$| $$  \ $$|__  $$__/
    | $$  | $$| $$  | $$| $$  | $$   | $$   
    | $$$$$$$/|  $$$$$$/| $$$$$$$/   |__/   
    |_______/  \______/ |_______/           
                                            
                                            
    https://github.com/DubPlus/DubPlus

    MIT License

    Copyright (c) 2017 DubPlus

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

var modal = require('./utils/modal.js');
var init = require('./lib/init.js');
var css = require('./utils/css.js');

/* globals Dubtrack */
if (!window.dubplus && Dubtrack.session.id) {
  init();
} else {
  var errorMsg;
  if (!Dubtrack.session.id) {
    css.load('/css/dubplus.css');
    errorMsg = 'You\'re not logged in. Please login to use Dub+.';
  } else {
    errorMsg = 'Dub+ is already loaded';
  }
  modal.create({
    title: 'Dub+ Error',
    content: errorMsg
  });
}

},{"./lib/init.js":3,"./utils/css.js":22,"./utils/modal.js":24}],2:[function(require,module,exports){
'use strict';

/* global  emojify */

var GetJSON = require('../utils/getJSON.js');
var settings = require("../lib/settings.js");

var prepEmoji = {};

prepEmoji.emoji = {
  template: function template(id) {
    return emojify.defaultConfig.img_dir + '/' + encodeURI(id) + '.png';
  }
};
prepEmoji.twitch = {
  template: function template(id) {
    return "//static-cdn.jtvnw.net/emoticons/v1/" + id + "/3.0";
  },
  specialEmotes: [],
  emotes: {},
  chatRegex: new RegExp(":([-_a-z0-9]+):", "ig")
};
prepEmoji.bttv = {
  template: function template(id) {
    return "//cdn.betterttv.net/emote/" + id + "/3x";
  },
  emotes: {},
  chatRegex: new RegExp(":([&!()\\-_a-z0-9]+):", "ig")
};
prepEmoji.tasty = {
  template: function template(id) {
    return this.emotes[id].url;
  },
  emotes: {}
};

prepEmoji.shouldUpdateAPIs = function (apiName) {
  var day = 86400000; // milliseconds in a day

  // if api return an object with an error then we should try again
  var savedItem = localStorage.getItem(apiName + '_api');
  if (savedItem) {
    var parsed = JSON.parse(savedItem);
    if (typeof parsed.error !== 'undefined') {
      return true;
    }
  }

  var today = Date.now();
  var lastSaved = parseInt(localStorage.getItem(apiName + '_api_timestamp'));
  // Is the lastsaved not a number for some strange reason, then we should update
  // are we past 5 days from last update? then we should update
  // does the data not exist in localStorage, then we should update
  return isNaN(lastSaved) || today - lastSaved > day * 5 || !savedItem;
};

/**************************************************************************
* Loads the twitch emotes from the api.
* http://api.twitch.tv/kraken/chat/emoticon_images
*/
prepEmoji.loadTwitchEmotes = function () {
  var _this = this;

  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the twitch API
  if (this.shouldUpdateAPIs('twitch')) {
    console.log('dub+', 'twitch', 'loading from api');
    var twApi = new GetJSON('https://api.twitch.tv/kraken/chat/emoticon_images', 'twitch:loaded', { 'Client-ID': '5vhafslpr2yqal6715puzysmzrntmt8' });
    twApi.done(function (data) {
      localStorage.setItem('twitch_api_timestamp', Date.now().toString());
      localStorage.setItem('twitch_api', data);
      _this.processTwitchEmotes(JSON.parse(data));
    });
  } else {
    console.log('dub+', 'twitch', 'loading from localstorage');
    savedData = JSON.parse(localStorage.getItem('twitch_api'));
    this.processTwitchEmotes(savedData);
    savedData = null; // clear the var from memory
    var twEvent = new Event('twitch:loaded');
    window.dispatchEvent(twEvent);
  }
};

prepEmoji.loadBTTVEmotes = function () {
  var _this2 = this;

  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the bttv API
  if (this.shouldUpdateAPIs('bttv')) {
    console.log('dub+', 'bttv', 'loading from api');
    var bttvApi = new GetJSON('//api.betterttv.net/2/emotes', 'bttv:loaded');
    bttvApi.done(function (data) {
      localStorage.setItem('bttv_api_timestamp', Date.now().toString());
      localStorage.setItem('bttv_api', data);
      _this2.processBTTVEmotes(JSON.parse(data));
    });
  } else {
    console.log('dub+', 'bttv', 'loading from localstorage');
    savedData = JSON.parse(localStorage.getItem('bttv_api'));
    this.processBTTVEmotes(savedData);
    savedData = null; // clear the var from memory
    var twEvent = new Event('bttv:loaded');
    window.dispatchEvent(twEvent);
  }
};

prepEmoji.loadTastyEmotes = function () {
  var _this3 = this;

  console.log('dub+', 'tasty', 'loading from api');
  // since we control this API we should always have it load from remote
  var tastyApi = new GetJSON(settings.srcRoot + '/emotes/tastyemotes.json', 'tasty:loaded');
  tastyApi.done(function (data) {
    localStorage.setItem('tasty_api', data);
    _this3.processTastyEmotes(JSON.parse(data));
  });
};

prepEmoji.processTwitchEmotes = function (data) {
  var _this4 = this;

  data.emoticons.forEach(function (el) {
    var _key = el.code.toLowerCase();

    // move twitch non-named emojis to their own array
    if (el.code.indexOf('\\') >= 0) {
      _this4.twitch.specialEmotes.push([el.code, el.id]);
      return;
    }

    if (emojify.emojiNames.indexOf(_key) >= 0) {
      return; // do nothing so we don't override emoji
    }

    if (!_this4.twitch.emotes[_key]) {
      // if emote doesn't exist, add it
      _this4.twitch.emotes[_key] = el.id;
    } else if (el.emoticon_set === null) {
      // override if it's a global emote (null set = global emote)
      _this4.twitch.emotes[_key] = el.id;
    }
  });
  this.twitchJSONSLoaded = true;
  this.emojiEmotes = emojify.emojiNames.concat(Object.keys(this.twitch.emotes));
};

prepEmoji.processBTTVEmotes = function (data) {
  var _this5 = this;

  data.emotes.forEach(function (el) {
    var _key = el.code.toLowerCase();

    if (el.code.indexOf(':') >= 0) {
      return; // don't want any emotes with smileys and stuff
    }

    if (emojify.emojiNames.indexOf(_key) >= 0) {
      return; // do nothing so we don't override emoji
    }

    if (el.code.indexOf('(') >= 0) {
      _key = _key.replace(/([()])/g, "");
    }

    _this5.bttv.emotes[_key] = el.id;
  });
  this.bttvJSONSLoaded = true;
  this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.bttv.emotes));
};

prepEmoji.processTastyEmotes = function (data) {
  this.tasty.emotes = data.emotes;
  this.tastyJSONLoaded = true;
  this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.tasty.emotes));
};

module.exports = prepEmoji;

},{"../lib/settings.js":6,"../utils/getJSON.js":23}],3:[function(require,module,exports){
'use strict';

var _loadModules = require('./loadModules.js');

var _loadModules2 = _interopRequireDefault(_loadModules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var css = require('../utils/css.js');
var menu = require('./menu.js');

module.exports = function () {
  // load our main CSS
  css.load('/css/dubplus.css');

  // add a 'global' css class just in case we need more specificity in our css
  $('html').addClass('dubplus');

  // load third party snowfall feature
  $.getScript('https://rawgit.com/loktar00/JQuery-Snowfall/master/src/snowfall.jquery.js');

  // what is this for?
  // $('.icon-mute.snooze_btn:after').css({"content": "1", "vertical-align": "top", "font-size": "0.75rem", "font-weight": "700"});

  // Get the opening html for the menu
  var menuString = menu.beginMenu();

  // load all our modules into the 'dubplus' global object
  // it also builds the menu dynamically
  // returns an object to be passed to menu.finish
  var menuObj = (0, _loadModules2.default)();

  // finalize the menu and add it to the UI
  menu.finishMenu(menuObj, menuString);

  // dubplus.previewListInit();
  // dubplus.userAutoComplete();
};

},{"../utils/css.js":22,"./loadModules.js":4,"./menu.js":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var options = require('../utils/options.js');
var dubPlus_modules = require('../modules/index.js');
var settings = require("../lib/settings.js");
var menu = require('../lib/menu.js');

var menuObj = {
  'General': '',
  'User Interface': '',
  'Settings': '',
  'Customize': ''
};

/**
 * Loads all the modules and initliazes them
 */
var loadAllModules = function loadAllModules() {
  window.dubplus = {};

  dubPlus_modules.forEach(function (mod) {
    // add each module to the new global object
    window.dubplus[mod.id] = mod;
    // add the toggleAndSave function as a member of each module
    window.dubplus[mod.id].toggleAndSave = options.toggleAndSave;

    // add event listener
    if (typeof mod.go === 'function' || typeof mod.extra === 'function') {
      $('body').on('click', '#' + mod.id, function (ev) {
        // if clicking on the "extra-icon", run module's "extra" function
        if (ev.target.classList.contains('extra-icon') && typeof mod.extra === 'function') {
          mod.extra.call(mod);
        } else if (mod.go) {
          mod.go.call(mod);
        }
      });
    }

    // check stored settings for module's initial state
    mod.optionState = settings.options[mod.id] || false;

    // This is run only once, when the script is loaded.
    // this is also where you should check stored settings 
    // to see if an option should be automatically turned on
    if (typeof mod.init === 'function') {
      mod.init.bind(mod)();
    }

    // generate the html for the menu option and add it to the
    // appropriate category
    menuObj[mod.category] += menu.makeOptionMenu(mod.moduleName, {
      id: mod.id,
      desc: mod.description,
      state: mod.optionState,
      extraIcon: mod.extraIcon || null,
      cssClass: mod.menuCssClass || '',
      altIcon: mod.altIcon || null
    });
  });

  return menuObj;
};

exports.default = loadAllModules;

},{"../lib/menu.js":5,"../lib/settings.js":6,"../modules/index.js":17,"../utils/options.js":25}],5:[function(require,module,exports){
'use strict';

var options = require('../utils/options.js');
var settings = require('./settings.js');
var css = require('../utils/css.js');

// this is used to set the state of the contact menu section
var arrow = "down";
var isClosedClass = "";
if (settings.menu.contact === "closed") {
  isClosedClass = "dubplus-menu-section-closed";
  arrow = "right";
}

// the contact section is hardcoded and setup up here
var contactSection = '\n  <div id="dubplus-contact" class="dubplus-menu-section-header">\n      <span class="fa fa-angle-' + arrow + '"></span>\n      <p>Contact</p>\n    </div>\n    <ul class="dubplus-menu-section ' + isClosedClass + '">\n      <li class="dubplus-menu-icon">\n        <span class="fa fa-bug"></span>\n        <a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>\n      </li>\n       <li class="dubplus-menu-icon">\n        <span class="fa fa-facebook"></span>\n        <a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>\n      </li>\n      <li class="dubplus-menu-icon">\n        <span class="fa fa-twitter"></span>\n        <a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>\n      </li>\n    </ul>';

module.exports = {
  beginMenu: function beginMenu() {
    // load font-awesome icons from CDN to be used in the menu
    css.loadExternal('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

    // add icon to the upper right corner
    var menuIcon = '<div class="dubplus-icon"><img src="' + settings.srcRoot + '/images/dubplus.svg" alt=""></div>';
    $('.header-right-navigation').append(menuIcon);

    // hide/show the  menu when you click on the icon in the top right
    $('body').on('click', '.dubplus-icon', function (e) {
      $('.dubplus-menu').toggleClass('dubplus-menu-open');
    });

    // make the menu
    var dp_menu_html = '\n      <section class="dubplus-menu dubplus-open">\n          <p class="dubplus-menu-header">Dub+ Settings</p>';

    return dp_menu_html;
  },

  finishMenu: function finishMenu(menuObj, menuString) {
    // dynamically create our menu from strings provided by each module
    for (var category in menuObj) {
      var fixed = category.replace(" ", "-").toLowerCase();
      var menuSettings = settings.menu[fixed];
      var id = 'dubplus-' + fixed;

      var arrow = "down";
      var isClosedClass = "";
      if (menuSettings === "closed") {
        isClosedClass = "dubplus-menu-section-closed";
        arrow = "right";
      }

      menuString += '\n        <div id="' + id + '" class="dubplus-menu-section-header">\n          <span class="fa fa-angle-' + arrow + '"></span>\n          <p>' + category + '</p>\n        </div>\n        <ul class="dubplus-menu-section ' + isClosedClass + '">';
      menuString += menuObj[category];
      menuString += '</ul>';
    }

    // contact section last, is already fully formed, not dynamic
    menuString += contactSection;
    // final part of the menu string
    menuString += '</section>';

    // add it to the DOM
    $('body').append(menuString);
    // use the perfectScrollBar plugin to make it look nice
    // $('.dubplus-menu').perfectScrollbar();

    // add event handler for menu sections
    $('body').on('click', '.dubplus-menu-section-header', function (e) {
      var $menuSec = $(this).next('.dubplus-menu-section');
      var $icon = $(this).find('span');
      var menuName = $(this).text().trim().replace(" ", "-").toLowerCase();
      $menuSec.toggleClass('dubplus-menu-section-closed');
      if ($menuSec.hasClass('dubplus-menu-section-closed')) {
        // menu is closed
        $icon.removeClass('fa-angle-down').addClass('fa-angle-right');
        options.saveOption('menu', menuName, 'closed');
      } else {
        // menu is open
        $icon.removeClass('fa-angle-right').addClass('fa-angle-down');
        options.saveOption('menu', menuName, 'open');
      }
    });
  },

  makeOptionMenu: function makeOptionMenu(menuTitle, options) {
    var defaults = {
      id: '', // will be the ID selector for the menu item
      desc: '', // will be used for the "title" attribute
      state: false, // whether the menu item is on/off
      extraIcon: null, // define the extra icon if an option needs it (like AFK, Custom Mentions)
      cssClass: '', // adds extra CSS class(es) if desired,
      altIcon: null
    };
    var opts = $.extend({}, defaults, options);
    var _extra = '';
    var _state = opts.state ? 'dubplus-switch-on' : '';
    if (opts.extraIcon) {
      _extra = '<span class="fa fa-' + opts.extraIcon + ' extra-icon"></span>';
    }

    // default icon on the left of each menu item is the switch
    var mainCssClass = "dubplus-switch";
    var mainIcon = '\n        <div class="dubplus-switch-bg">\n          <div class="dubplus-switcher"></div>\'\n        </div>';
    // however, if an "altIcon" is provided, then we use that instead
    if (opts.altIcon) {
      mainCssClass = "dubplus-menu-icon";
      mainIcon = '<span class="fa fa-' + opts.altIcon + '"></span>';
    }
    return '\n      <li id="' + opts.id + '" class="' + mainCssClass + ' ' + _state + ' ' + opts.cssClass + ' title="' + opts.desc + '">\n        ' + mainIcon + '\n        <span class="dubplus-menu-label">' + menuTitle + '</span>\n        ' + _extra + '\n      </li>';
  },

  makeLinkMenu: function makeLinkMenu(menuTitle, icon, link, options) {
    var defaults = {
      id: '',
      desc: '',
      cssClass: ''
    };
    var opts = $.extend({}, defaults, options);
    return '\n      <li id="' + opts.id + '" class="dubplus-menu-icon ' + opts.cssClass + ' title="' + opts.desc + '">\n        <span class="fa fa-' + icon + '"></span>\n        <a href="' + link + '" class="dubplus-menu-label" target="_blank">' + menuTitle + '</a>\n      </li>';
  }

};

},{"../utils/css.js":22,"../utils/options.js":25,"./settings.js":6}],6:[function(require,module,exports){
(function (CURRENT_BRANCH){
"use strict";

var defaults = {
  our_version: '0.1.0',
  srcRoot: "https://rawgit.com/FranciscoG/DubPlus/" + CURRENT_BRANCH,
  // this will store all the on/off states
  options: {},
  // this will store the open/close state of the menu sections
  menu: {
    "general": "open",
    "user-interface": "open",
    "settings": "open",
    "customize": "open",
    "contact": "open"
  },
  // this will store custom strings for options like custom css, afk message, etc
  custom: {}
};

var savedSettings = {};
var _storageRaw = localStorage.getItem('dubplusUserSettings');
if (_storageRaw) {
  savedSettings = JSON.parse(_storageRaw);
}

module.exports = $.extend({}, defaults, savedSettings);

}).call(this,'es6')
},{}],7:[function(require,module,exports){
'use strict';

/**
 * AFK -  Away from Keyboard
 * Toggles the afk auto response on/off
 * including adding a custom message
 */

/* global Dubtrack */
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var settings = require("../lib/settings.js");

var afk_module = {};
afk_module.id = "dubplus-afk";
afk_module.moduleName = "AFK Autorespond";
afk_module.description = "Toggle Away from Keyboard and customize AFK message.";
afk_module.category = "General";
afk_module.extraIcon = 'pencil';

var afk_chat_respond = function afk_chat_respond(e) {
  var content = e.message;
  var user = Dubtrack.session.get('username');

  if (content.indexOf('@' + user) > -1 && Dubtrack.session.id !== e.user.userInfo.userid) {

    if (settings.custom.customAfkMessage) {
      $('#chat-txt-message').val('[AFK] ' + settings.custom.customAfkMessage);
    } else {
      $('#chat-txt-message').val("[AFK] I'm not here right now.");
    }

    Dubtrack.room.chat.sendMessage();
    this.optionState = false;

    var self = this;
    setTimeout(function () {
      self.optionState = true;
    }, 180000);
  }
};

afk_module.init = function () {
  if (this.optionState === true) {
    Dubtrack.Events.bind("realtime:chat-message", afk_chat_respond);
  }
};

afk_module.go = function (e) {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    Dubtrack.Events.bind("realtime:chat-message", afk_chat_respond);
  } else {
    newOptionState = false;
    Dubtrack.Events.unbind("realtime:chat-message", afk_chat_respond);
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

var saveAFKmessage = function saveAFKmessage() {
  var customAfkMessage = $('.dp-modal textarea').val();
  if (customAfkMessage !== '') {
    options.saveOption('custom', 'customAfkMessage', customAfkMessage);
  }
};

afk_module.extra = function () {
  modal.create({
    title: 'Custom AFK Message',
    content: 'Enter a custom Away From Keyboard [AFK] message here',
    value: settings.custom.customAfkMessage || '',
    placeholder: 'Be right back!',
    maxlength: '255',
    confirmCallback: saveAFKmessage
  });
};

module.exports = afk_module;

},{"../lib/settings.js":6,"../utils/modal.js":24,"../utils/options.js":25}],8:[function(require,module,exports){
"use strict";

/* global Dubtrack */
var autovote = {};
autovote.id = "dubplus-autovote";
autovote.moduleName = "Autovote";
autovote.description = "Toggles auto upvoting for every song";
autovote.category = "General";

/*******************************************************/
// add any custom functions to this module

var advance_vote = function advance_vote() {
  console.log('advancing the vote');
  $('.dubup').click();
};

var voteCheck = function voteCheck(obj) {
  if (obj.startTime < 2) {
    advance_vote();
  }
};

/*******************************************************/

autovote.init = function () {
  if (this.optionState === true) {
    this.start();
  }
};

// this function will be run on each click of the menu
autovote.go = function () {
  var newOptionState;
  console.log(this.optionState);

  if (!this.optionState) {
    newOptionState = true;
    this.start();
  } else {
    newOptionState = false;
    Dubtrack.Events.unbind("realtime:room_playlist-update", voteCheck);
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

autovote.start = function () {
  var song = Dubtrack.room.player.activeSong.get('song');
  var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
  var dubsong = Dubtrack.helpers.cookie.get('dub-song');

  if (!Dubtrack.room || !song || song.songid !== dubsong) {
    dubCookie = false;
  }
  //Only cast the vote if user hasn't already voted
  if (!$('.dubup, .dubdown').hasClass('voted') && !dubCookie) {
    advance_vote();
  }

  Dubtrack.Events.bind("realtime:room_playlist-update", voteCheck);
};

module.exports = autovote;

},{}],9:[function(require,module,exports){
'use strict';

/**
 * Autocomplete User @ Mentions in Chat
 */

/* global Dubtrack */
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');

var myModule = {};

myModule.id = "custom_mentions";
myModule.moduleName = "Custom Mentions";
myModule.description = "Toggle using custom mentions to trigger sounds in chat";
myModule.category = "General";
myModule.extraIcon = 'pencil';

var saveCustomMentions = function saveCustomMentions() {
  var mentionsVal = $('.dp-modal textarea').val();
  if (mentionsVal !== '') {
    options.saveOption('custom', 'custom_mentions', mentionsVal);
  }
};

myModule.customMentionCheck = function (e) {
  var content = e.message.toLowerCase();
  if (settings.custom.custom_mentions) {
    var customMentions = settings.custom.custom_mentions.toLowerCase().split(',');
    var inUsers = customMentions.some(function (v) {
      return content.indexOf(v.trim(' ')) >= 0;
    });
    if (Dubtrack.session.id !== e.user.userInfo.userid && inUsers) {
      Dubtrack.room.chat.mentionChatSound.play();
    }
  }
};

myModule.start = function () {
  Dubtrack.Events.bind("realtime:chat-message", this.customMentionCheck);
};

myModule.init = function () {
  if (this.optionState === true) {
    this.start();
  }
};

myModule.extra = function () {
  modal.create({
    title: 'Custom AFK Message',
    content: 'Custom Mention Triggers (separate by comma)',
    value: settings.custom.custom_mentions || '',
    placeholder: 'separate, custom triggers, by, comma, :heart:',
    maxlength: '255',
    confirmCallback: saveCustomMentions
  });
};

myModule.go = function () {
  var newOptionState;

  if (!this.optionState) {
    this.start();
    newOptionState = true;
  } else {
    Dubtrack.Events.unbind("realtime:chat-message", this.customMentionCheck);
    newOptionState = false;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;

},{"../lib/settings.js":6,"../utils/modal.js":24,"../utils/options.js":25}],10:[function(require,module,exports){
"use strict";

/**
 * Autocomplete User @ Mentions in Chat
 */

/* global Dubtrack */
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');

var myModule = {};
myModule.id = "mention_notifications";
myModule.moduleName = "Notification on Mentions";
myModule.description = "Enable desktop notifications when a user mentions you in chat";
myModule.category = "General";

myModule.notifyOnMention = function (e) {
  var content = e.message;
  var user = Dubtrack.session.get('username').toLowerCase();
  var mentionTriggers = ['@' + user];

  if (settings.options.custom_mentions && settings.custom.custom_mentions) {
    //add custom mention triggers to array
    mentionTriggers = mentionTriggers.concat(settings.custom.custom_mentions.toLowerCase().split(','));
  }

  var mentionTriggersTest = mentionTriggers.some(function (v) {
    return content.toLowerCase().indexOf(v.trim(' ')) >= 0;
  });
  if (mentionTriggersTest && !this.isActiveTab && Dubtrack.session.id !== e.user.userInfo.userid) {
    var notificationOptions = {
      body: content,
      icon: "https://res.cloudinary.com/hhberclba/image/upload/c_lpad,h_100,w_100/v1400351432/dubtrack_new_logo_fvpxa6.png"
    };
    var n = new Notification("Message from " + e.user.username, notificationOptions);

    n.onclick = function (x) {
      window.focus();
      n.close();
    };
    setTimeout(n.close.bind(n), 5000);
  }
};

myModule.mentionNotifications = function () {
  var self = this;

  function startNotifications(permission) {
    if (permission === "granted") {
      Dubtrack.Events.bind("realtime:chat-message", self.notifyOnMention);
      self.toggleAndSave(self.id, true);
    }
  }

  this.isActiveTab = true;

  window.onfocus = function () {
    self.isActiveTab = true;
  };

  window.onblur = function () {
    self.isActiveTab = false;
  };

  if (!("Notification" in window)) {
    modal.create({
      title: 'Mention Notifications',
      content: "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox"
    });
  } else {
    if (Notification.permission === "granted") {
      startNotifications("granted");
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(startNotifications);
    } else {
      modal.create({
        title: 'Mention Notifications',
        content: "You have chosen to block notifications. Reset this choice by clearing your cache for the site."
      });
    }
  }
};

myModule.init = function () {
  if (this.optionState === true) {
    myModule.mentionNotifications();
  }
};

myModule.go = function () {
  var newOptionState;

  if (!this.optionState) {
    myModule.mentionNotifications();
    newOptionState = true;
  } else {
    Dubtrack.Events.unbind("realtime:chat-message", this.notifyOnMention);
    newOptionState = false;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;

},{"../lib/settings.js":6,"../utils/modal.js":24}],11:[function(require,module,exports){
"use strict";

/**
 * Emotes
 * Adds additional Twitch, BTTV, and Tasty Emotes to the chat window 
 */

/* global Dubtrack */
var dubplus_emoji = require('../emojiUtils/prepEmoji.js');

var emote_module = {};
emote_module.id = "dubplus-emotes";
emote_module.moduleName = "Emotes";
emote_module.description = "Adds twitch and bttv emotes in chat.";
emote_module.category = "General";

function makeImage(type, src, name, w, h) {
  return '<img class="emoji ' + type + '-emote" ' + (w ? 'width="' + w + '" ' : '') + (h ? 'height="' + h + '" ' : '') + 'title="' + name + '" alt="' + name + '" src="' + src + '" />';
}

/**********************************************************************
 * handles replacing twitch emotes in the chat box with the images
 */

var replaceTextWithEmote = function replaceTextWithEmote() {
  var _regex = dubplus_emoji.twitch.chatRegex;

  if (!dubplus_emoji.twitchJSONSLoaded) {
    return;
  } // can't do anything until jsons are loaded

  var $chatTarget = $('.chat-main .text').last();

  if (!$chatTarget.html()) {
    return;
  } // nothing to do

  if (dubplus_emoji.bttvJSONSLoaded) {
    _regex = dubplus_emoji.bttv.chatRegex;
  }

  var emoted = $chatTarget.html().replace(_regex, function (matched, p1) {
    var _id,
        _src,
        key = p1.toLowerCase();

    if (dubplus_emoji.twitch.emotes[key]) {
      _id = dubplus_emoji.twitch.emotes[key];
      _src = dubplus_emoji.twitch.template(_id);
      return makeImage("twitch", _src, key);
    } else if (dubplus_emoji.bttv.emotes[key]) {
      _id = dubplus_emoji.bttv.emotes[key];
      _src = dubplus_emoji.bttv.template(_id);
      return makeImage("bttv", _src, key);
    } else if (dubplus_emoji.tasty.emotes[key]) {
      _src = dubplus_emoji.tasty.template(key);
      return makeImage("tasty", _src, key, dubplus_emoji.tasty.emotes[key].width, dubplus_emoji.tasty.emotes[key].height);
    } else {
      return matched;
    }
  });

  $chatTarget.html(emoted);
};

var startReplacing = function startReplacing() {
  window.addEventListener('twitch:loaded', dubplus_emoji.loadBTTVEmotes.bind(dubplus_emoji));
  // window.addEventListener('bttv:loaded', dubplus_emoji.loadTastyEmotes.bind(dubplus_emoji));

  if (!dubplus_emoji.twitchJSONSLoaded) {
    dubplus_emoji.loadTwitchEmotes();
  } else {
    replaceTextWithEmote();
  }
  Dubtrack.Events.bind("realtime:chat-message", replaceTextWithEmote);
};

emote_module.init = function () {
  if (emote_module.optionState) {
    startReplacing();
  }
};

/**************************************************************************
 * Turn on/off the twitch emoji in chat
 */
emote_module.go = function () {
  var newOptionState;
  if (!emote_module.optionState) {
    startReplacing();
    newOptionState = true;
  } else {
    Dubtrack.Events.unbind("realtime:chat-message", replaceTextWithEmote);
    newOptionState = false;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = emote_module;

},{"../emojiUtils/prepEmoji.js":2}],12:[function(require,module,exports){
"use strict";

/**
 * ETA
 *
 * This module is not a menu item, it is run once on load
 */

/* global Dubtrack */
var myModule = {};

myModule.id = "eta";
myModule.moduleName = "eta";
myModule.description = "shows your eta on hover.";

myModule.optionState = false;
myModule.category = false;
myModule.menuHTML = false;

var eta = function eta() {
    var time = 4;
    var current_time = parseInt($('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min').text());
    var booth_duration = parseInt($('.queue-position').text());
    var booth_time = booth_duration * time - time + current_time;

    if (booth_time >= 0) {
        $(this).append('<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">ETA: ' + booth_time + ' minutes</div>');
    } else {
        $(this).append('<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">You\'re not in the queue</div>');
    }
};

var hide_eta = function hide_eta() {
    $(this).empty();
};

myModule.init = function () {
    $('.player_sharing').append('<span class="icon-history eta_tooltip_t"></span>');
    $('.eta_tooltip_t').mouseover(eta).mouseout(hide_eta);
};

module.exports = myModule;

},{}],13:[function(require,module,exports){
"use strict";

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

fs_module.go = function (e) {
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

},{}],14:[function(require,module,exports){
'use strict';

/**
 * Grabs in Chat
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var css = require('../utils/css.js');
var modal = require('../utils/modal.js');
var settings = require("../lib/settings.js");

var grabs_chat = {};

grabs_chat.id = "grabChat";
grabs_chat.moduleName = "Grabs in Chat";
grabs_chat.description = "Puts a message in the chat when another user grabs your song";
grabs_chat.optionState = false;
grabs_chat.category = "General";
grabs_chat.menuHTML = menu.makeOptionMenu(grabs_chat.moduleName, {
    id: 'dubplus-grabs-chat',
    desc: grabs_chat.description
});

grabs_chat.grabChatWatcher = function (e) {
    var user = Dubtrack.session.get('username');
    var currentDj = Dubtrack.room.users.collection.findWhere({
        userid: Dubtrack.room.player.activeSong.attributes.song.userid
    }).attributes._user.username;

    if (user === currentDj && !Dubtrack.room.model.get('displayUserGrab')) {
        $('ul.chat-main').append('<li class="dubplus-chat-system dubplus-chat-system-grab">' + '<div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)"><span class="icon-close"></span></div>' + '<div class="text">' + '@' + e.user.username + ' has grabbed your song \'' + Dubtrack.room.player.activeSong.attributes.songInfo.name + ' \'' + '</div>' + '</li>');
    }
};

grabs_chat.go = function () {
    var newOptionState;
    if (!this.optionState) {
        newOptionState = true;

        Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
    } else {
        newOptionState = false;
        Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
    }

    this.optionState = newOptionState;
    this.toggleAndSave(this.id, newOptionState);
};

module.exports = grabs_chat;

},{"../lib/menu.js":5,"../lib/settings.js":6,"../utils/css.js":22,"../utils/modal.js":24}],15:[function(require,module,exports){
"use strict";

/**
 * Dubs in Chat
 * Show down o
 */

var myModule = {};
myModule.id = "dubplus-video-only";
myModule.moduleName = "Hide Chat";
myModule.description = "Toggles hiding the chat box";
myModule.category = "User Interface";

myModule.init = function () {
  if (this.optionState) {
    $('body').addClass('dubplus-video-only');
  }
};

myModule.go = function () {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('body').addClass('dubplus-video-only');
  } else {
    newOptionState = false;
    $('body').removeClass('dubplus-video-only');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;

},{}],16:[function(require,module,exports){
"use strict";

/**
 * Dubs in Chat
 * Show down o
 */

var myModule = {};
myModule.id = "dubplus-chat-only";
myModule.moduleName = "Hide Video";
myModule.description = "Toggles hiding the video box";
myModule.category = "User Interface";

myModule.init = function () {
  if (this.optionState) {
    $('body').addClass('dubplus-chat-only');
  }
};

myModule.go = function () {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('body').addClass('dubplus-chat-only');
  } else {
    newOptionState = false;
    $('body').removeClass('dubplus-chat-only');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;

},{}],17:[function(require,module,exports){
'use strict';

// put this in order of appearance in the menu
module.exports = [
// General 
require('./autovote.js'), require('./afk.js'), require('./emotes.js'),
// autocomplete emoji
// autocomplete mentions
require('./customMentions.js'), require('./desktopNotifications.js'), require('./showDubsOnHover.js'),
// Downdubs in chat (mod only)
// Updubs in chat
require('./grabsInChat.js'), require('./snow.js'),

// User Interface
require('./fullscreen.js'), require('./splitchat.js'), require('./hideChat.js'), require('./hideVideo.js'),
// require('./hideAvatars.js'),
// require('./hideBackground.js'),

// // Settings
// require('./spacebarMute.js'),
// require('./showTimestamps.js'),
// require('./warnOnNavigation.js'),

// // Customize
// require('./communityTheme.js'),
// require('./customCSS.js'),
// require('./customBackground.js'),

// non-menu modules
require('./snooze.js'), require('./eta.js')];

},{"./afk.js":7,"./autovote.js":8,"./customMentions.js":9,"./desktopNotifications.js":10,"./emotes.js":11,"./eta.js":12,"./fullscreen.js":13,"./grabsInChat.js":14,"./hideChat.js":15,"./hideVideo.js":16,"./showDubsOnHover.js":18,"./snooze.js":19,"./snow.js":20,"./splitchat.js":21}],18:[function(require,module,exports){
"use strict";

/* global Dubtrack */
var modal = require('../utils/modal.js');

var dubshover = {};
dubshover.id = "dubplus-dubs-hover";
dubshover.moduleName = "Show Dub info on Hover";
dubshover.description = "Show Dub info on Hover.";
dubshover.category = "General";

/*******************************/

dubshover.resetGrabs = function () {
  window.dubplus.dubs.grabs = []; //TODO: Remove when we can hit the api for all grabs of current playing song
};

dubshover.grabInfoWarning = function () {
  if (!this.warned) {
    return;
  }

  this.warned = true;
  modal.create({
    title: 'Grab Vote Info',
    content: 'Please note that this feature is currently still in development. We are waiting on the ability to pull grab vote information from Dubtrack on load. Until then the only grabs you will be able to see are those you are present in the room for.'
  });
};

dubshover.showDubsOnHover = function () {
  var _this = this;

  var self = this;

  this.resetDubs();

  Dubtrack.Events.bind("realtime:room_playlist-dub", this.dubWatcher.bind(this));
  Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabWatcher.bind(this));
  Dubtrack.Events.bind("realtime:user-leave", this.dubUserLeaveWatcher.bind(this));
  Dubtrack.Events.bind("realtime:room_playlist-update", this.resetDubs.bind(this));
  Dubtrack.Events.bind("realtime:room_playlist-update", this.resetGrabs.bind(this)); //TODO: Remove when we can hit the api for all grabs of current playing song

  var dubupEl = $('.dubup').first().parent('li');
  var dubdownEl = $('.dubdown').first().parent('li');
  var grabEl = $('.add-to-playlist-button').first().parent('li');

  $(dubupEl).addClass("dubplus-updubs-hover");
  $(dubdownEl).addClass("dubplus-downdubs-hover");
  $(grabEl).addClass("dubplus-grabs-hover");

  //Show compiled info containers when casting/changing vote
  $(dubupEl).click(function (event) {
    $('#dubplus-updubs-container').remove();
    var x = event.clientX,
        y = event.clientY;

    if (!x || !y || isNaN(x) || isNaN(y)) {
      return $('#dubplus-downdubs-container').remove();
    }

    var elementMouseIsOver = document.elementFromPoint(x, y);

    if ($(elementMouseIsOver).hasClass('dubplus-updubs-hover') || $(elementMouseIsOver).parents('.dubplus-updubs-hover').length > 0) {
      setTimeout(function () {
        $(dubupEl).mouseenter();
      }, 250);
    }
  });

  $(dubdownEl).click(function (event) {
    $('#dubplus-downdubs-container').remove();
    var x = event.clientX,
        y = event.clientY;

    if (!x || !y || isNaN(x) || isNaN(y)) {
      return $('#dubplus-downdubs-container').remove();
    }

    var elementMouseIsOver = document.elementFromPoint(x, y);

    if ($(elementMouseIsOver).hasClass('dubplus-downdubs-hover') || $(elementMouseIsOver).parents('.dubplus-downdubs-hover').length > 0) {
      setTimeout(function () {
        $(dubdownEl).mouseenter();
      }, 250);
    }
  });

  $(grabEl).click(function (event) {
    $('#dubplus-grabs-container').remove();
    var x = event.clientX,
        y = event.clientY;

    if (!x || !y || isNaN(x) || isNaN(y)) {
      return $('#dubplus-grabs-container').remove();
    }

    var elementMouseIsOver = document.elementFromPoint(x, y);

    if ($(elementMouseIsOver).hasClass('dubplus-grabs-hover') || $(elementMouseIsOver).parents('.dubplus-grabs-hover').length > 0) {
      setTimeout(function () {
        $(grabEl).mouseenter();
      }, 250);
    }
  });

  $(dubupEl).mouseenter(function (e) {
    var self = e.currentTarget;
    if ($("#dubplus-updubs-container").length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubupBackground = $('.dubup').hasClass('voted') ? $('.dubup').css('background-color') : $('.dubup').find('.icon-arrow-up').css('color');
    var html;

    if (window.dubplus.dubs.upDubs.length > 0) {
      html = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover" style="border-color: ' + dubupBackground + '">';

      window.dubplus.dubs.upDubs.forEach(function (val) {
        html += '<li class="preview-dubinfo-item users-previews dubplus-updubs-hover">' + '<div class="dubinfo-image">' + '<img src="https://api.dubtrack.fm/user/' + val.userid + '/image">' + '</div>' + '<span class="dubinfo-text">@' + val.username + '</span>' + '</li>';
      });
      html += '</ul>';
    } else {
      html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover dubplus-no-dubs" style="border-color: ' + dubupBackground + '">' + 'No updubs have been casted yet!' + '</div>';
    }

    var newEl = document.createElement('div');
    newEl.id = 'dubplus-updubs-container';
    newEl.className = 'dubinfo-show dubplus-updubs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + 'px';
    newEl.style.top = elemRect.top - 150 + 'px';

    //If info pane would run off screen set the position on right edge
    if (bodyRect.right - elemRect.left >= infoPaneWidth) {
      newEl.style.left = elemRect.left + 'px';
    } else {
      newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(self).addClass('dubplus-updubs-hover');

    $(document.body).on('click', '.preview-dubinfo-item', function (e) {
      var new_text = $(e.currentTarget).find('.dubinfo-text')[0].innerHTML + ' ';
      _this.updateChatInputWithString(new_text);
    });

    $('#dubinfo-preview').perfectScrollbar();

    $('.dubplus-updubs-hover').mouseleave(function (event) {
      var x = event.clientX,
          y = event.clientY;

      if (!x || !y || isNaN(x) || isNaN(y)) {
        return $('#dubplus-downdubs-container').remove();
      }

      var elementMouseIsOver = document.elementFromPoint(x, y);

      if (!$(elementMouseIsOver).hasClass('dubplus-updubs-hover') && !$(elementMouseIsOver).hasClass('ps-scrollbar-y') && $(elementMouseIsOver).parent('.dubplus-updubs-hover').length <= 0) {
        $('#dubplus-updubs-container').remove();
      }
    });
  });

  $(dubdownEl).mouseenter(function (e) {
    var self = e.currentTarget;
    if ($("#dubplus-downdubs-container").length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubdownBackground = $('.dubdown').hasClass('voted') ? $('.dubdown').css('background-color') : $('.dubdown').find('.icon-arrow-down').css('color');
    var html;

    if (_this.userIsAtLeastMod(Dubtrack.session.id)) {
      if (window.dubplus.dubs.downDubs.length > 0) {
        html = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover" style="border-color: ' + dubdownBackground + '">';
        window.dubplus.dubs.downDubs.forEach(function (val) {
          html += '<li class="preview-dubinfo-item users-previews dubplus-downdubs-hover">' + '<div class="dubinfo-image">' + '<img src="https://api.dubtrack.fm/user/' + val.userid + '/image">' + '</div>' + '<span class="dubinfo-text">@' + val.username + '</span>' + '</li>';
        });
        html += '</ul>';
      } else {
        html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-no-dubs" style="border-color: ' + dubdownBackground + '">' + 'No downdubs have been casted yet!' + '</div>';
      }
    } else {
      html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-downdubs-unauthorized" style="border-color: ' + dubdownBackground + '">' + 'You must be at least a mod to view downdubs!' + '</div>';
    }

    var newEl = document.createElement('div');
    newEl.id = 'dubplus-downdubs-container';
    newEl.className = 'dubinfo-show dubplus-downdubs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + 'px';
    newEl.style.top = elemRect.top - 150 + 'px';

    //If info pane would run off screen set the position on right edge
    if (bodyRect.right - elemRect.left >= infoPaneWidth) {
      newEl.style.left = elemRect.left + 'px';
    } else {
      newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(self).addClass('dubplus-downdubs-hover');

    $(document.body).on('click', '.preview-dubinfo-item', function (e) {
      var new_text = $(e.currentTarget).find('.dubinfo-text')[0].innerHTML + ' ';
      this.updateChatInputWithString(new_text);
    });

    $('#dubinfo-preview').perfectScrollbar();

    $('.dubplus-downdubs-hover').mouseleave(function (event) {
      var x = event.clientX,
          y = event.clientY;

      if (!x || !y || isNaN(x) || isNaN(y)) {
        return $('#dubplus-downdubs-container').remove();
      }

      var elementMouseIsOver = document.elementFromPoint(x, y);

      if (!$(elementMouseIsOver).hasClass('dubplus-downdubs-hover') && !$(elementMouseIsOver).hasClass('ps-scrollbar-y') && $(elementMouseIsOver).parent('.dubplus-downdubs-hover').length <= 0) {
        $('#dubplus-downdubs-container').remove();
      }
    });
  });

  $(grabEl).mouseenter(function (e) {
    var self = e.currentTarget;
    if ($("#dubplus-grabs-container").length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(grabEl).innerWidth();

    var grabsBackground = $('.add-to-playlist-button').hasClass('grabbed') ? $('.add-to-playlist-button').css('background-color') : $('.add-to-playlist-button').find('.icon-heart').css('color');

    var html;

    if (window.dubplus.dubs.grabs.length > 0) {
      html = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover" style="border-color: ' + grabsBackground + '">';

      window.dubplus.dubs.grabs.forEach(function (val) {
        html += '<li class="preview-dubinfo-item users-previews dubplus-grabs-hover">' + '<div class="dubinfo-image">' + '<img src="https://api.dubtrack.fm/user/' + val.userid + '/image">' + '</div>' + '<span class="dubinfo-text">@' + val.username + '</span>' + '</li>';
      });
      html += '</ul>';
    } else {

      html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover dubplus-no-grabs" style="border-color: ' + grabsBackground + '">' + 'This song hasn\'t been grabbed yet!' + '</div>';
    }

    var newEl = document.createElement('div');
    newEl.id = 'dubplus-grabs-container';
    newEl.className = 'dubinfo-show dubplus-grabs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + 'px';
    newEl.style.top = elemRect.top - 150 + 'px';

    //If info pane would run off screen set the position on right edge
    if (bodyRect.right - elemRect.left >= infoPaneWidth) {
      newEl.style.left = elemRect.left + 'px';
    } else {
      newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(self).addClass('dubplus-grabs-hover');

    $(document.body).on('click', '.preview-dubinfo-item', function (e) {
      var new_text = $(e.currentTarget).find('.dubinfo-text')[0].innerHTML + ' ';
      this.updateChatInputWithString(new_text);
    });

    $('#dubinfo-preview').perfectScrollbar();

    $('.dubplus-grabs-hover').mouseleave(function (event) {
      var x = event.clientX,
          y = event.clientY;

      if (!x || !y || isNaN(x) || isNaN(y)) {
        return $('#dubplus-grabs-container').remove();
      }

      var elementMouseIsOver = document.elementFromPoint(x, y);

      if (!$(elementMouseIsOver).hasClass('dubplus-grabs-hover') && !$(elementMouseIsOver).hasClass('ps-scrollbar-y') && $(elementMouseIsOver).parent('.dubplus-grabs-hover').length <= 0) {
        $('#dubplus-grabs-container').remove();
      }
    });
  });
};

dubshover.stopDubsOnHover = function () {
  Dubtrack.Events.unbind("realtime:room_playlist-dub", this.dubWatcher);
  Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabWatcher);
  Dubtrack.Events.unbind("realtime:user-leave", this.dubUserLeaveWatcher);
  Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetDubs);
  Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetGrabs); //TODO: Remove when we can hit the api for all grabs of current playing song
};

dubshover.dubUserLeaveWatcher = function (e) {
  //Remove user from dub list
  if ($.grep(window.dubplus.dubs.upDubs, function (el) {
    return el.userid === e.user._id;
  }).length > 0) {
    $.each(window.dubplus.dubs.upDubs, function (i) {
      if (window.dubplus.dubs.upDubs[i].userid === e.user._id) {
        window.dubplus.dubs.upDubs.splice(i, 1);
        return false;
      }
    });
  }
  if ($.grep(window.dubplus.dubs.downDubs, function (el) {
    return el.userid === e.user._id;
  }).length > 0) {
    $.each(window.dubplus.dubs.downDubs, function (i) {
      if (window.dubplus.dubs.downDubs[i].userid === e.user._id) {
        window.dubplus.dubs.downDubs.splice(i, 1);
        return false;
      }
    });
  }
  if ($.grep(window.dubplus.dubs.grabs, function (el) {
    return el.userid === e.user._id;
  }).length > 0) {
    $.each(window.dubplus.dubs.grabs, function (i) {
      if (window.dubplus.dubs.grabs[i].userid === e.user._id) {
        window.dubplus.dubs.grabs.splice(i, 1);
        return false;
      }
    });
  }
};

dubshover.grabWatcher = function (e) {
  //If grab already casted
  if ($.grep(window.dubplus.dubs.grabs, function (el) {
    return el.userid === e.user._id;
  }).length <= 0) {
    window.dubplus.dubs.grabs.push({
      userid: e.user._id,
      username: e.user.username
    });
  }
};

dubshover.updateChatInputWithString = function (str) {
  $("#chat-txt-message").val(str).focus();
};

dubshover.userIsAtLeastMod = function (userid) {
  return Dubtrack.helpers.isDubtrackAdmin(userid) || Dubtrack.room.users.getIfOwner(userid) || Dubtrack.room.users.getIfManager(userid) || Dubtrack.room.users.getIfMod(userid);
};

dubshover.deleteChatMessageClientSide = function (el) {
  $(el).parent('li')[0].remove();
};

dubshover.dubWatcher = function (e) {

  if (e.dubtype === 'updub') {

    //If dub already casted
    if ($.grep(window.dubplus.dubs.upDubs, function (el) {
      return el.userid === e.user._id;
    }).length <= 0) {
      window.dubplus.dubs.upDubs.push({
        userid: e.user._id,
        username: e.user.username
      });
    }

    //Remove user from other dubtype if exists
    if ($.grep(window.dubplus.dubs.downDubs, function (el) {
      return el.userid === e.user._id;
    }).length > 0) {
      $.each(window.dubplus.dubs.downDubs, function (i) {
        if (window.dubplus.dubs.downDubs[i].userid === e.user._id) {
          window.dubplus.dubs.downDubs.splice(i, 1);
          return false;
        }
      });
    }
  } else if (e.dubtype === 'downdub') {

    //If dub already casted
    if ($.grep(window.dubplus.dubs.downDubs, function (el) {
      return el.userid === e.user._id;
    }).length <= 0 && this.userIsAtLeastMod(Dubtrack.session.id)) {
      window.dubplus.dubs.downDubs.push({
        userid: e.user._id,
        username: e.user.username
      });
    }

    //Remove user from other dubtype if exists
    if ($.grep(window.dubplus.dubs.upDubs, function (el) {
      return el.userid === e.user._id;
    }).length > 0) {
      $.each(window.dubplus.dubs.upDubs, function (i) {
        if (window.dubplus.dubs.upDubs[i].userid === e.user._id) {
          window.dubplus.dubs.upDubs.splice(i, 1);
          return false;
        }
      });
    }
  }

  var msSinceSongStart = new Date() - new Date(Dubtrack.room.player.activeSong.attributes.song.played);
  if (msSinceSongStart < 1000) {
    return;
  }

  if (window.dubplus.dubs.upDubs.length !== Dubtrack.room.player.activeSong.attributes.song.updubs) {
    // console.log("Updubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
    this.resetDubs();
  } else if (this.userIsAtLeastMod(Dubtrack.session.id) && window.dubplus.dubs.downDubs.length !== Dubtrack.room.player.activeSong.attributes.song.downdubs) {
    // console.log("Downdubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
    this.resetDubs();
  }

  // TODO: Uncomment this else if block when we can hit the api for all grabs of current playing song
  /*
  else if(window.dubplus.dubs.grabs.length !== parseInt($('.grab-counter')[0].innerHTML)){
      console.log("Grabs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
      this.resetDubs();
  }*/
};

dubshover.resetDubs = function () {
  var _this2 = this;

  window.dubplus.dubs.upDubs = [];
  window.dubplus.dubs.downDubs = [];
  // window.dubplus.dubs.grabs: [] //TODO: Uncomment this when we can hit the api for all grabs of current playing song

  var dubsURL = "https://api.dubtrack.fm/room/" + Dubtrack.room.model.id + "/playlist/active/dubs";
  $.getJSON(dubsURL, function (response) {
    response.data.upDubs.forEach(function (e) {
      //Dub already casted (usually from autodub)
      if ($.grep(window.dubplus.dubs.upDubs, function (el) {
        return el.userid === e.userid;
      }).length > 0) {
        return;
      }

      var username;
      if (!Dubtrack.room.users.collection.findWhere({ userid: e.userid }) || !Dubtrack.room.users.collection.findWhere({ userid: e.userid }).attributes) {
        $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function (response) {
          if (response && response.userinfo) {
            username = response.userinfo.username;
          }
        });
      } else {
        username = Dubtrack.room.users.collection.findWhere({ userid: e.userid }).attributes._user.username;
      }

      if (!username) {
        return;
      }

      window.dubplus.dubs.upDubs.push({
        userid: e.userid,
        username: username
      });
    });
    //TODO: Uncomment this when we can hit the api for all grabs of current playing song
    /*response.data.grabs.forEach(function(e){
        //Dub already casted (usually from autodub)
        if($.grep(window.dubplus.dubs.grabs, function(el){ return el.userid == e.userid; }).length > 0){
            return;
        }
         var username;
        if(!Dubtrack.room.users.collection.findWhere({userid: e.userid}) || !Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes) {
            $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function(response){
                username = response.userinfo.username;
            });
        }
        else{
            username = Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username;
        }
         window.dubplus.dubs.grabs.push({
            userid: e.userid,
            username: username
        })
    });*/

    //Only let mods or higher access down dubs
    if (_this2.userIsAtLeastMod(Dubtrack.session.id)) {
      response.data.downDubs.forEach(function (e) {
        //Dub already casted
        if ($.grep(window.dubplus.dubs.downDubs, function (el) {
          return el.userid === e.userid;
        }).length > 0) {
          return;
        }

        var username;
        if (!Dubtrack.room.users.collection.findWhere({ userid: e.userid }) || !Dubtrack.room.users.collection.findWhere({ userid: e.userid }).attributes) {
          $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function (response) {
            username = response.userinfo.username;
          });
        } else {
          username = Dubtrack.room.users.collection.findWhere({ userid: e.userid }).attributes._user.username;
        }

        window.dubplus.dubs.downDubs.push({
          userid: e.userid,
          username: Dubtrack.room.users.collection.findWhere({ userid: e.userid }).attributes._user.username
        });
      });
    }
  });
};

/************************************************************/

dubshover.init = function () {

  window.dubplus.dubs = {
    upDubs: [],
    downDubs: [],
    grabs: []
  };

  if (this.optionState === true) {
    this.grabInfoWarning();
    this.showDubsOnHover();
  }
};

dubshover.go = function (e) {

  var newOptionState;
  if (!this.optionState) {
    newOptionState = true;

    this.showDubsOnHover();
    this.grabInfoWarning();
  } else {
    newOptionState = false;
    this.stopDubsOnHover();
  }

  // these following lines are standard, need to remove them and make
  // them part of loadModules
  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = dubshover;

},{"../utils/modal.js":24}],19:[function(require,module,exports){
"use strict";

/**
 * Snooze
 * Mutes audio for one song.
 *
 * This module is not a menu item, it is always automatically run on load
 */

/* global Dubtrack */
var myModule = {};

myModule.id = "snooze_btn";
myModule.moduleName = "Snooze";
myModule.description = "Mutes the current song.";

myModule.optionState = false; // not used in this module
myModule.category = false; // not used for this module
myModule.menuHTML = false; // not used for this module


var snooze_tooltip = function snooze_tooltip(e) {
    $(this).append('<div class="snooze_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">Mute current song</div>');
};

var hide_snooze_tooltip = function hide_snooze_tooltip() {
    $('.snooze_tooltip').remove();
};

var eventUtils = {
    currentVol: 50,
    snoozed: false
};

var eventSongAdvance = function eventSongAdvance(e) {
    if (e.startTime < 2) {
        if (eventUtils.snoozed) {
            Dubtrack.room.player.setVolume(eventUtils.currentVol);
            eventUtils.snoozed = false;
        }
        return true;
    }
};

var snooze = function snooze() {
    if (!eventUtils.snoozed && Dubtrack.room.player.player_volume_level > 2) {
        eventUtils.currentVol = Dubtrack.room.player.player_volume_level;
        Dubtrack.room.player.setVolume(0);
        eventUtils.snoozed = true;
        Dubtrack.Events.bind("realtime:room_playlist-update", eventSongAdvance);
    } else if (eventUtils.snoozed) {
        Dubtrack.room.player.setVolume(eventUtils.currentVol);
        eventUtils.snoozed = false;
    }
};

myModule.init = function () {
    $('.player_sharing').append('<span class="icon-mute snooze_btn"></span>');

    $('body').on('mouseover', '.snooze_btn', snooze_tooltip);
    $('body').on('mouseout', '.snooze_btn', hide_snooze_tooltip);
    $('body').on('click', '.snooze_btn', snooze);
};

module.exports = myModule;

},{}],20:[function(require,module,exports){
"use strict";

var menu = require('../lib/menu.js');

var snow = {};

snow.id = "dubplus-snow";
snow.moduleName = "Snow";
snow.description = "Make it snow!";
snow.optionState = false;
snow.category = "General";
snow.menuHTML = menu.makeOptionMenu(snow.moduleName, {
  id: snow.id,
  desc: snow.description
});

// this function will be run on each click of the menu
snow.go = function (e) {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $(document).snowfall({
      round: true,
      shadow: true,
      flakeCount: 50,
      minSize: 1,
      maxSize: 5,
      minSpeed: 5,
      maxSpeed: 5
    });
  } else {
    newOptionState = false;
    $(document).snowfall('clear');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = snow;

},{"../lib/menu.js":5}],21:[function(require,module,exports){
"use strict";

/**
 * Split Chat
 * Toggle Split chat mode
 */

var myModule = {};
myModule.id = "dubplus-split-chat";
myModule.moduleName = "Split Chat";
myModule.description = "Toggle Split Chat UI enhancement";
myModule.category = "User Interface";

myModule.init = function () {
  if (this.optionState) {
    $('body').addClass('dubplus-split-chat');
  }
};

myModule.go = function () {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('body').addClass('dubplus-split-chat');
  } else {
    newOptionState = false;
    $('body').removeClass('dubplus-split-chat');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;

},{}],22:[function(require,module,exports){
'use strict';

var settings = require("../lib/settings.js");

/**
 * Loads a CSS file into <head>.  It concats settings.srcRoot with the first argument (cssFile)
 * @param {string} cssFile    the css file location
 * @param {string} className  class name for element
 *
 * example:  css.load("/options/show_timestamps.css", "show_timestamps_link");
 */
var load = function load(cssFile, className) {
  if (!cssFile) {
    return;
  }
  var src = settings.srcRoot + cssFile;
  var cn = 'class="' + className + '"' || '';
  $('head').append('<link ' + cn + ' rel="stylesheet" type="text/css" href="' + src + '">');
};

/**
 * Loads a css file from a full URL in the <head>
 * @param  {String} cssFile   the full url location of a CSS file
 * @param  {String} className a class name to give to the <link> element
 * @return {undefined}           
 */
var loadExternal = function loadExternal(cssFile, className) {
  if (!cssFile) {
    return;
  }
  var cn = 'class="' + className + '"' || '';
  $('head').append('<link ' + cn + ' rel="stylesheet" type="text/css" href="' + cssFile + '">');
};

module.exports = {
  load: load,
  loadExternal: loadExternal
};

},{"../lib/settings.js":6}],23:[function(require,module,exports){
'use strict';

// jQuery's getJSON kept returning errors so making my own with promise-like
// structure and added optional Event to fire when done so can hook in elsewhere
var GetJSON = function GetJSON(url, optionalEvent, headers) {
  var doneEvent = optionalEvent ? new Event(optionalEvent) : null;

  function GetJ(_url, _cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', _url);
    if (headers) {
      for (var property in headers) {
        if (headers.hasOwnProperty(property)) {
          xhr.setRequestHeader(property, headers[property]);
        }
      }
    }
    xhr.send();
    xhr.onload = function () {
      var resp = xhr.responseText;
      if (typeof _cb === 'function') {
        _cb(resp);
      }
      if (doneEvent) {
        window.dispatchEvent(doneEvent);
      }
    };
  }

  var done = function done(cb) {
    new GetJ(url, cb);
  };
  return { done: done };
};

module.exports = GetJSON;

},{}],24:[function(require,module,exports){
'use strict';

function makeButtons(cb) {
  var buttons = '';
  if (cb) {
    buttons += '<button id="dp-modal-cancel">cancel</button>';
    buttons += '<button id="dp-modal-confirm">okay</button>';
  } else {
    buttons += '<button id="dp-modal-cancel">close</button>';
  }
  return buttons;
}

/**
 * input is a modal used to display messages and also capture data
 * 
 * @param  {String} title       title that shows at the top of the modal
 * @param  {String} content     A descriptive message on what the modal is for
 * @param  {String} placeholder placeholder for the textarea
 * @param  {String} confirm     a way to customize the text of the confirm button
 * @param  {Number} maxlength   for the textarea maxlength attribute
 */
var create = function create(options) {
  var defaults = {
    title: 'Dub+',
    content: '',
    value: '',
    placeholder: null,
    maxlength: 999,
    confirmCallback: null
  };
  var opts = $.extend({}, defaults, options);

  /*****************************************************
   * Create modal html string
   */

  // textarea in our modals are optional.  To add one, using the placeholder option will generate
  // a textarea in the modal
  var textarea = '';
  if (opts.placeholder) {
    textarea = '<textarea placeholder="' + opts.placeholder + '" maxlength="' + opts.maxlength + '">';
    textarea += opts.value;
    textarea += '</textarea>';
  }

  var dubplusModal = ['<div class="dp-modal">', '<aside class="container">', '<div class="title">', '<h1>' + opts.title + '</h1>', '</div>', '<div class="content">', '<p>' + opts.content + '</p>', textarea, '</div>', '<div class="dp-modal-buttons">', makeButtons(opts.confirmCallback), '</div>', '</aside>', '</div>'].join('');

  $('body').append(dubplusModal);

  /*****************************************************
   * Attach events to your modal
   */

  // if a confirm cb function was defined then we add a click event to the 
  // confirm button as well
  if (typeof opts.confirmCallback === 'function') {
    $('#dp-modal-confirm').one("click", function (e) {
      opts.confirmCallback();
      $('.dp-modal').remove();
    });
  }

  // add one time cancel click
  $('#dp-modal-cancel').one("click", function () {
    $('.dp-modal').remove();
  });

  // bind one time keyup ENTER and ESC events
  $(document).one('keyup', function (e) {
    // enter
    if (e.keyCode === 13 && typeof opts.confirmCallback === 'function') {
      opts.confirmCallback();
      $('.dp-modal').remove();
    }
    // esc
    if (e.keyCode === 27) {
      $('.dp-modal').remove();
    }
  });
};

var close = function close() {
  $('.dp-modal').remove();
};

module.exports = {
  create: create,
  close: close
};

},{}],25:[function(require,module,exports){
'use strict';

var settings = require("../lib/settings.js");

/**
 * Update settings and save all options to localStorage
 * @param  {String} where      Location in the settings object to save to
 * @param  {String} optionName 
 * @param  {String|Number|Boolean} value      
 */
var saveOption = function saveOption(where, optionName, value) {
  settings[where][optionName] = value;
  localStorage.setItem('dubplusUserSettings', JSON.stringify(settings));
};

var getAllOptions = function getAllOptions() {
  var _stored = localStorage.dubplusUserSettings;
  if (_stored) {
    return JSON.parse(_stored);
  } else {
    return settings;
  }
};

/**
 * Updates the on/off state of the option in the dubplus menu
 * @param  {String} selector name of the selector to be updated
 * @param  {Bool} state      true for "on", false for "off"
 * @return {undefined}         
 */
var toggle = function toggle(selector, state) {
  var $item = $(selector);
  if (!$item.length) {
    return;
  }

  if (state === true) {
    $item.addClass('dubplus-switch-on');
  } else {
    $item.removeClass('dubplus-switch-on');
  }
};

var toggleAndSave = function toggleAndSave(optionName, state) {
  toggle("#" + optionName, state);
  return saveOption('options', optionName, state);
};

module.exports = {
  toggle: toggle,
  toggleAndSave: toggleAndSave,
  getAllOptions: getAllOptions,
  saveOption: saveOption
};

},{"../lib/settings.js":6}]},{},[1]);
