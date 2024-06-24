/**
 * Show downvotes in chat
 * only mods can use this
 */

import { insertQueupChat } from "../../utils/chat-message";
import { t } from "../stores/i18n.svelte";

function grabChatWatcher(e) {
  // const user = window.QueUp.session.get("username");
  // const currentDj = window.QueUp.room.users.collection.findWhere({
  //   userid: window.QueUp.room.player.activeSong.attributes.song.userid,
  // }).attributes._user.username;

  const isUserTheDJ =
    window.QueUp.session.id ===
    window.QueUp.room.player.activeSong.attributes.song.userid;

  if (isUserTheDJ && !window.QueUp.room.model.get("displayUserGrab")) {
    insertQueupChat(
      "dubplus-chat-system-updub",
      t("grabs-in-chat.chat-message", {
        username: e.user.username,
        song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name,
      })
    );
  }
}

export const grabsInChat = {
  id: "grabs-in-chat",
  label: "grabs-in-chat.label",
  description: "grabs-in-chat.description",
  category: "general",
  turnOn() {
    window.QueUp.Events.bind(
      "realtime:room_playlist-queue-update-grabs",
      grabChatWatcher
    );
  },

  turnOff() {
    window.QueUp.Events.unbind(
      "realtime:room_playlist-queue-update-grabs",
      grabChatWatcher
    );
  },
};
