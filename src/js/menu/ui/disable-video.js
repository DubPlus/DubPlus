import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy";

function toggle(isFirstLoad) {
  if (isFirstLoad) {
    // disabling the video from stored settings on page load causes the video
    // to not play until you un-hide it.  So we delay turning it off for a bit
    // to give the video time to load and start playing
    setTimeout(function() {
      dtproxy.dom.hideVideoBtn().click();
    }, 5000);
    return;
  }

  dtproxy.dom.hideVideoBtn().click();
}

/**
 * Disable Video
 * This is the equivalent of clicking on the little eye icon to toggle the video
 * Sometimes I just want to hide the video the native dubtrack way but not remove
 * the entire video box
 */
const DisableVideo = function() {
  return (
    <MenuSwitch
      id="dubplus-disable-video"
      section="User Interface"
      menuTitle="Disable Video"
      desc="Toggles disabling the video. Equivalent to clicking on the eye icon under the video"
      turnOn={toggle}
      turnOff={toggle}
    />
  );
};
export default DisableVideo;
