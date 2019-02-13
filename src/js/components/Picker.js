import { h, render, Component } from "preact";
import twitchSpriteSheet from "@/utils/emotes/twitch-spritesheet";
import bttvSpriteSheet from "@/utils/emotes/bttv-spritesheet";
import { emojiNames } from "@/utils/emotes/emoji";
import Portal from "preact-portal/src/preact-portal";

const TWITCH_SS_W = 837;
const TWITCH_SS_H = 819;

const BTTV_SS_W = 1931;
const BTTV_SS_H = 1867;

class Picker extends Component {
  state = {
    emojiShow: false,
    twitchShow: false
  };

  fillChat(val) {
    document.getElementById("chat-txt-message").value += ` :${val}:`;
    this.setState({
      emojiShow: false,
      twitchShow: false
    });
  }

  toggleEmoji = () => {
    this.setState(prevState => {
      return {
        emojiShow: !prevState.emojiShow,
        twitchShow: false
      };
    });
  };

  toggleTwitch = () => {
    this.setState(prevState => {
      return {
        emojiShow: false,
        twitchShow: !prevState.twitchShow
      };
    });
  };

  handleKeyup = e => {
    var key = "which" in e ? e.which : e.keyCode;
    if ((this.state.emojiShow || this.state.twitchShow) && key === 27) {
      this.setState({
        emojiShow: false,
        twitchShow: false
      });
    }
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyup);
  }

  emojiList() {
    let list = Object.keys(emojiNames).map(id => {
      let data = emojiNames[id];
      let x = data.x * 0.546875;
      let y = data.y * 0.546875;
      let css = { backgroundPosition: `-${x}px -${y}px` };
      return (
        <span
          key={`emoji-${id}`}
          style={css}
          title={id}
          onClick={() => this.fillChat(id)}
        />
      );
    });
    return list;
  }

  twitchList() {
    let twitchList = Object.keys(twitchSpriteSheet).map(name => {
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
    let bttvList = Object.keys(bttvSpriteSheet).map(name => {
      let data = bttvSpriteSheet[name];
      let x = (BTTV_SS_W * 100) / data.width;
      let y = (BTTV_SS_H * 100) / data.height;
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
    return twitchList.concat(bttvList);
  }

  render(props, { emojiShow, twitchShow }) {
    return (
      <div style="display: inline;">
        <span
          className="dp-emoji-picker-icon fa fa-smile-o"
          onClick={this.toggleEmoji}
        >
          <Portal into=".pusher-chat-widget-input">
            <div className={`dp-emoji-picker ${emojiShow ? "show" : ""}`}>
              {this.emojiList()}
            </div>
          </Portal>
        </span>
        <span className="dp-twitch-picker-icon" onClick={this.toggleTwitch}>
          <Portal into=".pusher-chat-widget-input">
            <div
              className={`dp-emoji-picker twitch-picker ${twitchShow ? "show" : ""}`}
            >
              {this.twitchList()}
            </div>
          </Portal>
        </span>
      </div>
    );
  }
}

export default function() {
  render(<Picker />, document.querySelector(".chat-text-box-icons"));
}
