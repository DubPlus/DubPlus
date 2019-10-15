import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import { notifyCheckPermission, showNotification } from "@/utils/notify.js";
import dtproxy from "@/utils/DTProxy.js";

export default class DJNotification extends Component {
  state = {
    canNotify: false,
    notifyOn: settings.stored.custom["dj-notification"]
  };

  savePosition = value => {
    var int = parseInt(value, 10);
    let amount = !isNaN(int) ? int : 2; // set default to position 2 in the queue
    const success = settings.save("custom", "dj-notification", amount);
    if (success) {
      this.setState({ notifyOn: value });
    }
    return success
  };

  djNotificationCheck = e => {
    if (!this.canNotify || e.startTime > 2) return;

    let queuePos = dtproxy.dom.getQueuePosition();
    var positionParse = parseInt(queuePos, 10);
    var position =
      e.startTime < 0 && !isNaN(positionParse)
        ? positionParse - 1
        : positionParse;
    if (isNaN(positionParse) || position !== this.state.notifyOn) {
      return;
    }

    showNotification({
      title: "DJ Alert!",
      content: "You will be DJing shortly! Make sure your song is set!",
      ignoreActiveTab: true,
      wait: 10000
    });
    dtproxy.playChatSound();
  };

  turnOn = () => {
    notifyCheckPermission((status, reason) => {
      if (status === true) {
        this.setState({ canNotify: true });
      }
    });
    dtproxy.events.onPlaylistUpdate(this.djNotificationCheck);
  };

  turnOff = () => {
    dtproxy.events.offPlaylistUpdate(this.djNotificationCheck);
  };

  render() {
    return (
      <MenuSwitch
        ref={s => (this.switchRef = s)}
        id="dj-notification"
        section="General"
        menuTitle="DJ Notification"
        desc="Notification when you are coming up to be the DJ"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <MenuPencil
          title="DJ Notification"
          section="General"
          content="Please specify the position in queue you want to be notified at"
          value={this.state.notifyOn}
          placeholder="2"
          maxlength="2"
          onConfirm={this.savePosition}
        />
      </MenuSwitch>
    );
  }
}
