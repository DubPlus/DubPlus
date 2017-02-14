/**
 * Emotes
 * Adds additional Twitch, BTTV, and Tasty Emotes to the chat window 
 */

/* global Dubtrack, emojify */
var options = require('../utils/options.js');
var menu = require('../lib/menu.js');
var dubplus_emoji = require('../emojiUtils/prepEmoji.js');
var settings = require("../lib/settings.js");

var emote_module = {};

emote_module.id = "dubplus-emotes";
emote_module.moduleName = "Emotes";
emote_module.description = "Toggle additionally supported emotes in chat. (twitch, bttv, etc)";
emote_module.optionState = settings.options[emote_module.id] || false; // initial state from stored settings
emote_module.category = "General";
emote_module.menuHTML = menu.makeOptionMenu(emote_module.moduleName, {
  id : emote_module.id,
  desc : emote_module.description,
  state : emote_module.optionState
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

var replaceTextWithEmote = function(){
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

var startReplacing = function(){
  if (!dubplus_emoji.twitchJSONSLoaded) {
    dubplus_emoji.loadTwitchEmotes();
  } else {
    replaceTextWithEmote();
  }
  Dubtrack.Events.bind("realtime:chat-message", replaceTextWithEmote);
};

emote_module.init = function(){
  if (emote_module.optionState) {
    startReplacing();
  }
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