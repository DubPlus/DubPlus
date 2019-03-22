import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import Portal from "preact-portal/src/preact-portal";
import dtproxy from "@/utils/DTProxy.js";

// if something else needs to use this then we can move it into utils
function convertTime(ms) {
  if (!ms) {
    return ""; // just in case songLength is missing for some reason
  }
  let rounded = 1000 * Math.round(ms / 1000); // round to nearest second
  var d = new Date(rounded);
  return d.getUTCMinutes() + ":" + d.getUTCSeconds();
}

const SongPreview = ({ song }) => {
  if (!song) {
    return null;
  }
  return (
    <p class="dubplus-song-preview">
      {song.images && song.images.thumbnail ? (
        <span class="dubplus-song-preview__image">
          <img src={song.images.thumbnail} />
        </span>
      ) : null}
      <span class="dubplus-song-preview__title">{song.name}</span>
      <span class="dubplus-song-preview__length">
        {convertTime(song.songLength)}
      </span>
    </p>
  );
};

export default class PreviewNextSong extends Component {
  state = {
    isOn: false,
    nextSong: null,
    renderTo: null
  };

  userid = dtproxy.getUserId();

  componentWillMount() {
    // add an empty span on mount to give Portal something to render to
    let widget = dtproxy.getChatInputContainer();
    let span = document.createElement("span");
    widget.parentNode.insertBefore(span, widget);
    this.setState({ renderTo: span });
  }

  /**
   * Go through the room's playlist queue and look for the ID of the current
   * logged in User
   */
  findNextSong() {
    dtproxy.getRoomQueue((err, json) => {
      if (err || !json.data || !json.data.length) {
        this.setState({ nextSong: null });
        return;
      }
      const next = json.data.filter(track => track.userid === this.userid);
      if (next.length > 0) {
        this.getSongInfo(next[0].songid);
        return;
      }
      this.setState({ nextSong: null });
    });
  }

  getSongInfo(songId) {
    dtproxy.getSongData(songId, (err, json) => {
      if (err || !json.data || !json.data.name) {
        this.setState({ nextSong: null });
        return;
      }
      this.setState({
        nextSong: json.data
      });
    });
  }

  turnOn = () => {
    this.setState({ isOn: true });
    this.findNextSong();
    dtproxy.onPlaylistUpdate(this.findNextSong);
  };

  turnOff = () => {
    this.setState({ isOn: false });
    dtproxy.offPlaylistUpdate(this.findNextSong);
  };

  render(props, { isOn, nextSong, renderTo }) {
    return (
      <MenuSwitch
        id="dubplus-preview-next-song"
        section="General"
        menuTitle="Preview Next Song"
        desc="Show the next song you have queued up without having to look in your queue"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        {isOn && renderTo ? (
          <Portal into={renderTo}>
            <SongPreview song={nextSong} />
          </Portal>
        ) : null}
      </MenuSwitch>
    );
  }
}
