/**
 * Show downvotes in chat
 * only mods can use this
 */

import { insertQueupChat } from "../../utils/chat-message";
import { t } from "../stores/i18n.svelte";

function updubWatcher(e) {
  // const user = window.QueUp.session.get("username");
  // const currentDj = window.QueUp.room.users.collection.findWhere({
  //   userid: window.QueUp.room.player.activeSong.attributes.song.userid,
  // }).attributes._user.username;

  const isUserTheDJ =
    window.QueUp.session.id ===
    window.QueUp.room.player.activeSong.attributes.song.userid;

  if (isUserTheDJ && e.dubtype === "updub") {
    insertQueupChat(
      "dubplus-chat-system-updub",
      t("updubs-in-chat.chat-message", {
        username: e.user.username,
        song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name,
      })
    );
  }
}

export const upDubInChat = {
  id: "updubs-in-chat",
  label: "updubs-in-chat.label",
  description: "updubs-in-chat.description",
  category: "general",
  turnOn() {
    window.QueUp.Events.bind("realtime:room_playlist-dub", updubWatcher);
  },
  turnOff() {
    window.QueUp.Events.unbind("realtime:room_playlist-dub", updubWatcher);
  },
};
