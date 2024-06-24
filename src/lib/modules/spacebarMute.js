/**
 * @param {KeyboardEvent} e
 */
function handleMute(e) {
  const tag = /**@type {HTMLElement}*/ (e.target).tagName.toLowerCase();
  if (e.key === " " && tag !== "input" && tag !== "textarea") {
    window.QueUp.room.player.mutePlayer();
  }
}

/**
 * Spacebar Mute
 * Turn on/off the ability to mute current song with the spacebar
 *
 * @type {import("./module").DubPlusModule}
 */
export const spacebarMute = {
  id: "dubplus-spacebar-mute",
  label: "dubplus-spacebar-mute.label",
  description: "dubplus-spacebar-mute.description",
  category: "settings",
  turnOn() {
    document.addEventListener("keypress", handleMute);
  },
  turnOff() {
    document.removeEventListener("keypress", handleMute);
  },
};
