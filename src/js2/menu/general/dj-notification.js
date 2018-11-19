import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import settings from "../../utils/UserSettings.js";
import { notifyCheckPermission, showNotification } from "../../utils/notify.js";

export default class DJNotification extends Component {
  state = {
    canNotify: false
  };

  savePosition = value => {
    var int = parseInt(value, 10);
    let amount = !isNaN(int) ? int : 2;
    settings.save("custom", "dj_notification", amount);
  };

  djNotificationCheck = e => {
    if (e.startTime > 2) return;

    let queuePos = document.querySelector(".queue-position").textContent;
    var positionParse = parseInt(queuePos, 10);
    var position =
      e.startTime < 0 && !isNaN(positionParse)
        ? positionParse - 1
        : positionParse;
    if (
      isNaN(positionParse) ||
      position !== settings.stored.custom.dj_notification
    )
      return;

    if (this.canNotify) {
      showNotification({
        title: "DJ Alert!",
        content: "You will be DJing shortly! Make sure your song is set!",
        ignoreActiveTab: true,
        wait: 10000
      });
    }
    Dubtrack.room.chat.mentionChatSound.play();
  };

  turnOn = () => {
    notifyCheckPermission((status, reason) => {
      if (status === true) {
        this.setState({ canNotify: true });
      }
    });
    Dubtrack.Events.bind(
      "realtime:room_playlist-update",
      this.djNotificationCheck
    );
  };

  turnOff = () => {
    Dubtrack.Events.unbind(
      "realtime:room_playlist-update",
      this.djNotificationCheck
    );
  };

  render(props, state) {
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
          value={settings.stored.custom.dj_notification || ""}
          placeholder="2"
          maxlength="2"
          onConfirm={this.savePosition}
        />
      </MenuSwitch>
    );
  }
}
