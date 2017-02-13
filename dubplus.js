(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

/* globals Dubtrack, dubplusLoaded */
window.dubplusLoaded = false;
if (!dubplusLoaded && Dubtrack.session.id) {
    window.dubplusLoaded = true;

    init();

} else {
    css.load('/css/asset.css');
    var errorMsg;
    if (!Dubtrack.session.id) {
        errorMsg = 'You\'re not logged in. Please login to use Dub+.';
    } else {
        errorMsg = 'Oh noes! We\'ve encountered a runtime error';
    }
    modal.create({
        title: 'Oh noes:',
        content: errorMsg,
        confirmButtonClass: 'confirm-err'
    });
}
},{"./lib/init.js":4,"./utils/css.js":18,"./utils/modal.js":20}],2:[function(require,module,exports){
/* global Dubtrack, emojify */

var getJSON = require('../utils/getJSON.js');
var settings = require("../lib/settings.js");

var prepEmoji = {};

prepEmoji.emoji = {
    template: function(id) { return emojify.defaultConfig.img_dir+'/'+encodeURI(id)+'.png'; },
};
prepEmoji.twitch = {
    template: function(id) { return "//static-cdn.jtvnw.net/emoticons/v1/" + id + "/3.0"; },
    specialEmotes: [],
    emotes: {},
    chatRegex : new RegExp(":([-_a-z0-9]+):", "ig")
};
prepEmoji.bttv = {
    template: function(id) { return  "//cdn.betterttv.net/emote/" + id + "/3x";  },
    emotes: {},
    chatRegex : new RegExp(":([&!()\\-_a-z0-9]+):", "ig")
};
prepEmoji.tasty = {
    template: function(id) { return this.emotes[id].url; },
    emotes: {}
};
prepEmoji.shouldUpdateAPIs = function(apiName){
    var day = 86400000; // milliseconds in a day

    var today = Date.now();
    var lastSaved = parseInt(localStorage.getItem(apiName+'_api_timestamp'));
    // Is the lastsaved not a number for some strange reason, then we should update
    // are we past 5 days from last update? then we should update
    // does the data not exist in localStorage, then we should update
    return isNaN(lastSaved) || today - lastSaved > day * 5 || !localStorage[apiName +'_api'];
};
/**************************************************************************
 * Loads the twitch emotes from the api.
 * http://api.twitch.tv/kraken/chat/emoticon_images
 */
prepEmoji.loadTwitchEmotes = function(){
    var self = this;
    var savedData;
    // if it doesn't exist in localStorage or it's older than 5 days
    // grab it from the twitch API
    if (self.shouldUpdateAPIs('twitch')) {
        console.log('dub+','twitch','loading from api');
        var twApi = new getJSON('//api.twitch.tv/kraken/chat/emoticon_images', 'twitch:loaded');
        twApi.done(function(data){
            localStorage.setItem('twitch_api_timestamp', Date.now().toString());
            localStorage.setItem('twitch_api', data);
            self.processTwitchEmotes(JSON.parse(data));
        });
    } else {
        console.log('dub+','twitch','loading from localstorage');
        savedData = JSON.parse(localStorage.getItem('twitch_api'));
        self.processTwitchEmotes(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('twitch:loaded');
        document.body.dispatchEvent(twEvent);
    }

};

prepEmoji.loadBTTVEmotes = function(){
    var self = this;
    var savedData;
    // if it doesn't exist in localStorage or it's older than 5 days
    // grab it from the bttv API
    if (self.shouldUpdateAPIs('bttv')) {
        console.log('dub+','bttv','loading from api');
        var bttvApi = new getJSON('//api.betterttv.net/2/emotes', 'bttv:loaded');
        bttvApi.done(function(data){
            localStorage.setItem('bttv_api_timestamp', Date.now().toString());
            localStorage.setItem('bttv_api', data);
            self.processBTTVEmotes(JSON.parse(data));
        });
    } else {
        console.log('dub+','bttv','loading from localstorage');
        savedData = JSON.parse(localStorage.getItem('bttv_api'));
        self.processBTTVEmotes(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('bttv:loaded');
        document.body.dispatchEvent(twEvent);
    }

};

prepEmoji.loadTastyEmotes = function(){
    var self = this;
    var savedData;
    console.log('dub+','tasty','loading from api');
    // since we control this API we should always have it load from remote
    var tastyApi = new getJSON(settings.srcRoot + '/emotes/tastyemotes.json', 'tasty:loaded');
    tastyApi.done(function(data){
        localStorage.setItem('tasty_api', data);
        self.processTastyEmotes(JSON.parse(data));
    });
};

prepEmoji.processTwitchEmotes = function(data) {
    var self = this;
    data.emoticons.forEach(function(el,i,arr){
        var _key = el.code.toLowerCase();

        // move twitch non-named emojis to their own array
        if (el.code.indexOf('\\') >= 0) {
            self.twitch.specialEmotes.push([el.code, el.id]);
            return;
        }

        if (emojify.emojiNames.indexOf(_key) >= 0) {
            return; // do nothing so we don't override emoji
        }

        if (!self.twitch.emotes[_key]){
            // if emote doesn't exist, add it
            self.twitch.emotes[_key] = el.id;
        } else if (el.emoticon_set === null) {
            // override if it's a global emote (null set = global emote)
            self.twitch.emotes[_key] = el.id;
        }

    });
    self.twitchJSONSLoaded = true;
    self.emojiEmotes = emojify.emojiNames.concat(Object.keys(self.twitch.emotes));
};

prepEmoji.processBTTVEmotes = function(data){
    var self = this;
    data.emotes.forEach(function(el,i,arr){
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

        self.bttv.emotes[_key] = el.id;

    });
    self.bttvJSONSLoaded = true;
    self.emojiEmotes = self.emojiEmotes.concat(Object.keys(self.bttv.emotes));
};

prepEmoji.processTastyEmotes = function(data) {
    var self = this;
    self.tasty.emotes = data.emotes;
    self.tastyJSONLoaded = true;
    self.emojiEmotes = self.emojiEmotes.concat(Object.keys(self.tasty.emotes));
};

module.exports = prepEmoji;
},{"../lib/settings.js":7,"../utils/getJSON.js":19}],3:[function(require,module,exports){
'use strict';
/**
 * convert all the current individual saved settings to the new version
 *
 * Options will be saved as JSON made from the dubplus.options object under one location
 */

var oldSettings = {
  general : [
    'autovote',
    'split_chat',
    'medium_disable',
    'warn_redirect',
    'chat_window',
    'hide_avatars',
    'show_timestamps',
    'video_window',
    'css_world',
    'twitch_emotes',
    'emoji_preview',
    'autocomplete_mentions',
    'mention_notifications',
    'custom_mentions',
    'spacebar_mute',
    'downdub_chat',
    'updub_chat',
    'grab_chat',
    'dubs_hover',
    'snow',
    'medium'
  ],
  menu: [
    'draw_general',
    'draw_userinterface',
    'draw_settings',
    'draw_customize',
    'draw_contact',
    'draw_social',
    'draw_chrome',
  ],
  custom: [
    'css',
    'customAfkMessage'
  ]
};


var convertSettings = function(){

  if ( localStorage.getItem( 'dubplusUserSettings') !== null ) {
    // new settings already exist, nothing do here, load old settings and return it
    return JSON.parse( localStorage.getItem( 'dubplusUserSettings' ) );
  }

  var newSettings = {
    options : {},
    menu : {},
    custom : {}
  };

  oldSettings.general.forEach(function(el,i,r){
    newSettings.options[el] = localStorage.getItem(el);
  });

  oldSettings.menu.forEach(function(el,i,r){
    newSettings.menu[el] = localStorage.getItem(el);
  });

  oldSettings.custom.forEach(function(el,i,r){
    newSettings.custom[el] = localStorage.getItem(el);
  });

  localStorage.setItem( 'dubplusUserSettings', JSON.stringify(newSettings) );
  return newSettings;
};

var delOldSettings = function(){

  oldSettings.general.forEach(function(el,i,r){
    localStorage.removeItem(el);
  });

  oldSettings.menu.forEach(function(el,i,r){
    localStorage.removeItem(el);
  });

  oldSettings.custom.forEach(function(el,i,r){
    localStorage.removeItem(el);
  });
};


module.exports = {
  go: convertSettings,
  delOldSettings: delOldSettings
};
},{}],4:[function(require,module,exports){
'use strict';
/* global Dubtrack */
var convertSettings = require('./convertSettings.js');
var modules = require('./loadModules.js');
var css = require('../utils/css.js');
var menu = require('./menu.js');

/*
  The following are elements that are always done on load
*/

module.exports = function(){
  // load our main CSS
  css.load('/css/dubplus.css');
  
  // convert all old settings to the new system
  convertSettings.go();
  convertSettings.delOldSettings();

  // add a 'global' css class just in case we need more specificity in our css
  $('html').addClass('dubplus');

  // load third party snowfall feature
  $.getScript('https://rawgit.com/loktar00/JQuery-Snowfall/master/src/snowfall.jquery.js');

  // ?
  // $('.icon-mute.snooze_btn:after').css({"content": "1", "vertical-align": "top", "font-size": "0.75rem", "font-weight": "700"});

  // make menu before loading the modules
  var menuString = menu.beginMenu();

  // load all our modules into the 'dubplus' global object
  // it also builds the menu dynamically
  modules.loadAllModulesTo('dubplus');

  // finalize the menu and add it to the UI
  menu.finishMenu(menuString);

  // dubplus.previewListInit();
  // dubplus.userAutoComplete();

  // I'm not sure we need this anymore now that they added
  // $('.chat-main').on('DOMNodeInserted', function(e) {
  //     var itemEl = $(e.target);
  //     if(itemEl.prop('tagName').toLowerCase() !== 'li' || itemEl.attr('class').substring(0, 'user-'.length) !== 'user-') return;
  //     var user = Dubtrack.room.users.collection.findWhere({userid: itemEl.attr('class').split(/-| /)[1]});
  //     var role = !user.get('roleid') ? 'default' : Dubtrack.helpers.isDubtrackAdmin(user.get('userid')) ? 'admin' : user.get('roleid').type;
  //     itemEl.addClass('is' + (role.charAt(0).toUpperCase() + role.slice(1)));
  // });

};
},{"../utils/css.js":18,"./convertSettings.js":3,"./loadModules.js":5,"./menu.js":6}],5:[function(require,module,exports){
'use strict';
var options = require('../utils/options.js');
var menu = require('../lib/menu.js');
var modules = require('../modules/index.js');
var storedSettings = options.getAllOptions();

/**
 * Loads all the modules in /modules and initliazes them
 * @param  {Object} globalObject The target global object that modules will be added to.  In our case it will be window.dubplus
 */
var loadAllModulesTo = function(globalObject){
    if (typeof window[globalObject] === "undefined") {
        window[globalObject] = {};
    }

    modules.forEach(function(mod, i, r){
        globalObject[mod.id] = mod;
        globalObject[mod.id].toggleAndSave = options.toggleAndSave;
        
        // add event listener
        if (typeof mod.go === 'function'){
          $('body').on('click', '#'+mod.id, mod.go.bind(mod) );
        }

        // if module has a definied init function, run that first
        if (typeof mod.init === 'function') { 
          mod.init.bind(mod); 
        }

        // add the menu item to the appropriate category section
        if (mod.menuHTML && mod.category) {
          menu.appendToSection(mod.category, mod.menuHTML );
        }

        // check localStorage for saved settings and update modules optionState
        if (typeof storedSettings.options[mod.id] !== 'undefined') {
          mod.optionState = storedSettings.options[mod.id];

          // run module's go function if setting was true
          if ( (storedSettings.options[mod.id] === 'true' || storedSettings.options[mod.id] === true) && typeof mod.go === 'function' ) {
            mod.go.call(mod, "onLoad");
          }
        }
    
    });

};

module.exports = {
  loadAllModulesTo : loadAllModulesTo
};
},{"../lib/menu.js":6,"../modules/index.js":14,"../utils/options.js":21}],6:[function(require,module,exports){
'use strict';
var options = require('../utils/options.js');
var settings = require('./settings.js');
var css = require('../utils/css.js');

var menu = {
    'General' : '',
    'User Interface' : '',
    'Settings' : '',
    'Customize' : '',
    'Contact' : [
      '<div id="dubplus-contact" class="dubplus-menu-section-header">',
        '<span class="fa fa-angle-down"></span>',
        '<p>Contact</p>',
      '</div>',
      '<ul class="dubplus-menu-section">',
        '<li class="dubplus-menu-icon">',
          '<span class="fa fa-bug"></span>',
          '<a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>',
        '</li>',
         '<li class="dubplus-menu-icon">',
          '<span class="fa fa-facebook"></span>',
          '<a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>',
        '</li>',
        '<li class="dubplus-menu-icon">',
          '<span class="fa fa-twitter"></span>',
          '<a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>',
        '</li>',
      '</ul>',
    ].join(''),
  };

module.exports = {
  beginMenu : function(){
    // load font-awesome icons from CDN to be used in the menu
    css.loadExternal('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    
    // add icon to the upper right corner
    var menuIcon = '<div class="dubplus-icon"><img src="'+settings.srcRoot+'/images/dubplus.svg" alt=""></div>';
    $('.header-right-navigation').append(menuIcon);

    // hide/show the  menu when you click on the icon in the top right
    $('body').on('click', '.dubplus-icon', function(e){
      $('.dubplus-menu').toggleClass('dubplus-menu-open');
    });

    // make the menu
    var dp_menu_html = [
        '<section class="menu-container dubplus-menu dubplus-open">',
          '<p class="dubplus-menu-header">Dub+ Settings</p>',
        '</section>'
    ].join('');

    return dp_menu_html;
  },

  appendToSection : function(section, menuItemHtml) {
    if (menu[section]) {
      menu[section] += menuItemHtml;
    }
  },

  finishMenu  : function(menuString) {
    // dynamically create our menu from strings provided by each module
    for (var category in menu) {
      if (category === 'Contact') { continue; }
      var id = 'dubplus-' + category.replace(" ", "-").toLowerCase();
      menuString += [
        '<div id="'+id+'" class="dubplus-menu-section-header">',
          '<span class="fa fa-angle-down"></span>',
          '<p>'+category+'</p>',
        '</div>',
        '<ul class="dubplus-menu-section">'
      ].join('');
      menuString += menu[category];
      menuString += '</ul>';
    }

    // contact section last, is already fully formed, not dynamic
    menuString += menu.contact;
    // final part of the menu string
    menuString += '</section>';

    // add it to the DOM
    $('body').prepend(menuString);
    // use the perfectScrollBar plugin to make it look nice
    // $('.dubplus-menu').perfectScrollbar();
  },

  makeOptionMenu : function(menuTitle, options){
    var defaults = {
      id : '',
      desc : '',
      state : false, 
      extraIcon : null,
      cssClass : ''
    };
    var opts  = $.extend({}, defaults, options);
    var _extra = '';
    var _state = opts.state ? 'dubplus-switch-on' : '';
    if (opts.extraIcon) {
      _extra = '<span class="fa fa-'+opts.extraIcon+' extra-icon"></span>';
    }
    return [
      '<li id="'+opts.id+'"" class="dubplus-switch '+opts.cssClass+'" title="'+opts.desc+'">',  
        '<div class="dubplus-switch-bg '+_state+'">',
          '<div class="dubplus-switcher"></div>', 
        '</div>',
        '<span class="dubplus-menu-label">'+menuTitle+'</span>',
        _extra,
      '</li>',
    ].join('');
  },

  makeLinkMenu : function(menuTitle, icon, link, options){
    var defaults = {
      id : '',
      desc : '',
      cssClass : ''
    };
    var opts  = $.extend({}, defaults, options);
    return [
      '<li id="'+opts.id+'"" class="dubplus-menu-icon '+opts.cssClass+'" title="'+opts.desc+'">',  
        '<span class="fa fa-'+icon+'"></span>',
        '<a href="'+link+'" class="dubplus-menu-label" target="_blank">'+menuTitle+'</a>',
      '</li>',
    ].join('');
  }

};



},{"../utils/css.js":18,"../utils/options.js":21,"./settings.js":7}],7:[function(require,module,exports){
(function (CURRENT_BRANCH){
/**
 * Settings
 * this will hold all the "global" (dubplus) settings
 */
module.exports = {
  // options and constants  
  our_version : '03.06.00 - The rewrite',
  srcRoot: 'https://rawgit.com/FranciscoG/DubPlus/'+CURRENT_BRANCH,
  options : {
      let_autovote: false,
      let_split_chat: false,
      let_fs: false,
      let_medium_disable: false,
      let_warn_redirect: false,
      let_afk: false,
      let_active_afk: true,
      let_chat_window: false,
      let_css: false,
      let_hide_avatars: false,
      let_show_timestamps: false,
      let_video_window: false,
      let_twitch_emotes: false,
      let_emoji_preview: false,
      let_spacebar_mute: false,
      let_autocomplete_mentions: false,
      let_mention_notifications: false,
      let_downdub_chat_notifications: false,
      let_updub_chat_notifications: false,
      let_grab_chat_notifications: false,
      let_dubs_hover: false,
      let_custom_mentions: false,
      let_snow: false,
      draw_general: false,
      draw_userinterface: false,
      draw_settings: false,
      draw_customize: false,
      draw_contact: false,
      draw_social: false,
      draw_chrome: false
    },
    dubs : {
      upDubs: [],
      downDubs: [],
      grabs: []
    },
    menu : {},
    custom: {}
};

}).call(this,'dev')
},{}],8:[function(require,module,exports){
/**
 * AFK -  Away from Keyboard
 * Toggles the afk auto response on/off
 * including adding a custom message
 */

/* global Dubtrack */
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");

var afk_module = {};
afk_module.id = "afk";
afk_module.moduleName = "AFK Autorespond";
afk_module.description = "Toggle Away from Keyboard and customize AFK message.";
afk_module.optionState = false;
afk_module.category = "General";
afk_module.menuHTML = menu.makeOptionMenu(afk_module.moduleName, {
    id : 'dubplus-afk',
    desc : afk_module.description,
    extraIcon : 'pencil',
  });

var afk_chat_respond = function(e) {
  var content = e.message;
  var user = Dubtrack.session.get('username');
  
  if (content.indexOf('@'+user) > -1 && Dubtrack.session.id !== e.user.userInfo.userid) {
  
      if (this.optionState) {
          if (settings.custom.customAfkMessage) {
              $('#chat-txt-message').val('[AFK] '+ settings.custom.customAfkMessage);
          } else {
              $('#chat-txt-message').val("[AFK] I'm not here right now.");
          }
          Dubtrack.room.chat.sendMessage();
          this.optionState = false;

          var self = this;
          setTimeout(function() {
              self.optionState = true;
          }, 180000);
      }

  }
};

var saveAFKmessage =function() {
    var customAfkMessage = $('.input').val();
    options.saveOption('customAfkMessage', customAfkMessage);
};

var editAFKmessage = function() {
    var current = settings.custom.customAfkMessage;
    modal.create({
        title: 'Custom AFK Message',
        content: current,
        placeholder: 'I\'m not here right now.',
        confirmButtonClass: 'confirm-for315',
        maxlength: '255',
        confirmCallback: saveAFKmessage
    });
};

afk_module.init = function(){
  // this opens the dialog modal to add your custom away message
  $('body').on('click', '#dubplus-afk .extra-icon', editAFKmessage);
};

afk_module.go = function(e) {
    if(typeof e === 'object' && (e.target.className === 'for_content_edit' || e.target.className === 'fi-pencil')) {
        return;
    }
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

module.exports = afk_module;
},{"../lib/menu.js":6,"../lib/settings.js":7,"../utils/modal.js":20,"../utils/options.js":21}],9:[function(require,module,exports){
/* global Dubtrack */
var menu = require('../lib/menu.js');

var autovote = {};

autovote.id = "autovote";
autovote.moduleName = "Autovote";
autovote.description = "Toggles auto upvoting for every song";
autovote.optionState = false;
autovote.category = "General";
autovote.menuHTML = menu.makeOptionMenu(autovote.moduleName, {
    id : 'dubplus-autovote',
    desc : autovote.description
  });

// this function will be run on each click of the menu
autovote.go = function(e){
  var newOptionState;
  
  if (!this.optionState) {
      newOptionState = true;

      var song = Dubtrack.room.player.activeSong.get('song');
      var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
      var dubsong = Dubtrack.helpers.cookie.get('dub-song');

      if (!Dubtrack.room || !song || song.songid !== dubsong) {
          dubCookie = false;
      }
      //Only cast the vote if user hasn't already voted
      if (!$('.dubup, .dubdown').hasClass('voted') && !dubCookie) {
          this.advance_vote();
      }

      Dubtrack.Events.bind("realtime:room_playlist-update", this.voteCheck);
  } else {
      newOptionState = false;
      Dubtrack.Events.unbind("realtime:room_playlist-update", this.voteCheck);
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

// add any custom functions to this module
autovote.advance_vote = function() {
  $('.dubup').click();
};

autovote.voteCheck = function (obj) {
  if (obj.startTime < 2) {
      this.advance_vote();
  }
};

module.exports = autovote;
},{"../lib/menu.js":6}],10:[function(require,module,exports){
/**
 * Emotes
 * Adds additional Twitch, BTTV, and Tasty Emotes to the chat window 
 */

/* global Dubtrack, emojify */
var options = require('../utils/options.js');
var menu = require('../lib/menu.js');
var dubplus_emoji = require('../emojiUtils/prepEmoji.js');


var emote_module = {};

emote_module.id = "emotes";
emote_module.moduleName = "Emotes";
emote_module.description = "Toggle addiontal emotes support. (twitch, bttv, etc)";
emote_module.optionState = false;
emote_module.category = "General";
emote_module.menuHTML = menu.makeOptionMenu(emote_module.moduleName, {
    id : 'dubplus-emotes',
    desc : emote_module.description
  });

function makeImage(type, src, name, w, h){
  return '<img class="emoji '+type+'-emote" '+
    (w ? 'width="'+w+'" ' : '') +
    (h ? 'height="'+h+'" ' : '') +
     'title="'+name+'" alt="'+name+'" src="'+src+'" />';
}

/**********************************************************************
 * handles replacing twitch emotes in the chat box with the images
 */

emote_module.replaceTextWithEmote = function(){
    var _regex = dubplus_emoji.twitch.chatRegex;

    if (!dubplus_emoji.twitchJSONSLoaded) { return; } // can't do anything until jsons are loaded

    var $chatTarget = $('.chat-main .text').last();
    
    if (!$chatTarget.html()) { return; } // nothing to do

    if (dubplus_emoji.bttvJSONSLoaded) { _regex = dubplus_emoji.bttv.chatRegex; }

    var emoted = $chatTarget.html().replace(_regex, function(matched, p1){
        var _id, _src, _desc, key = p1.toLowerCase();

        if ( dubplus_emoji.twitch.emotes[key] ){
            _id = dubplus_emoji.twitch.emotes[key];
            _src = dubplus_emoji.twitch.template(_id);
            return makeImage("twitch", _src, key);
        } else if ( dubplus_emoji.bttv.emotes[key] ) {
            _id = dubplus_emoji.bttv.emotes[key];
            _src = dubplus_emoji.bttv.template(_id);
            return makeImage("bttv", _src, key);
        } else if ( dubplus_emoji.tasty.emotes[key] ) {
            _src = dubplus_emoji.tasty.template(key);
            return makeImage("tasty", _src, key, dubplus_emoji.tasty.emotes[key].width, dubplus_emoji.tasty.emotes[key].height);
        } else {
            return matched;
        }

    });

    $chatTarget.html(emoted);
};

/**************************************************************************
 * Turn on/off the twitch emoji in chat
 */
emote_module.go = function(){
    document.body.addEventListener('twitch:loaded', dubplus_emoji.loadBTTVEmotes);
    document.body.addEventListener('bttv:loaded', dubplus_emoji.loadTastyEmotes);
    
    var newOptionState;
    var optionName = 'twitch_emotes';

    if (!emote_module.optionState) {
        
        if (!dubplus_emoji.twitchJSONSLoaded) {
            dubplus_emoji.loadTwitchEmotes();
        } else {
            this.replaceTextWithEmote();
        }

        Dubtrack.Events.bind("realtime:chat-message", this.replaceTextWithEmote);
        newOptionState = true;
    } else {
        Dubtrack.Events.unbind("realtime:chat-message", this.replaceTextWithEmote);
        newOptionState = false;
    }

    this.optionState = newOptionState;
    this.toggleAndSave(this.id, newOptionState);
};


module.exports = emote_module;
},{"../emojiUtils/prepEmoji.js":2,"../lib/menu.js":6,"../utils/options.js":21}],11:[function(require,module,exports){
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

var eta = function() {
    var time = 4;
    var current_time = parseInt($('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min').text());
    var booth_duration = parseInt($('.queue-position').text());
    var booth_time = (booth_duration * time - time) + current_time;
    
    if (booth_time >= 0) {
        $(this).append('<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">ETA: '+booth_time+' minutes</div>');
    } else {
        $(this).append('<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">You\'re not in the queue</div>');
    }
};

var hide_eta = function() {
    $(this).empty();
};

myModule.init = function() {
  $('.player_sharing').append('<span class="icon-history eta_tooltip_t"></span>');
  $('.eta_tooltip_t').mouseover(eta).mouseout(hide_eta);
};

module.exports = myModule;
},{}],12:[function(require,module,exports){
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
},{"../lib/menu.js":6}],13:[function(require,module,exports){
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
    id : 'dubplus-grabs-chat',
    desc : grabs_chat.description
  });

grabs_chat.grabChatWatcher = function(e){
    var user = Dubtrack.session.get('username');
    var currentDj = Dubtrack.room.users.collection.findWhere({
        userid: Dubtrack.room.player.activeSong.attributes.song.userid
    }).attributes._user.username;


    if(user === currentDj && !Dubtrack.room.model.get('displayUserGrab')){
        $('ul.chat-main').append(
            '<li class="dubplus-chat-system dubplus-chat-system-grab">' +
                '<div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)"><span class="icon-close"></span></div>' +
                '<div class="text">' +
                    '@' + e.user.username + ' has grabbed your song \'' + Dubtrack.room.player.activeSong.attributes.songInfo.name + ' \'' +
                '</div>' +
            '</li>');
    }
};

grabs_chat.go = function() {
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
},{"../lib/menu.js":6,"../lib/settings.js":7,"../utils/css.js":18,"../utils/modal.js":20}],14:[function(require,module,exports){
// put this in order of appearance in the menu
module.exports = [
  // General 
  require('./autovote.js'),
  require('./afk.js'),
  require('./emotes.js'),
  // autocomplete emoji
  // autocomplete mentions
  // cusomt mention triggers
  // notifications on mentions
  require('./showDubsOnHover.js'),
  // Downdubs in chat (mod only)
  // Updubs in chat
  require('./grabsInChat.js'),
  require('./snow.js'),
  
  // User Interface
  require('./fullscreen.js'),
  // require('./splitchat.js'),
  // require('./hideChat.js'),
  // require('./hideVideo.js'),
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

  // // Contact
  // require('./bugReport.js'),

  // non-menu modules
  require('./snooze.js'),
  require('./eta.js')
];
},{"./afk.js":8,"./autovote.js":9,"./emotes.js":10,"./eta.js":11,"./fullscreen.js":12,"./grabsInChat.js":13,"./showDubsOnHover.js":15,"./snooze.js":16,"./snow.js":17}],15:[function(require,module,exports){
/**
 * Show Dubs on Hover
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var css = require('../utils/css.js');
var modal = require('../utils/modal.js');
var settings = require("../lib/settings.js");

var dubshover = {};

dubshover.id = "dubs-hover";
dubshover.moduleName = "Show Dub info on Hover";
dubshover.description = "Show Dub info on Hover.";
dubshover.optionState = false;
dubshover.category = "General";
dubshover.menuHTML = menu.makeOptionMenu(dubshover.moduleName, {
    id : 'dubplus-dubs-hover',
    desc : dubshover.description
  });

dubshover.go = function(e) {
  
  var newOptionState;
  if (!this.optionState) {
    newOptionState = true;
    
    this.grabInfoWarning();
    this.showDubsOnHover();

  } else {
    newOptionState = false;
    this.stopDubsOnHover();
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = dubshover;

/*******************************/


dubshover.resetGrabs = function(){
  this.dubs.grabs = []; //TODO: Remove when we can hit the api for all grabs of current playing song
};

dubshover.grabInfoWarning = function(){
    modal.create({
      title: 'Grab Vote Info',
      content: 'Please note that this feature is currently still in development. We are waiting on the ability to pull grab vote information from Dubtrack on load. Until then the only grabs you will be able to see are those you are present in the room for.',
      confirmButtonClass: 'confirm-for-grab-info'
    });
};

dubshover.showDubsOnHover = function(){
  var self = this;

  this.resetDubs();

  Dubtrack.Events.bind("realtime:room_playlist-dub", this.dubWatcher);
  Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabWatcher);
  Dubtrack.Events.bind("realtime:user-leave", this.dubUserLeaveWatcher);
  Dubtrack.Events.bind("realtime:room_playlist-update", this.resetDubs);
  Dubtrack.Events.bind("realtime:room_playlist-update", this.resetGrabs); //TODO: Remove when we can hit the api for all grabs of current playing song

  var dubupEl = $('.dubup').first().parent('li');
  var dubdownEl = $('.dubdown').first().parent('li');
  var grabEl = $('.add-to-playlist-button').first().parent('li');

  $(dubupEl).addClass("dubplus-updubs-hover");
  $(dubdownEl).addClass("dubplus-downdubs-hover");
  $(grabEl).addClass("dubplus-grabs-hover");

  //Show compiled info containers when casting/changing vote
  $(dubdownbupEl).click(function(event){
    $('#dubplus-updubs-container').remove();
        var x = event.clientX, y = event.clientY;

        if(!x || !y || isNaN(x) || isNaN(y)){
            return $('#dubplus-downdubs-container').remove();
        }

        var elementMouseIsOver = document.elementFromPoint(x, y);

    if($(elementMouseIsOver).hasClass('dubplus-updubs-hover') || $(elementMouseIsOver).parents('.dubplus-updubs-hover').length > 0){
        setTimeout(function(){$(dubupEl).mouseenter();}, 250);
    }
  });
  $(dubdownEl).click(function(event){
    $('#dubplus-downdubs-container').remove();
        var x = event.clientX, y = event.clientY;

        if(!x || !y || isNaN(x) || isNaN(y)){
            return $('#dubplus-downdubs-container').remove();
        }

        var elementMouseIsOver = document.elementFromPoint(x, y);

    if($(elementMouseIsOver).hasClass('dubplus-downdubs-hover') || $(elementMouseIsOver).parents('.dubplus-downdubs-hover').length > 0){
        setTimeout(function(){$(dubdownEl).mouseenter();}, 250);
    }
  });
  $(grabEl).click(function(event){
    $('#dubplus-grabs-container').remove();
        var x = event.clientX, y = event.clientY;

        if(!x || !y || isNaN(x) || isNaN(y)){
            return $('#dubplus-grabs-container').remove();
        }

        var elementMouseIsOver = document.elementFromPoint(x, y);

    if($(elementMouseIsOver).hasClass('dubplus-grabs-hover') || $(elementMouseIsOver).parents('.dubplus-grabs-hover').length > 0){
        setTimeout(function(){$(grabEl).mouseenter();}, 250);
    }
  });

  $(dubupEl).mouseenter(function(){
    if($("#dubplus-updubs-container").length > 0) return; //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubupBackground = $('.dubup').hasClass('voted') ? $('.dubup').css('background-color') : $('.dubup').find('.icon-arrow-up').css('color');
    var html;

    if(this.dubs.upDubs.length > 0){
        html = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover" style="border-color: '+dubupBackground+'">';
        this.dubs.upDubs.forEach(function(val){
            html += '<li class="preview-dubinfo-item users-previews dubplus-updubs-hover">' +
                        '<div class="dubinfo-image">' +
                            '<img src="https://api.dubtrack.fm/user/' + val.userid + '/image">' +
                        '</div>' +
                        '<span class="dubinfo-text">@' + val.username + '</span>' +
                    '</li>'
        });
        html += '</ul>';                     
    }
    else{
        html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover dubplus-no-dubs" style="border-color: '+dubupBackground+'">' +
                    'No updubs have been casted yet!' +
                '</div>';
    }

    var newEl = document.createElement('div');
    newEl.id = 'dubplus-updubs-container';
    newEl.className = 'dubinfo-show dubplus-updubs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = this.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + 'px';
    newEl.style.top = (elemRect.top-150) + 'px';

    //If info pane would run off screen set the position on right edge
    if(bodyRect.right - elemRect.left >= infoPaneWidth){
        newEl.style.left = elemRect.left + 'px';
    }
    else{
        newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(this).addClass('dubplus-updubs-hover');

    $(document.body).on('click', '.preview-dubinfo-item', function(e){
        var new_text = $(this).find('.dubinfo-text')[0].innerHTML + ' ' ;
        self.updateChatInputWithString(new_text);
    });

    $('#dubinfo-preview').perfectScrollbar();

    $('.dubplus-updubs-hover').mouseleave(function(event){
        var x = event.clientX, y = event.clientY;

        if(!x || !y || isNaN(x) || isNaN(y)){
            return $('#dubplus-downdubs-container').remove();
        }

        var elementMouseIsOver = document.elementFromPoint(x, y);

        if(!$(elementMouseIsOver).hasClass('dubplus-updubs-hover') && !$(elementMouseIsOver).hasClass('ps-scrollbar-y') && $(elementMouseIsOver).parent('.dubplus-updubs-hover').length <= 0){
            $('#dubplus-updubs-container').remove();
        }

    });
  });
  $(dubdownEl).mouseenter(function(){
    if($("#dubplus-downdubs-container").length > 0) return; //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubdownBackground = $('.dubdown').hasClass('voted') ? $('.dubdown').css('background-color') : $('.dubdown').find('.icon-arrow-down').css('color');
    var html;

    if(this.userIsAtLeastMod(Dubtrack.session.id)){
        if(this.dubs.downDubs.length > 0){
            html = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover" style="border-color: '+dubdownBackground+'">';
            this.dubs.downDubs.forEach(function(val){
                html += '<li class="preview-dubinfo-item users-previews dubplus-downdubs-hover">' +
                            '<div class="dubinfo-image">' +
                                '<img src="https://api.dubtrack.fm/user/' + val.userid + '/image">' +
                            '</div>' +
                            '<span class="dubinfo-text">@' + val.username + '</span>' +
                        '</li>'
            });
            html += '</ul>';                     
        }
        else{
            html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-no-dubs" style="border-color: '+dubdownBackground+'">' +
                        'No downdubs have been casted yet!' +
                    '</div>';
        }
    }
    else{
        html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-downdubs-unauthorized" style="border-color: '+dubdownBackground+'">' +
                    'You must be at least a mod to view downdubs!' +
                '</div>';
    }

    var newEl = document.createElement('div');
    newEl.id = 'dubplus-downdubs-container';
    newEl.className = 'dubinfo-show dubplus-downdubs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = this.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + 'px';
    newEl.style.top = (elemRect.top-150) + 'px';

    //If info pane would run off screen set the position on right edge
    if(bodyRect.right - elemRect.left >= infoPaneWidth){
        newEl.style.left = elemRect.left + 'px';
    }
    else{
        newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(this).addClass('dubplus-downdubs-hover');

    $(document.body).on('click', '.preview-dubinfo-item', function(e){
        var new_text = $(this).find('.dubinfo-text')[0].innerHTML + ' ' ;
        self.updateChatInputWithString(new_text);
    });

    $('#dubinfo-preview').perfectScrollbar();

    $('.dubplus-downdubs-hover').mouseleave(function(event){
        var x = event.clientX, y = event.clientY;

        if(!x || !y || isNaN(x) || isNaN(y)){
            return $('#dubplus-downdubs-container').remove();
        }

        var elementMouseIsOver = document.elementFromPoint(x, y);

        if(!$(elementMouseIsOver).hasClass('dubplus-downdubs-hover') && !$(elementMouseIsOver).hasClass('ps-scrollbar-y') && $(elementMouseIsOver).parent('.dubplus-downdubs-hover').length <= 0){
            $('#dubplus-downdubs-container').remove();
        }

    });
  });
  $(grabEl).mouseenter(function(){
    if($("#dubplus-grabs-container").length > 0) return; //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(grabEl).innerWidth();
    var grabsBackground = $('.add-to-playlist-button').hasClass('grabbed') ? $('.add-to-playlist-button').css('background-color') : $('.add-to-playlist-button').find('.icon-heart').css('color');
    var html;

    if(this.dubs.grabs.length > 0){
        html = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover" style="border-color: '+grabsBackground+'">';
        this.dubs.grabs.forEach(function(val){
            html += '<li class="preview-dubinfo-item users-previews dubplus-grabs-hover">' +
                        '<div class="dubinfo-image">' +
                            '<img src="https://api.dubtrack.fm/user/' + val.userid + '/image">' +
                        '</div>' +
                        '<span class="dubinfo-text">@' + val.username + '</span>' +
                    '</li>'
        });
        html += '</ul>';                     
    }
    else{
        html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover dubplus-no-grabs" style="border-color: '+grabsBackground+'">' +
                    'This song hasn\'t been grabbed yet!' +
                '</div>';
    }

    var newEl = document.createElement('div');
    newEl.id = 'dubplus-grabs-container';
    newEl.className = 'dubinfo-show dubplus-grabs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = "hidden";
    document.body.appendChild(newEl);

    var elemRect = this.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();

    newEl.style.visibility = "";
    newEl.style.width = infoPaneWidth + 'px';
    newEl.style.top = (elemRect.top-150) + 'px';

    //If info pane would run off screen set the position on right edge
    if(bodyRect.right - elemRect.left >= infoPaneWidth){
        newEl.style.left = elemRect.left + 'px';
    }
    else{
        newEl.style.right = 0;
    }

    document.body.appendChild(newEl);

    $(this).addClass('dubplus-grabs-hover');

    $(document.body).on('click', '.preview-dubinfo-item', function(e){
        var new_text = $(this).find('.dubinfo-text')[0].innerHTML + ' ' ;
        self.updateChatInputWithString(new_text);
    });

    $('#dubinfo-preview').perfectScrollbar();

    $('.dubplus-grabs-hover').mouseleave(function(event){
        var x = event.clientX, y = event.clientY;

        if(!x || !y || isNaN(x) || isNaN(y)){
            return $('#dubplus-grabs-container').remove();
        }

        var elementMouseIsOver = document.elementFromPoint(x, y);

        if(!$(elementMouseIsOver).hasClass('dubplus-grabs-hover') && !$(elementMouseIsOver).hasClass('ps-scrollbar-y') && $(elementMouseIsOver).parent('.dubplus-grabs-hover').length <= 0){
            $('#dubplus-grabs-container').remove();
        }

    });
  });
 
};

dubshover.stopDubsOnHover = function(){
    Dubtrack.Events.unbind("realtime:room_playlist-dub", this.dubWatcher);
    Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabWatcher);
    Dubtrack.Events.unbind("realtime:user-leave", this.dubUserLeaveWatcher);
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetDubs);
    Dubtrack.Events.unbind("realtime:room_playlist-update", this.resetGrabs); //TODO: Remove when we can hit the api for all grabs of current playing song
};


dubshover.dubUserLeaveWatcher = function(e){
    var self = this;
    //Remove user from dub list
    if($.grep(this.dubs.upDubs, function(el){ return el.userid === e.user._id; }).length > 0){
        $.each(self.dubs.upDubs, function(i){
            if(self.dubs.upDubs[i].userid === e.user._id) {
                self.dubs.upDubs.splice(i,1);
                return false;
            }
        });
    }
    if($.grep(this.dubs.downDubs, function(el){ return el.userid === e.user._id; }).length > 0){
        $.each(self.dubs.downDubs, function(i){
            if(self.dubs.downDubs[i].userid === e.user._id) {
                self.dubs.downDubs.splice(i,1);
                return false;
            }
        });
    }
    if($.grep(mydubs.grabs, function(el){ return el.userid === e.user._id; }).length > 0){
        $.each(self.dubs.grabs, function(i){
            if(self.dubs.grabs[i].userid === e.user._id) {
                self.dubs.grabs.splice(i,1);
                return false;
            }
        });
    }
};

dubshover.grabWatcher = function(e){
    var self = this;
    //If grab already casted
    if($.grep(this.dubs.grabs, function(el){ return el.userid == e.user._id; }).length <= 0){
        self.dubs.grabs.push({
            userid: e.user._id,
            username: e.user.username
        });
    }
};

dubshover.updateChatInputWithString = function(str){
    $("#chat-txt-message").val(str).focus();
};

dubshover.userIsAtLeastMod = function(userid){
    return Dubtrack.helpers.isDubtrackAdmin(userid) ||
            Dubtrack.room.users.getIfOwner(userid) ||
            Dubtrack.room.users.getIfManager(userid) ||
            Dubtrack.room.users.getIfMod(userid);
};

dubshover.deleteChatMessageClientSide = function(el){
  $(el).parent('li')[0].remove();
};

dubshover.dubWatcher = function(e){
    if(e.dubtype === 'updub'){
        //If dub already casted
        if($.grep(this.dubs.upDubs, function(el){ return el.userid === e.user._id; }).length <= 0){
            self.dubs.upDubs.push({
                userid: e.user._id,
                username: e.user.username
            });
        }

        //Remove user from other dubtype if exists
        if($.grep(this.dubs.downDubs, function(el){ return el.userid === e.user._id; }).length > 0){
            $.each(self.dubs.downDubs, function(i){
                if(self.dubs.downDubs[i].userid === e.user._id) {
                    self.dubs.downDubs.splice(i,1);
                    return false;
                }
            });
        }
    }
    else if(e.dubtype === 'downdub'){
        //If dub already casted
        if($.grep(this.dubs.downDubs, function(el){ return el.userid === e.user._id; }).length <= 0 && this.userIsAtLeastMod(Dubtrack.session.id)){
            self.dubs.downDubs.push({
                userid: e.user._id,
                username: e.user.username
            });
        }

        //Remove user from other dubtype if exists
        if($.grep(this.dubs.upDubs, function(el){ return el.userid === e.user._id; }).length > 0){
            $.each(self.dubs.upDubs, function(i){
                if(self.dubs.upDubs[i].userid === e.user._id) {
                    self.dubs.upDubs.splice(i,1);
                    return false;
                }
            });
        }
    }

    var msSinceSongStart = new Date() - new Date(Dubtrack.room.player.activeSong.attributes.song.played);
    if(msSinceSongStart < 1000) return;

    if(this.dubs.upDubs.length !== Dubtrack.room.player.activeSong.attributes.song.updubs){
        // console.log("Updubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
        this.resetDubs();
    }
    else if(this.userIsAtLeastMod(Dubtrack.session.id) && this.dubs.downDubs.length !== Dubtrack.room.player.activeSong.attributes.song.downdubs){
        // console.log("Downdubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
        this.resetDubs();
    }
    // TODO: Uncomment this else if block when we can hit the api for all grabs of current playing song
    /*
    else if(this.dubs.grabs.length !== parseInt($('.grab-counter')[0].innerHTML)){
        console.log("Grabs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
        this.resetDubs();
    }*/
};

dubshover.resetDubs = function(){
    var self = this;
    this.dubs.upDubs = [];
    this.dubs.downDubs = [];
    // this.dubs.grabs: [] //TODO: Uncomment this when we can hit the api for all grabs of current playing song

    $.getJSON("https://api.dubtrack.fm/room/" + Dubtrack.room.model.id + "/playlist/active/dubs", function(response){
        response.data.upDubs.forEach(function(e){
            //Dub already casted (usually from autodub)
            if($.grep(self.dubs.upDubs, function(el){ return el.userid == e.userid; }).length > 0){
                return;
            }

            var username;
            if(!Dubtrack.room.users.collection.findWhere({userid: e.userid}) || !Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes) {
                $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function(response){
                    if(response && response.userinfo)
                        username = response.userinfo.username;
                });
            }
            else{
                username = Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username;
            }

            if(!username) return;

            self.dubs.upDubs.push({
                userid: e.userid,
                username: username
            });
        });
        //TODO: Uncomment this when we can hit the api for all grabs of current playing song
        /*response.data.grabs.forEach(function(e){
            //Dub already casted (usually from autodub)
            if($.grep(self.dubs.grabs, function(el){ return el.userid == e.userid; }).length > 0){
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

            self.dubs.grabs.push({
                userid: e.userid,
                username: username
            })
        });*/

        //Only let mods or higher access down dubs
        if(self.userIsAtLeastMod(Dubtrack.session.id)){
            response.data.downDubs.forEach(function(e){
                //Dub already casted
                if($.grep(self.dubs.downDubs, function(el){ return el.userid == e.userid; }).length > 0){
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

                self.dubs.downDubs.push({
                    userid: e.userid,
                    username: Dubtrack.room.users.collection.findWhere({userid: e.userid}).attributes._user.username
                });
            });
        }
    });
};
},{"../lib/menu.js":6,"../lib/settings.js":7,"../utils/css.js":18,"../utils/modal.js":20}],16:[function(require,module,exports){
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


var snooze_tooltip = function(e) {
  $(this).append('<div class="snooze_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">Mute current song</div>');
};

var hide_snooze_tooltip = function() {
    $('.snooze_tooltip').remove();
};

var eventUtils = {
    currentVol: 50,
    snoozed: false
};

var eventSongAdvance = function(e) {
    if (e.startTime < 2) {
        if (eventUtils.snoozed) {
            Dubtrack.room.player.setVolume(eventUtils.currentVol);
            eventUtils.snoozed = false;
        }
        return true;
    }
};

var snooze = function() {
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

myModule.init = function() {
  $('.player_sharing').append('<span class="icon-mute snooze_btn"></span>');

  $('body').on('mouseover', '.snooze_btn', snooze_tooltip);
  $('body').on('mouseout', '.snooze_btn', hide_snooze_tooltip);
  $('body').on('click', '.snooze_btn', snooze);
};

module.exports = myModule;




},{}],17:[function(require,module,exports){
var menu = require('../lib/menu.js');

var snow = {};

snow.id = "snow";
snow.moduleName = "Snow";
snow.description = "Make it snow!";
snow.optionState = false;
snow.category = "General";
snow.menuHTML = menu.makeOptionMenu(snow.moduleName, {
    id : 'dubplus-snow',
    desc : snow.description
  });

// this function will be run on each click of the menu
snow.go = function(e){
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
    newOptionState= false;
    $(document).snowfall('clear');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = snow;
},{"../lib/menu.js":6}],18:[function(require,module,exports){
'use strict';
var settings = require("../lib/settings.js");

/**
 * Loads a CSS file into <head>.  It concats settings.srcRoot with the first argument (cssFile)
 * @param {string} cssFile    the css file location
 * @param {string} className  class name for element
 *
 * example:  css.load("/options/show_timestamps.css", "show_timestamps_link");
 */
var load = function(cssFile, className){
  if (!cssFile) {return;}
  var src =  settings.srcRoot + cssFile;
  var cn = 'class="'+className+'"' || '';
  $('head').append('<link '+cn+' rel="stylesheet" type="text/css" href="'+src+'">');
};

/**
 * Loads a css file from a full URL in the <head>
 * @param  {String} cssFile   the full url location of a CSS file
 * @param  {String} className a class name to give to the <link> element
 * @return {undefined}           
 */
var loadExternal = function(cssFile, className){
  if (!cssFile) {return;}
  var cn = 'class="'+className+'"' || '';
  $('head').append('<link '+cn+' rel="stylesheet" type="text/css" href="'+cssFile+'">');
};

module.exports = {
  load : load,
  loadExternal: loadExternal
};
},{"../lib/settings.js":7}],19:[function(require,module,exports){
// jQuery's getJSON kept returning errors so making my own with promise-like
// structure and added optional Event to fire when done so can hook in elsewhere
var getJSON = (function (url, optionalEvent) {
    var doneEvent;
    function GetJ(_url, _cb){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', _url);
        xhr.send();
        xhr.onload = function() {
            var resp = xhr.responseText;
            if (typeof _cb === 'function') { _cb(resp); }
            if (optionalEvent) { document.body.dispatchEvent(doneEvent); }
        };
    }
    if (optionalEvent){ doneEvent = new Event(optionalEvent); }
    var done = function(cb){
        new GetJ(url, cb);
    };
    return { done: done };
});

module.exports = getJSON;
},{}],20:[function(require,module,exports){
/**
 * input is a modal used to display messages and also capture data
 * 
 * @param  {String} title       title that shows at the top of the modal
 * @param  {String} content     A descriptive message on what the modal is for
 * @param  {String} placeholder placeholder for the textarea
 * @param  {String} confirm     a way to customize the text of the confirm button
 * @param  {Number} maxlength   for the textarea maxlength attribute
 */
var create = function(infoObj) {
    var defaults = {
        title: '',
        content: '',
        placeholder: null,
        confirmButtonClass: null,
        maxlength: null,
        confirmCallback: null
    };
    var opts = $.extend(true, {}, this.defaults, infoObj);
    
    var textarea = '';
    var confirmButton = '';

    if (opts.placeholder) {
        var mx = opts.maxlength || 999;
        textarea = '<textarea class="input" type="text" placeholder="'+opts.placeholder+'" maxlength="'+ mx +'">'+opts.content+'</textarea>';
    }
    if (opts.confirmButtonClass) {
        confirmButton = '<div class="'+opts.confirmButtonClass+' confirm"><p>Okay</p></div>';
    }
    
    var dubplusModal = [
        '<div class="onErr">',
            '<div class="container">',
                '<div class="title">',
                    '<h1>'+opts.title+'</h1>',
                '</div>',
                '<div class="content">',
                    '<p>'+opts.content+'</p>',
                    textarea,
                '</div>',
                '<div class="control">',
                    '<div class="cancel dubplus-js-cancel">',
                        '<p>Cancel</p>',
                    '</div>',
                    confirmButton,
                '</div>',
            '</div>',
        '</div>'
    ].join('');
    $('body').append(dubplusModal);

    // add one time cancel click
    $('.dubplus-js-cancel').one("click",function(){
        $('.onErr').remove();
    });
    
    if (opts.confirmButtonClass) {
      $('.'+opts.confirmButtonClass).one("click", function(e){
        if (typeof opts.confirmCallback === 'function'){
            opts.confirmCallback();
        }
        $('.onErr').remove();
      });
    }
    
};

var close = function() {
    $('.onErr').remove();
};

module.exports = {
    create: create,
    close : close
};
},{}],21:[function(require,module,exports){
var settings = require("../lib/settings.js");
/**
 * Save an option to localStorage. 
 * 
 * @param  {String} selector    the name of the option
 * @param  {String} value       'true' or 'false'
 */
var saveOption = function(optionName, value) {
  localStorage.setItem(optionName,value);

  // new options
  if ( /^draw/i.test(optionName) ) {
    settings.menu[optionName] = value;
  } else if (/(css|customAfkMessage)/i.test(optionName)) {
    settings.custom[optionName] = value;
  } else {
    settings.options[optionName] = value;
  }
  localStorage.setItem( 'dubplusUserSettings', JSON.stringify(settings) );
};

var saveMenuOption = function(optionName, value){
  settings.menu[optionName] = value;
  localStorage.setItem( 'dubplusUserSettings', JSON.stringify(settings) );
};

var getAllOptions = function(){
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
var toggle = function(selector, state){
  var item = document.querySelector(selector + ' .for_content_off i');
  
  if (state === true) {
    item.classList.remove('fi-x');
    item.classList.add('fi-check');
  } else {
    item.classList.remove('fi-check');
    item.classList.add('fi-x');
  }
};

/**
 * TODO: go through all the files and replace .on and .off with the new toggle
 */
// deprecating these 2 eventually, for now they are pass-throughs
var on = function(selector) {
  // $(selector + ' .for_content_off i').replaceWith('<i class="fi-check"></i>');
  toggle(selector, true);
};
var off = function(selector) {
  // $(selector + ' .for_content_off i').replaceWith('<i class="fi-x"></i>');
  toggle(selector, false);
};

var toggleAndSave = function(optionName, state){
  toggle("."+optionName, state);
  return saveOption(optionName, state.toString());
};

module.exports = {
  on: on,
  off: off,
  toggle: toggle,
  toggleAndSave: toggleAndSave,
  saveMenuOption: saveMenuOption,
  getAllOptions: getAllOptions
};
},{"../lib/settings.js":7}]},{},[1]);
