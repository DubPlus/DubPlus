/* global  emojify */

var GetJSON = require('../utils/getJSON.js');
var settings = require("../lib/settings.js");

// IndexedDB wrapper for increased quota compared to localstorage (5mb to 50mb)
!function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}();

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
prepEmoji.frankerFacez = {
  template: function(id) { return "//cdn.frankerfacez.com/emoticon/" + id + "/1"; },
  emotes: {},
  chatRegex : new RegExp(":([-_a-z0-9]+):", "ig")
};

prepEmoji.shouldUpdateAPIs = function(apiName, callback){
  var day = 86400000; // milliseconds in a day

  // if api return an object with an error then we should try again
  ldb.get(apiName +'_api', function(savedItem){
    if (savedItem) {
      var parsed = JSON.parse(savedItem);
      if (typeof parsed.error !== 'undefined') { callback(true); }
    }
  
    var today = Date.now();
    var lastSaved = parseInt(localStorage.getItem(apiName+'_api_timestamp'));
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
prepEmoji.loadTwitchEmotes = function(){
  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the twitch API
  this.shouldUpdateAPIs('twitch', function(update) {
    if (update) {
      console.log('dub+','twitch','loading from api');
      var twApi = new GetJSON('https://api.twitch.tv/kraken/chat/emoticon_images', 'twitch:loaded', {'Accept': 'application/vnd.twitchtv.v5+json', 'Client-ID': 'z5bpa7x6y717dsw28qnmcooolzm2js'});
      twApi.done((data)=>{
        var json = JSON.parse(data);
        var twitchEmotes = {};
        json.emoticons.forEach(e => {
          if (!twitchEmotes[e.code]){
            // if emote doesn't exist, add it
            twitchEmotes[e.code] = e.id;
          } else if (e.emoticon_set === null) {
            // override if it's a global emote (null set = global emote)
            twitchEmotes[e.code] = e.id;
          }
        });
        localStorage.setItem('twitch_api_timestamp', Date.now().toString());
        ldb.set('twitch_api', JSON.stringify(twitchEmotes));
        prepEmoji.processTwitchEmotes(twitchEmotes);
      });
    } else {
      ldb.get('twitch_api', function(data) {
        console.log('dub+','twitch','loading from IndexedDB');
        savedData = JSON.parse(data);
        prepEmoji.processTwitchEmotes(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('twitch:loaded');
        window.dispatchEvent(twEvent);
      });
    }
  });

};

prepEmoji.loadBTTVEmotes = function(){
  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the bttv API
  this.shouldUpdateAPIs('bttv', function(update) {
    if (update) {
      console.log('dub+','bttv','loading from api');
      var bttvApi = new GetJSON('//api.betterttv.net/2/emotes', 'bttv:loaded');
      bttvApi.done((data)=>{
          var json = JSON.parse(data);
          var bttvEmotes = {};
          json.emotes.forEach(e => {
            if (!bttvEmotes[e.code]){
              // if emote doesn't exist, add it
              bttvEmotes[e.code] = e.id;
            }
          });
          localStorage.setItem('bttv_api_timestamp', Date.now().toString());
          ldb.set('bttv_api', JSON.stringify(bttvEmotes));
          prepEmoji.processBTTVEmotes(bttvEmotes);
      });
    } else {
      ldb.get('bttv_api', function(data) {
        console.log('dub+','bttv','loading from IndexedDB');
        savedData = JSON.parse(data);
        prepEmoji.processBTTVEmotes(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('bttv:loaded');
        window.dispatchEvent(twEvent);
      });
    }
  });
};

prepEmoji.loadTastyEmotes = function(){
  console.log('dub+','tasty','loading from api');
  // since we control this API we should always have it load from remote
  var tastyApi = new GetJSON(settings.srcRoot + '/emotes/tastyemotes.json', 'tasty:loaded');
  tastyApi.done((data)=>{
    ldb.set('tasty_api', JSON.stringify(data));
    this.processTastyEmotes(JSON.parse(data));
  });
};

prepEmoji.loadFrankerFacez = function(){
  var savedData;
  // if it doesn't exist in localStorage or it's older than 5 days
  // grab it from the frankerfacez API
  this.shouldUpdateAPIs('frankerfacez', function(update) {
    if (update) {
      console.log('dub+','frankerfacez','loading from api');
      var frankerFacezApi = new GetJSON('//rawgit.com/Jiiks/BetterDiscordApp/master/data/emotedata_ffz.json', 'frankerfacez:loaded');
      frankerFacezApi.done((data)=>{
          var frankerFacez = JSON.parse(data);
          localStorage.setItem('frankerfacez_api_timestamp', Date.now().toString());
          ldb.set('frankerfacez_api', data);
          prepEmoji.processFrankerFacez(frankerFacez);
      });

    } else {
      ldb.get('frankerfacez_api', function(data) {
        console.log('dub+','frankerfacez','loading from IndexedDB');
        savedData = JSON.parse(data);
        prepEmoji.processFrankerFacez(savedData);
        savedData = null; // clear the var from memory
        var twEvent = new Event('frankerfacez:loaded');
        window.dispatchEvent(twEvent);
      });
    }
  });
};

prepEmoji.processTwitchEmotes = function(data) {
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

      if (!this.twitch.emotes[_key]){
        // if emote doesn't exist, add it
        this.twitch.emotes[_key] = data[code];
      } 
    }
  }
  this.twitchJSONSLoaded = true;
  this.emojiEmotes = emojify.emojiNames.concat(Object.keys(this.twitch.emotes));
};

prepEmoji.processBTTVEmotes = function(data){
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

prepEmoji.processTastyEmotes = function(data) {
  this.tasty.emotes = data.emotes;
  this.tastyJSONLoaded = true;
  this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.tasty.emotes));
};

prepEmoji.processFrankerFacez = function(data){
  for (var code in data) {
    if (data.hasOwnProperty(code)) {
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

      this.frankerFacez.emotes[_key] = data[code];
    }
  }
  this.frankerfacezJSONLoaded = true;
  this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.frankerFacez.emotes));
};

module.exports = prepEmoji;