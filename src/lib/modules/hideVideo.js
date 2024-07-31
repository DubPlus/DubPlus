/**
 * @type {import("./module").DubPlusModule}
 */
export const hideVideo = {
  id: "hide-video",
  label: "hide-video.label",
  description: "hide-video.description",
  category: "user-interface",
  turnOn() {
    document.body.classList.add("dubplus-chat-only");
  },
  turnOff() {
    document.body.classList.remove("dubplus-chat-only");
  },
};
