import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import Portal from "preact-portal/src/preact-portal";
import AutocompletePreview from "./autocomplete-preview";

/**********************************************************************
 * Autocomplete Emoji / Emotes
 * Brings up a small window above the chat input to help the user
 * pick emoji/emotes
 */

/*
TODO: 
 - if found:
   - hijack arrow keys to make it move around the preview window
   - moving around auto completes the text
   - typing continues to filter
*/

const KEYS = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  enter: 13,
  esc: 27,
  tab: 9,
  shiftKey: 16,
  backspace: 8,
  del: 46,
  space: 32,
  ctrl: 17
};

export default class AutocompleteEmoji extends Component {
  state = {
    isOn: false,
    symbol: ""
  };

  renderTo = document.querySelector(".pusher-chat-widget-input");

  chatInput = document.getElementById("chat-txt-message");

  navIndex = 0;

  /**
   * check chat input for the beginning of an emoji at the very end
   * of the input string. Similar to how Dubtrack handles user autocomplete
   */
  checkInput = e => {
    const parts = e.target.value.split(" ");
    if (parts.length === 0) {
      return;
    }

    const last = parts[parts.length - 1];
    const lastChar = last.charAt(last.length - 1);

    if (last.charAt(0) === ":" && last.length > 3 && lastChar !== ":") {
      this.setState({ symbol: last });
      return;
    }

    if (this.state.symbol !== "") {
      this.closePreview();
    }
  };

  updateChatInput = emote => {
    let inputText = this.chatInput.value.split(" ");
    inputText.pop();
    inputText.push(`:${emote}:`);
    this.chatInput.value = inputText.join(" ");
    this.chatInput.focus();
    this.closePreview();
  };

  closePreview() {
    this.setState({ symbol: "" });
    this.navIndex = -1;
  }

  navDown() {
    document.querySelector('.preview-item.selected').classList.remove('selected');
    this.navIndex++;
    if (navIndex >= this.previewList.length) {
      this.navIndex = 0;
    }
    console.log(this.previewList[this.navIndex]);
    this.previewList[this.navIndex].classList.add('selected');
    this.previewList[this.navIndex].scrollIntoView();
  }

  navUp() {
    document.querySelector('.preview-item.selected').classList.remove('selected');
    this.navIndex--;
    if (navIndex < 0) {
      this.navIndex = this.previewList.length - 1;
    }
    this.previewList[this.navIndex].classList.add('selected');
    this.previewList[this.navIndex].scrollIntoView(true);
  }


  keyboardNav = e => {
    if (
      !this.props.symbol ||
      !this.previewList ||
      this.previewList.length === 0
    ) {
      return;
    }

    const key = "which" in e ? e.which : e.keyCode;
    switch (key) {
      case KEYS.down:
      case KEYS.tab:
        e.preventDefault();
        this.navDown();
      case KEYS.up:
        e.preventDefault();
        this.navUp();
      case KEYS.enter:
        let emote = document.querySelector('.preview-item.selected .ac-text').textContent.trim();
        this.updateChatInput(emote);
      case KEYS.esc:
        this.closePreview();
        this.chatInput.focus();
    }
  };

  turnOn = e => {
    this.setState({ isOn: true });
    Dubtrack.room.chat.delegateEvents(
      _.omit(Dubtrack.room.chat.events, ["keydown #chat-txt-message"])
    );
    this.chatInput.addEventListener("keyup", this.checkInput);
    this.chatInput.addEventListener("keydown", this.keyboardNav);
  };

  turnOff = e => {
    this.setState({ isOn: false });
    Dubtrack.room.chat.delegateEvents(Dubtrack.room.chat.events);
    this.chatInput.removeEventListener("keyup", this.checkInput);
    this.chatInput.removeEventListener("keydown", this.keyboardNav);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOn) {
      this.previewList = document.querySelectorAll("#autocomplete-preview li");
    }
  }

  render(props, { isOn, symbol }) {
    return (
      <MenuSwitch
        id="dubplus-emotes"
        section="General"
        menuTitle="Autocomplete Emoji"
        desc="Quick find and insert emojis and emotes while typing in the chat input"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        {isOn ? (
          <Portal into={this.renderTo}>
            <AutocompletePreview
              onSelect={this.updateChatInput}
              symbol={symbol}
            />
          </Portal>
        ) : null}
      </MenuSwitch>
    );
  }
}
