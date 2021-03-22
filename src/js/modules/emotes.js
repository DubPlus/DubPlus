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
        var _id, _src, key = p1.toLowerCase();

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
        } else if ( dubplus_emoji.frankerFacez.emotes[key] ) {
            _id = dubplus_emoji.frankerFacez.emotes[key];
            _src = dubplus_emoji.frankerFacez.template(_id);
            return makeImage("frankerFacez", _src, key);
        } else {
            return matched;
        }

    });

    $chatTarget.html(emoted);
};

emote_module.turnOn = function(){
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

emote_module.turnOff = function(){
  QueUp.Events.unbind("realtime:chat-message", replaceTextWithEmote);
};


module.exports = emote_module;