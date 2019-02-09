import {h, Component} from 'preact';
import {MenuSwitch} from '@/components/menuItems.js';
import chatReplace from '@/utils/emotes/chat-replace.js';
import bttvEmotes from '@/utils/emotes/bttv.js';
import dtproxy from "@/utils/DTProxy.js";

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

    this.begin();
  }

  begin() {
    document.body.classList.remove('dubplus-icon-spinning');
    // when first turning it on, it replaces ALL of the emotes in chat history
    chatReplace(dtproxy.chatList());
    // then it sets up replacing emotes on new chat messages
    dtproxy.onChatMessage(chatReplace);
  }
  
  turnOff = (e) => {
    dtproxy.offChatMessage(chatReplace);
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