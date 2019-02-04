import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import userIsAtLeastMod from "@/utils/modcheck.js";

function chatMessage (username, song) {
  var li = document.createElement('li');
  li.className = "dubplus-chat-system dubplus-chat-system-downdub";

  var div = document.createElement('div');
  div.className = "chatDelete";
  div.onclick = e => e.currentTarget.parentElement.remove();

  var span = document.createElement('span');
  span.className = "icon-close";

  var text = document.createElement('div');
  text.className = "text";
  text.textContent = `@${username} has downdubbed your song ${song}`;

  div.appendChild(span);
  li.appendChild(div);
  li.appendChild(text);

  return li;
};

export default class DowndubInChat extends Component {
  turnOn() {
    if (!userIsAtLeastMod(Dubtrack.session.id)) {
      return;
    }

    Dubtrack.Events.bind("realtime:room_playlist-dub", this.downdubWatcher);
  }

  turnOff() {
    Dubtrack.Events.unbind("realtime:room_playlist-dub", this.downdubWatcher);
  }

  downdubWatcher(e) {
    var user = Dubtrack.session.get("username");
    var currentDj = Dubtrack.room.users.collection.findWhere({
      userid: Dubtrack.room.player.activeSong.attributes.song.userid
    }).attributes._user.username;

    if (user === currentDj && e.dubtype === "downdub") {
      let newChat = chatMessage(e.user.username, Dubtrack.room.player.activeSong.attributes.songInfo.name);
      document.querySelector("ul.chat-main").appendChild(newChat);
    }
  };

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
