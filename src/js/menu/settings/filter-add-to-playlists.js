import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";

function handleKeyup(e) {
  if (e.target.id === 'playlist-input') {
    let list = dtproxy.grabPlaylists();
    if (!list.length) { return; }
    let ul = list[0].parentElement;
    if (!ul.style.height) {
      ul.style.height = ul.offsetHeight + 'px';
    }
    let lcVal = e.target.value.toLowerCase();
    list.forEach(function(li){
      let liText = li.textContent.toLowerCase();
      let check = liText.indexOf(lcVal) >= 0;
      li.style.display = check ? 'block' : 'none';
    });
  }
}

function turnOn() {
  // the playlist is part of a DOM element that gets added and removed so we 
  // can't bind directly to it, we need to use delegation.
  document.body.addEventListener("keyup", handleKeyup);
}

function turnOff() {
  document.body.removeEventListener("keyup", handleKeyup);
}

const filterAddToPlaylists = function() {
  return (
    <MenuSwitch
      id="dubplus-playlist-filter"
      section="Settings"
      menuTitle="Filter playlists in grabs"
      desc="Adds 'filter as you type' functionality to the 'create a new playlist' input inside the grab to playlist popup"
      turnOn={turnOn}
      turnOff={turnOff}
    />
  );
};

export default filterAddToPlaylists;
