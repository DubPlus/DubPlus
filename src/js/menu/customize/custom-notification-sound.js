import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

/*
  Interaction model
  
  # Extension start up (first load)
  - check if there is an audio url in saved options
  - if so -> check if a playable url -> set as chat sound
  - if can't play, turn off option

  # Turn on from user click
  - if no saved setting, show modal
  - else turn on (see above for turn on process)

  # Modal Save
  - if switch is on
    - check if new url is playable, set it as chat sound
  - else
    - show error message in modal. User will either have to fix
      it or his cancel to get out of the modal

  # Modal Cancel
  - close modal
  - if setting is empty, or cant play sound, turn off switch

*/


const modalMessage =
  "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to Dubtrack's default sound";

const processError = "Error saving new url, check url and try again"

/**
 * Custom Notification Sound
 */
export default class CustomSound extends Component {
  state = {
    showModal: false,
    errorMsg: processError
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
    const newVal = val.trim()
    let success = settings.save("custom", "notificationSound", newVal);
    if (!success) {
      this.setState({errorMsg: processError})
      return false;
    }

    if (this.switchRef.state.on) {
      // Check if valid sound url
      if (soundManager.canPlayURL(newVal)) {
        dtproxy.setChatSoundUrl(newVal);
        this.setState({ showModal: false });
        return true
      } else {
        this.setState({errorMsg: this.badUrlError})
        return false
      }
    }
    
    this.setState({ showModal: false });
    return true
  };

  onCancel = () => {
    this.setState({ showModal: false });

    const {notificationSound } = settings.stored.custom;

    if (!notificationSound || !soundManager.canPlayURL(notificationSound)) {
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
