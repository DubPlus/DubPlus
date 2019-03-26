import { h, Component } from "preact";
import { MenuSwitch, MenuPencil } from "@/components/menuItems.js";
import settings from "@/utils/UserSettings.js";
import dtproxy from "@/utils/DTProxy.js";

/**
 * Menu item for ChatCleaner
 */
export default class ChatCleaner extends Component {
  state = {
    maxChats: settings.stored.custom.chat_cleaner || 500,
    showModal: false
  };

  chatCleanerCheck = e => {
    let totalChats = Array.from(dtproxy.dom.chatList().children);
    let max = parseInt(this.state.maxChats, 10);

    if (
      isNaN(totalChats.length) ||
      isNaN(max) ||
      !totalChats.length ||
      totalChats.length < max
    ) {
      return;
    }

    let parentUL = totalChats[0].parentElement;
    let min = totalChats.length - max;
    if (min > 0) {
      totalChats.splice(0, min).forEach(function(li) {
        parentUL.removeChild(li);
      });
      totalChats[totalChats.length - 1].scrollIntoView(false);
    }
  };

  saveAmount = value => {
    var chatItems = parseInt(value, 10);
    let amount = !isNaN(chatItems) ? chatItems : 500;
    settings.save("custom", "chat_cleaner", amount); // default to 500
    this.setState({ maxChats: value, showModal: false });
  };

  turnOn = initialLoad => {
    dtproxy.events.onChatMessage(this.chatCleanerCheck);

    if (!initialLoad && !settings.stored.custom.chat_cleaner) {
      this.setState({ showModal: true });
    }
  };

  turnOff = () => {
    dtproxy.events.offChatMessage(this.chatCleanerCheck);
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
          showModal={this.state.showModal}
          title="Chat Cleaner"
          section="General"
          content="Please specify the number of most recent chat items that will remain in your chat history"
          value={this.state.maxChats}
          placeholder="defaults to 500"
          maxlength="5"
          onConfirm={this.saveAmount}
        />
      </MenuSwitch>
    );
  }
}
