import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import { notifyCheckPermission, showNotification } from "@/utils/notify.js";
import Modal from "@/components/modal";
import dtproxy from "@/utils/DTProxy.js";

export default class PMNotifications extends Component {
  state = {
    showWarning: false,
    warnTitle: "",
    warnContent: ""
  };

  notify(e) {
    var userid = dtproxy.getSessionId;
    if (userid === e.userid) {
      return;
    }
    showNotification({
      title: "You have a new PM",
      ignoreActiveTab: true,
      callback: function() {
        dtproxy.userPMs().click();
        setTimeout(function() {
          dtproxy.getPMmsg(e.messageid).click();
        }, 500);
      },
      wait: 10000
    });
  }

  turnOn = () => {
    notifyCheckPermission((status, reason) => {
      if (status === true) {
        dtproxy.onNewPM(this.notify);
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
    dtproxy.offNewPM(this.notify);
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
