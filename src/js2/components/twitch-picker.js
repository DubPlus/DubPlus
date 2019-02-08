import { h, render, Component } from "preact";
import twitchSpriteSheet from "@/utils/emotes/twitch-spritesheet";
import Portal from "preact-portal/src/preact-portal";

const TWITCH_SS_W = 837;
const TWITCH_SS_H = 819;

class TwitchPicker extends Component {
  state = {
    show: false
  };

  fillChat(val) {
    document.getElementById("chat-txt-message").value += ` :${val}:`;
    this.setState({ show: false });
  }

  toggle = () => {
    this.setState(prevState => {
      return { show: !prevState.show };
    });
  };

  handleKeyup = e => {
    var key = "which" in e ? e.which : e.keyCode;
    if (this.state.show && key === 27) {
      this.setState({ show: false });
    }
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyup);
  }

  render(props, { show }) {
    let list = Object.keys(twitchSpriteSheet).map(name => {
      let data = twitchSpriteSheet[name];
      let x = (TWITCH_SS_W * 100) / data.width;
      let y = (TWITCH_SS_H * 100) / data.height;
      let css = {
        backgroundPosition: `-${data.x}px -${data.y}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
        backgroundSize: `${x}% ${y}%`
      };
      return (
        <span
          key={`twitch-${name}`}
          style={css}
          title={name}
          onClick={() => this.fillChat(name)}
        />
      );
    });

    return (
      <span
        className="dp-twitch-picker-icon"
        onClick={this.toggle}
      >
        <Portal into=".pusher-chat-widget-input">
          <div className={`dp-emoji-picker twitch-picker ${show ? "show" : ""}`}>{list}</div>
        </Portal>
      </span>
    );
  }
}

export default function() {
  render(<TwitchPicker />, document.querySelector(".chat-text-box-icons"));
}
