import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import { notifyCheckPermission, showNotification } from "@/utils/notify.js";
import Modal from "@/components/modal";

export default class ChatNotification extends Component {
  state = {
    showWarning : false,
    warnTitle : '',
    warnContent: ''
  }

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
    notifyCheckPermission((status, reason) => {
      if (status === true) {
        Dubtrack.Events.bind("realtime:chat-message", this.notifyOnMention);
      } else {
        // call MenuSwitch's switchOff with noTrack=true argument
        this.switchRef.switchOff(true);
        this.setState({
          showWarning: true,
          warnTitle: reason.title,
          warnContent: reason.content
        });
      }
    });
  };

  closeModal = () => {
    this.setState({ showWarning: false });
  }

  turnOff = () => {
    Dubtrack.Events.unbind("realtime:chat-message", this.notifyOnMention);
  };

  render(props, state) {
    return (
      <MenuSwitch
        ref={s => (this.switchRef = s)}
        id="mention_notifications"
        section="General"
        menuTitle="Notification on Mentions"
        desc="Enable desktop notifications when a user mentions you in chat"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <Modal
          open={state.showWarning}
          title={state.warnTitle}
          content={state.warnContent}
          onClose={this.closeModal}
        />
      </MenuSwitch>
    );
  }
}
