/**
 * @type {import("./module").DubPlusModule}
 */
export const hideVideo = {
  id: "dubplus-chat-only",
  label: "dubplus-chat-only.label",
  description: "dubplus-chat-only.description",
  category: "user-interface",
  turnOn() {
    document.body.classList.add("dubplus-chat-only");
  },
  turnOff() {
    document.body.classList.remove("dubplus-chat-only");
  },
};
