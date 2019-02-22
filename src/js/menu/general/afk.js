import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

/**
 *
 * Away From Keyboard autoresponder
 */
export default class AFK extends Component {
  state = {
    canSend: true,
    afkMessage: settings.stored.custom.customAfkMessage
  };

  afk_chat_respond = e => {
    if (!this.state.canSend) {
      return; // do nothing until it's back to true
    }
    var content = e.message;
    var user = dtproxy.getUserName();
    if (
      content.indexOf("@" + user) >= 0 &&
      dtproxy.getSessionId() !== e.user.userInfo.userid
    ) {
      var chatInput = dtproxy.chatInput();
      if (this.state.afkMessage) {
        chatInput.value = "[AFK] " + this.state.afkMessage;
      } else {
        chatInput.value = "[AFK] I'm not here right now.";
      }

      dtproxy.sendChatMessage();

      // so we don't spam chat, we pause the auto respond for 30sec
      this.setState({ canSend: false });

      // allow AFK responses after 30sec
      setTimeout(() => {
        this.setState({ canSend: true });
      }, 30000);
    }
  };

  turnOn = () => {
    dtproxy.onChatMessage(this.afk_chat_respond);
  };

  turnOff = () => {
    dtproxy.offChatMessage(this.afk_chat_respond);
  };

  saveAFKmessage = val => {
    settings.save("custom", "customAfkMessage", val);
    this.setState({ afkMessage: val });
  };

  render(props, { afkMessage }) {
    return (
      <MenuSwitch
        id="dubplus-afk"
        section="General"
        menuTitle="AFK Auto-respond"
        desc="Toggle Away from Keyboard and customize AFK message."
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <MenuPencil
          title="Custom AFK Message"
          section="General"
          content="Enter a custom Away From Keyboard [AFK] message here"
          value={afkMessage}
          placeholder="Be right back!"
          maxlength="255"
          onConfirm={this.saveAFKmessage}
        />
      </MenuSwitch>
    );
  }
}
