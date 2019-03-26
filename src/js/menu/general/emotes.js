import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import chatReplace from "@/utils/emotes/chat-replace.js";
import dtproxy from "@/utils/DTProxy.js";

/**********************************************************************
 * handles replacing twitch emotes in the chat box with the images
 */

export default class Emotes extends Component {
  turnOn = () => {
    document.body.classList.add("dubplus-emotes-on");
    this.begin();
  };

  begin() {
    // when first turning it on, it replaces ALL of the emotes in chat history
    chatReplace(dtproxy.dom.chatList());
    // then it sets up replacing emotes on new chat messages
    dtproxy.events.onChatMessage(chatReplace);
  }

  turnOff = e => {
    document.body.classList.remove("dubplus-emotes-on");
    dtproxy.events.offChatMessage(chatReplace);
  };

  render(props, state) {
    return (
      <MenuSwitch
        id="dubplus-emotes"
        section="General"
        menuTitle="Emotes"
        desc="Adds twitch and bttv emotes in chat."
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
