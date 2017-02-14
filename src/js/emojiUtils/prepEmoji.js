'use strict';
/* global Dubtrack, emojify */

var GetJSON = require('../utils/getJSON.js');
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

  // if api return an object with an error then we should try again
  var savedItem = localStorage.getItem(apiName +'_api');
  if (savedItem) {
    var parsed = JSON.parse(savedItem);
    if (typeof parsed.error !== 'undefined') { return true;}
  }

  var today = Date.now();
  var lastSaved = parseInt(localStorage.getItem(apiName+'_api_timestamp'));
  // Is the lastsaved not a number for some strange reason, then we should update
  // are we past 5 days from last update? then we should update
  // does the data not exist in localStorage, then we should update
  return isNaN(lastSaved) || today - lastSaved > day * 5 || !savedItem;
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
    var twApi = new GetJSON('//api.twitch.tv/kraken/chat/emoticon_images', 'twitch:loaded');
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
      var bttvApi = new GetJSON('//api.betterttv.net/2/emotes', 'bttv:loaded');
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
  var tastyApi = new GetJSON(settings.srcRoot + '/emotes/tastyemotes.json', 'tasty:loaded');
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