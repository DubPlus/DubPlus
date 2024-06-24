/**
 * Split Chat
 * Toggle Split chat mode
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const splitChat = {
  id: "dubplus-split-chat",
  label: "dubplus-split-chat.label",
  description: "dubplus-split-chat.description",
  category: "user-interface",
  turnOn() {
    document.body.classList.add("dubplus-split-chat");
  },
  turnOff() {
    document.body.classList.remove("dubplus-split-chat");
  },
};
