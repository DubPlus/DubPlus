import { h } from "preact";
import { MenuSimple } from "@/components/menuItems.js";

/**
 * Fullscreen Video
 */

function goFS() {
  var elem = document.querySelector("#room-main-player-container");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}

const FullscreenVideo = function() {
  return (
    <MenuSimple
      id="dubplus-fullscreen"
      section="User Interface"
      menuTitle="Fullscreen Video"
      desc="Toggle fullscreen video mode"
      icon="arrows-alt"
      onClick={goFS}
    />
  );
};

export default FullscreenVideo;
