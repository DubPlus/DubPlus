import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import css from "@/utils/css.js";

/**
 * Custom CSS
 */
export default class CustomCSS extends Component {
  // if you edit the stored value but the switch is off we check this value
  // to know if we should load the css or not.
  isOn = false;

  state = {
    showModal: false
  };

  turnOn = initialLoad => {
    // if a valid custom css file exists then we can load it
    if (settings.stored.custom.css) {
      this.isOn = true;
      css.loadExternal(settings.stored.custom.css, "dubplus-custom-css");
      return;
    }

    // if you turn this option on but the stored value is empty then we should
    // bring up a modal ... BUT not initial load of the extension
    if (!initialLoad) {
      this.setState({ showModal: true });
    }
  };

  turnOff = () => {
    this.isOn = false;
    let link = document.querySelector(".dubplus-custom-css");
    if (link) {
      link.remove();
    }
    this.closeModal();
  };

  save = (val = "") => {
    settings.save("custom", "css", val);

    // disable the switch if the value is empty/null/undefined
    if (!val) {
      this.turnOff();
      return;
    }

    if (this.isOn) {
      css.loadExternal(settings.stored.custom.css, "dubplus-custom-css");
    }
    this.closeModal();
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <MenuSwitch
        id="dubplus-custom-css"
        section="Customize"
        menuTitle="Custom CSS"
        desc="Add your own custom CSS."
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <MenuPencil
          showModal={this.state.showModal}
          title="Custom CSS"
          section="Customize"
          content="Enter a url location for your custom css"
          value={settings.stored.custom.css || ""}
          placeholder="https://example.com/example.css"
          maxlength="500"
          onConfirm={this.save}
          onCancel={this.closeModal}
        />
      </MenuSwitch>
    );
  }
}