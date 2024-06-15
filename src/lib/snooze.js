/**
 * Snooze
 * Mutes audio for one song.
 *
 * This module is not a menu item. It is self-contained feature
 * that will always be automatically run on load.
 */

const eventUtils = {
  currentVol: 50,
  snoozed: false,
};

/**
 * Unmute when the song changes
 * @param {{startTime: number}} e
 * @returns
 */
const eventSongAdvance = function (e) {
  if (e.startTime < 2) {
    if (eventUtils.snoozed) {
      window.QueUp.room.player.setVolume(eventUtils.currentVol);
      eventUtils.snoozed = false;
    }
    return true;
  }
};

const snooze = function () {
  if (
    !eventUtils.snoozed &&
    !window.QueUp.room.player.muted_player &&
    window.QueUp.playerController.volume > 2
  ) {
    // save current volume so we can restore it later
    eventUtils.currentVol = window.QueUp.playerController.volume;
    // mute the player
    window.QueUp.room.player.mutePlayer();
    eventUtils.snoozed = true;
    // setup event listener for song advance to restore volume
    // when the song changes
    window.QueUp.Events.once("realtime:room_playlist-update", eventSongAdvance);
  } else if (eventUtils.snoozed) {
    window.QueUp.room.player.setVolume(eventUtils.currentVol);
    window.QueUp.room.player.updateVolumeBar();
    eventUtils.snoozed = false;
  }
};

export function addSnooze() {
  if (document.querySelector(".snooze_btn")) {
    document.querySelector(".snooze_btn").remove();
  }
  const snoozeBtn = document.createElement("button");
  snoozeBtn.className = "icon-mute snooze_btn";
  snoozeBtn.setAttribute("data-dp-tooltip", "Mute current song");
  snoozeBtn.addEventListener("click", snooze);
  snoozeBtn.textContent = "Mute current song";

  document.querySelector(".player_sharing").appendChild(snoozeBtn);
}
