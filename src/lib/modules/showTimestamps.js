/**
 * Show Timestamps
 * Toggle always showing chat message timestamps.
 * @type {import("./module").DubPlusModule}
 */
export const showTimestamps = {
  id: "dubplus-show-timestamp",
  label: "dubplus-show-timestamp.label",
  description: "dubplus-show-timestamp.description",
  category: "user-interface",
  turnOn() {
    document.body.classList.add("dubplus-show-timestamp");
  },
  turnOff() {
    document.body.classList.remove("dubplus-show-timestamp");
  },
};
