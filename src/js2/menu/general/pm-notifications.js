import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import { notifyCheckPermission, showNotification } from "../../utils/notify.js";
import Modal from "../../components/modal";

const statuses = {
  denyDismiss: {
    title: "Desktop Notifications",
    content:
      "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site."
  },
  noSupport: {
    title: "Desktop Notifications",
    content:
      "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox"
  }
};

export default class PMNotifications extends Component {
  state = {
    showWarning: false,
    warnTitle: "",
    warnContent: ""
  };

  notify(e) {
    var userid = Dubtrack.session.get("_id");
    if (userid === e.userid) {
      return;
    }
    showNotification({
      title: "You have a new PM",
      ignoreActiveTab: true,
      callback: function() {
        document.querySelector(".user-messages").click();
        setTimeout(function() {
          document.querySelector(`.message-item[data-messageid="${e.messageid}"]`).click();
        }, 500);
      },
      wait: 10000
    });
  }

  turnOn = () => {
    notifyCheckPermission((status, reason) => {
      if (status === true) {
        Dubtrack.Events.bind("realtime:new-message", this.notify);
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
  };

  turnOff = () => {
    Dubtrack.Events.unbind("realtime:new-message", this.notify);
  };

  render(props, state) {
    return (
      <MenuSwitch
        ref={s => (this.switchRef = s)}
        id="dubplus_pm_notifications"
        section="General"
        menuTitle="Notification on PM"
        desc="Enable desktop notifications when a user receives a private message"
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
