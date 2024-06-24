import { PLAYLIST_UPDATE } from "../../events-constants";

function voteCheck() {
  // we can call this as many times as we want, it will only vote once per song
  window.QueUp?.playerController?.voteUp?.click();
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const autovote = {
  id: "autovote",
  label: "autovote.label",
  description: "autovote.description",
  category: "general",
  turnOff() {
    window.QueUp.Events.unbind(PLAYLIST_UPDATE, voteCheck);
  },
  turnOn() {
    voteCheck();
    window.QueUp.Events.bind(PLAYLIST_UPDATE, voteCheck);
  },
};
