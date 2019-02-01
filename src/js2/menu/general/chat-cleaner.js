import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "../../components/menuItems.js";
import settings from "../../utils/UserSettings.js";

/**
 * Menu item for ChatCleaner
 */
export default class ChatCleaner extends Component {
  chatCleanerCheck = e => {
    let totalChats = Array.from(document.querySelectorAll("ul.chat-main > li"));
    let max = parseInt(settings.stored.custom.chat_cleaner, 10);

    if (
      isNaN(totalChats.length) ||
      isNaN(max) ||
      !totalChats.length ||
      totalChats.length < max
    ) {
      return;
    }

    let parentUL = totalChats[0].parentElement;
    totalChats.slice(0, max).forEach(function(li, i) {
      parentUL.removeChild(li);
    });
  };

  saveAmount = value => {
    var chatItems = parseInt(value, 10);
    let amount = !isNaN(chatItems) ? chatItems : 500;
    settings.save("custom", "chat_cleaner", amount); // default to 500
  };

  turnOn = () => {
    Dubtrack.Events.bind("realtime:chat-message", this.chatCleanerCheck);
  };

  turnOff = () => {
    Dubtrack.Events.unbind("realtime:chat-message", this.chatCleanerCheck);
  };

  render() {
    return (
      <MenuSwitch
        id="chat-cleaner"
        section="General"
        menuTitle="Chat Cleaner"
        desc="Automatically only keep a designated chatItems of chat items while clearing older ones, keeping CPU stress down"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        <MenuPencil
          title="Chat Cleaner"
          section="General"
          content="Please specify the number of most recent chat items that will remain in your chat history"
          value={settings.stored.custom.chat_cleaner || ""}
          placeholder="500"
          maxlength="5"
          onConfirm={this.saveAmount}
        />
      </MenuSwitch>
    );
  }
}
