import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import snowFall from "../../utils/snowfall";

const options = {
  round: true,
  shadow: true,
  flakeCount: 50,
  minSize: 1,
  maxSize: 5,
  minSpeed: 5,
  maxSpeed: 5
};

export default class SnowSwitch extends Component {
  makeContainer() {
    let snowdiv = document.createElement('div');
    snowdiv.id = 'snow-container';
    snowdiv.style.cssText = `
      position:absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
    `;
    document.body.appendChild(snowdiv);
  }

  turnOn = () => {
    let target = document.getElementById('snow-container');
    if (!target) {
      this.makeContainer();
    }
    snowFall.snow(target, options);
  };

  turnOff = () => {
    let target = document.getElementById('snow-container');
    if (target) {
      target.remove();
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
