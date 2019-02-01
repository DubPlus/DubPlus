import { h, render, Component } from "preact";
import { emoji } from "../utils/emotes/prepEmoji";
import emojis from '../utils/emotes/emoji';
import Portal from "preact-portal/src/preact-portal";

class EmojiPicker extends Component {
  state = {
    show: false,
    emojiLoad: 70
  };

  isLoading = false

  fillChat(val) {
    document.getElementById("chat-txt-message").value += " " + val;
  }

  toggle = () => {
    this.setState(prevState => {
      return { show: !prevState.show };
    });
  };

  componentDidMount() {
    document.addEventListener("keyup", e => {
      const key = "which" in e ? e.which : e.keyCode;
      if (this.state.show && key === 27) {
        this.setState({ show: false });
      }
    });
  }

  onScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight > (el.scrollHeight - 25) && !this.isLoading ) {
      this.isLoading = true;
      this.setState((prevState)=>{
        let next = prevState.emojiLoad + 70;
        if (next >= emojis.length) { 
          next = emojis.length;
          document.querySelector('.dp-emoji-picker').removeEventListener('scroll', this.onScroll);
        }
        return { emojiLoad: next }
      }, ()=>{
        this.isLoading = false;
      })
    }
  }

  componentDidMount() {
    document.querySelector('.dp-emoji-picker').addEventListener('scroll', this.onScroll);
  }

  render(props, { show, emojiLoad }) {
    let list = emojis.slice(0, emojiLoad).map(e => {
      let name = e.replace(/^:|:$/g, '');
      return (
        <span key={`emoji-${name}`} onClick={() => this.fillChat(e)}>
          <img src={emoji.template(name)} />
        </span>
      );
    });

    return (
      <span
        className="dp-emoji-picker-icon fa fa-smile-o"
        onClick={this.toggle}
      >
        <Portal into=".pusher-chat-widget-input">
          <div className={`dp-emoji-picker ${show ? "show" : ""}`}>
            {list}
          </div>
        </Portal>
      </span>
    );
  }
}

export default function() {
  render(<EmojiPicker />, document.querySelector(".chat-text-box-icons"));
}
