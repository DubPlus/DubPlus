/**
 * Show downvotes in chat
 * only mods can use this
 */
import { isMod } from "../../utils/modcheck";
import { insertQueupChat } from "../../utils/chat-message";
import { t } from "../stores/i18n.svelte";

function downdubWatcher(e) {
  // const user = window.QueUp.session.get("username");
  // const currentDj = window.QueUp.room.users.collection.findWhere({
  //   userid: window.QueUp.room.player.activeSong.attributes.song.userid,
  // }).attributes._user.username;

  const isUserTheDJ =
    window.QueUp.session.id ===
    window.QueUp.room.player.activeSong.attributes.song.userid;

  if (isUserTheDJ && e.dubtype === "downdub") {
    insertQueupChat(
      "dubplus-chat-system-downdub",
      t("dubplus-downdubs.chat-message", {
        username: e.user.username,
        song_name: window.QueUp.room.player.activeSong.attributes.songInfo.name,
      })
    );
  }
}

export const downdubsInChat = {
  id: "dubplus-downdubs",
  label: "dubplus-downdubs.label",
  description: "dubplus-downdubs.description",
  category: "General",
  turnOn() {
    if (isMod(window.QueUp.session.id)) {
      window.QueUp.Events.bind("realtime:room_playlist-dub", downdubWatcher);
    }
  },

  turnOff() {
    window.QueUp.Events.unbind("realtime:room_playlist-dub", downdubWatcher);
  },
};
