import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";

function chatMessage (username, song) {
  var li = document.createElement('li');
  li.className = "dubplus-chat-system dubplus-chat-system-grab";

  var div = document.createElement('div');
  div.className = "chatDelete";
  div.onclick = e => e.currentTarget.parentElement.remove();

  var span = document.createElement('span');
  span.className = "icon-close";

  var text = document.createElement('div');
  text.className = "text";
  text.textContent = `@${username} has grabbed your song ${song}`;

  div.appendChild(span);
  li.appendChild(div);
  li.appendChild(text);

  return li;
};

export default class GrabsInChat extends Component {
  turnOn() {
    dtproxy.onSongGrab(this.grabChatWatcher);
  }

  turnOff() {
    dtproxy.offSongGrab(this.grabChatWatcher);
  }

  grabChatWatcher(e) {
    var user = dtproxy.getUserName();
    var currentDj = dtproxy.getCurrentDJ();

    if(user === currentDj && !dtproxy.displayUserGrab()) {
      let newChat = chatMessage(e.user.username, dtproxy.getSongName());
      dtproxy.chatList().appendChild(newChat);
    }
  };

  render() {
    return (
      <MenuSwitch
        id="dubplus-grabschat"
        section="General"
        menuTitle="Grabs in Chat"
        desc="Toggle showing grabs in the chat box"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
