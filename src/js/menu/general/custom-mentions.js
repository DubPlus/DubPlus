import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

/**
 * Custom mentions
 */
export default class CustomMentions extends Component {
  state = {
    custom: settings.stored.custom.custom_mentions
  };

  customMentionCheck = e => {
    var content = e.message;
    if (this.state.custom) {
      var customMentions = this.state.custom.split(",");
      var inUsers = customMentions.some(function(v) {
        var reg = new RegExp("\\b" + v.trim() + "\\b", "i");
        return reg.test(content);
      });
      if (dtproxy.sessionId() !== e.user.userInfo.userid && inUsers) {
        dtproxy.playChatSound();
      }
    }
  };

  saveCustomMentions = val => {
    settings.save("custom", "custom_mentions", val);
    this.setState({ custom: val });
  };

  turnOn = () => {
    dtproxy.events.onChatMessage(this.customMentionCheck);
  };

  turnOff = () => {
    dtproxy.events.offChatMessage(this.customMentionCheck);
  };

  render(props, { custom }) {
    return (
      <MenuSwitch
        id="custom_mentions"
        section="General"
        menuTitle="Custom Mentions"
        desc="Toggle using custom mentions to trigger sounds in chat"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <MenuPencil
          title="Custom AFK Message"
          section="General"
          content="Add your custom mention triggers here (separate by comma)"
          value={custom}
          placeholder="separate, custom triggers, by, comma, :heart:"
          maxlength="255"
          onConfirm={this.saveCustomMentions}
        />
      </MenuSwitch>
    );
  }
}
