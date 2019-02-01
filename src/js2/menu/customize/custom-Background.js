import {h, Component} from 'preact';
import {MenuSwitch, MenuPencil} from '../../components/menuItems.js';
import settings from '../../utils/UserSettings.js';

/**
 * Custom Background
 */
export default class CustomBG extends Component {
  isOn = false
  state = {
    showModal: false
  }

  addCustomBG(val) {
    let elem = document.querySelector('.backstretch-item img');
    this.saveSrc = elem.src;
    elem.src = val;
  }

  revertBG() {
    let elem = document.querySelector('.backstretch-item img');
    elem.src = this.saveSrc
  }
   
  turnOn = () => {
    this.isOn = true;
    if (settings.stored.custom.bg) {
      this.addCustomBG(settings.stored.custom.bg);
    } else {
      this.setState({showModal: true})
    }
  }
  
  turnOff = () => {
    this.isOn = false;
    this.revertBG();
  }

  saveCustomCSS = (val) => {
    // TODO: save to global state
    settings.save('custom', 'bg', val);
    if (this.isOn && val !== '') {
      this.addCustomBG(val);
    }
    this.setState({showModal: false})
  };

  render(props,state){
    return (
      <MenuSwitch
        id="dubplus-custom-bg"
        section="Customize"
        menuTitle="Custom Background"
        desc="Add your own custom Background."
        turnOn={this.turnOn}
        turnOff={this.turnOff}>
        <MenuPencil 
          showModal={state.showModal}
          title='Custom CSS'
          section="Customize"
          content='Enter a url location for your custom css'
          value={settings.stored.custom.bg || ''}
          placeholder='https://example.com/example.css'
          maxlength='500'
          onConfirm={this.saveCustomCSS} />
      </MenuSwitch>
    )
  }
}