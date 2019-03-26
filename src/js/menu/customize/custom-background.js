import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

/**
 * Custom Background
 */
export default class CustomBG extends Component {
  isOn = false;
  state = {
    showModal: false
  };

  // this returns the DOM element for the background image
  bgImg = dtproxy.dom.bgImg();

  addCustomBG(val) {
    this.saveSrc = this.bgImg.src;
    this.bgImg.src = val;
  }

  revertBG() {
    this.bgImg.src = this.saveSrc;
  }

  turnOn = initialLoad => {
    if (settings.stored.custom.bg) {
      this.isOn = true;
      this.addCustomBG(settings.stored.custom.bg);
      return;
    }

    if (!initialLoad) {
      this.setState({ showModal: true });
    }
  };

  turnOff = () => {
    this.isOn = false;
    this.revertBG();
    this.setState({ showModal: false });
  };

  save = val => {
    settings.save("custom", "bg", val);

    // disable the switch if the value is empty/null/undefined
    if (!val) {
      this.turnOff();
      return;
    }

    if (this.isOn) {
      this.addCustomBG(val);
    }
    this.setState({ showModal: false });
  };

  render(props, state) {
    return (
      <MenuSwitch
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
