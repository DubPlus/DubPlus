function isIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE "); // IE 10 and below
  var trident = ua.indexOf("Trident/"); // IE 11
  return msie > 0 || trident > 0;
}

const ie = isIE();

export default {
  get up() {
    return ie ? "Up" : "ArrowUp";
  },

  get down() {
    return ie ? "Down" : "ArrowDown";
  },

  get left() {
    return ie ? "Left" : "ArrowLeft";
  },

  get right() {
    return ie ? "Right" : "ArrowRight";
  },

  get esc() {
    return ie ? "Esc" : "Escape";
  },

  get space() {
    return ie ? "Spacebar" : "Space";
  },

  enter: "Enter",
  tab: "Tab"
};
