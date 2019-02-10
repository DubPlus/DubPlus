import {h, Component} from 'preact';
import {MenuSwitch, MenuPencil} from '@/components/menuItems.js';
import settings from '@/utils/UserSettings.js';
import dtproxy from "@/utils/DTProxy.js";

/**
 * Custom Background
 */
export default class CustomBG extends Component {
  isOn = false
  state = {
    showModal: false
  }

  bgImg = dtproxy.bgImg()

  addCustomBG(val) {
    this.saveSrc = this.bgImg.src;
    this.bgImg.src = val;
  }

  revertBG() {
    this.bgImg.src = this.saveSrc
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

  save = (val) => {
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
        menuTitle="Custom Background Image"
        desc="Add your own custom Background."
        turnOn={this.turnOn}
        turnOff={this.turnOff}>
        <MenuPencil 
          showModal={state.showModal}
          title='Custom Background Image'
          section="Customize"
          content='Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image'
          value={settings.stored.custom.bg || ''}
          placeholder='https://example.com/big-image.jpg'
          maxlength='500'
          onConfirm={this.save} />
      </MenuSwitch>
    )
  }
}