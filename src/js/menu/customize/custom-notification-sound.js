import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

const modalMessage =
  "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to Dubtrack's default sound";

/**
 * Custom Notification Sound
 */
export default class CustomSound extends Component {
  state = {
    showModal: false,
    errorMsg: ""
  }

  badUrlError = "You've entered an invalid sound url! Please make sure you are entering the full, direct url to the file. IE: https://example.com/sweet-sound.mp3"

  DubtrackDefaultSound = dtproxy.getChatSoundUrl();

  turnOn = initialLoad => {
    const {notificationSound } = settings.stored.custom;

    if (notificationSound && soundManager.canPlayURL(notificationSound)) {
      dtproxy.setChatSoundUrl(notificationSound);
      return;
    } else if (initialLoad) {
      this.switchRef.switchOff()
      return
    }

    if (!initialLoad) {
      this.setState({ showModal: true, errorMsg: this.badUrlError});
    }
  };

  turnOff = () => {
    dtproxy.setChatSoundUrl(this.DubtrackDefaultSound);
    this.setState({ showModal: false });
  };

  save = val => { 
    // if value was empty then we turn off the switch
    if (val.trim() === "") {
      settings.save("custom", "notificationSound", val)
      this.switchRef.switchOff()
      return true;
    }

    // Check if valid sound url
    if (soundManager.canPlayURL(val)) {
      settings.save("custom", "notificationSound", val)
      dtproxy.setChatSoundUrl(val);
      this.setState({ showModal: false });
      return true
    } else {
      settings.save("custom", "notificationSound", "")
      this.setState({errorMsg: this.badUrlError})
      return false
    }
  };

  onCancel = () => {
    this.setState({ showModal: false });
    if (!settings.stored.custom.notificationSound) {
      this.switchRef.switchOff()
    }
  };

  render(props, state) {
    return (
      <MenuSwitch
        ref={e => this.switchRef = e}
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
          content={modalMessage}
          value={settings.stored.custom.notificationSound || ""}
          placeholder="https://example.com/sweet-sound.mp3"
          maxlength="500"
          onConfirm={this.save}
          onCancel={this.onCancel}
          errorMsg={this.state.errorMsg}
        />
      </MenuSwitch>
    );
  }
}
