import { h, Component } from "preact";
import { MenuSwitch } from "@/components/menuItems.js";
import Portal from "@/utils/Portal.js"
import dtproxy from "@/utils/DTProxy.js";
import { convertMStoTime } from "@/utils/time-utils.js"


const SongPreview = ({ song }) => {
  if (!song) {
    return null;
  }
  return (
    <p className="dubplus-song-preview">
      {song.images && song.images.thumbnail ? (
        <span className="dubplus-song-preview__image">
          <img src={song.images.thumbnail} />
        </span>
      ) : null}
      <span className="dubplus-song-preview__title">
        <small>Your next track:</small>
        {song.name}
      </span>
      <span className="dubplus-song-preview__length">
        {convertMStoTime(song.songLength)}
      </span>
    </p>
  );
};

export default class PreviewNextSong extends Component {
  state = {
    isOn: false,
    nextSong: null
  };

  componentWillMount() {
    // add an empty span on mount to give Portal something to render to
    let widget = dtproxy.dom.chatInputContainer();
    let span = document.createElement("span");
    span.id = "dp-song-prev-target";
    widget.parentNode.insertBefore(span, widget);
    this.renderTo = document.getElementById("dp-song-prev-target");
    this.userid = dtproxy.userId();
  }

  /**
   * Go through the room's playlist queue and look for the ID of the current
   * logged in User
   */
  findNextSong = () => {
    dtproxy.api
      .getRoomQueue()
      .then(json => {
        let data = window._.get(json, "data", []);
        const next = data.filter(track => track.userid === this.userid);
        if (next.length > 0) {
          this.getSongInfo(next[0].songid);
          return;
        }
        this.setState({ nextSong: null });
      })
      .catch(err => {
        this.setState({ nextSong: null });
      });
  };

  getSongInfo = songId => {
    dtproxy.api
      .getSongData(songId)
      .then(json => {
        let name = window._.get(json, "data.name");
        if (name) {
          this.setState({
            nextSong: json.data
          });
          return;
        }
        this.setState({ nextSong: null });
      })
      .catch(err => {
        this.setState({ nextSong: null });
      });
  };

  turnOn = () => {
    this.setState({ isOn: true });
    this.findNextSong();
    dtproxy.events.onPlaylistUpdate(this.findNextSong);
    dtproxy.events.onQueueUpdate(this.findNextSong);
    document.body.classList.add("dplus-song-preview");
  };

  turnOff = () => {
    this.setState({ isOn: false });
    dtproxy.events.offPlaylistUpdate(this.findNextSong);
    dtproxy.events.offQueueUpdate(this.findNextSong);
    document.body.classList.remove("dplus-song-preview");
  };

  render(props, { isOn, nextSong }) {
    return (
      <MenuSwitch
        id="dubplus-preview-next-song"
        section="General"
        menuTitle="Preview Next Song"
        desc="Show the next song you have queued up without having to look in your queue"
        turnOn={this.turnOn}
        turnOff={this.turnOff}
      >
        {isOn ? (
          <Portal into={this.renderTo}>
            <SongPreview song={nextSong} />
          </Portal>
        ) : null}
      </MenuSwitch>
    );
  }
}
