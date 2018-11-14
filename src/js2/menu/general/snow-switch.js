import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import getScript from "../../utils/getScript.js";

/**
 * Menu item for Rain
 */
export default class SnowSwitch extends Component {
  doSnow() {
    $(document).snowfall({
      round: true,
      shadow: true,
      flakeCount: 50,
      minSize: 1,
      maxSize: 5,
      minSpeed: 5,
      maxSpeed: 5
    });
  }

  turnOn = () => {
    if (!$.snowfall) {
      // only pull in the script once if it doesn't exist
      getScript(
        "https://rawgit.com/loktar00/JQuery-Snowfall/master/src/snowfall.jquery.js",
        err => {
          if (err) {
            this.switchRef.switchOff(true);
            console.error("Could not load snowfall jquery plugin", err);
            return;
          }
          this.doSnow();
        }
      );
    } else {
      this.doSnow();
    }
  };

  turnOff() {
    if ($.snowfall) {
      // checking to avoid errors if you quickly switch it on/off before plugin
      // is loaded in the turnOn function
      $(document).snowfall("clear");
    }
  }

  render() {
    return (
      <MenuSwitch
        ref={s => (this.switchRef = s)}
        id="dubplus-snow"
        section="General"
        menuTitle="Snow"
        desc="Make it snow!"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
