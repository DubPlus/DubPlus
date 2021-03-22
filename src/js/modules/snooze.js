/**
 * Snooze
 * Mutes audio for one song.
 *
 * This module is not a menu item, it is always automatically run on load
 */

/*global Dubtrack*/
var snooze_tooltip = function(e) {
  $(this).append('<div class="snooze_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">Mute current song</div>');
};

var hide_snooze_tooltip = function() {
  $('.snooze_tooltip').remove();
};

var eventUtils = {
  currentVol: 50,
  snoozed: false
};

var eventSongAdvance = function(e) {
  if (e.startTime < 2) {
    if (eventUtils.snoozed) {
        QueUp.room.player.setVolume(eventUtils.currentVol);
        eventUtils.snoozed = false;
    }
    return true;
  }
};

var snooze = function() {
  if (!eventUtils.snoozed && !QueUp.room.player.muted_player && QueUp.playerController.volume > 2) {
    eventUtils.currentVol = QueUp.playerController.volume;
    QueUp.room.player.mutePlayer();
    eventUtils.snoozed = true;
    QueUp.Events.bind("realtime:room_playlist-update", eventSongAdvance);
  } else if (eventUtils.snoozed) {
    QueUp.room.player.setVolume(eventUtils.currentVol);
    QueUp.room.player.updateVolumeBar();
    eventUtils.snoozed = false;
  }
};

export default function() {
  $('.player_sharing').append('<span class="icon-mute snooze_btn"></span>');

  $('body').on('mouseover', '.snooze_btn', snooze_tooltip);
  $('body').on('mouseout', '.snooze_btn', hide_snooze_tooltip);
  $('body').on('click', '.snooze_btn', snooze);
}



