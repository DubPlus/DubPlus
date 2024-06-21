function voteCheck() {
  // we can call this as many times as we want, it will only vote once per song
  window.QueUp?.playerController?.voteUp?.click();
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const autovote = {
  id: "dubplus-autovote",
  label: "dubplus-autovote.label",
  description: "dubplus-autovote.description",
  category: "General",
  turnOff() {
    window.QueUp.Events.unbind("realtime:room_playlist-update", voteCheck);
  },
  turnOn() {
    voteCheck();
    window.QueUp.Events.bind("realtime:room_playlist-update", voteCheck);
  },
};
