import { h, Component } from "preact";
import { MenuSwitch } from "../../components/menuItems.js";
import Portal from "preact-portal/src/preact-portal";
import AutocompletePreview from "./autocomplete-preview";
import twitch from "../../utils/emotes/twitch.js";
import bttv from "../../utils/emotes/bttv.js";
import { emoji } from "../../utils/emotes/prepEmoji.js";

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
  tab: 9
};
const ignoreKeys = [
  KEYS.up,
  KEYS.down,
  KEYS.left,
  KEYS.right,
  KEYS.esc,
  KEYS.enter
];

export default class AutocompleteEmoji extends Component {
  state = {
    isOn: false,
    matches: []
  };

  renderTo = document.querySelector(".pusher-chat-widget-input");

  chatInput = document.getElementById("chat-txt-message");

  navIndex = 0;

  /**
   * check chat input for the beginning of an emoji at the very end
   * of the input string. Similar to how Dubtrack handles user autocomplete
   */
  checkInput = e => {
    const key = "which" in e ? e.which : e.keyCode;
    if (ignoreKeys.indexOf(key) >= 0) {
      return;
    }

    const parts = e.target.value.split(" ");
    if (parts.length === 0) {
      return;
    }

    const lastPart = parts[parts.length - 1];
    const lastChar = lastPart.charAt(lastPart.length - 1);

    if (lastPart.charAt(0) === ":" && lastPart.length > 3 && lastChar !== ":") {
      let new_matches = this.getMatches(lastPart);
      this.chunkLoadMatches(new_matches);
      return;
    }

    if (this.state.matches.length !== 0) {
      this.closePreview();
    }
  };

  chunkLoadMatches(matches) {
    let limit = 50;
    if (matches.length < limit + 1) {
      this.setState({ matches: matches });
      return;
    }

    // render the first 50 matches
    let startingArray = matches.slice(0, limit);
    this.setState({ matches: startingArray });

    // then render the full list after given time
    // dom diffing should leave the first in place and just add the
    // remaining matches
    setTimeout(() => {
      this.setState({ matches: matches });
    }, 250);
  }

  getMatches(symbol) {
    symbol = symbol.replace(/^:/, "");
    let classic = emoji.find(symbol);
    var twitchMatches = twitch.find(symbol);
    var bttvMatches = bttv.find(symbol);
    return classic.concat(twitchMatches, bttvMatches);
  }

  updateChatInput = (emote, focusBack = true) => {
    let inputText = this.chatInput.value.split(" ");
    inputText.pop();
    inputText.push(`:${emote}:`);
    this.chatInput.value = inputText.join(" ");
    if (focusBack) {
      this.chatInput.focus();
      this.closePreview();
    }
  };

  closePreview() {
    this.setState({ matches: [] });
    this.navIndex = -1;
    this.previewList = [];
  }

  clearSelected() {
    let selected = document.querySelector(".preview-item.selected");
    if (selected) selected.classList.remove("selected");
  }

  navDown() {
    this.clearSelected();
    this.navIndex++;
    if (this.navIndex >= this.previewList.length) {
      this.navIndex = 0;
    }
    console.log('down', this.navIndex);
    let item = this.previewList[this.navIndex];
    console.log(item);
    item.classList.add("selected");
    item.scrollIntoView();
    this.updateChatInput(item.dataset.name, false);
  }

  navUp() {
    this.clearSelected();
    this.navIndex--;
    if (this.navIndex < 0) {
      this.navIndex = this.previewList.length - 1;
    }
    let item = this.previewList[this.navIndex];
    item.classList.add("selected");
    item.scrollIntoView(true);
    this.updateChatInput(item.dataset.name, false);
  }

  keyboardNav = e => {
    if (
      this.state.matches.length === 0 ||
      !this.previewList ||
      this.previewList.length === 0
    ) {
      return true;
    }

    const key = "which" in e ? e.which : e.keyCode;
    switch (key) {
      case KEYS.down:
      case KEYS.tab:
        e.preventDefault();
        e.stopImmediatePropagation();
        this.navDown();
        break;
      case KEYS.up:
        e.preventDefault();
        e.stopImmediatePropagation();
        this.navUp();
        break;
      case KEYS.esc:
        this.closePreview();
        this.chatInput.focus();
        break;
      default:
        return true;
    }
  };

  turnOn = e => {
    this.setState({ isOn: true });
    Dubtrack.room.chat.delegateEvents(
      _.omit(Dubtrack.room.chat.events, ["keydown #chat-txt-message"])
    );

    // relying on Dubtrack.fm's lodash being globally available
    this.debouncedCheckInput = window._.debounce(this.checkInput, 100);
    this.debouncedNav = window._.debounce(this.keyboardNav, 100);
    this.chatInput.addEventListener("keydown", this.debouncedNav);
    this.chatInput.addEventListener("keyup", this.debouncedCheckInput);
  };

  turnOff = e => {
    this.setState({ isOn: false });
    Dubtrack.room.chat.delegateEvents(Dubtrack.room.chat.events);
    this.chatInput.removeEventListener("keydown", this.debouncedNav);
    this.chatInput.removeEventListener("keyup", this.debouncedCheckInput);
  };

  componentDidUpdate(prevProps, prevState) {
    console.log('updated');
    if (this.state.isOn) {
      this.previewList = document.querySelectorAll("#autocomplete-preview li");
      if (this.previewList[0]) console.log('new list', this.previewList[0].dataset.name);
    }
  }

  render(props, { isOn, matches }) {
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
              matches={matches}
            />
          </Portal>
        ) : null}
      </MenuSwitch>
    );
  }
}
