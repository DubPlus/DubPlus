import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";

function handleKeyup(e) {
  if ((e.keyCode || e.which) !== 32) {
    return;
  }
  var tag = event.target.tagName.toLowerCase();
  if (tag !== "input" && tag !== "textarea") {
    Dubtrack.room.player.mutePlayer();
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
