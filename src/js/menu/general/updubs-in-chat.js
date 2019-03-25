import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";

function chatMessage(username, song) {
  var li = document.createElement("li");
  li.className = "dubplus-chat-system dubplus-chat-system-updub";

  var div = document.createElement("div");
  div.className = "chatDelete";
  div.onclick = e => e.currentTarget.parentElement.remove();

  var span = document.createElement("span");
  span.className = "icon-close";

  var text = document.createElement("div");
  text.className = "text";
  text.textContent = `@${username} has updubbed your song ${song}`;

  div.appendChild(span);
  li.appendChild(div);
  li.appendChild(text);

  return li;
}

export default class UpdubsInChat extends Component {
  turnOn = () => {
    dtproxy.events.onSongVote(this.updubWatcher);
  };

  turnOff = () => {
    dtproxy.events.offSongVote(this.updubWatcher);
  };

  updubWatcher(e) {
    var user = dtproxy.userName;
    var currentDj = dtproxy.getCurrentDJ();
    if (!currentDj) {
      return;
    }

    if (user === currentDj && e.dubtype === "updub") {
      let newChat = chatMessage(e.user.username, dtproxy.getSongName());
      dtproxy.dom.chatList.appendChild(newChat);
    }
  }

  render() {
    return (
      <MenuSwitch
        id="dubplus-updubs"
        section="General"
        menuTitle="Updubs in Chat"
        desc="Toggle showing updubs in the chat box"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
