import {h, Component} from 'preact';
import {MenuSwitch} from '@/components/menuItems.js';
import chatReplace from '@/utils/emotes/chat-replace.js';

import twitchEmotes from '@/utils/emotes/twitch.js';
import bttvEmotes from '@/utils/emotes/bttv.js';

/**********************************************************************
 * handles replacing twitch emotes in the chat box with the images
 */

export default class Emotes extends Component {

  turnOn = () => {
    // spin logo to indicate emotes are still loading
    document.body.classList.add('dubplus-icon-spinning');

    // these load super fast
    if (!bttvEmotes.loaded) {
      bttvEmotes.load();
    }

    // these load super slow
    if (!twitchEmotes.loaded) {
      // if this one errors out then we still want to turn this on
      twitchEmotes.error(this.begin);
      twitchEmotes.done(this.begin);
      twitchEmotes.load();
      return;
    }

    this.begin();
  }

  begin() {
    document.body.classList.remove('dubplus-icon-spinning');
    // when first turning it on, it replaces ALL of the emotes in chat history
    chatReplace(document.querySelector('.chat-main'));
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