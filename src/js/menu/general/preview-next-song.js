import {h, Component} from 'preact';
import {MenuSwitch} from '@/components/menuItems.js';
import Portal from "preact-portal/src/preact-portal";
import dtproxy from "@/utils/DTProxy.js";

const SongPreview = (props) => {
  return (
    <p class="dubplus-song-preview">
      <span>{props.title || ''}</span> <span>{props.time || ''}</span>
    </p>
  );
};

export default class PreviewNextSong extends Component {
  state = {
    isOn : false,
    nextSong : null,
    renderTo: null
  }
  
  componentWillMount() {
    // add an empty span on mount to give Poral something to render to
    let widget = dtproxy.getChatInputContainer();
    let span = document.createElement('span');
    widget.parentNode.insertBefore(span, widget);
    this.renderTo = span;
  }

  findNextSong() {
    dtproxy.getUserQueue((err, queue) => {
      if (err) { return; }
      if (!queue.length || !queue[0].isActive) {
        this.nextSong = null;
        return;
      }
      this.nextSong = {title: queue[0]._song.name, time: queue[0]._song.songLength};
    });
  }

  turnOn = () => {
    this.setState({ isOn: true });
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
