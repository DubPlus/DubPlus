import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";
import KEYS from "@/utils/keys";

function handleKeyup(e) {
  if (e.code !== KEYS.space) {
    return;
  }
  var tag = e.target.tagName.toLowerCase();
  if (tag !== "input" && tag !== "textarea") {
    dtproxy.mutePlayer();
  }
}

function turnOn() {
  document.addEventListener("keyup", handleKeyup);
}

function turnOff() {
  document.removeEventListener("keyup", handleKeyup);
}

const SpacebarMute = function() {
  return (
    <MenuSwitch
      id="dubplus-spacebar-mute"
      section="Settings"
      menuTitle="Spacebar Mute"
      desc="Turn on/off the ability to mute current song with the spacebar."
      turnOn={turnOn}
      turnOff={turnOff}
    />
  );
};
export default SpacebarMute;
