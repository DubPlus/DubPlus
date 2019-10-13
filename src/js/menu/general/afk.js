import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

export default class AFK extends Component {
  state = {
    canSend: true,
    afkMessage : settings.stored.custom.customAfkMessage
  }

  afkRespond = e => {
    if (!this.state.canSend) {
      return; // do nothing until it's back to true
    }

    var content = e.message;
    var user = dtproxy.userName();
    if (
      content.indexOf("@" + user) >= 0 &&
      dtproxy.sessionId() !== e.user.userInfo.userid
    ) {
      var chatInput = dtproxy.dom.chatInput();
      if (this.state.afkMessage) {
        chatInput.value = "[AFK] " + this.state.afkMessage;
      } else {
        chatInput.value = "[AFK] I'm not here right now.";
      }

      dtproxy.sendChatMessage();

      // so we don't spam chat, we pause the auto respond for 30sec
      this.setState({ canSend: false });

      setTimeout(() => {
         this.setState({ canSend: true });
      }, 30000);
    }
  }

  turnOn = () => {
    dtproxy.events.onChatMessage(this.afkRespond);
  }

  turnOff = () => {
    dtproxy.events.offChatMessage(this.afkRespond);
  }

  saveAFKmessage = val => {
    const success = settings.save("custom", "customAfkMessage", val);
    if (success) {
      this.setState({ afkMessage: val });
    }
    return success;
  }

  render() {
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
          value={this.state.afkMessage}
          placeholder="Be right back!"
          maxlength="255"
          onConfirm={this.saveAFKmessage}
          errorMsg={"An error occured saving your AFK message"}
        />
      </MenuSwitch>
    );
  }
}
