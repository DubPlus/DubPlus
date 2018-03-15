'use strict';
import {h, Component} from 'preact';

/**
 * Component to render a simple row like the links
 * in the contact section or the fullscreen
 * @param {object} props 
 */
export function MenuSimple (props) {
  return (
    <li id={props.id} 
        title={prop.desc}
        className={`dubplus-menu-icon ${props.extraClassNames||''}`}>
      <span className={`fa fa-${props.icon}`} />
      <span className="dubplus-menu-label">
        {props.menuTitle}
      </span>
    </li>
  );
}

export class MenuPencil extends Component {
  constructor(){
    super();
    this.loadModal = this.loadModal.bind(this);
  }

  loadModal(){
    // maybe use context to access modal from main app container
  }

  render(props) {
    return (
      <span onClick={this.loadModal} class="fa fa-pencil extra-icon" />
    )
  }
}

export class MenuSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      on : false
    }

    this.switchOn = this.switchOn.bind(this);
    this.switchOff = this.switchOff.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  switchOn() {
    this.props.turnOn();
    // TODO: save to global state
    this.setState({on: true});
  }

  switchOff() {
    this.props.turnOff();
    // TODO: save to global state
    this.setState({on: false});
  }

  toggleSwitch(){
    if (this.state.on) {
      this.switchOff();
    } else {
      this.switchOn();
    }
  }

  render(props, state) {

    return (
      <li id={props.id} 
        title={prop.desc}
        className={`dubplus-switch ${state.on?'dubplus-switch-on':''} ${props.extraClassNames||''}`}>
        
        {/* 
          used for the optional MenuPencil at the moment
          but leaving it open ended for now. Can be any component
         */}
        {props.children}

        <div onClick={this.toggleSwitch}>
          <div class="dubplus-switch-bg">
            <div class="dubplus-switcher"></div>
          </div>
          
          <span className="dubplus-menu-label">
            {props.menuTitle}
          </span>
        </div>
      </li>
    )
  }
}