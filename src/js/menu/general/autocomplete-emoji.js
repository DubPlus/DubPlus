import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import Portal from "preact-portal/src/preact-portal";
import AutocompletePreview from "./autocomplete-preview";
import twitch from "@/utils/emotes/twitch-local.js";
import bttv from "@/utils/emotes/bttv-local.js";
import { emoji } from "@/utils/emotes/emoji.js";
import dtproxy from "@/utils/DTProxy.js";
import settings from "@/utils/UserSettings.js";
import KEYS from "@/utils/keys";

/**********************************************************************
 * Autocomplete Emoji / Emotes
 * Brings up a small window above the chat input to help the user
 * pick emoji/emotes
 */

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

  chatInput = dtproxy.chatInput();

  selectedItem = null;

  /**
   * check chat input for the beginning of an emoji at the very end
   * of the input string. Similar to how Dubtrack handles user autocomplete
   */
  checkInput = e => {
    // we want to ignore keyups that don't output anything
    const key = e.code;
    if (ignoreKeys.indexOf(key) >= 0) {
      return;
    }

    // grab the input value and split into an array so we can easily grab the
    // last element in it
    const parts = e.target.value.split(" ");
    if (parts.length === 0) {
      return;
    }

    const lastPart = parts[parts.length - 1];
    const lastChar = lastPart.charAt(lastPart.length - 1);

    // now we check if the last word in the input starts with the opening
    // emoji colon but does not have the closing emoji colon
    if (lastPart.charAt(0) === ":" && lastPart.length > 3 && lastChar !== ":") {
      let new_matches = this.getMatches(lastPart);
      this.setState({ matches: new_matches });
      return;
    }

    if (this.state.matches.length !== 0) {
      this.closePreview();
    }
  };

  getMatches(symbol) {
    symbol = symbol.replace(/^:/, "");
    let classic = emoji.find(symbol);
    if (classic.length > 0) {
      classic.unshift({ header: "Emoji" });
    }

    // if emotes is not on then we return just classic emoji
    if (!settings.stored.options["dubplus-emotes"]) {
      return classic;
    }

    var bttvMatches = bttv.find(symbol);
    if (bttvMatches.length > 0) {
      bttvMatches.unshift({ header: "BetterTTV" });
    }
    var twitchMatches = twitch.find(symbol);
    if (twitchMatches.length > 0) {
      twitchMatches.unshift({ header: "Twitch" });
    }
    return classic.concat(bttvMatches, twitchMatches);
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
    this.selectedItem = null;
  }

  isElementInView(el) {
    var container = document.querySelector("#autocomplete-preview");
    var rect = el.getBoundingClientRect();
    var outerRect = container.getBoundingClientRect();
    return rect.top >= outerRect.top && rect.bottom <= outerRect.bottom;
  }

  navDown() {
    let item;

    if (this.selectedItem) {
      this.selectedItem.classList.remove("selected");
      item = this.selectedItem.nextSibling;
    }

    // go back to the first item
    if (!item) {
      item = document.querySelector(".preview-item");
    }

    // there should always be a nextSibling after a header so
    // we don't need to check item again after this
    if (item.classList.contains("preview-item-header")) {
      item = item.nextSibling;
    }

    item.classList.add("selected");
    if (!this.isElementInView(item)) {
      item.scrollIntoView(false);
    }

    this.selectedItem = item;
    this.updateChatInput(item.dataset.name, false);
  }

  navUp() {
    let item;

    if (this.selectedItem) {
      this.selectedItem.classList.remove("selected");
      item = this.selectedItem.previousSibling;
    }

    // get to the last item
    if (!item) {
      item = [].slice.call(document.querySelectorAll(".preview-item")).pop();
    }

    if (item.classList.contains("preview-item-header")) {
      item = item.previousSibling;
    }

    // check again because the header
    if (!item) {
      item = [].slice.call(document.querySelectorAll(".preview-item")).pop();
    }

    item.classList.add("selected");
    if (!this.isElementInView(item)) {
      item.scrollIntoView(true);
    }

    this.selectedItem = item;
    this.updateChatInput(item.dataset.name, false);
  }

  keyboardNav = e => {
    if (this.state.matches.length === 0) {
      return true;
    }

    switch (e.code) {
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
      case KEYS.enter:
        this.closePreview();
        break;
      default:
        return true;
    }
  };

  turnOn = e => {
    this.setState({ isOn: true });
    // relying on Dubtrack.fm's lodash being globally available
    this.debouncedCheckInput = window._.debounce(this.checkInput, 100);
    this.debouncedNav = window._.debounce(this.keyboardNav, 100);
    this.chatInput.addEventListener("keydown", this.debouncedNav);
    this.chatInput.addEventListener("keyup", this.debouncedCheckInput);
  };

  turnOff = e => {
    this.setState({ isOn: false });
    this.chatInput.removeEventListener("keydown", this.debouncedNav);
    this.chatInput.removeEventListener("keyup", this.debouncedCheckInput);
  };

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
