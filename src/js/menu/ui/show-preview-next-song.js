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

export default class ShowNextSong extends Component {
  state = {
    isOn : false,
    nextSong : null,
    renderTo: null
  }

  userId = dtproxy.getUserId()

  
  componentWillMount() {
    // add an empty span on mount to give Poral something to render to
    let widget = dtproxy.getChatInputContainer();
    let span = document.createElement('span');
    this.renderTo = widget.parentNode.insertBefore(span, widget);
  }

  findNextSong() {
    let queue = dtproxy.getCurrentQueue();
    
    if (!queue.length) {
      this.nextSong = null;
      return;
    }

    queue.forEach( song => {
      if (song.userid === this.userId) {
        this.nextSong = song
      } 
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
