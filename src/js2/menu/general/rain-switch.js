import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import rain from "@/utils/rain.js";

/**
 * Menu item for Rain
 */
export default class RainSwitch extends Component {
  turnOn() {
    rain.init();
  }

  turnOff() {
    rain.destroy();
  }

  render(props, state) {
    return (
      <MenuSwitch
        id="dubplus-rain"
        section="General"
        menuTitle="Rain"
        desc="Make it rain!"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
