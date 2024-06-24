/**
 * Warn on Navigation
 * Warns you when accidentally clicking on a link that takes you out of dubtrack
 */

function unloader(e) {
  let confirmationMessage = "You are leaving";
  e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
  return confirmationMessage; // Gecko, WebKit, Chrome <34
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const warnOnNavigation = {
  id: "warn-redirect",
  label: "warn-redirect.label",
  description: "warn-redirect.description",
  category: "settings",
  turnOn() {
    window.addEventListener("beforeunload", unloader);
  },
  turnOff() {
    window.removeEventListener("beforeunload", unloader);
  },
};
