import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";

// #playlist-input
let input = dtproxy.playlistInput();
input.placeholder = "filter or create a new playlist";
input.placeholder = "create a new playlist";

function handleKeyup(e) {
  console.log(e.target);
}

function turnOn() {
  // the playlist is part of a DOM element that gets added and removed so we 
  // can't bind directly to it
  document.body.addEventListener("keyup", handleKeyup);
}

function turnOff() {
  document.body.addEventListener("keyup", handleKeyup);
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
