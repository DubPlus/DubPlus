import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

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
    this.bgImg.onerror = () => {
      alert("error loading image, check the url and try again")
      this.switchRef.switchOff()
    }
  }

  addCustomBG(val) {
    this.saveSrc = this.bgImg.src;
    this.bgImg.src = val;
  }

  revertBG() {
    if (this.saveSrc) {
      this.bgImg.src = this.saveSrc;
    }
  }

  turnOn = initialLoad => {
    if (settings.stored.custom.bg) {
      this.addCustomBG(settings.stored.custom.bg);
      return;
    }

    if (!initialLoad) {
      this.setState({ showModal: true });
    }
  };

  turnOff = () => {
    this.revertBG();
    this.setState({ showModal: false });
  };

  save = val => {
    let success = settings.save("custom", "bg", val);

    if (val && success) {
      this.addCustomBG(val);
      this.setState({ showModal: false });
    }

    // if custom bg is empty we should disable the switch 
    if (!settings.stored.custom.bg) {
      this.switchRef.switchOff()
    }
    
    return success
  };

  render(props, state) {
    return (
      <MenuSwitch
        ref={e => this.switchRef = e}
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
          onConfirm={this.save}
        />
      </MenuSwitch>
    );
  }
}
