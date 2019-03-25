import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy";

function getArtist() {
  let song = dtproxy.getActiveSong();

  if (song.type !== "soundcloud") {
    return;
  }

  dtproxy.api
    .getSCtrackInfo(song.fkid)
    .then(json => {
      let artist = window._.get(json, "user.username");
      if (aritst) {
        let currentSong = dtproxy.dom.getCurrentSongElem();
        let track = currentSong.textContent;
        currentSong.textContent = `${track} [artist: ${artist}]`;
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function turnOn() {
  getArtist();
  dtproxy.events.onPlaylistUpdate(getArtist);
}
function turnOff() {
  dtproxy.events.offPlaylistUpdate(getArtist);
}

const ShowSCArtist = function() {
  return (
    <MenuSwitch
      id="dubplus-show-sc-artist"
      section="User Interface"
      menuTitle="Show Soundcloud artist"
      desc="Insert SoundCloud artist name into track title in the player bar"
      turnOn={turnOn}
      turnOff={toggle}
    />
  );
};
export default ShowSCArtist;
