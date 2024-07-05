(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _waitFor = _interopRequireDefault(require("./utils/waitFor.js"));
var _preload = _interopRequireDefault(require("./utils/preload.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
function errorModal(errorMsg) {
  // probably should make a modal with inline styles
  // or a smaller css file with just modal styles so
  // we're not loading the whole css for just a modal
  css.load('/css/dubplus.css', 'dubplus-css');
  modal.create({
    title: 'Dub+ Error',
    content: errorMsg
  });
}
(0, _preload.default)();
if (window.dubplus) {
  var _document$querySelect;
  // unbind any listeners before we reload the script
  for (var key in window.dubplus) {
    if (typeof window.dubplus[key].turnOff === 'function') {
      window.dubplus[key].turnOff();
    }
  }
  (_document$querySelect = document.querySelector('.dubplus-menu')) === null || _document$querySelect === void 0 || _document$querySelect.remove();
}

/* globals Dubtrack */
(0, _preload.default)();

// checking to see if these items exist before initializing the script
// instead of just picking an arbitrary setTimeout and hoping for the best
var checkList = ['QueUp.session.id', 'QueUp.room.chat', 'QueUp.Events', 'QueUp.room.player', 'QueUp.helpers.cookie', 'QueUp.room.model', 'QueUp.room.users'];
var dubplusWaiting = new _waitFor.default(checkList, {
  seconds: 10
}); // 10sec should be more than enough

dubplusWaiting.then(function () {
  init();
  $('.dubplus-waiting').remove();
}).fail(function () {
  if (!QueUp.session.id) {
    errorModal("You're not logged in. Please login to use Dub+.");
  } else {
    $('.dubplus-waiting span').text('Something happed, refresh and try again');
  }
});

},{"./lib/init.js":4,"./utils/css.js":41,"./utils/modal.js":43,"./utils/preload.js":47,"./utils/waitFor.js":48}],2:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* global  emojify */

var GetJSON = require('../utils/getJSON.js');
var settings = require("../lib/settings.js");

// IndexedDB wrapper for increased quota compared to localstorage (5mb to 50mb)
!function () {
  function e(t, o) {
    return n ? void (n.transaction("s").objectStore("s").get(t).onsuccess = function (e) {
      var t = e.target.result && e.target.result.v || null;
      o(t);
    }) : void setTimeout(function () {
      e(t, o);
    }, 100);
  }
  var t = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  if (!t) return void console.error("indexDB not supported");
  var n,
    o = {
      k: "",
      v: ""
    },
    r = t.open("d2", 1);
  r.onsuccess = function (e) {
    n = this.result;
  }, r.onerror = function (e) {
    console.error("indexedDB request error"), console.log(e);
  }, r.onupgradeneeded = function (e) {
    n = null;
    var t = e.target.result.createObjectStore("s", {
      keyPath: "k"
    });
    t.transaction.oncomplete = function (e) {
      n = e.target.db;
    };
  }, window.ldb = {
    get: e,
    set: function set(e, t) {
      o.k = e, o.v = t, n.transaction("s", "readwrite").objectStore("s").put(o);
    }
  };
}();
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
prepEmoji.frankerFacez = {
  template: function template(id) {
    return "//cdn.frankerfacez.com/emoticon/" + id + "/1";
  },
  emotes: {},
  chatRegex: new RegExp(":([-_a-z0-9]+):", "ig")
};
prepEmoji.shouldUpdateAPIs = function (apiName, callback) {
  var day = 86400000; // milliseconds in a day

  // if api return an object with an error then we should try again
  ldb.get(apiName + '_api', function (savedItem) {
    if (savedItem) {
      var parsed = JSON.parse(savedItem);
      if (typeof parsed.error !== 'undefined') {
        callback(true);
      }
    }
    var today = Date.now();
    var lastSaved = parseInt(localStorage.getItem(apiName + '_api_timestamp'));
    // Is the lastsaved not a number for some strange reason, then we should update
    // are we past 5 days from last update? then we should update
    // does the data not exist in localStorage, then we should update
    callback(isNaN(lastSaved) || today - lastSaved > day * 5 || !savedItem);
  });
};

/**************************************************************************
* Loads the twitch emotes from the api.
* http://api.twitch.tv/kraken/chat/emoticon_images
*/
prepEmoji.loadTwitchEmotes = function () {
  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the twitch API
  this.shouldUpdateAPIs('twitch', function (update) {
    if (update) {
      console.log('dub+', 'twitch', 'loading from api');
      var twApi = new GetJSON('//cdn.jsdelivr.net/gh/Jiiks/BetterDiscordApp/data/emotedata_twitch_global.json', 'twitch:loaded');
      twApi.done(function (data) {
        var json = JSON.parse(data);
        var twitchEmotes = {};
        for (var emote in json.emotes) {
          if (!twitchEmotes[emote]) {
            // if emote doesn't exist, add it
            twitchEmotes[emote] = json.emotes[emote].image_id;
          }
        }
        localStorage.setItem('twitch_api_timestamp', Date.now().toString());
        ldb.set('twitch_api', JSON.stringify(twitchEmotes));
        prepEmoji.processTwitchEmotes(twitchEmotes);
      });
    } else {
      ldb.get('twitch_api', function (data) {
        console.log('dub+', 'twitch', 'loading from IndexedDB');
        savedData = JSON.parse(data);
        prepEmoji.processTwitchEmotes(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('twitch:loaded');
        window.dispatchEvent(twEvent);
      });
    }
  });
};
prepEmoji.loadBTTVEmotes = function () {
  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the bttv API
  this.shouldUpdateAPIs('bttv', function (update) {
    if (update) {
      console.log('dub+', 'bttv', 'loading from api');
      var bttvApi = new GetJSON('//api.betterttv.net/3/cached/emotes/global', 'bttv:loaded');
      bttvApi.done(function (data) {
        var json = JSON.parse(data);
        var bttvEmotes = {};
        json.forEach(function (e) {
          if (!bttvEmotes[e.code]) {
            // if emote doesn't exist, add it
            bttvEmotes[e.code] = e.id;
          }
        });
        localStorage.setItem('bttv_api_timestamp', Date.now().toString());
        ldb.set('bttv_api', JSON.stringify(bttvEmotes));
        prepEmoji.processBTTVEmotes(bttvEmotes);
      });
    } else {
      ldb.get('bttv_api', function (data) {
        console.log('dub+', 'bttv', 'loading from IndexedDB');
        savedData = JSON.parse(data);
        prepEmoji.processBTTVEmotes(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('bttv:loaded');
        window.dispatchEvent(twEvent);
      });
    }
  });
};
prepEmoji.loadTastyEmotes = function () {
  var _this = this;
  console.log('dub+', 'tasty', 'loading from api');
  // since we control this API we should always have it load from remote
  var tastyApi = new GetJSON(settings.srcRoot + '/emotes/tastyemotes.json', 'tasty:loaded');
  tastyApi.done(function (data) {
    ldb.set('tasty_api', JSON.stringify(data));
    _this.processTastyEmotes(JSON.parse(data));
  });
};
prepEmoji.loadFrankerFacez = function () {
  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the frankerfacez API
  this.shouldUpdateAPIs('frankerfacez', function (update) {
    if (update) {
      console.log('dub+', 'frankerfacez', 'loading from api');
      var frankerFacezApi = new GetJSON('//api.frankerfacez.com/v1/emoticons?per_page=200&private=off&sort=count-desc', 'frankerfacez:loaded');
      frankerFacezApi.done(function (data) {
        var frankerFacez = JSON.parse(data);
        localStorage.setItem('frankerfacez_api_timestamp', Date.now().toString());
        ldb.set('frankerfacez_api', data);
        prepEmoji.processFrankerFacez(frankerFacez);
      });
    } else {
      ldb.get('frankerfacez_api', function (data) {
        console.log('dub+', 'frankerfacez', 'loading from IndexedDB');
        savedData = JSON.parse(data);
        prepEmoji.processFrankerFacez(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('frankerfacez:loaded');
        window.dispatchEvent(twEvent);
      });
    }
  });
};
prepEmoji.processTwitchEmotes = function (data) {
  for (var code in data) {
    if (data.hasOwnProperty(code)) {
      var _key = code.toLowerCase();

      // move twitch non-named emojis to their own array
      if (code.indexOf('\\') >= 0) {
        this.twitch.specialEmotes.push([code, data[code]]);
        continue;
      }
      if (emojify.emojiNames.indexOf(_key) >= 0) {
        continue; // do nothing so we don't override emoji
      }
      if (!this.twitch.emotes[_key]) {
        // if emote doesn't exist, add it
        this.twitch.emotes[_key] = data[code];
      }
    }
  }
  this.twitchJSONSLoaded = true;
  this.emojiEmotes = emojify.emojiNames.concat(Object.keys(this.twitch.emotes));
};
prepEmoji.processBTTVEmotes = function (data) {
  for (var code in data) {
    if (data.hasOwnProperty(code)) {
      var _key = code.toLowerCase();
      if (code.indexOf(':') >= 0) {
        continue; // don't want any emotes with smileys and stuff
      }
      if (emojify.emojiNames.indexOf(_key) >= 0) {
        continue; // do nothing so we don't override emoji
      }
      if (code.indexOf('(') >= 0) {
        _key = _key.replace(/([()])/g, "");
      }
      this.bttv.emotes[_key] = data[code];
    }
  }
  this.bttvJSONSLoaded = true;
  this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.bttv.emotes));
};
prepEmoji.processTastyEmotes = function (data) {
  this.tasty.emotes = data.emotes;
  this.tastyJSONLoaded = true;
  this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.tasty.emotes));
};
prepEmoji.processFrankerFacez = function (data) {
  var _iterator = _createForOfIteratorHelper(data.emoticons),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var emoticon = _step.value;
      var code = emoticon.name;
      var _key = code.toLowerCase().replace('~', '-');
      if (code.indexOf(':') >= 0) {
        continue; // don't want any emotes with smileys and stuff
      }
      if (emojify.emojiNames.indexOf(_key) >= 0) {
        continue; // do nothing so we don't override emoji
      }
      if (code.indexOf('(') >= 0) {
        _key = _key.replace(/([()])/g, "");
      }
      this.frankerFacez.emotes[_key] = emoticon.id;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  this.frankerfacezJSONLoaded = true;
  this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.frankerFacez.emotes));
};
module.exports = prepEmoji;

},{"../lib/settings.js":8,"../utils/getJSON.js":42}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeList = exports.PreviewListManager = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var debugAC = false;
function log() {
  if (debugAC) {
    console.log.apply(console, arguments);
  }
}

/**
 * Populates the popup container with a list of items that you can click/enter
 * on to autocomplete items in the chat box
 * @param  {Array} acArray  the array of items to be added.  Each item is an object:
 * {
 *   src : full image src,
 *   text : text for auto completion,
 *   cn : css class name for to be concat with '-preview',
 *   alt : OPTIONAL, to add to alt and title tag
 * }
 */
var makeList = exports.makeList = function makeList(acArray) {
  function makePreviewContainer(cn) {
    var d = document.createElement('li');
    d.className = cn;
    return d;
  }
  function makeImg(src, altText) {
    var i = document.createElement('img');
    i.src = src;
    if (altText) {
      i.title = altText;
      i.alt = altText;
    }
    var div = document.createElement('div');
    div.className = "ac-image";
    div.appendChild(i);
    return div;
  }
  function makeNameSpan(name) {
    var s = document.createElement('span');
    s.textContent = name;
    s.className = "ac-text"; // autocomplete text
    return s;
  }
  function makeEnterSpan() {
    var s = document.createElement('span');
    s.textContent = 'press enter to select';
    s.className = "ac-list-press-enter"; // autocomplete text
    return s;
  }
  function makeLi(info, i) {
    var container = makePreviewContainer("preview-item " + info.cn + "-previews");
    var span = makeNameSpan(info.text);
    var img;
    if (info.alt) {
      img = makeImg(info.src, info.alt);
    } else {
      img = makeImg(info.src);
    }
    container.appendChild(img);
    container.appendChild(span);
    if (i === 0) {
      container.appendChild(makeEnterSpan());
      container.classList.add('selected');
    }
    container.tabIndex = -1;
    return container;
  }
  var aCp = document.getElementById('autocomplete-preview');
  aCp.innerHTML = "";
  var frag = document.createDocumentFragment();
  acArray.forEach(function (val, i) {
    frag.appendChild(makeLi(val, i));
  });
  aCp.appendChild(frag);
  aCp.classList.add('ac-show');
};
function isElementInView(el, container) {
  var rect = el.getBoundingClientRect();
  var outerRect = container.getBoundingClientRect();
  return rect.top >= outerRect.top && rect.bottom <= outerRect.bottom;
}

/**
 * previewList
 * 
 * In this JS file should only exist what's necessary to populate the
 * autocomplete preview list that popups up for emojis and mentions
 * 
 * It also binds the events that handle navigating through the list
 * and also placing selected text into the chat
 */
var PreviewListManager = exports.PreviewListManager = /*#__PURE__*/function () {
  function PreviewListManager(data) {
    _classCallCheck(this, PreviewListManager);
    this._data = data || {
      start: 0,
      end: 0,
      selected: ""
    };
  }
  return _createClass(PreviewListManager, [{
    key: "data",
    get: function get() {
      return this._data;
    },
    set: function set(newData) {
      if (newData) {
        this._data = newData;
      }
    }
  }, {
    key: "selected",
    set: function set(text) {
      if (text) {
        this._data.selected = text;
      }
    }
  }, {
    key: "repl",
    value: function repl(str, start, end, newtext) {
      return str.substring(0, start - 1) + newtext + str.substring(end);
    }
  }, {
    key: "updateChatInput",
    value: function updateChatInput() {
      log("inUpdate", this._data);
      var inputText = $("#chat-txt-message").val();
      var updatedText = this.repl(inputText, this._data.start, this._data.end, this._data.selected) + " ";
      $('#autocomplete-preview').empty().removeClass('ac-show');
      $("#chat-txt-message").val(updatedText).focus();
    }
  }, {
    key: "doNavigate",
    value: function doNavigate(diff) {
      // get the current index of selected element within the nodelist collection of previews
      var displayBoxIndex = $('.preview-item.selected').index();

      // calculate new index position with given argument
      displayBoxIndex += diff;
      var oBoxCollection = $(".ac-show li");

      // remove "press enter to select" span
      $('.ac-list-press-enter').remove();

      // if new index is greater than total length then we reset back to the top
      if (displayBoxIndex >= oBoxCollection.length) {
        displayBoxIndex = 0;
      }
      // if at the top and index becomes negative, we wrap down to end of array
      if (displayBoxIndex < 0) {
        displayBoxIndex = oBoxCollection.length - 1;
      }
      var cssClass = "selected";
      var enterToSelectSpan = '<span class="ac-list-press-enter">press enter or tab to select</span>';
      oBoxCollection.removeClass(cssClass).eq(displayBoxIndex).addClass(cssClass).append(enterToSelectSpan);
      var pvItem = document.querySelector('.preview-item.selected');
      var acPreview = document.querySelector('#autocomplete-preview');
      var isInView = isElementInView(pvItem, acPreview);
      log("isInView", isInView);
      var align = diff === 1 ? false : true;
      if (!isInView) {
        pvItem.scrollIntoView(align);
      }
    }
  }, {
    key: "updater",
    value: function updater(e) {
      log(e.target, e);
      this._data.selected = $(e.target).find('.ac-text').text();
      this.updateChatInput();
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      var acUL = document.createElement('ul');
      acUL.id = "autocomplete-preview";
      $('.pusher-chat-widget-input').prepend(acUL);
      $(document.body).on('click', '.preview-item', function (e) {
        return _this.updater(e);
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      // the garbade collector should clean up the event listener added in init
      $('#autocomplete-preview').remove();
    }
  }]);
}();

},{}],4:[function(require,module,exports){
(function (PKGINFO){(function (){
"use strict";

var _loadModules = _interopRequireDefault(require("./loadModules.js"));
var _css = _interopRequireDefault(require("../utils/css.js"));
var _menu = _interopRequireDefault(require("./menu.js"));
var _snooze = _interopRequireDefault(require("../modules/snooze.js"));
var _eta = _interopRequireDefault(require("../modules/eta.js"));
var _menuEvents = require("./menu-events.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
module.exports = function () {
  window.dubplus = JSON.parse(PKGINFO);
  window.dubplus.toggleMenuSection = _menuEvents.toggleMenuSection;
  window.dubplus.toggleMenu = _menuEvents.toggleMenu;
  window.dubplus.onMenuToggle = _menuEvents.onMenuToggle;
  window.dubplus.onMenuAction = _menuEvents.onMenuAction;
  window.dubplus.onMenuEdit = _menuEvents.onMenuEdit;

  // load our main CSS
  _css.default.load('/css/dubplus.css', 'dubplus-css');

  // add a 'global' css class just in case we need more specificity in our css
  document.querySelector('html').classList.add('dubplus');

  // Get the opening html for the menu
  var menuContainer = _menu.default.beginMenu();

  // load all our modules into the 'dubplus' global object
  // it also builds the menu dynamically
  // returns an object to be passed to menu.finish
  var menuObj = (0, _loadModules.default)();

  // finalize the menu and add it to the UI
  _menu.default.finishMenu(menuObj, menuContainer);

  // run non-menu related items here:
  (0, _snooze.default)();
  (0, _eta.default)();
};

}).call(this)}).call(this,'{"name":"DubPlus","version":"0.3.4","description":"Dub+ - A simple script/extension for Dubtrack.fm and QueUp.net","author":"DubPlus","license":"MIT","homepage":"https://dub.plus","browserslist":["> 1%","last 2 versions"],"dependencies":{"@babel/core":"^7.24.7","node-fetch":"^3.3.2","sass":"^1.77.6"}}')
},{"../modules/eta.js":22,"../modules/snooze.js":34,"../utils/css.js":41,"./loadModules.js":5,"./menu-events.js":6,"./menu.js":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var options = require('../utils/options.js');
var dubPlus_modules = require('../modules/index.js');
var settings = require('../lib/settings.js');
var menu = require('../lib/menu.js');
var menuObj = {
  General: '',
  'User Interface': '',
  Settings: '',
  Customize: ''
};

/**
 * Loads all the modules and initliazes them
 */
function loadAllModules() {
  // window.dubplus was created in the init module

  dubPlus_modules.forEach(function (mod) {
    // add each module to the new global object
    window.dubplus[mod.id] = mod;
    // add the toggleAndSave function as a member of each module
    window.dubplus[mod.id].toggleAndSave = options.toggleAndSave;
    // check stored settings for module's initial state
    mod.optionState = settings.options[mod.id] || false;

    // This is run only once, when the script is loaded.
    // put anything you want ALWAYS run on Dub+ script load here
    if (typeof mod.init === 'function') {
      mod.init.call(mod);
    }

    // if module's localStorage option state is ON, we turn it on!
    if (mod.optionState && typeof mod.turnOn === 'function') {
      mod.turnOn.call(mod);
    }
    var _extraIcon = null;
    // if module has a defined .extra {function} but does not define the .extraIcon {string}
    // then we use 'pencil' as the default icon
    if (typeof mod.extra === 'function' && !mod.extraIcon) {
      _extraIcon = 'pencil';
    }
    if (!menuObj[mod.category]) {
      menuObj[mod.category] = new DocumentFragment();
    }

    // generate the html for the menu option and add it to the
    // appropriate category
    menuObj[mod.category].appendChild(menu.makeOptionMenu(mod.moduleName, {
      id: mod.id,
      desc: mod.description,
      state: mod.optionState,
      extraIcon: mod.extraIcon || _extraIcon,
      cssClass: mod.menuCssClass || '',
      altIcon: mod.altIcon || null
    }));
  });
  return menuObj;
}
var _default = exports.default = loadAllModules;

},{"../lib/menu.js":7,"../lib/settings.js":8,"../modules/index.js":29,"../utils/options.js":46}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMenuAction = onMenuAction;
exports.onMenuEdit = onMenuEdit;
exports.onMenuToggle = onMenuToggle;
exports.toggleMenu = toggleMenu;
exports.toggleMenuSection = toggleMenuSection;
var options = require('../utils/options.js');

/**
 * handles opening and closing of a menu section
 * @param  {string} id The id of the section to toggle
 */
function toggleMenuSection(id) {
  var sectionHeader = document.getElementById(id);
  var icon = sectionHeader.querySelector('.fa');
  var sectionUL = sectionHeader.nextElementSibling;
  var menuName = sectionHeader.textContent.trim().replace(' ', '-').toLowerCase();
  var closedClass = 'dubplus-menu-section-closed';
  sectionUL.classList.toggle(closedClass);
  var isClosed = sectionUL.classList.contains(closedClass);
  icon.classList.toggle('fa-angle-down');
  icon.classList.toggle('fa-angle-right');
  options.saveOption('menu', menuName, isClosed ? 'closed' : 'open');
}

/**
 * handles the pencil icon click
 * @param {string} id
 */
function onMenuEdit(id) {
  var mod = window.dubplus[id];
  if (!mod) {
    return;
  }
  if (mod.extra) {
    mod.extra.call(mod);
  }
}

/**
 * handles the toggling of the switch
 * @param {string} id
 */
function onMenuToggle(id) {
  var mod = window.dubplus[id];
  if (!mod) {
    return;
  }
  if (mod.turnOn && mod.turnOff) {
    // if it was off
    if (!mod.optionState) {
      mod.turnOn.call(mod);
    } else {
      mod.turnOff.call(mod);
    }
    mod.optionState = !mod.optionState;
    options.toggleAndSave(mod.id, mod.optionState);
  }
}

/**
 * handles the action of the menu item (like full screen, etc)
 * @param {string} id
 */
function onMenuAction(id) {
  var mod = window.dubplus[id];
  if (!mod) {
    return;
  }
  if (mod.go) {
    mod.go.call(mod);
  }
}

/**
 * open/close the menu
 */
function toggleMenu() {
  document.querySelector('.dubplus-menu').classList.toggle('dubplus-menu-open');
}

},{"../utils/options.js":46}],7:[function(require,module,exports){
'use strict';

var _menuEvents = _interopRequireDefault(require("./menu-events.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var settings = require('./settings.js');
var css = require('../utils/css.js');
// this is used to set the state of the contact menu section
var arrow = 'down';
var isClosedClass = '';
if (settings.menu.contact === 'closed') {
  isClosedClass = 'dubplus-menu-section-closed';
  arrow = 'right';
}

/*
<div id="dubplus-contact" class="dubplus-menu-section-header">
  <span class="fa fa-angle-${arrow}"></span>
  <p>Contact</p>
</div>
<ul class="dubplus-menu-section ${isClosedClass}">
  <li class="dubplus-menu-icon">
    <span class="fa fa-bug"></span>
    <a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>
  </li>
  <li class="dubplus-menu-icon">
    <span class="fa fa-reddit-alien"></span>
    <a href="https://www.reddit.com/r/DubPlus/" class="dubplus-menu-label"  target="_blank">Reddit</a>
  </li>
  <li class="dubplus-menu-icon">
    <span class="fa fa-facebook"></span>
    <a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>
  </li>
  <li class="dubplus-menu-icon">
    <span class="fa fa-twitter"></span>
    <a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>
  </li>
</ul>`;
*/
function makeContactSection() {
  var fragment = new DocumentFragment();
  var contacts = [{
    icon: 'bug',
    link: 'https://discord.gg/XUkG3Qy',
    text: 'Report bugs on Discord'
  }, {
    icon: 'reddit-alien',
    link: 'https://www.reddit.com/r/DubPlus/',
    text: 'Reddit'
  }, {
    icon: 'facebook',
    link: 'https://facebook.com/DubPlusScript',
    text: 'Facebook'
  }, {
    icon: 'twitter',
    link: 'https://twitter.com/DubPlusScript',
    text: 'Twitter'
  }];
  var contactSection = document.createElement('div');
  contactSection.id = 'dubplus-contact';
  contactSection.className = 'dubplus-menu-section-header';
  contactSection.innerHTML = "\n    <span class=\"fa fa-angle-".concat(arrow, "\"></span>\n    <p>Contact</p>\n  ");
  contactSection.setAttribute('onclick', "window.dubplus.toggleMenuSection('dubplus-contact')");
  fragment.appendChild(contactSection);
  var contactList = document.createElement('ul');
  contactList.className = "dubplus-menu-section ".concat(isClosedClass);
  contacts.forEach(function (contact) {
    var contactItem = document.createElement('li');
    contactItem.className = 'dubplus-menu-icon';
    contactItem.innerHTML = "\n      <span class=\"fa fa-".concat(contact.icon, "\"></span>\n      <a href=\"").concat(contact.link, "\" class=\"dubplus-menu-label\" target=\"_blank\">").concat(contact.text, "</a>\n    ");
    contactList.appendChild(contactItem);
  });
  fragment.appendChild(contactList);
  return fragment;
}
module.exports = {
  beginMenu: function beginMenu() {
    var _document$querySelect;
    // load font-awesome icons from CDN to be used in the menu
    css.loadExternal('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 'dubplus-font-awesome');

    /*
      <div class="dubplus-icon">
        <img src="images/dubplus.svg" alt="" />
      </div>
    */
    // remove old one:
    (_document$querySelect = document.querySelector('.dubplus-icon')) === null || _document$querySelect === void 0 || _document$querySelect.remove();

    // create new one:
    var menuIcon = document.createElement('div');
    menuIcon.className = 'dubplus-icon';
    var iconImg = document.createElement('img');
    iconImg.src = "".concat(settings.srcRoot, "/images/dubplus.svg");
    iconImg.alt = '';
    menuIcon.appendChild(iconImg);
    menuIcon.setAttribute('onclick', 'window.dubplus.toggleMenu()');
    document.querySelector('.header-right-navigation').appendChild(menuIcon);

    /*
      <section class="dubplus-menu">
        <p class="dubplus-menu-header">Dub+ Options</p>
      </section>
    */
    var menuContainer = document.createElement('section');
    menuContainer.className = 'dubplus-menu';
    var header = document.createElement('p');
    header.className = 'dubplus-menu-header';
    header.textContent = 'Dub+ Options';
    menuContainer.appendChild(header);
    return menuContainer;
  },
  finishMenu: function finishMenu(menuObj, menuContainer) {
    // dynamically create our menu from strings provided by each module
    for (var category in menuObj) {
      var fixed = category.replace(' ', '-').toLowerCase();
      var menuSettings = settings.menu[fixed];
      var id = 'dubplus-' + fixed;
      var arrow = 'down';
      var isClosedClass = '';
      if (menuSettings === 'closed') {
        isClosedClass = 'dubplus-menu-section-closed';
        arrow = 'right';
      }

      /*
        <div id="{id}" class="dubplus-menu-section-header" onclick="...">
          <span class="fa fa-angle-{arrow}"></span>
          <p>{category}</p>
        </div>
        <ul class="dubplus-menu-section {isClosedClass}">
          {menuObj[category]}
        </ul>
      */

      var sectionHeader = document.createElement('div');
      sectionHeader.id = id;
      sectionHeader.className = 'dubplus-menu-section-header';
      var arrowSpan = document.createElement('span');
      arrowSpan.className = "fa fa-angle-".concat(arrow);
      var p = document.createElement('p');
      p.textContent = category;
      sectionHeader.appendChild(arrowSpan);
      sectionHeader.appendChild(p);
      sectionHeader.setAttribute('onclick', "window.dubplus.toggleMenuSection('".concat(id, "')"));
      var sectionUL = document.createElement('ul');
      sectionUL.className = "dubplus-menu-section ".concat(isClosedClass);
      sectionUL.appendChild(menuObj[category]);
      menuContainer.appendChild(sectionHeader);
      menuContainer.appendChild(sectionUL);
    }

    // contact section last, is already fully formed, not dynamic
    menuContainer.appendChild(makeContactSection());
    document.body.appendChild(menuContainer);
  },
  makeOptionMenu: function makeOptionMenu(menuTitle, options) {
    var defaults = {
      id: '',
      // will be the ID selector for the menu item
      desc: '',
      // will be used for the "title" attribute
      state: false,
      // whether the menu item is on/off
      extraIcon: null,
      // define the extra icon if an option needs it (like AFK, Custom Mentions)
      cssClass: '',
      // adds extra CSS class(es) if desired,
      altIcon: null // use a font-awesome icon instead of the switch
    };
    var opts = Object.assign({}, defaults, options);
    var switchState = opts.state ? 'dubplus-switch-on' : '';

    // default icon on the left of each menu item is the switch
    var mainCssClass = 'dubplus-switch';

    /*
       --- IF ALT ICON IS DEFINED ---
      <li id="{opts.id}" class="dubplus-menu-icon dubplus-switch-{on|off} {opts.cssClass}" title="{opts.desc}">
        <span class="fa fa-{opts.altIcon}"></span>
        <span class="dubplus-menu-label">{menuTitle}</span>
      </li>
       --- ELSE ---
      <li id="{opts.id}" class="dubplus-switch dubplus-switch-{on|off} {opts.cssClass}" title="{opts.desc}">
        <!-- IF EXTRA ICON -->
        <span class="fa fa-{opts.extraIcon} extra-icon"></span>
        <!-- ENDIF -->
        <div class="dubplus-switch-bg">
          <div class="dubplus-switcher"></div>
        </div>
        <span class="dubplus-menu-label">{menuTitle}</span>
      </li>
    */

    var mainIcon;
    if (options.altIcon) {
      mainCssClass = 'dubplus-menu-icon';
      mainIcon = document.createElement('span');
      mainIcon.className = "fa fa-".concat(opts.altIcon);
      mainIcon.setAttribute('onclick', "window.dubplus.onMenuAction('".concat(opts.id, "')"));
    } else {
      mainIcon = document.createElement('div');
      mainIcon.className = 'dubplus-switch-bg';
      var switcher = document.createElement('div');
      switcher.className = 'dubplus-switcher';
      mainIcon.appendChild(switcher);
      mainIcon.setAttribute('onclick', "window.dubplus.onMenuToggle('".concat(opts.id, "')"));
    }
    var li = document.createElement('li');
    li.id = opts.id;
    li.className = "".concat(mainCssClass, " ").concat(switchState, " ").concat(opts.cssClass).trim();
    li.title = opts.desc;
    if (opts.extraIcon) {
      var extra = document.createElement('span');
      extra.className = "fa fa-".concat(opts.extraIcon, " extra-icon");
      extra.setAttribute('onclick', "window.dubplus.onMenuEdit('".concat(opts.id, "')"));
      li.appendChild(extra);
    }
    li.appendChild(mainIcon);
    var label = document.createElement('span');
    label.className = 'dubplus-menu-label';
    label.textContent = menuTitle;
    li.appendChild(label);
    return li;
  }
};

},{"../utils/css.js":41,"./menu-events.js":6,"./settings.js":8}],8:[function(require,module,exports){
(function (_RESOURCE_SRC_){(function (){
"use strict";

var defaults = {
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
var exportSettings = $.extend({}, defaults, savedSettings);

// this is stored in localStorage but we don't want that, we always want it fresh
exportSettings.srcRoot = _RESOURCE_SRC_;
module.exports = exportSettings;

}).call(this)}).call(this,'https://cdn.jsdelivr.net/gh/DubPlus/DubPlus')
},{}],9:[function(require,module,exports){
"use strict";

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
afk_module.moduleName = "AFK Auto-respond";
afk_module.description = "Toggle Away from Keyboard and customize AFK message.";
afk_module.category = "General";
afk_module.canSend = true;
var afk_chat_respond = function afk_chat_respond(e) {
  if (!afk_module.canSend) {
    return; // do nothing until it's back to true
  }
  var content = e.message;
  var user = QueUp.session.get('username');
  if (content.indexOf('@' + user) > -1 && QueUp.session.id !== e.user.userInfo.userid) {
    if (settings.custom.customAfkMessage) {
      $('#chat-txt-message').val('[AFK] ' + settings.custom.customAfkMessage);
    } else {
      $('#chat-txt-message').val("[AFK] I'm not here right now.");
    }
    QueUp.room.chat.sendMessage();
    afk_module.canSend = false;
    setTimeout(function () {
      afk_module.canSend = true;
    }, 30000);
  }
};
afk_module.turnOn = function () {
  QueUp.Events.bind("realtime:chat-message", afk_chat_respond);
};
afk_module.turnOff = function () {
  QueUp.Events.unbind("realtime:chat-message", afk_chat_respond);
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
    placeholder: "Be right back!",
    maxlength: '255',
    confirmCallback: saveAFKmessage
  });
};
module.exports = afk_module;

},{"../lib/settings.js":8,"../utils/modal.js":43,"../utils/options.js":46}],10:[function(require,module,exports){
"use strict";

var _previewList = require("../emojiUtils/previewList.js");
/**
 * Autocomplete Emojis/Emotes
 */
/*global _, Dubtrack, emojify*/
var settings = require('../lib/settings.js');
var prepEmjoji = require('../emojiUtils/prepEmoji.js');
// because I have a lot of logging on each keypress I made this
var debugAC = false;
function log() {
  if (debugAC) {
    console.log.apply(console, arguments);
  }
}
var myModule = {};
myModule.id = 'dubplus-autocomplete';
myModule.moduleName = 'Autocomplete Emoji';
myModule.description = 'Toggle autocompleting emojis and emotes.  Shows a preview box in the chat';
myModule.category = 'General';
var KEYS = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  enter: 13,
  esc: 27,
  tab: 9,
  shiftKey: 16,
  backspace: 8,
  del: 46,
  space: 32,
  ctrl: 17
};
var keyCharMin = 3; // when to start showing previews
var inputRegex = new RegExp('(:)([&!()\\+\\-_a-z0-9]+)($|\\s)', 'ig');

/**************************************************************************
 * A bunch of utility helpers for the emoji preview
 */
var emojiUtils = {
  createPreviewObj: function createPreviewObj(type, id, name) {
    return {
      src: prepEmjoji[type].template(id),
      text: ':' + name + ':',
      alt: name,
      cn: type
    };
  },
  addToPreviewList: function addToPreviewList(emojiArray) {
    var self = this;
    var listArray = [];
    var _key;
    emojiArray.forEach(function (val) {
      _key = val.toLowerCase();
      if (typeof prepEmjoji.twitch.emotes[_key] !== 'undefined') {
        listArray.push(self.createPreviewObj('twitch', prepEmjoji.twitch.emotes[_key], val));
      }
      if (typeof prepEmjoji.bttv.emotes[_key] !== 'undefined') {
        listArray.push(self.createPreviewObj('bttv', prepEmjoji.bttv.emotes[_key], val));
      }
      if (typeof prepEmjoji.tasty.emotes[_key] !== 'undefined') {
        listArray.push(self.createPreviewObj('tasty', _key, val));
      }
      if (typeof prepEmjoji.frankerFacez.emotes[_key] !== 'undefined') {
        listArray.push(self.createPreviewObj('frankerFacez', prepEmjoji.frankerFacez.emotes[_key], val));
      }
      if (emojify.emojiNames.indexOf(_key) >= 0) {
        listArray.push(self.createPreviewObj('emoji', val, val));
      }
    });
    (0, _previewList.makeList)(listArray);
  },
  filterEmoji: function filterEmoji(str) {
    var finalStr = str.replace(/([+()])/, '\\$1');
    var re = new RegExp('^' + finalStr, 'i');
    var arrayToUse = emojify.emojiNames || [];
    if (settings.options['dubplus-emotes']) {
      arrayToUse = prepEmjoji.emojiEmotes || []; // merged array
    }
    return arrayToUse.filter(function (val) {
      return re.test(val);
    });
  }
};

/**************************************************************************
 * handles filtering emoji, twitch, and users preview autocomplete popup on keyup
 */

var previewList = new _previewList.PreviewListManager();
var shouldClearPreview = function shouldClearPreview(ac, pvStr, current, kMin) {
  var lastChar = current.charAt(current.length - 1);
  if (pvStr.length < kMin || lastChar === ':' || lastChar === ' ' || current === '') {
    pvStr = '';
    ac.innerHTML = '';
    ac.className = '';
  }
  return pvStr;
};
var handleMatch = function handleMatch(triggerMatch, currentText, cursorPos, keyCharMin) {
  var pos = triggerMatch.length - 1; // only want to use the last one in the array
  var currentMatch = triggerMatch[pos].trim();
  var emoteChar = currentMatch.charAt(0); // get the ":" trigger and store it separately
  currentMatch = currentMatch.substring(1); // and then remove it from the matched string

  var strStart = currentText.lastIndexOf(currentMatch);
  var strEnd = strStart + currentMatch.length;
  log('cursorPos', cursorPos);
  if (cursorPos >= strStart && cursorPos <= strEnd) {
    // twitch and other emoji
    if (currentMatch && currentMatch.length >= keyCharMin && emoteChar === ':') {
      emojiUtils.addToPreviewList(emojiUtils.filterEmoji(currentMatch));
    }
  }
  log('match', triggerMatch, strStart, strEnd);
  return {
    start: strStart,
    end: strEnd,
    currentMatch: currentMatch
  };
};
var chatInputKeyupFunc = function chatInputKeyupFunc(e) {
  var acPreview = document.querySelector('#autocomplete-preview');
  var hasItems = acPreview.children.length > 0;
  if (e.keyCode === KEYS.enter && !hasItems) {
    return; // do nothing
  }
  if (e.keyCode === KEYS.up && hasItems) {
    e.preventDefault();
    previewList.doNavigate(-1);
    return;
  }
  if (e.keyCode === KEYS.down && hasItems) {
    e.preventDefault();
    previewList.doNavigate(1);
    return;
  }
  if ((e.keyCode === KEYS.enter || e.keyCode === KEYS.tab) && hasItems) {
    e.preventDefault();
    previewList.selected = $('.preview-item.selected').find('.ac-text').text();
    previewList.updateChatInput();
    return false;
  }
  var currentText = e.target.value;
  var cursorPos = e.target.selectionStart;
  var triggerMatch = currentText.match(inputRegex);
  var previewSearchStr = '';
  if (triggerMatch && triggerMatch.length > 0) {
    var matchData = handleMatch(triggerMatch, currentText, cursorPos, keyCharMin);
    previewSearchStr = matchData.currentMatch;
    previewList.data = matchData;
  }
  log('inKeyup', previewList.data);
  shouldClearPreview(acPreview, previewSearchStr, currentText, keyCharMin);
};
var chatInputKeydownFunc = function chatInputKeydownFunc(e) {
  var hasItems = document.querySelector('#autocomplete-preview > li');
  var isValidKey = [KEYS.tab, KEYS.enter, KEYS.up, KEYS.down].includes(e.keyCode);
  var isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
  if (!isModifierKey && hasItems && isValidKey) {
    e.preventDefault();
    return;
  }

  // temporary fix to restore enter key functionality for sending messages
  // due to the new multiline chat textarea
  if (!isModifierKey && e.keyCode === KEYS.enter) {
    window.QueUp.room.chat.sendMessage();
    window.QueUp.room.chat.resizeTextarea();
  } else if (!isModifierKey) {
    window.QueUp.room.chat.ncKeyDown(e);
  }
};
myModule.turnOn = function () {
  previewList.init();
  QueUp.room.chat.delegateEvents(_.omit(QueUp.room.chat.events, ['keydown #chat-txt-message']));
  $('#chat-txt-message').on('keydown', chatInputKeydownFunc);
  $('#chat-txt-message').on('keyup', chatInputKeyupFunc);
};
myModule.turnOff = function () {
  previewList.stop();
  QueUp.room.chat.delegateEvents(QueUp.room.chat.events);
  $('#chat-txt-message').off('keydown', chatInputKeydownFunc);
  $('#chat-txt-message').off('keyup', chatInputKeyupFunc);
};
module.exports = myModule;

},{"../emojiUtils/prepEmoji.js":2,"../emojiUtils/previewList.js":3,"../lib/settings.js":8}],11:[function(require,module,exports){
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
  if (QueUp && QueUp.playerController && QueUp.playerController.voteUp) {
    console.log('voting');
    QueUp.playerController.voteUp.click();
  }
};
var voteCheck = function voteCheck(obj) {
  if (obj.startTime < 2) {
    advance_vote();
  }
};

/*******************************************************/

autovote.turnOff = function () {
  QueUp.Events.unbind("realtime:room_playlist-update", voteCheck);
};
autovote.turnOn = function () {
  var song = QueUp.room.player.activeSong.get('song');
  var dubCookie = QueUp.helpers.cookie.get('dub-' + QueUp.room.model.get("_id"));
  var dubsong = QueUp.helpers.cookie.get('dub-song');
  if (!QueUp.room || !song || song.songid !== dubsong) {
    dubCookie = false;
  }
  //Only cast the vote if user hasn't already voted
  if (!$('.dubup, .dubdown').hasClass('voted') && !dubCookie) {
    advance_vote();
  }
  QueUp.Events.bind("realtime:room_playlist-update", voteCheck);
};
module.exports = autovote;

},{}],12:[function(require,module,exports){
"use strict";

/* global Dubtrack */
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var myModule = {};
myModule.id = "chat-cleaner";
myModule.moduleName = "Chat Cleaner";
myModule.description = "Automatically only keep a designated chatItems of chat items while clearing older ones, keeping CPU stress down";
myModule.category = "General";
myModule.extraIcon = 'pencil';
var saveAmount = function saveAmount() {
  var chatItems = parseInt($('.dp-modal textarea').val());
  if (!isNaN(chatItems)) {
    options.saveOption('custom', 'chat_cleaner', chatItems);
  } else {
    options.saveOption('custom', 'chat_cleaner', 500); // default to 500
  }
};
myModule.chatCleanerCheck = function (e) {
  var totalChats = $('ul.chat-main > li').length;
  if (isNaN(totalChats) || isNaN(settings.custom.chat_cleaner) || totalChats < settings.custom.chat_cleaner) return;
  $('ul.chat-main > li:lt(' + ($('ul.chat-main > li').length - settings.custom.chat_cleaner) + ')').remove();
};
myModule.turnOn = function () {
  QueUp.Events.bind("realtime:chat-message", this.chatCleanerCheck);
};
myModule.extra = function () {
  modal.create({
    title: 'Chat Cleaner',
    content: 'Please specify the number of most recent chat items that will remain in your chat history',
    value: settings.custom.chat_cleaner || '',
    placeholder: '500',
    maxlength: '5',
    confirmCallback: saveAmount
  });
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:chat-message", this.chatCleanerCheck);
};
module.exports = myModule;

},{"../lib/settings.js":8,"../utils/modal.js":43,"../utils/options.js":46}],13:[function(require,module,exports){
"use strict";

var _notify = require("../utils/notify.js");
/* global Dubtrack */
var settings = require("../lib/settings.js");
var myModule = {};
myModule.id = "mention_notifications";
myModule.moduleName = "Notification on Mentions";
myModule.description = "Enable desktop notifications when a user mentions you in chat";
myModule.category = "General";
myModule.notifyOnMention = function (e) {
  var content = e.message;
  var user = QueUp.session.get('username').toLowerCase();
  var mentionTriggers = ['@' + user];
  if (settings.options.custom_mentions && settings.custom.custom_mentions) {
    //add custom mention triggers to array
    mentionTriggers = mentionTriggers.concat(settings.custom.custom_mentions.split(','));
  }
  var mentionTriggersTest = mentionTriggers.some(function (v) {
    var reg = new RegExp('\\b' + v.trim() + '\\b', 'i');
    return reg.test(content);
  });
  if (mentionTriggersTest && !this.isActiveTab && QueUp.session.id !== e.user.userInfo.userid) {
    (0, _notify.showNotification)({
      title: "Message from ".concat(e.user.username),
      content: content
    });
  }
};
myModule.turnOn = function () {
  var _this = this;
  (0, _notify.notifyCheckPermission)(function (granted) {
    if (granted === true) {
      QueUp.Events.bind("realtime:chat-message", _this.notifyOnMention);
    } else {
      // turn back off until it's granted
      _this.toggleAndSave(_this.id, false);
    }
  });
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:chat-message", this.notifyOnMention);
};
module.exports = myModule;

},{"../lib/settings.js":8,"../utils/notify.js":45}],14:[function(require,module,exports){
"use strict";

var _api = require("../utils/api.js");
/**
 * Community Theme
 * Toggle Community CSS theme
 */

/* global Dubtrack */
var css = require('../utils/css.js');
var myModule = {};
myModule.id = 'dubplus-comm-theme';
myModule.moduleName = 'Community Theme';
myModule.description = 'Toggle Community CSS theme.';
myModule.category = 'Customize';
myModule.turnOn = function () {
  var location = QueUp.room.model.get('roomUrl');
  $.ajax({
    type: 'GET',
    url: "".concat(_api.apiBase, "/room/").concat(location)
  }).done(function (e) {
    var content = e.data.description;

    // for backwards compatibility with dubx we're checking for both @dubx and @dubplus and @dub+
    var themeCheck = new RegExp(/(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/, 'i');
    var communityCSSUrl = null;
    content.replace(themeCheck, function (match, p1, p2, p3) {
      console.log('loading community css theme:', p3);
      communityCSSUrl = p3;
    });
    if (!communityCSSUrl) {
      return;
    }
    css.loadExternal(communityCSSUrl, 'dubplus-comm-theme');
  });
};
myModule.turnOff = function () {
  $('.dubplus-comm-theme').remove();
};
module.exports = myModule;

},{"../utils/api.js":40,"../utils/css.js":41}],15:[function(require,module,exports){
"use strict";

/**
 * Custom Background
 * Add your own custom background
 */

var settings = require('../lib/settings.js');
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var myModule = {};
myModule.id = 'dubplus-custom-bg';
myModule.moduleName = 'Custom Background';
myModule.description = 'Add your own custom background.';
myModule.category = 'Customize';
myModule.extraIcon = 'pencil';
var makeBGdiv = function makeBGdiv(url) {
  return "<div class=\"dubplus-custom-bg\" style=\"background-image: url(".concat(url, ");\"></div>");
};
var saveCustomBG = function saveCustomBG() {
  var content = $('.dp-modal textarea').val();
  options.saveOption('custom', 'bg', content || '');

  // if the option is on, update the background
  if (settings.options[myModule.id]) {
    // always remove the old one
    $('.dubplus-custom-bg').remove();
    // if there is a new one, add it
    if (content) {
      $('body').append(makeBGdiv(content));
    }
  }
};
myModule.extra = function () {
  modal.create({
    title: 'Custom Background Image',
    content: 'Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image',
    value: settings.custom.bg || '',
    placeholder: 'https://example.com/big-image.jpg',
    maxlength: '500',
    confirmCallback: saveCustomBG
  });
};
myModule.turnOn = function () {
  // show modal if no image is in settings
  if (!settings.custom.bg) {
    this.extra();
  } else {
    $('.dubplus-custom-bg').remove();
    $('body').append(makeBGdiv(settings.custom.bg));
  }
};
myModule.turnOff = function () {
  $('.dubplus-custom-bg').remove();
};
module.exports = myModule;

},{"../lib/settings.js":8,"../utils/modal.js":43,"../utils/options.js":46}],16:[function(require,module,exports){
"use strict";

/**
 * Custom CSS
 * Add custom CSS
 */

var css = require('../utils/css.js');
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var myModule = {};
myModule.id = "dubplus-custom-css";
myModule.moduleName = "Custom CSS";
myModule.description = "Add your own custom CSS.";
myModule.category = "Customize";
myModule.extraIcon = 'pencil';
var css_import = function css_import() {
  $('.dubplus-custom-css').remove();
  var css_to_import = $('.dp-modal textarea').val();
  options.saveOption('custom', 'css', css_to_import);
  if (css_to_import && css_to_import !== '') {
    css.loadExternal(css_to_import, 'dubplus-custom-css');
  }
};
myModule.extra = function () {
  modal.create({
    title: 'Custom CSS',
    content: 'Enter a url location for your custom css',
    value: settings.custom.css || '',
    placeholder: 'https://example.com/example.css',
    maxlength: '500',
    confirmCallback: css_import
  });
};
myModule.turnOn = function () {
  if (settings.custom.css && settings.custom.css !== "") {
    css.loadExternal(settings.custom.css, 'dubplus-custom-css');
  } else {
    this.extra();
  }
};
myModule.turnOff = function () {
  $('.dubplus-custom-css').remove();
};
module.exports = myModule;

},{"../lib/settings.js":8,"../utils/css.js":41,"../utils/modal.js":43,"../utils/options.js":46}],17:[function(require,module,exports){
"use strict";

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
  var content = e.message;
  if (settings.custom.custom_mentions) {
    var customMentions = settings.custom.custom_mentions.split(',');
    var inUsers = customMentions.some(function (v) {
      var reg = new RegExp('\\b' + v.trim() + '\\b', 'i');
      return reg.test(content);
    });
    if (QueUp.session.id !== e.user.userInfo.userid && inUsers) {
      QueUp.room.chat.mentionChatSound.play();
    }
  }
};
myModule.turnOn = function () {
  QueUp.Events.bind("realtime:chat-message", this.customMentionCheck);
};
myModule.extra = function () {
  modal.create({
    title: 'Custom Mentions',
    content: 'Add your custom mention triggers here (separate by comma)',
    value: settings.custom.custom_mentions || '',
    placeholder: 'separate, custom triggers, by, comma, :heart:',
    maxlength: '255',
    confirmCallback: saveCustomMentions
  });
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:chat-message", this.customMentionCheck);
};
module.exports = myModule;

},{"../lib/settings.js":8,"../utils/modal.js":43,"../utils/options.js":46}],18:[function(require,module,exports){
"use strict";

var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var DubtrackDefaultSound = '/assets/music/user_ping.mp3';
var myModule = {};
myModule.id = "dubplus-custom-notification-sound";
myModule.moduleName = "Custom Notification Sound";
myModule.description = "Change the notification sound to a custom one.";
myModule.category = "Customize";
myModule.extraIcon = 'pencil';
var saveCustomNotificationSound = function saveCustomNotificationSound() {
  var content = $('.dp-modal textarea').val();
  if (content === '' || !content) {
    options.saveOption('custom', 'notificationSound', '');
    QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
    return;
  }

  // Check if valid sound url
  if (soundManager.canPlayURL(content)) {
    QueUp.room.chat.mentionChatSound.url = content;
  } else {
    setTimeout(function () {
      var that = myModule;
      modal.create({
        title: 'Dub+ Error',
        content: "You've entered an invalid sound url! Please make sure you are entering the full, direct url to the file. IE: https://example.com/sweet-sound.mp3"
      });
      QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
      that.optionState = false;
      that.toggleAndSave(that.id, false);
    }, 100);
  }
  options.saveOption('custom', 'notificationSound', content);
};
myModule.extra = function () {
  modal.create({
    title: 'Custom Notification Sound',
    content: 'Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to Dubtrack\'s default sound',
    value: settings.custom.notificationSound || '',
    placeholder: 'https://example.com/sweet-sound.mp3',
    maxlength: '500',
    confirmCallback: saveCustomNotificationSound
  });
};
myModule.init = function () {
  if (this.optionState && settings.custom.notificationSound) {
    this.turnOn();
  }
};
myModule.turnOn = function () {
  // show modal if no image is in settings
  if (!settings.custom.notificationSound || settings.custom.notificationSound === '') {
    this.extra();
  } else {
    QueUp.room.chat.mentionChatSound.url = settings.custom.notificationSound;
  }
};
myModule.turnOff = function () {
  QueUp.room.chat.mentionChatSound.url = DubtrackDefaultSound;
};
module.exports = myModule;

},{"../lib/settings.js":8,"../utils/modal.js":43,"../utils/options.js":46}],19:[function(require,module,exports){
"use strict";

var _notify = require("../utils/notify.js");
/* global Dubtrack */
var settings = require("../lib/settings.js");
var modal = require('../utils/modal.js');
var options = require('../utils/options.js');
var myModule = {};
myModule.id = "dj-notification";
myModule.moduleName = "DJ Notification";
myModule.description = "Notification when you are coming up to be the DJ";
myModule.category = "General";
myModule.extraIcon = 'pencil';
var savePosition = function savePosition() {
  var position = parseInt($('.dp-modal textarea').val());
  if (!isNaN(position)) {
    options.saveOption('custom', 'dj_notification', position);
  } else {
    options.saveOption('custom', 'dj_notification', 2); // default to 2
  }
};
myModule.djNotificationCheck = function (e) {
  if (e.startTime > 2) return;
  var positionParse = parseInt($('.queue-position').text());
  var position = e.startTime < 0 && !isNaN(positionParse) ? positionParse - 1 : positionParse;
  if (isNaN(positionParse) || position !== settings.custom.dj_notification) return;
  (0, _notify.showNotification)({
    title: 'DJ Alert!',
    content: 'You will be DJing shortly! Make sure your song is set!',
    ignoreActiveTab: true,
    wait: 10000
  });
  QueUp.room.chat.mentionChatSound.play();
};
myModule.turnOn = function () {
  QueUp.Events.bind("realtime:room_playlist-update", this.djNotificationCheck);
};
myModule.extra = function () {
  modal.create({
    title: 'DJ Notification',
    content: 'Please specify the position in queue you want to be notified at',
    value: settings.custom.dj_notification || '',
    placeholder: '2',
    maxlength: '2',
    confirmCallback: savePosition
  });
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:room_playlist-update", this.djNotificationCheck);
};
module.exports = myModule;

},{"../lib/settings.js":8,"../utils/modal.js":43,"../utils/notify.js":45,"../utils/options.js":46}],20:[function(require,module,exports){
"use strict";

var _modcheck = _interopRequireDefault(require("../utils/modcheck.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Show downvotes in chat
 * only mods can use this
 */

/*global Dubtrack */

var myModule = {};
myModule.id = "dubplus-downdubs";
myModule.moduleName = "Downdubs in Chat (mods only)";
myModule.description = "Toggle showing downdubs in the chat box (mods only)";
myModule.category = "General";
myModule.downdubWatcher = function (e) {
  var user = QueUp.session.get('username');
  var currentDj = QueUp.room.users.collection.findWhere({
    userid: QueUp.room.player.activeSong.attributes.song.userid
  }).attributes._user.username;
  if (user === currentDj && e.dubtype === 'downdub') {
    var newChat = "\n      <li class=\"dubplus-chat-system dubplus-chat-system-downdub\">\n        <div class=\"chatDelete\" onclick=\"dubplus.deleteChatMessageClientSide(this)\">\n          <span class=\"icon-close\"></span>\n        </div>\n        <div class=\"text\">\n          @".concat(e.user.username, " has downdubbed your song ").concat(QueUp.room.player.activeSong.attributes.songInfo.name, "\n        </div>\n      </li>");
    $('ul.chat-main').append(newChat);
  }
};
myModule.turnOn = function () {
  if (!(0, _modcheck.default)(QueUp.session.id)) {
    return;
  }
  QueUp.Events.bind("realtime:room_playlist-dub", this.downdubWatcher);

  // add this function to our global dubplus object so that downdubbed chat
  // items can be deleted
  if (typeof window.dubplus.deleteChatMessageClientSide !== 'function') {
    window.dubplus.deleteChatMessageClientSide = function (el) {
      $(el).parent('li')[0].remove();
    };
  }
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:room_playlist-dub", this.downdubWatcher);
};
module.exports = myModule;

},{"../utils/modcheck.js":44}],21:[function(require,module,exports){
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
    } else if (dubplus_emoji.frankerFacez.emotes[key]) {
      _id = dubplus_emoji.frankerFacez.emotes[key];
      _src = dubplus_emoji.frankerFacez.template(_id);
      return makeImage("frankerFacez", _src, key);
    } else {
      return matched;
    }
  });
  $chatTarget.html(emoted);
};
emote_module.turnOn = function () {
  window.addEventListener('twitch:loaded', dubplus_emoji.loadBTTVEmotes.bind(dubplus_emoji));
  window.addEventListener('bttv:loaded', dubplus_emoji.loadFrankerFacez.bind(dubplus_emoji));
  // window.addEventListener('bttv:loaded', dubplus_emoji.loadTastyEmotes.bind(dubplus_emoji));

  if (!dubplus_emoji.twitchJSONSLoaded) {
    dubplus_emoji.loadTwitchEmotes();
  } else {
    replaceTextWithEmote();
  }
  QueUp.Events.bind("realtime:chat-message", replaceTextWithEmote);
};
emote_module.turnOff = function () {
  QueUp.Events.unbind("realtime:chat-message", replaceTextWithEmote);
};
module.exports = emote_module;

},{"../emojiUtils/prepEmoji.js":2}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
/**
 * ETA
 *
 * This module is not a menu item, it is run once on load
 */

function eta() {
  var tooltip = document.querySelector('.player_sharing .eta_tooltip_t');
  var div = document.createElement('div');
  div.className = 'eta_tooltip dubplus-tooltip';
  div.style.cssText = 'min-width: 150px;position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;';
  var remainingTime = document.querySelector('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min');
  var queuePosition = document.querySelector('.queue-position');
  var queueTotal = document.querySelector('.queue-total');
  if (!remainingTime.textContent || !queueTotal.textContent) {
    div.textContent = 'No one is in the queue';
    tooltip.appendChild(div);
    return;
  }
  if (!queuePosition.textContent) {
    div.textContent = "You're not in the queue";
    tooltip.appendChild(div);
    return;
  }
  var current_time = parseInt(remainingTime.textContent);
  var booth_duration = parseInt(queuePosition.textContent);
  var time = 4;
  var booth_time = booth_duration * time - time + current_time;
  if (booth_time >= 0) {
    div.textContent = "ETA: ".concat(booth_time, " minute").concat(booth_time > 1 ? 's' : '');
  } else {
    div.textContent = "You're not in the queue";
  }
  tooltip.appendChild(div);
}
function hide_eta() {
  var _document$querySelect;
  (_document$querySelect = document.querySelector('.eta_tooltip')) === null || _document$querySelect === void 0 || _document$querySelect.remove();
}
function _default() {
  if (document.querySelector('.player_sharing .eta_tooltip_t')) {
    document.querySelector('.player_sharing .eta_tooltip_t').remove();
  }
  window.dubplus.etaTooltipShow = eta;
  window.dubplus.etaTooltipHide = hide_eta;
  var etaBtn = document.createElement('span');
  etaBtn.className = 'icon-history eta_tooltip_t';
  etaBtn.style.position = 'relative';
  etaBtn.setAttribute('onmouseover', 'window.dubplus.etaTooltipShow()');
  etaBtn.setAttribute('onmouseout', 'window.dubplus.etaTooltipHide()');
  document.querySelector('.player_sharing').appendChild(etaBtn);
}

},{}],23:[function(require,module,exports){
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
fs_module.go = function () {
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

},{}],24:[function(require,module,exports){
"use strict";

/**
 * Show downvotes in chat
 * only mods can use this
 */

/*global Dubtrack */
var myModule = {};
myModule.id = "dubplus-grabschat";
myModule.moduleName = "Grabs in Chat";
myModule.description = "Toggle showing grabs in the chat box";
myModule.category = "General";
myModule.grabChatWatcher = function (e) {
  var user = QueUp.session.get('username');
  var currentDj = QueUp.room.users.collection.findWhere({
    userid: QueUp.room.player.activeSong.attributes.song.userid
  }).attributes._user.username;
  if (user === currentDj && !QueUp.room.model.get('displayUserGrab')) {
    var newChat = "\n      <li class=\"dubplus-chat-system dubplus-chat-system-grab\">\n        <div class=\"chatDelete\" onclick=\"dubplus.deleteChatMessageClientSide(this)\">\n          <span class=\"icon-close\"></span>\n        </div>\n        <div class=\"text\">\n          @".concat(e.user.username, " has grabbed your song ").concat(QueUp.room.player.activeSong.attributes.songInfo.name, "\n        </div>\n      </li>");
    $('ul.chat-main').append(newChat);
  }
};
myModule.turnOn = function () {
  QueUp.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);

  // add this function to our global dubplus object so that chat
  // items can be deleted
  if (typeof window.dubplus.deleteChatMessageClientSide !== 'function') {
    window.dubplus.deleteChatMessageClientSide = function (el) {
      $(el).parent('li')[0].remove();
    };
  }
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
};
module.exports = myModule;

},{}],25:[function(require,module,exports){
"use strict";

/**
 * Hide Avatars
 * Toggle hiding user avatars in the chat box.
 */
var myModule = {};
myModule.id = "dubplus-hide-avatars";
myModule.moduleName = "Hide Avatars";
myModule.description = "Toggle hiding user avatars in the chat box.";
myModule.category = "User Interface";
myModule.turnOn = function () {
  $('body').addClass('dubplus-hide-avatars');
};
myModule.turnOff = function () {
  $('body').removeClass('dubplus-hide-avatars');
};
module.exports = myModule;

},{}],26:[function(require,module,exports){
"use strict";

/**
 * Hide Background
 * toggle hiding background image
 */

var myModule = {};
myModule.id = "dubplus-hide-bg";
myModule.moduleName = "Hide Background";
myModule.description = "Toggle hiding background image.";
myModule.category = "User Interface";
myModule.turnOn = function () {
  $('body').addClass('dubplus-hide-bg');
};
myModule.turnOff = function () {
  $('body').removeClass('dubplus-hide-bg');
};
module.exports = myModule;

},{}],27:[function(require,module,exports){
"use strict";

/**
 * Hide the Chat box and only show the video
 */

var myModule = {};
myModule.id = "dubplus-video-only";
myModule.moduleName = "Hide Chat";
myModule.description = "Toggles hiding the chat box";
myModule.category = "User Interface";
myModule.turnOn = function () {
  $('body').addClass('dubplus-video-only');
};
myModule.turnOff = function () {
  $('body').removeClass('dubplus-video-only');
};
module.exports = myModule;

},{}],28:[function(require,module,exports){
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
myModule.turnOn = function () {
  $('body').addClass('dubplus-chat-only');
};
myModule.turnOff = function () {
  $('body').removeClass('dubplus-chat-only');
};
module.exports = myModule;

},{}],29:[function(require,module,exports){
"use strict";

// put this in order of appearance in the menu
module.exports = [
// General 
require('./autovote.js'), require('./afk.js'), require('./emotes.js'), require('./autocomplete.js'), require('./customMentions.js'), require('./chatCleaner.js'), require('./chatNotifications.js'), require('./pmNotifications.js'), require('./djNotification.js'), require('./showDubsOnHover.js'), require('./downDubInChat.js'),
// (mod only)
require('./upDubInChat.js'), require('./grabsInChat.js'), require('./snow.js'), require('./rain.js'),
// User Interface
require('./fullscreen.js'), require('./splitchat.js'), require('./hideChat.js'), require('./hideVideo.js'), require('./hideAvatars.js'), require('./hideBackground.js'), require('./showTimestamps.js'),
// Settings
require('./spacebarMute.js'), require('./warnOnNavigation.js'),
// Customize
require('./communityTheme.js'), require('./customCSS.js'), require('./customBackground.js'), require('./customNotificationSound.js')];

},{"./afk.js":9,"./autocomplete.js":10,"./autovote.js":11,"./chatCleaner.js":12,"./chatNotifications.js":13,"./communityTheme.js":14,"./customBackground.js":15,"./customCSS.js":16,"./customMentions.js":17,"./customNotificationSound.js":18,"./djNotification.js":19,"./downDubInChat.js":20,"./emotes.js":21,"./fullscreen.js":23,"./grabsInChat.js":24,"./hideAvatars.js":25,"./hideBackground.js":26,"./hideChat.js":27,"./hideVideo.js":28,"./pmNotifications.js":30,"./rain.js":31,"./showDubsOnHover.js":32,"./showTimestamps.js":33,"./snow.js":35,"./spacebarMute.js":36,"./splitchat.js":37,"./upDubInChat.js":38,"./warnOnNavigation.js":39}],30:[function(require,module,exports){
"use strict";

var _notify = require("../utils/notify.js");
/* global Dubtrack */

var myModule = {};
myModule.id = "dubplus_pm_notifications";
myModule.moduleName = "Notification on PM";
myModule.description = "Enable desktop notifications when a user receives a private message";
myModule.category = "General";
myModule.pmNotify = function (e) {
  var userid = QueUp.session.get('_id');
  if (userid === e.userid) {
    return;
  }
  (0, _notify.showNotification)({
    title: 'You have a new PM',
    ignoreActiveTab: true,
    callback: function callback() {
      $('.user-messages').click();
      setTimeout(function () {
        $(".message-item[data-messageid=\"".concat(e.messageid, "\"]")).click();
      }, 500);
    },
    wait: 10000
  });
};
myModule.turnOn = function () {
  var _this = this;
  (0, _notify.notifyCheckPermission)(function (granted) {
    if (granted === true) {
      QueUp.Events.bind("realtime:new-message", _this.pmNotify);
    } else {
      // turn back off until it's granted
      _this.toggleAndSave(_this.id, false);
    }
  });
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:new-message", this.pmNotify);
};
module.exports = myModule;

},{"../utils/notify.js":45}],31:[function(require,module,exports){
"use strict";

var rain = {};
rain.id = "dubplus-rain";
rain.moduleName = "Rain";
rain.description = "Make it rain!";
rain.category = "General";

// Rain settings
rain.particles = [];
rain.drops = [];
rain.numbase = 5;
rain.numb = 2;
rain.width, rain.height = 0;

// We can update these realtime
rain.controls = {
  rain: 2,
  alpha: 1,
  color: 200,
  opacity: 1,
  saturation: 100,
  lightness: 50,
  back: 0,
  multi: false,
  speed: 1
};
rain.turnOn = function () {
  $('body').prepend('<canvas id="dubPlusRainCanvas" style="position : fixed; top : 0px; left : 0px; z-index: 100; pointer-events:none;"></canvas>');
  this.bindCanvas();
};

// this function will be run on each click of the menu
rain.turnOff = function () {
  $('#dubPlusRainCanvas').remove();
  this.unbindCanvas();
};
rain.bindCanvas = function () {
  var windowAnimFram = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
  this.requestAnimFrame = windowAnimFram ? windowAnimFram.bind(window) : null;
  var canvas = document.getElementById('dubPlusRainCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  this.width, this.height = 0;
  window.onresize = function onresize() {
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
  };
  window.onresize();
  this.particles, this.drops = [];
  this.numbase = 5;
  this.numb = 2;
  function Screenshot() {
    window.open(canvas.toDataURL());
  }
  var that = this;
  (function boucle() {
    that.requestAnimFrame(boucle);
    that.update();
    that.rendu(ctx);
  })();
};
rain.buildRainParticle = function (X, Y, num) {
  if (!num) {
    num = this.numb;
  }
  while (num--) {
    this.particles.push({
      speedX: Math.random() * 0.25,
      speedY: Math.random() * 9 + 1,
      X: X,
      Y: Y,
      alpha: 1,
      color: "hsla(" + this.controls.color + "," + this.controls.saturation + "%, " + this.controls.lightness + "%," + this.controls.opacity + ")"
    });
  }
};
rain.explosion = function (X, Y, color, num) {
  if (!num) {
    num = this.numbase;
  }
  while (num--) {
    this.drops.push({
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * -4,
      X: X,
      Y: Y,
      radius: 0.65 + Math.floor(Math.random() * 1.6),
      alpha: 1,
      color: color
    });
  }
};
rain.rendu = function (ctx) {
  if (this.controls.multi == true) {
    this.controls.color = Math.random() * 360;
  }
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  var particleslocales = this.particles;
  var dropslocales = this.drops;
  var tau = Math.PI * 2;
  for (var i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
    ctx.globalAlpha = particlesactives.alpha;
    ctx.fillStyle = particlesactives.color;
    ctx.fillRect(particlesactives.X, particlesactives.Y, particlesactives.speedY / 4, particlesactives.speedY);
  }
  for (var i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {
    ctx.globalAlpha = dropsactives.alpha;
    ctx.fillStyle = dropsactives.color;
    ctx.beginPath();
    ctx.arc(dropsactives.X, dropsactives.Y, dropsactives.radius, 0, tau);
    ctx.fill();
  }
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.restore();
};
rain.update = function () {
  var particleslocales = this.particles;
  var dropslocales = this.drops;
  for (var i = 0, particlesactives; particlesactives = particleslocales[i]; i++) {
    particlesactives.X += particlesactives.speedX;
    particlesactives.Y += particlesactives.speedY + 5;
    if (particlesactives.Y > height - 15) {
      particleslocales.splice(i--, 1);
      this.explosion(particlesactives.X, particlesactives.Y, particlesactives.color);
    }
  }
  for (var i = 0, dropsactives; dropsactives = dropslocales[i]; i++) {
    dropsactives.X += dropsactives.speedX;
    dropsactives.Y += dropsactives.speedY;
    dropsactives.radius -= 0.075;
    if (dropsactives.alpha > 0) {
      dropsactives.alpha -= 0.005;
    } else {
      dropsactives.alpha = 0;
    }
    if (dropsactives.radius < 0) {
      dropslocales.splice(i--, 1);
    }
  }
  var i = this.controls.rain;
  while (i--) {
    this.buildRainParticle(Math.floor(Math.random() * width), -15);
  }
};
rain.unbindCanvas = function () {
  this.requestAnimFrame = function () {};
};
module.exports = rain;

},{}],32:[function(require,module,exports){
"use strict";

var _modcheck = _interopRequireDefault(require("../utils/modcheck.js"));
var _api = require("../utils/api.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* global Dubtrack */
var modal = require('../utils/modal.js');
var dubshover = {};
dubshover.id = 'dubplus-dubs-hover';
dubshover.moduleName = 'Show Dub info on Hover';
dubshover.description = 'Show Dub info on Hover.';
dubshover.category = 'General';

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
  var that = this;
  this.resetDubs();
  QueUp.Events.bind('realtime:room_playlist-dub', this.dubWatcher.bind(this));
  QueUp.Events.bind('realtime:room_playlist-queue-update-grabs', this.grabWatcher.bind(this));
  QueUp.Events.bind('realtime:user-leave', this.dubUserLeaveWatcher.bind(this));
  QueUp.Events.bind('realtime:room_playlist-update', this.resetDubs.bind(this));
  QueUp.Events.bind('realtime:room_playlist-update', this.resetGrabs.bind(this)); //TODO: Remove when we can hit the api for all grabs of current playing song

  var dubupEl = $('.dubup').first().parent('li');
  var dubdownEl = $('.dubdown').first().parent('li');
  var grabEl = $('.add-to-playlist-button').first().parent('li');
  $(dubupEl).addClass('dubplus-updubs-hover');
  $(dubdownEl).addClass('dubplus-downdubs-hover');
  $(grabEl).addClass('dubplus-grabs-hover');

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
    if ($('#dubplus-updubs-container').length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubupBackground = $('.dubup').hasClass('voted') ? $('.dubup').css('background-color') : $('.dubup').find('.icon-arrow-up').css('color');
    var html;
    if (window.dubplus.dubs.upDubs.length > 0) {
      html = "<ul id=\"dubinfo-preview\" class=\"dubinfo-show dubplus-updubs-hover\" style=\"border-color: ".concat(dubupBackground, "\">");
      window.dubplus.dubs.upDubs.forEach(function (val) {
        html += "\n          <li class=\"preview-dubinfo-item users-previews dubplus-updubs-hover\">\n            <div class=\"dubinfo-image\">\n              <img src=\"".concat(_api.apiBase, "/user/").concat(val.userid, "/image\">\n            </div>\n            <span class=\"dubinfo-text\">@").concat(val.username, "</span>\n          </li>\n        ");
      });
      html += '</ul>';
    } else {
      html = "<div id=\"dubinfo-preview\" class=\"dubinfo-show dubplus-updubs-hover dubplus-no-dubs\" style=\"border-color: ".concat(dubupBackground, "\">\n          No updubs have been casted yet!\n        </div>");
    }
    var newEl = document.createElement('div');
    newEl.id = 'dubplus-updubs-container';
    newEl.className = 'dubinfo-show dubplus-updubs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = 'hidden';
    document.body.appendChild(newEl);
    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();
    newEl.style.visibility = '';
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
      that.updateChatInputWithString(new_text);
    });
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
    if ($('#dubplus-downdubs-container').length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(dubdownEl).innerWidth();
    var dubdownBackground = $('.dubdown').hasClass('voted') ? $('.dubdown').css('background-color') : $('.dubdown').find('.icon-arrow-down').css('color');
    var html;
    if ((0, _modcheck.default)(QueUp.session.id)) {
      if (window.dubplus.dubs.downDubs.length > 0) {
        html = "<ul id=\"dubinfo-preview\" class=\"dubinfo-show dubplus-downdubs-hover\" style=\"border-color: ".concat(dubdownBackground, "\">");
        window.dubplus.dubs.downDubs.forEach(function (val) {
          html += "\n            <li class=\"preview-dubinfo-item users-previews dubplus-downdubs-hover\">\n              <div class=\"dubinfo-image\">\n                <img src=\"".concat(_api.apiBase, "/user/").concat(val.userid, "/image\" />\n              </div>\n              <span class=\"dubinfo-text\">@").concat(val.username, "</span>\n            </li>\n          ");
        });
        html += '</ul>';
      } else {
        html = "<div id=\"dubinfo-preview\" class=\"dubinfo-show dubplus-downdubs-hover dubplus-no-dubs\" style=\"border-color: ".concat(dubdownBackground, "\">\n          No downdubs have been casted yet!\n          </div>");
      }
    } else {
      html = "<div id=\"dubinfo-preview\" class=\"dubinfo-show dubplus-downdubs-hover dubplus-downdubs-unauthorized\" style=\"border-color: ".concat(dubdownBackground, "\">\n          You must be at least a mod to view downdubs!\n        </div>");
    }
    var newEl = document.createElement('div');
    newEl.id = 'dubplus-downdubs-container';
    newEl.className = 'dubinfo-show dubplus-downdubs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = 'hidden';
    document.body.appendChild(newEl);
    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();
    newEl.style.visibility = '';
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
      that.updateChatInputWithString(new_text);
    });
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
    if ($('#dubplus-grabs-container').length > 0) {
      return;
    } //already exists

    var infoPaneWidth = $(dubupEl).innerWidth() + $(grabEl).innerWidth();
    var grabsBackground = $('.add-to-playlist-button').hasClass('grabbed') ? $('.add-to-playlist-button').css('background-color') : $('.add-to-playlist-button').find('.icon-heart').css('color');
    var html;
    if (window.dubplus.dubs.grabs.length > 0) {
      html = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover" style="border-color: ' + grabsBackground + '">';
      window.dubplus.dubs.grabs.forEach(function (val) {
        html += '<li class="preview-dubinfo-item users-previews dubplus-grabs-hover">' + '<div class="dubinfo-image">' + "<img src=\"".concat(_api.apiBase, "/user/").concat(val.userid, "/image\" />") + '</div>' + '<span class="dubinfo-text">@' + val.username + '</span>' + '</li>';
      });
      html += '</ul>';
    } else {
      html = '<div id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover dubplus-no-grabs" style="border-color: ' + grabsBackground + '">' + "This song hasn't been grabbed yet!" + '</div>';
    }
    var newEl = document.createElement('div');
    newEl.id = 'dubplus-grabs-container';
    newEl.className = 'dubinfo-show dubplus-grabs-hover';
    newEl.innerHTML = html;
    newEl.style.visibility = 'hidden';
    document.body.appendChild(newEl);
    var elemRect = self.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect();
    newEl.style.visibility = '';
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
      that.updateChatInputWithString(new_text);
    });
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
  QueUp.Events.unbind('realtime:room_playlist-dub', this.dubWatcher);
  QueUp.Events.unbind('realtime:room_playlist-queue-update-grabs', this.grabWatcher);
  QueUp.Events.unbind('realtime:user-leave', this.dubUserLeaveWatcher);
  QueUp.Events.unbind('realtime:room_playlist-update', this.resetDubs);
  QueUp.Events.unbind('realtime:room_playlist-update', this.resetGrabs); //TODO: Remove when we can hit the api for all grabs of current playing song
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
  $('#chat-txt-message').val(str).focus();
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
    }).length <= 0 && (0, _modcheck.default)(QueUp.session.id)) {
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
  var msSinceSongStart = new Date() - new Date(QueUp.room.player.activeSong.attributes.song.played);
  if (msSinceSongStart < 1000) {
    return;
  }
  if (window.dubplus.dubs.upDubs.length !== QueUp.room.player.activeSong.attributes.song.updubs) {
    // console.log("Updubs don't match, reset! Song started ", msSinceSongStart, "ms ago!");
    this.resetDubs();
  } else if ((0, _modcheck.default)(QueUp.session.id) && window.dubplus.dubs.downDubs.length !== QueUp.room.player.activeSong.attributes.song.downdubs) {
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
  window.dubplus.dubs.upDubs = [];
  window.dubplus.dubs.downDubs = [];
  // window.dubplus.dubs.grabs: [] //TODO: Uncomment this when we can hit the api for all grabs of current playing song

  var dubsURL = "".concat(_api.apiBase, "/room/").concat(QueUp.room.model.id, "/playlist/active/dubs");
  $.getJSON(dubsURL, function (response) {
    response.data.upDubs.forEach(function (e) {
      //Dub already casted (usually from autodub)
      if ($.grep(window.dubplus.dubs.upDubs, function (el) {
        return el.userid === e.userid;
      }).length > 0) {
        return;
      }
      var username;
      if (!QueUp.room.users.collection.findWhere({
        userid: e.userid
      }) || !QueUp.room.users.collection.findWhere({
        userid: e.userid
      }).attributes) {
        $.getJSON("".concat(_api.apiBase, "/user/").concat(e.userid), function (response) {
          if (response && response.userinfo) {
            username = response.userinfo.username;
          }
        });
      } else {
        username = QueUp.room.users.collection.findWhere({
          userid: e.userid
        }).attributes._user.username;
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
        if(!QueUp.room.users.collection.findWhere({userid: e.userid}) || !QueUp.room.users.collection.findWhere({userid: e.userid}).attributes) {
            $.getJSON("https://api.dubtrack.fm/user/" + e.userid, function(response){
                username = response.userinfo.username;
            });
        }
        else{
            username = QueUp.room.users.collection.findWhere({userid: e.userid}).attributes._user.username;
        }
         window.dubplus.dubs.grabs.push({
            userid: e.userid,
            username: username
        })
    });*/

    //Only let mods or higher access down dubs
    if ((0, _modcheck.default)(QueUp.session.id)) {
      response.data.downDubs.forEach(function (e) {
        //Dub already casted
        if ($.grep(window.dubplus.dubs.downDubs, function (el) {
          return el.userid === e.userid;
        }).length > 0) {
          return;
        }
        var username;
        if (!QueUp.room.users.collection.findWhere({
          userid: e.userid
        }) || !QueUp.room.users.collection.findWhere({
          userid: e.userid
        }).attributes) {
          $.getJSON("".concat(_api.apiBase, "/user/").concat(e.userid), function (response) {
            username = response.userinfo.username;
          });
        } else {
          username = QueUp.room.users.collection.findWhere({
            userid: e.userid
          }).attributes._user.username;
        }
        window.dubplus.dubs.downDubs.push({
          userid: e.userid,
          username: QueUp.room.users.collection.findWhere({
            userid: e.userid
          }).attributes._user.username
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
};
dubshover.turnOn = function () {
  this.grabInfoWarning();
  this.showDubsOnHover();
};
dubshover.turnOff = function () {
  this.stopDubsOnHover();
};
module.exports = dubshover;

},{"../utils/api.js":40,"../utils/modal.js":43,"../utils/modcheck.js":44}],33:[function(require,module,exports){
"use strict";

/**
 * Show Timestamps
 * Toggle always showing chat message timestamps.
 */

var myModule = {};
myModule.id = "dubplus-show-timestamp";
myModule.moduleName = "Show Timestamps";
myModule.description = "Toggle always showing chat message timestamps.";
myModule.category = "User Interface";
myModule.turnOn = function () {
  $('body').addClass('dubplus-show-timestamp');
};
myModule.turnOff = function () {
  $('body').removeClass('dubplus-show-timestamp');
};
module.exports = myModule;

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
/**
 * Snooze
 * Mutes audio for one song.
 *
 * This module is not a menu item, it is always automatically run on load
 */

/*global Dubtrack*/
function snooze_tooltip() {
  var div = document.createElement('div');
  div.className = 'snooze_tooltip';
  div.style.cssText = 'min-width: 186px;position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -15px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9';
  div.textContent = 'Mute current song';
  document.querySelector('.player_sharing .snooze_btn').appendChild(div);
}
function hide_snooze_tooltip() {
  var _document$querySelect;
  (_document$querySelect = document.querySelector('.snooze_tooltip')) === null || _document$querySelect === void 0 || _document$querySelect.remove();
}
var eventUtils = {
  currentVol: 50,
  snoozed: false
};
function eventSongAdvance(e) {
  if (e.startTime < 2) {
    if (eventUtils.snoozed) {
      QueUp.room.player.setVolume(eventUtils.currentVol);
      eventUtils.snoozed = false;
    }
    return true;
  }
}
function snooze() {
  if (!eventUtils.snoozed && !QueUp.room.player.muted_player && QueUp.playerController.volume > 2) {
    eventUtils.currentVol = QueUp.playerController.volume;
    QueUp.room.player.mutePlayer();
    eventUtils.snoozed = true;
    QueUp.Events.bind('realtime:room_playlist-update', eventSongAdvance);
  } else if (eventUtils.snoozed) {
    QueUp.room.player.setVolume(eventUtils.currentVol);
    QueUp.room.player.updateVolumeBar();
    eventUtils.snoozed = false;
  }
}
function _default() {
  if (document.querySelector('.player_sharing .snooze_btn')) {
    document.querySelector('.player_sharing .snooze_btn').remove();
  }
  window.dubplus.snowTooltipShow = snooze_tooltip;
  window.dubplus.snoozeTooltipHide = hide_snooze_tooltip;
  window.dubplus.snoozeClick = snooze;
  var snoozeBtn = document.createElement('span');
  snoozeBtn.className = 'icon-mute snooze_btn';
  snoozeBtn.style.position = 'relative';
  snoozeBtn.setAttribute('onmouseover', 'window.dubplus.snowTooltipShow()');
  snoozeBtn.setAttribute('onmouseout', 'window.dubplus.snoozeTooltipHide()');
  snoozeBtn.setAttribute('onclick', 'window.dubplus.snoozeClick()');
  document.querySelector('.player_sharing').appendChild(snoozeBtn);
}

},{}],35:[function(require,module,exports){
"use strict";

var options = require('../utils/options.js');
module.exports = {
  id: "dubplus-snow",
  moduleName: "Snow",
  description: "Make it snow!",
  category: "General",
  doSnow: function doSnow() {
    $(document).snowfall('clear');
    $(document).snowfall({
      round: true,
      shadow: true,
      flakeCount: 50,
      minSize: 1,
      maxSize: 5,
      minSpeed: 5,
      maxSpeed: 5
    });
  },
  turnOn: function turnOn() {
    var _this = this;
    if (!$.snowfall) {
      // only pull in the script once if it doesn't exist
      $.getScript("https://cdn.jsdelivr.net/gh/loktar00/JQuery-Snowfall/src/snowfall.jquery.js").done(function () {
        _this.doSnow();
      }).fail(function (jqxhr, settings, exception) {
        options.toggleAndSave(_this.id, false);
        console.error('Could not load snowfall jquery plugin', exception);
      });
    } else {
      this.doSnow();
    }
    window.addEventListener('resize', this.doSnow, true);
  },
  turnOff: function turnOff() {
    if ($.snowfall) {
      // checking to avoid errors if you quickly switch it on/off before plugin
      // is loaded in the turnOn function
      $(document).snowfall('clear');
      window.removeEventListener('resize', this.doSnow, true);
    }
  }
};

},{"../utils/options.js":46}],36:[function(require,module,exports){
"use strict";

/**
 * Spacebar Mute
 * Turn on/off the ability to mute current song with the spacebar
 */

var myModule = {};
myModule.id = 'dubplus-spacebar-mute';
myModule.moduleName = 'Spacebar Mute';
myModule.description = 'Turn on/off the ability to mute current song with the spacebar.';
myModule.category = 'Settings';
var clickableTags = ['input', 'textarea', 'button', 'select', 'a'];
function onSpacebar(event) {
  var tag = event.target.tagName.toLowerCase();
  if (event.which === 32 && !clickableTags.includes(tag) && !event.target.isContentEditable) {
    QueUp.room.player.mutePlayer();
  }
}
myModule.turnOn = function () {
  $(document).on('keypress.key32', onSpacebar);
};
myModule.turnOff = function () {
  $(document).off('keypress.key32', onSpacebar);
};
module.exports = myModule;

},{}],37:[function(require,module,exports){
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
myModule.turnOn = function () {
  $('body').addClass('dubplus-split-chat');
};
myModule.turnOff = function () {
  $('body').removeClass('dubplus-split-chat');
};
module.exports = myModule;

},{}],38:[function(require,module,exports){
"use strict";

/**
 * Show downvotes in chat
 * only mods can use this
 */

/*global Dubtrack */
var myModule = {};
myModule.id = "dubplus-updubs";
myModule.moduleName = "Updubs in Chat";
myModule.description = "Toggle showing updubs in the chat box";
myModule.category = "General";
myModule.updubWatcher = function (e) {
  var user = QueUp.session.get('username');
  var currentDj = QueUp.room.users.collection.findWhere({
    userid: QueUp.room.player.activeSong.attributes.song.userid
  }).attributes._user.username;
  if (user === currentDj && e.dubtype === 'updub') {
    var newChat = "\n      <li class=\"dubplus-chat-system dubplus-chat-system-updub\">\n        <div class=\"chatDelete\" onclick=\"dubplus.deleteChatMessageClientSide(this)\">\n          <span class=\"icon-close\"></span>\n        </div>\n        <div class=\"text\">\n          @".concat(e.user.username, " has updubbed your song ").concat(QueUp.room.player.activeSong.attributes.songInfo.name, "\n        </div>\n      </li>");
    $('ul.chat-main').append(newChat);
  }
};
myModule.turnOn = function () {
  QueUp.Events.bind("realtime:room_playlist-dub", this.updubWatcher);

  // add this function to our global dubplus object so that chat
  // items can be deleted
  if (typeof window.dubplus.deleteChatMessageClientSide !== 'function') {
    window.dubplus.deleteChatMessageClientSide = function (el) {
      $(el).parent('li')[0].remove();
    };
  }
};
myModule.turnOff = function () {
  QueUp.Events.unbind("realtime:room_playlist-dub", this.updubWatcher);
};
module.exports = myModule;

},{}],39:[function(require,module,exports){
"use strict";

/**
 * Warn on Navigation
 * Warns you when accidentally clicking on a link that takes you out of dubtrack
 */

var myModule = {};
myModule.id = "warn_redirect";
myModule.moduleName = "Warn On Navigation";
myModule.description = "Warns you when accidentally clicking on a link that takes you out of dubtrack.";
myModule.category = "Settings";
function unloader(e) {
  var confirmationMessage = "";
  e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
  return confirmationMessage; // Gecko, WebKit, Chrome <34
}
myModule.turnOn = function () {
  window.addEventListener("beforeunload", unloader);
};
myModule.turnOff = function () {
  window.removeEventListener("beforeunload", unloader);
};
module.exports = myModule;

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiBase = void 0;
var apiBase = exports.apiBase = window.location.hostname.includes('staging') ? 'https://staging-api.queup.dev' : 'https://api.queup.net';

},{}],41:[function(require,module,exports){
(function (TIME_STAMP){(function (){
'use strict';

var settings = require('../lib/settings.js');
var makeLink = function makeLink(className, FileName) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.className = className || '';
  link.href = FileName;
  return link;
};
function removeLink(className) {
  var link = document.querySelector("link.".concat(className));
  if (link) {
    link.remove();
  }
}

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
  removeLink(className);
  var link = makeLink(className, settings.srcRoot + cssFile + '?' + TIME_STAMP);
  document.head.appendChild(link);
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
  removeLink(className);
  var link = makeLink(className, cssFile);
  document.head.appendChild(link);
};
module.exports = {
  load: load,
  loadExternal: loadExternal
};

}).call(this)}).call(this,'1720194289241')
},{"../lib/settings.js":8}],42:[function(require,module,exports){
"use strict";

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
  return {
    done: done
  };
};
module.exports = GetJSON;

},{}],43:[function(require,module,exports){
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
  var opts = Object.assign({}, defaults, options);

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
  document.body.insertAdjacentHTML('beforeend', dubplusModal);

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

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
/**
 * Check if a user is at least a mod or above
 */
/*global Dubtrack */
function _default(userid) {
  return QueUp.helpers.isSiteAdmin(userid) || QueUp.room.users.getIfOwner(userid) || QueUp.room.users.getIfManager(userid) || QueUp.room.users.getIfMod(userid);
}

},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyCheckPermission = notifyCheckPermission;
exports.showNotification = showNotification;
/* global Dubtrack */
var modal = require('../utils/modal.js');
var isActiveTab = true;
window.onfocus = function () {
  isActiveTab = true;
};
window.onblur = function () {
  isActiveTab = false;
};
var onDenyDismiss = function onDenyDismiss() {
  modal.create({
    title: 'Desktop Notifications',
    content: "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site."
  });
};
function notifyCheckPermission(cb) {
  var _cb = typeof cb === 'function' ? cb : function () {};

  // first check if browser supports it
  if (!("Notification" in window)) {
    modal.create({
      title: 'Desktop Notifications',
      content: "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox"
    });
    return _cb(false);
  }

  // no request needed, good to go
  if (Notification.permission === "granted") {
    return _cb(true);
  }
  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function (result) {
      if (result === 'denied' || result === 'default') {
        onDenyDismiss();
        _cb(false);
        return;
      }
      _cb(true);
    });
  } else {
    onDenyDismiss();
    return _cb(false);
  }
}
function showNotification(opts) {
  var defaults = {
    title: 'New Message',
    content: '',
    ignoreActiveTab: false,
    callback: null,
    wait: 5000
  };
  var options = Object.assign({}, defaults, opts);

  // don't show a notification if tab is active
  if (isActiveTab === true && !options.ignoreActiveTab) {
    return;
  }
  var notificationOptions = {
    body: options.content,
    icon: "https://res.cloudinary.com/hhberclba/image/upload/c_lpad,h_100,w_100/v1400351432/dubtrack_new_logo_fvpxa6.png"
  };
  var n = new Notification(options.title, notificationOptions);
  n.onclick = function () {
    window.focus();
    if (typeof options.callback === "function") {
      options.callback();
    }
    n.close();
  };
  setTimeout(n.close.bind(n), options.wait);
}

},{"../utils/modal.js":43}],46:[function(require,module,exports){
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

},{"../lib/settings.js":8}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = preload;
var settings = require('../lib/settings.js');
function preload() {
  var waitingStyles = ['font-family: \'Trebuchet MS\', Helvetica, sans-serif', 'z-index: 2147483647', 'color: white', 'position: fixed', 'top: 69px', 'right: 13px', 'background: #222', 'padding: 10px', 'line-height: 1', '-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)', '-moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)', 'box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)', 'border-radius: 5px', 'overflow: hidden', 'width: 230px'].join(';');
  var dpIcon = ['float:left', 'width: 26px', 'margin-right:5px'].join(";");
  var dpText = ['display: table-cell', 'width: 10000px', 'padding-top:5px'].join(";");
  var preloadHTML = "\n    <div class=\"dubplus-waiting\" style=\"".concat(waitingStyles, "\">\n      <div style=\"").concat(dpIcon, "\">\n        <img src=\"").concat(settings.srcRoot, "/images/dubplus.svg\" alt=\"DubPlus icon\">\n      </div>\n      <span style=\"").concat(dpText, "\">\n        Waiting for QueUp...\n      </span>\n    </div>\n  ");
  document.body.insertAdjacentHTML('afterbegin', preloadHTML);
}

},{"../lib/settings.js":8}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Takes a string  representation of a variable or object and checks if it's
 * definied starting at provided scope or default to global window scope.
 * @param  {string} dottedString  the item you are looking for
 * @param  {var}    startingScope where to start lookined
 * @return {boolean}              if it is defined or not
 */
function deepCheck(dottedString, startingScope) {
  var _vars = dottedString.split('.');
  var len = _vars.length;
  var depth = startingScope || window;
  for (var i = 0; i < len; i++) {
    if (typeof depth[_vars[i]] === 'undefined') {
      return false;
    }
    depth = depth[_vars[i]];
  }
  return true;
}
function arrayDeepCheck(arr, startingScope) {
  var len = arr.length;
  var scope = startingScope || window;
  for (var i = 0; i < len; i++) {
    if (!deepCheck(arr[i], scope)) {
      console.log(arr[i], 'is not found yet');
      return false;
    }
  }
  return true;
}

/**
 * pings for the existence of var/function for # seconds until it's defined
 * runs callback once found and stops pinging
 * @param {string|array} waitingFor          what you are waiting for
 * @param {object}       options             optional options to pass
 *                       options.interval    how often to ping
 *                       options.seconds     how long to ping for
 *                       
 * @return {object}                    2 functions:
 *                  .then(fn)          will run fn only when item successfully found.  This also starts the ping process
 *                  .fail(fn)          will run fn only when is never found in the time given
 */
function WaitFor(waitingFor, options) {
  if (typeof waitingFor !== "string" && !Array.isArray(waitingFor)) {
    console.warn('WaitFor: invalid first argument');
    return;
  }
  var defaults = {
    interval: 500,
    // every XX ms we check to see if waitingFor is defined
    seconds: 5 // how many total seconds we wish to continue pinging
  };
  var _cb = function _cb() {};
  var _failCB = function _failCB() {};
  var checkFunc = Array.isArray(waitingFor) ? arrayDeepCheck : deepCheck;
  var opts = Object.assign({}, defaults, options);
  var tryCount = 0;
  var tryLimit = opts.seconds * 1000 / opts.interval; // how many intervals

  var check = function check() {
    tryCount++;
    var _test = checkFunc(waitingFor);
    if (_test) {
      return _cb();
    }
    if (tryCount < tryLimit) {
      window.setTimeout(check, opts.interval);
    } else {
      return _failCB();
    }
  };
  var then = function then(cb) {
    if (typeof cb === 'function') {
      _cb = cb;
    }
    // start the first one
    window.setTimeout(check, opts.interval);
    return this;
  };
  var fail = function fail(cb) {
    if (typeof cb === 'function') {
      _failCB = cb;
    }
    return this;
  };
  return {
    then: then,
    fail: fail
  };
}
var _default = exports.default = WaitFor;

},{}]},{},[1]);
