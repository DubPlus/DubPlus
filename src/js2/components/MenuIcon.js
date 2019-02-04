import {h, Component} from 'preact';
import settings from '@/utils/UserSettings.js';

class MenuIcon extends Component {
  state = {
    open : false
  }

  toggle = () => {
    let menu = document.querySelector('.dubplus-menu');
    if (this.state.open) {
      menu.classList.remove('dubplus-menu-open');
      this.setState({open: false});
    } else {
      menu.classList.add('dubplus-menu-open');
      this.setState({open: true});
    }
  }

  render(props, state) {
    return (
      <div className="dubplus-icon" onClick={this.toggle}>
        <img src={`${settings.srcRoot}/images/dubplus.svg`} alt="DubPlus Icon" />
      </div>
    )
  }
}

export default MenuIcon;
