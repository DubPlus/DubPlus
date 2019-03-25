import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import dtproxy from "@/utils/DTProxy.js";

/**
 * Menu item for Autovote
 */
export default class Autovote extends Component {
  dubup = dtproxy.dom.upVote;
  dubdown = dtproxy.dom.downVote;

  advance_vote = () => {
    var event = document.createEvent("HTMLEvents");
    event.initEvent("click", true, false);
    this.dubup.dispatchEvent(event);
  };

  voteCheck = obj => {
    if (obj.startTime < 2) {
      this.advance_vote();
    }
  };

  turnOn = e => {
    var song = dtproxy.getActiveSong();
    var dubCookie = dtproxy.getVoteType();
    var dubsong = dtproxy.getDubSong();

    if (!song || song.songid !== dubsong) {
      dubCookie = false;
    }

    // Only cast the vote if user hasn't already voted
    if (
      !this.dubup.classList.contains("voted") &&
      !this.dubdown.classList.contains("voted") &&
      !dubCookie
    ) {
      this.advance_vote();
    }

    dtproxy.events.onPlaylistUpdate(this.voteCheck);
  };

  turnOff = e => {
    dtproxy.events.offPlaylistUpdate(this.voteCheck);
  };

  render() {
    return (
      <MenuSwitch
        id="dubplus-autovote"
        section="General"
        menuTitle="Autovote"
        desc="Toggles auto upvoting for every song"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      />
    );
  }
}
