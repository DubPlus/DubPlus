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
  const vol = dtproxy.getVolume();
  if (!eventUtils.snoozed && !dtproxy.isMuted() && vol > 2) {
    eventUtils.currentVol = vol;
    dtproxy.mutePlayer();
    eventUtils.snoozed = true;
    dtproxy.events.onPlaylistUpdate(eventSongAdvance);
  } else if (eventUtils.snoozed) {
    dtproxy.setVolume(eventUtils.currentVol);
    eventUtils.snoozed = false;
  }
};

var css = {
  position: "absolute",
  font: "1rem/1.5 proxima-nova,sans-serif",
  display: "block",
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

export default class Snooze extends Component {
  state = {
    show: false
  };

  showTooltip = () => {
    this.setState({ show: true });
  };

  hideTooltip = () => {
    this.setState({ show: false });
  };

  updateLeft() {
    if (css.left) {
      return css
    }
    const left = this.snoozeRef.getBoundingClientRect().left
    css.left = left + "px"
    return css
  }

  render(props, state) {
    return (
      <span
        ref={s => (this.snoozeRef = s)}
        className="icon-mute snooze_btn"
        onClick={snooze}
        onMouseOver={this.showTooltip}
        onMouseOut={this.hideTooltip}
      >
        {state.show && (
          <div className="snooze_tooltip" style={this.updateLeft()}>
            Mute current song
          </div>
        )}
      </span>
    );
  }
}
