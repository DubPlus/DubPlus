import { h, Component } from "preact";
// import Portal from './Portal.js';
import settings from "../utils/UserSettings.js";
import Modal from "./modal.js";
import track from "../utils/analytics.js";

/**
 * Component to render a simple row like the links in the contact section
 * or the fullscreen menu option
 * @param {object} props
 * @param {string} props.id the dom ID name, usually dubplus-*
 * @param {string} props.desc description of the menu item used in the title attr
 * @param {string} props.icon icon to be used
 * @param {string} props.menuTitle text to display in the menu
 */
export function MenuSimple(props) {
  let _cn = ["dubplus-menu-icon"];
  // combine with ones that were passed through
  if (props.className) {
    _cn.push(props.className);
  }

  return (
    <li id={props.id} title={props.desc} className={_cn.join(" ")}>
      <span className={`fa fa-${props.icon}`} />
      <span className="dubplus-menu-label">{props.menuTitle}</span>
    </li>
  );
}

/**
 * Component which brings up a modal box to allow user to
 * input and store a text value which will be used by the
 * parent menu item.
 *
 * MenuPencil must always by a child of MenuSwitch.
 */
export class MenuPencil extends Component {
  state = {
    open: false
  };

  loadModal = () => {
    this.setState({ open: true });
    track.menuClick(this.props.section + " section", this.props.id + " edit");
  };

  closeModal = () => {
    console.log("closing dub+ modal");
    this.setState({ open: false });
  };

  render(props, state) {
    return (
      <span onClick={this.loadModal} className="fa fa-pencil extra-icon">
        <Modal
          open={state.open}
          title={props.title || "Dub+ option"}
          content={props.content || "Please enter a value"}
          placeholder={props.placeholder || "in here"}
          value={props.value}
          onConfirm={props.onConfirm}
          onClose={this.closeModal}
        />
      </span>
    );
  }
}

export class MenuSwitch extends Component {
  state = {
    on: settings.stored.options[this.props.id] || false
  };

  componentDidMount() {
    if (this.state.on) {
      this.props.turnOn();
    }
  }

  switchOn = () => {
    this.props.turnOn();
    settings.save("options", this.props.id, true);
    this.setState({ on: true });
    track.menuClick(this.props.section + " section", this.props.id + " on");
  };

  switchOff = (noTrack = false) => {
    this.props.turnOff();
    settings.save("options", this.props.id, false);
    this.setState({ on: false });
    if (!noTrack) {
      track.menuClick(this.props.section + " section", this.props.id + " off");
    }
  };

  toggleSwitch = () => {
    if (this.state.on) {
      this.switchOff();
    } else {
      this.switchOn();
    }
  };

  render(props, state) {
    let _cn = ["dubplus-switch"];
    if (state.on) {
      _cn.push("dubplus-switch-on");
    }
    // combine with ones that were passed through
    if (props.className) {
      _cn.push(props.className);
    }

    return (
      <li id={props.id} title={props.desc} className={_cn.join(" ")}>
        {/* 
          used for the optional MenuPencil at the moment
          but leaving it open ended for now. Can be any component
         */}
        {props.children || null}

        <div onClick={this.toggleSwitch} className="dubplus-form-control">
          <div class="dubplus-switch-bg">
            <div class="dubplus-switcher" />
          </div>

          <span className="dubplus-menu-label">{props.menuTitle}</span>
        </div>
      </li>
    );
  }
}
