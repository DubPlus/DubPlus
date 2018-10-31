import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import settings from "../../utils/UserSettings.js";
import { notifyCheckPermission, showNotification } from "../../utils/notify.js";

export default class ChatNotification extends Component {
  notifyOnMention(e) {
    var content = e.message;
    var user = Dubtrack.session.get("username").toLowerCase();
    var mentionTriggers = ["@" + user];

    if (
      settings.stored.options.custom_mentions &&
      settings.stored.custom.custom_mentions
    ) {
      //add custom mention triggers to array
      mentionTriggers = mentionTriggers.concat(
        settings.stored.custom.custom_mentions.split(",")
      );
    }

    var mentionTriggersTest = mentionTriggers.some(function(v) {
      var reg = new RegExp("\\b" + v.trim() + "\\b", "i");
      return reg.test(content);
    });

    if (
      mentionTriggersTest &&
      !this.isActiveTab &&
      Dubtrack.session.id !== e.user.userInfo.userid
    ) {
      showNotification({
        title: `Message from ${e.user.username}`,
        content: content
      });
    }
  }

  turnOn = () => {
    notifyCheckPermission(granted => {
      if (granted === true) {
        Dubtrack.Events.bind("realtime:chat-message", this.notifyOnMention);
      } else {
        // call MenuSwitch's switchOff
      }
    });
  };

  turnOff = () => {
    Dubtrack.Events.unbind("realtime:chat-message", this.notifyOnMention);
  };

  render() {
    return (
      <MenuSwitch
        id="mention_notifications"
        section="General"
        menuTitle="Notification on Mentions"
        desc="Enable desktop notifications when a user mentions you in chat"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
