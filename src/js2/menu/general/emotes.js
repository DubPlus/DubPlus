import {h, Component} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';
import settings from '../../utils/UserSettings.js';

// var dubplus_emoji = require('../emojiUtils/prepEmoji.js');

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
      } else {
          return matched;
      }

  });

  $chatTarget.html(emoted);
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