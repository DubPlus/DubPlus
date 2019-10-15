import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

/*
  Interaction model
  
  # Extension start up (first load)
  - check if user has turned this option on
  - if so, try loading custom bg
  - if for some reason the switch is on but saved data is empty, turn it off

  # On error
  - if image doesn't load
    - show alert with error message
    - turn off switch

  # Turn on from user click
  - if there's a saved setting
    - load BG image
  - if not
    - show modal to enter an image

  # Modal Save
  - if switch is on and val is not empty, try loading the bg image
  - if switch is on and val is empty, revert to the original bg image
  - close modal

  # Modal Cancel
  - close modal

*/

/**
 * Custom Background
 */
export default class CustomBG extends Component {
  state = {
    showModal: false
  };

  // this returns the DOM element for the background image
  bgImg = dtproxy.dom.bgImg();
  
  componentDidMount() {
    this.dubBgImg = this.bgImg.src
    this.bgImg.onerror = this.handleError
  }

  handleError = () => {
    this.switchRef.switchOff();
    this.revertBG();
    alert("error loading image, edit the url and try again");
  };

  addCustomBG = val => {
    this.bgImg.src = val;
  };

  revertBG = () => {
    this.bgImg.src = this.dubBgImg;
  };

  turnOn = initialLoad => {
    if (settings.stored.custom.bg) {
      this.addCustomBG(settings.stored.custom.bg);
      return;
    } else {
      this.switchRef.switchOff();
    }

    // if there is no saved setting
    // and User clicked to turn it on
    if (!initialLoad) {
      this.setState({ showModal: true });
    }
  };

  turnOff = () => {
    this.revertBG();
    this.setState({ showModal: false });
  };

  save = val => {
    let success = settings.save("custom", "bg", val.trim());
    if (!success) {
      return false;
    }

    if (this.switchRef.state.on) {
      if (settings.stored.custom.bg) {
        this.addCustomBG(val);
      } else {
        this.turnOff();
        return true;
      }
    }

    this.setState({ showModal: false });

    return true;
  };

  onCancel = () => {
    this.setState({ showModal: false });
  };

  render(props, state) {
    return (
      <MenuSwitch
        ref={e => (this.switchRef = e)}
        id="dubplus-custom-bg"
        section="Customize"
        menuTitle="Custom Background Image"
        desc="Add your own custom Background."
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <MenuPencil
          showModal={state.showModal}
          title="Custom Background Image"
          section="Customize"
          content="Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image"
          value={settings.stored.custom.bg || ""}
          placeholder="https://example.com/big-image.jpg"
          maxlength="500"
          errorMsg={
            "An error occured trying to save your image url, please check it and try again"
          }
          onCancel={this.onCancel}
          onConfirm={this.save}
        />
      </MenuSwitch>
    );
  }
}
