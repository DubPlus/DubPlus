import { h, render, Component } from "preact";
import twitchSpriteSheet from "@/utils/emotes/twitch-spritesheet";
import bttvSpriteSheet from "@/utils/emotes/bttv-spritesheet";
import { emojiNames } from "@/utils/emotes/emoji";
import Portal from "preact-portal/src/preact-portal";
import dtproxy from "@/utils/DTProxy.js";
import KEYS from "@/utils/keys";

// the W and H of the emoji spritesheet
const EMOJI_SS_W = 1931;
const EMOJI_SS_H = 1867;

// the W and H of the twitch spritesheet
const TWITCH_SS_W = 837;
const TWITCH_SS_H = 819;

// the W and H of the bttv spritesheet
const BTTV_SS_W = 326;
const BTTV_SS_H = 316;

class Picker extends Component {
  state = {
    emojiShow: false,
    twitchShow: false
  };

  componentWillMount() {
    this.chatWidget = dtproxy.getChatInputContainer();
  }

  fillChat(val) {
    dtproxy.chatInput.value += ` :${val}:`;
    dtproxy.chatInput.focus();
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
    var key = e.code;
    if ((this.state.emojiShow || this.state.twitchShow) && key === KEYS.esc) {
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
    let size = 35;

    // 64px is the original size of each icon in the spritesheet but we want to
    // reduce them to SIZE without altering the spritesheet
    let perc = size / 64;

    let list = Object.keys(emojiNames).map(id => {
      let data = emojiNames[id];
      let x = (EMOJI_SS_W * perc * 100) / size;
      let y = (EMOJI_SS_H * perc * 100) / size;
      let css = {
        backgroundPosition: `-${data.x * perc}px -${data.y * perc}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundSize: `${x}% ${y}%`
      };
      return (
        <span
          key={`emoji-${id}`}
          style={css}
          title={id}
          className="emoji-picker-image"
          onClick={() => this.fillChat(id)}
        />
      );
    });
    return list;
  }

  twitchList() {
    return Object.keys(twitchSpriteSheet).map(name => {
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
          className="twitch-picker-image"
          onClick={() => this.fillChat(name)}
        />
      );
    });
  }

  bttvList() {
    return Object.keys(bttvSpriteSheet).map(name => {
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
          key={`bttv-${name}`}
          style={css}
          className="bttv-picker-image"
          title={name}
          onClick={() => this.fillChat(name)}
        />
      );
    });
  }

  render(props, { emojiShow, twitchShow }) {
    return (
      <div style="display: inline;">
        <span
          className="dp-emoji-picker-icon fa fa-smile-o"
          onClick={this.toggleEmoji}
        >
          <Portal into={this.chatWidget}>
            <div className={`dp-emoji-picker ${emojiShow ? "show" : ""}`}>
              {this.emojiList()}
            </div>
          </Portal>
        </span>
        <span className="dp-twitch-picker-icon" onClick={this.toggleTwitch}>
          <Portal into={this.chatWidget}>
            <div
              className={`dp-emoji-picker twitch-bttv-picker ${
                twitchShow ? "show" : ""
              }`}
            >
              {this.twitchList().concat(this.bttvList())}
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
