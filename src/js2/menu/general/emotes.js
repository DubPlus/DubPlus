import {h, Component} from 'preact';
import {MenuSwitch} from '../../components/menuItems.js';
import chatReplace from '../../utils/emotes/chat-replace.js';

/**********************************************************************
 * handles replacing twitch emotes in the chat box with the images
 */

export default class Emotes extends Component {

  turnOn = (e) => {
    if (!dubplus_emoji.twitchJSONSLoaded) {
      dubplus_emoji.loadTwitchEmotes();
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