import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";

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
    Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
  }

  turnOff() {
    Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
  }

  grabChatWatcher(e) {
    var user = Dubtrack.session.get("username");
    var currentDj = Dubtrack.room.users.collection.findWhere({
      userid: Dubtrack.room.player.activeSong.attributes.song.userid
    }).attributes._user.username;

    if(user === currentDj && !Dubtrack.room.model.get('displayUserGrab')) {
      let newChat = chatMessage(e.user.username, Dubtrack.room.player.activeSong.attributes.songInfo.name);
      document.querySelector("ul.chat-main").appendChild(newChat);
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
