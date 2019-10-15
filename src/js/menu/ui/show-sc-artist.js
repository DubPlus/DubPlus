/**
 * Get soundcloud user's name and insert it next to the track name in the
 * player bar. (most of the time the user is the artist but not always)
 * 
 * NOT IN USE
 * you can get the artist name from the SoundCloud widget now so I'm not 
 * sure if this is worth the extra SoundCloud API call. 
 */
import { h } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy";

function getArtist() {
  let song = dtproxy.getActiveSong();

  if (!song || song.type !== "soundcloud") {
    return;
  }

  dtproxy.api
    .getSCtrackInfo(song.fkid)
    .then(json => {
      const artist = window._.get(json, "user.username");
      if (artist) {
        let currentSong = dtproxy.dom.getCurrentSongElem();
        let small = document.createElement('small');
        small.textContent = ` by: ${artist}`;
        currentSong.appendChild(small);
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
      id="dubplus-show-sc-user"
      section="User Interface"
      menuTitle="Show Soundcloud user"
      desc="Insert SoundCloud username into track title in the player bar"
      turnOn={turnOn}
      turnOff={turnOff}
    />
  );
};
export default ShowSCArtist;
