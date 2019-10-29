import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";

/**
 * Custom Background
 */
export default class CustomBG extends Component {
  state = {
    showModal: false
  };

  addCustomBG = val => {
    const img = document.createElement("div");
    img.className = "dubplus-custom-bg";
    img.style.backgroundImage = `url(${val})`;
    document.body.appendChild(img);
  }

  revertBG = () => {
    const img = document.querySelector('.dubplus-custom-bg');
    if (img) {
      document.body.removeChild(img);
    }
  }

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
  }

  turnOff = () => {
    this.revertBG();
    this.setState({ showModal: false });
  }

  save = val => {
    const newVal = val.trim();
    let success = settings.save("custom", "bg", newVal);
    if (!success) {
      return false;
    }

    if (this.switchRef.state.on) {
      if (settings.stored.custom.bg) {
        this.addCustomBG(newVal);
      } else {
        this.turnOff();
        return true;
      }
    }

    this.setState({ showModal: false });

    return true;
  }

  onCancel = () => {
    this.setState({ showModal: false });
  }

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
