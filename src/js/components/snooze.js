/**
 * Snooze
 * Mutes audio for one song.
 *
 * This module is not a menu item, it is always automatically run on load
 */

import { h, render, Component } from "preact";
import dtproxy from "@/utils/DTProxy.js";

/*global Dubtrack*/
var eventUtils = {
  currentVol: 50,
  snoozed: false
};

var eventSongAdvance = function(e) {
  if (e.startTime < 2) {
    if (eventUtils.snoozed) {
      dtproxy.setVolume(eventUtils.currentVol);
      eventUtils.snoozed = false;
    }
    return true;
  }
};

var snooze = function() {
  if (!eventUtils.snoozed && !dtproxy.isMuted() && dtproxy.getVolume() > 2) {
    eventUtils.currentVol = dtproxy.getVolume();
    dtproxy.mutePlayer();
    eventUtils.snoozed = true;
    dtproxy.onPlaylistUpdate(eventSongAdvance);
  } else if (eventUtils.snoozed) {
    dtproxy.setVolume(eventUtils.currentVol);
    eventUtils.snoozed = false;
  }
};

var css = {
  position: "absolute",
  font: "1rem/1.5 proxima-nova,sans-serif",
  display: "block",
  left: "-33px",
  cursor: "pointer",
  borderRadius: "1.5rem",
  padding: "8px 16px",
  background: "#fff",
  fontWeight: "700",
  fontSize: "13.6px",
  textTransform: "uppercase",
  color: "#000",
  opacity: "0.8",
  textAlign: "center",
  zIndex: "9"
};

class Snooze extends Component {
  state = {
    show: false
  };

  showTooltip = () => {
    this.setState({ show: true });
  };

  hideTooltip = () => {
    this.setState({ show: false });
  };

  render(props, state) {
    return (
      <span
        className="icon-mute snooze_btn"
        onClick={snooze}
        onMouseOver={this.showTooltip}
        onMouseOut={this.hideTooltip}
      >
        {state.show && (
          <div className="snooze_tooltip" style={css}>
            Mute current song
          </div>
        )}
      </span>
    );
  }
}

export default function() {
  render(<Snooze />, document.querySelector(".player_sharing"));
}
