import { h, render, Component } from "preact";
import { emoji } from "../utils/emotes/prepEmoji";
import Portal from "preact-portal/src/preact-portal";

class EmojiPicker extends Component {
  state = {
    show: false
  };

  fillChat(val) {
    document.getElementById("chat-txt-message").value += " " + val;
  }

  toggle = () => {
    this.setState(prevState => {
      return { show: !prevState.show };
    });
  }

  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      const key = "which" in e ? e.which : e.keyCode;
      if (this.state.show && key === 27) {
        this.setState({show: false})
      }
    });
  }

  render(props,{show}) {
    let list = emojify.emojiNames.map(e => {
      return (
        <span onClick={() => this.fillChat(`:${e}:`)}>
          <img src={emoji.template(e)} />
        </span>
      );
    });

    return (
      <span className="dp-emoji-picker-icon fa fa-smile-o" onClick={this.toggle}>
        <Portal into=".pusher-chat-widget-input">
          <div className={`dp-emoji-picker ${show?'show':''}`}>{list}</div>
        </Portal>
      </span>
    );
  }
}

export default function() {
  render(<EmojiPicker />, document.querySelector(".chat-text-box-icons"));
}
