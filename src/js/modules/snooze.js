/**
 * Snooze
 * Mutes audio for one song.
 *
 * This module is not a menu item, it is always automatically run on load
 */

/* global Dubtrack */
var myModule = {};

myModule.id = "snooze_btn";
myModule.moduleName = "Snooze";
myModule.description = "Mutes the current song.";

myModule.optionState = false; // not used in this module
myModule.category = false; // not used for this module
myModule.menuHTML = false; // not used for this module


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
            Dubtrack.room.player.setVolume(eventUtils.currentVol);
            eventUtils.snoozed = false;
        }
        return true;
    }
};

var snooze = function() {
    if (!eventUtils.snoozed && Dubtrack.room.player.player_volume_level > 2) {
        eventUtils.currentVol = Dubtrack.room.player.player_volume_level;
        Dubtrack.room.player.setVolume(0);
        eventUtils.snoozed = true;
        Dubtrack.Events.bind("realtime:room_playlist-update", eventSongAdvance);
    } else if (eventUtils.snoozed) {
        Dubtrack.room.player.setVolume(eventUtils.currentVol);
        eventUtils.snoozed = false;
    }
};

myModule.init = function() {
  $('.player_sharing').append('<span class="icon-mute snooze_btn"></span>');

  $('body').on('mouseover', '.snooze_btn', snooze_tooltip);
  $('body').on('mouseout', '.snooze_btn', hide_snooze_tooltip);
  $('body').on('click', '.snooze_btn', snooze);
};

module.exports = myModule;



