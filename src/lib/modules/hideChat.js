/**
 * Hide the Chat box and only show the video
 */

/**
 * @type {import("./module").DubPlusModule}
 */
export const hideChat = {
  id: "dubplus-video-only",
  label: "dubplus-video-only.label",
  description: "dubplus-video-only.description",
  category: "user-interface",
  turnOn() {
    document.body.classList.add("dubplus-video-only");
  },
  turnOff() {
    document.body.classList.remove("dubplus-video-only");
  },
};
