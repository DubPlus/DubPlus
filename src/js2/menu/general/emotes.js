import {h, Component} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';
import chatReplace from '../../utils/emotes/chat-replace.js';

import twitchEmotes from '../../utils/emotes/twitch.js';
import bttvEmotes from '../../utils/emotes/bttv.js';
import tastyEmotes from '../../utils/emotes/tasty.js';

/**********************************************************************
 * handles replacing twitch emotes in the chat box with the images
 */

export default class Emotes extends Component {

  turnOn = (e) => {
    if (!twitchEmotes.loaded) {

      twitchEmotes.download();
      window.addEventListener("twitch:loaded", bttvEmotes.download);
      window.addEventListener("bttv:loaded", tastyEmotes.download);
      window.addEventListener("tasty:loaded", function tastyLoaded() {
        // when first turning it on, it replaces ALL of the emotes in chat history
        chatReplace(document.querySelectorAll('.chat-main'));
        window.removeEventListener("twitch:loaded", bttvEmotes.download);
        window.removeEventListener("bttv:loaded", tastyEmotes.download);
        window.removeEventListener("tasty:loaded", tastyLoaded);
      });

    } else {
      // when first turning it on, it replaces ALL of the emotes in chat history
      chatReplace(document.querySelectorAll('.chat-main'));
    }
    // then it sets up replacing emotes on new chat messages
    Dubtrack.Events.bind("realtime:chat-message", chatReplace);
  }
  
  turnOff = (e) => {
    Dubtrack.Events.unbind("realtime:chat-message", chatReplace);
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