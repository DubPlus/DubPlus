import { h, render, Component } from "preact";
import { emojiNames } from "@/utils/emotes/emoji";
import Portal from "preact-portal/src/preact-portal";

class EmojiPicker extends Component {
  state = {
    show: false
  };

  fillChat(val) {
    document.getElementById("chat-txt-message").value += ` :${val}:`;
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
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyup);
  }

  render(props, { show }) {
    let list = Object.keys(emojiNames).map(id => {
      let data = emojiNames[id];
      let x = data.x * 0.46875;
      let y = data.y * 0.46875;
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

    return (
      <span
        className="dp-emoji-picker-icon fa fa-smile-o"
        onClick={this.toggle}
      >
        <Portal into=".pusher-chat-widget-input">
          <div className={`dp-emoji-picker ${show ? "show" : ""}`}>{list}</div>
        </Portal>
      </span>
    );
  }
}

export default function() {
  render(<EmojiPicker />, document.querySelector(".chat-text-box-icons"));
}
