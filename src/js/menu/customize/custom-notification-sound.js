import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

const DubtrackDefaultSound = dtproxy.getChatSoundUrl;
const modalMessage =
  "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to Dubtrack's default sound";

/**
 * Custom Notification Sound
 */
export default class CustomSound extends Component {
  isOn = false;
  state = {
    showModal: false,
    modalMessage: modalMessage
  };

  turnOn = initialLoad => {
    if (settings.stored.custom.notificationSound) {
      this.isOn = true;
      dtproxy.setChatSoundUrl(settings.stored.custom.notificationSound);
      return;
    }

    if (!initialLoad) {
      this.setState({ showModal: true, modalMessage: modalMessage });
    }
  };

  turnOff = () => {
    this.isOn = false;
    dtproxy.setChatSoundUrl(DubtrackDefaultSound);
    this.setState({ showModal: false });
  };

  save = val => {
    // Check if valid sound url
    if (soundManager.canPlayURL(val)) {
      settings.save("custom", "notificationSound", val);
    } else {
      this.setState({
        modalMessage:
          "You've entered an invalid sound url! Please make sure you are entering the full, direct url to the file. IE: https://example.com/sweet-sound.mp3",
        showModal: true
      });
      return;
    }

    if (this.isOn) {
      dtproxy.setChatSoundUrl(val);
    }
    this.setState({ showModal: false });
  };

  onCancel = () => {
    if (!settings.stored.custom.notificationSound) {
      this.turnOff();
    }
  };

  render(props, state) {
    return (
      <MenuSwitch
        id="dubplus-custom-notification-sound"
        section="Customize"
        menuTitle="Custom Notification Sound"
        desc="Change the notification sound to a custom one."
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <MenuPencil
          showModal={state.showModal}
          title="Custom Notification Sound"
          section="Customize"
          content={state.modalMessage}
          value={settings.stored.custom.notificationSound || ""}
          placeholder="https://example.com/sweet-sound.mp3"
          maxlength="500"
          onConfirm={this.save}
          onCancel={this.onCancel}
        />
      </MenuSwitch>
    );
  }
}
