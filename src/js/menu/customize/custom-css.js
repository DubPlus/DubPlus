import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import css from "@/utils/css.js";

/**
 * Custom CSS
 */
export default class CustomCSS extends Component {
  isOn = false;
  state = {
    showModal: false
  };

  turnOn = () => {
    this.isOn = true;
    if (settings.stored.custom.css) {
      css.loadExternal(settings.stored.custom.css, "dubplus-custom-css");
    } else {
      this.setState({ showModal: true });
    }
  };

  turnOff = () => {
    this.isOn = false;
    let link = document.querySelector(".dubplus-custom-css");
    if (link) {
      link.remove();
    }
  };

  save = val => {
    // TODO: save to global state
    settings.save("custom", "css", val);
    if (this.isOn && val !== "") {
      css.loadExternal(settings.stored.custom.css, "dubplus-custom-css");
    }
    this.setState({ showModal: false });
  };

  render(props, state) {
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
          showModal={state.showModal}
          title="Custom CSS"
          section="Customize"
          content="Enter a url location for your custom css"
          value={settings.stored.custom.css || ""}
          placeholder="https://example.com/example.css"
          maxlength="500"
          onConfirm={this.save}
        />
      </MenuSwitch>
    );
  }
}
