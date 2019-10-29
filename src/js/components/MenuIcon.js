import {h, Component} from 'preact';

class MenuIcon extends Component {
  state = {
    open : false
  }

  toggle = () => {
    let menu = document.querySelector('.dubplus-menu');

    if (!menu) {
      console.warn("menu not built yet, try again");
      return;
    }

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
        <img src="https://dub.plus/assets/img/logo.svg" alt="DubPlus Icon" />
      </div>
    )
  }
}

export default MenuIcon;
