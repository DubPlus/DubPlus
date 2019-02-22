import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#Browser_compatibility
let input = dtproxy.playlistInput();

function handleKeyup(e) {}

function turnOn() {
  input.addEventListener("keyup", handleKeyup);
  input.placeholder = "filter or create a new playlist";
}

function turnOff() {
  input.removeEventListener("keyup", handleKeyup);
  // create a new playlist
  input.placeholder = "create a new playlist";
}

const SpacebarMute = function() {
  return (
    <MenuSwitch
      id="dubplus-playlist-filter"
      section="Settings"
      menuTitle="Filter playlists"
      desc="Adds filter functionality to the playlists in the grab popup by using the same input that already exists"
      turnOn={turnOn}
      turnOff={turnOff}
    />
  );
};
export default SpacebarMute;
