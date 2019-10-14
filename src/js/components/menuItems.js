import { h, Component } from "preact";
import settings from "@/utils/UserSettings.js";
import SectionHeader from "@/components/section-header";
import Modal from "@/components/modal.js";
import track from "@/utils/analytics.js";

/**
 * Component to render a menu section.
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.title the name to display
 * @param {string} props.settingsKey the key in the setting.stored.menu object
 */
export class MenuSection extends Component {
  state = {
    section: settings.stored.menu[this.props.settingsKey] || "open"
  };

  toggleSection = e => {
    this.setState(prevState => {
      let newState = prevState.section === "open" ? "closed" : "open";
      settings.save("menu", this.props.settingsKey, newState);
      return { section: newState };
    });
  };

  render(props, state) {
    let _cn = ["dubplus-menu-section"];
    if (state.section === "closed") {
      _cn.push("dubplus-menu-section-closed");
    }
    return (
      <>
        <SectionHeader
          onClick={this.toggleSection}
          id={props.id}
          category={props.title}
          open={state.section}
        />
        <ul className={_cn.join(" ")}>{props.children}</ul>
      </>
    );
  }
}

/**
 * Component to render a simple row like the fullscreen menu option
 * @param {object} props
 * @param {string} props.id the dom ID name, usually dubplus-*
 * @param {string} props.desc description of the menu item used in the title attr
 * @param {string} props.icon icon to be used
 * @param {string} props.menuTitle text to display in the menu
 * @param {Function} props.onClick function to run on click
 * @param {string} props.href if provided will render an anchor instead
 */
export function MenuSimple(props) {
  let _cn = ["dubplus-menu-icon"];
  // combine with ones that were passed through
  if (props.className) {
    _cn.push(props.className);
  }

  if (props.href) {
    return (
      <li class="dubplus-menu-icon">
        <span class={`fa fa-${props.icon}`} />
        <a
          href={props.href}
          class="dubplus-menu-label"
          target="_blank"
        >
          {props.menuTitle}
        </a>
      </li>
    );
  }

  return (
    <li
      id={props.id}
      title={props.desc}
      className={_cn.join(" ")}
      onClick={props.onClick}
    >
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
 * @param {string} props.section which section of the menu this is in
 * @param {string} props.title the modal title
 * @param {string} props.content  the description below the title
 * @param {string} props.value prepopulate the value of the text area
 * @param {number|string} props.maxLength  the max length of characters allowed in the text field
 * @param {string} props.placeholder the text area placeholder if there is no value
 * @param {boolean} props.showModal turns modal on/off directlt
 * @param {function} props.onConfirm 
 * @param {function} props.onCancel
 */
export class MenuPencil extends Component {
  state = {
    open: false
  };

  loadModal = () => {
    this.setState({ open: true });
    track.menuClick(this.props.section + " section", this.props.title + " edit");
  };

  closeModal = () => {
    this.setState({ open: false });
    if (typeof this.props.onCancel === "function") {
      this.props.onCancel();
    }
  };

  checkVal = val => {
    let limit = parseInt(this.props.maxlength, 10);
    if (isNaN(limit)) {
      limit = 500;
    }

    if (val.length > limit) {
      val = val.substring(0, limit);
    }

    // now we don't have to check val length inside every option
    return this.props.onConfirm(val);
  };

  render(props, state) {
    return (
      <span onClick={this.loadModal} className="fa fa-pencil extra-icon">
        <Modal
          open={state.open || (props.showModal || false)}
          title={props.title || "Dub+ option"}
          content={props.content || "Please enter a value"}
          placeholder={props.placeholder || "in here"}
          value={props.value}
          maxlength={props.maxlength}
          onConfirm={this.checkVal}
          onClose={this.closeModal}
          errorMsg={props.errorMsg}
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
      // The "true" argument is so you can tell if component 
      // was activated on first load or not
      this.props.turnOn(true);
    }
  }

  switchOn = () => {
    this.props.turnOn(false);
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
          <div className="dubplus-switch-bg">
            <div className="dubplus-switcher" />
          </div>

          <span className="dubplus-menu-label">{props.menuTitle}</span>
        </div>
      </li>
    );
  }
}
