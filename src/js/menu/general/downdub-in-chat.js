import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";

function chatMessage(username, song) {
  var li = document.createElement("li");
  li.className = "dubplus-chat-system dubplus-chat-system-downdub";

  var div = document.createElement("div");
  div.className = "chatDelete";
  div.onclick = e => e.currentTarget.parentElement.remove();

  var span = document.createElement("span");
  span.className = "icon-close";

  var text = document.createElement("div");
  text.className = "text";
  text.textContent = `@${username} has downdubbed your song ${song}`;

  div.appendChild(span);
  li.appendChild(div);
  li.appendChild(text);

  return li;
}

export default class DowndubInChat extends Component {
  turnOn = () => {
    if (!dtproxy.modCheck()) {
      return;
    }

    dtproxy.events.onSongVote(this.downdubWatcher);
  };

  turnOff = () => {
    dtproxy.events.offSongVote(this.downdubWatcher);
  };

  downdubWatcher(e) {
    var user = dtproxy.userName();
    var currentDj = dtproxy.getCurrentDJ();
    if (!currentDj) {
      return;
    }

    if (user === currentDj && e.dubtype === "downdub") {
      let newChat = chatMessage(e.user.username, dtproxy.getSongName());
      dtproxy.dom.chatList().appendChild(newChat);
    }
  }

  render() {
    return (
      <MenuSwitch
        id="dubplus-downdubs"
        section="General"
        menuTitle="Downdubs in Chat (mods only)"
        desc="Toggle showing downdubs in the chat box (mods only)"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
