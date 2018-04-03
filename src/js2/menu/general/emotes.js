import {h, Component} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';
import settings from '../../utils/UserSettings.js';

// var dubplus_emoji = require('../emojiUtils/prepEmoji.js');

function makeImage(type, src, name, w, h){
  let img = document.createElement('img');
  if (w) { img.width = w;}
  if (h) { img.height = h;}
  img.className = `emoji ${type}-emote`;
  img.title = name;
  img.alt = name;
  img.src = src;
  return img;
}

function getLatestChatNode(){
  var list = document.querySelectorAll('.chat-main .text');
  list = Array.prototype.slice.call(list);
  return list[list.length - 1];
}

/**
 * I didn't want to use innerHTML anymore because that's dangerous so I'm 
 * iterating through all childnodes, finding text nodes only, and replacing
 * text in there
 * @param {Node} parentNode 
 */
function replaceOnlyTextNodes(parentNode){
  // search thr
}

/**********************************************************************
 * handles replacing twitch emotes in the chat box with the images
 */

var replaceTextWithEmote = function(){
  var _regex = dubplus_emoji.twitch.chatRegex;

  if (!dubplus_emoji.twitchJSONSLoaded) { return; } // can't do anything until jsons are loaded

  var chatTarget = getLatestChatNode();
  
  if (!chatTarget.hasChildNodes()) { return; } // nothing to do

  if (dubplus_emoji.bttvJSONSLoaded) { _regex = dubplus_emoji.bttv.chatRegex; }

  var emoted = chatTarget.innerHTML.replace(_regex, function(matched, p1){
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
      } else {
          return matched;
      }

  });

  chatTarget.innerHTML(emoted);
};

export default class Emotes extends Component {

  turnOn = (e) => {
    window.addEventListener('twitch:loaded', dubplus_emoji.loadBTTVEmotes.bind(dubplus_emoji));

    if (!dubplus_emoji.twitchJSONSLoaded) {
      dubplus_emoji.loadTwitchEmotes();
    } else {
      replaceTextWithEmote();
    }
    Dubtrack.Events.bind("realtime:chat-message", replaceTextWithEmote);
  }
  
  turnOff = (e) => {
    Dubtrack.Events.unbind("realtime:chat-message", replaceTextWithEmote);
  }


  render(props,state){
    return (
      <MenuSwitch
        id="dubplus-emotes"
        section="General"
        menuTitle="Emotes"
        desc="Adds twitch and bttv emotes in chat."
        turnOn={this.turnOn}
        turnOff={this.turnOff}>
      </MenuSwitch>
    )
  }
}