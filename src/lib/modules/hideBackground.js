/**
 * Hide Background
 * toggle hiding background image
 *
 * @type {import("./module").DubPlusModule}
 */
export const hideBackground = {
  id: "hide-bg",
  label: "hide-bg.label",
  description: "hide-bg.description",
  category: "user-interface",
  turnOn() {
    document.body.classList.add("dubplus-hide-bg");
  },
  turnOff() {
    document.body.classList.remove("dubplus-hide-bg");
  },
};
