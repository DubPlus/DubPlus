/**
 * Snooze
 * Mutes audio for one song.
 *
 * This module is not a menu item, it is always automatically run on load
 */

/*global Dubtrack*/
function snooze_tooltip() {
  const div = document.createElement('div');
  div.className = 'snooze_tooltip';
  div.style.cssText =
    'min-width: 186px;position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -15px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9';
  div.textContent = 'Mute current song';
  document.querySelector('.player_sharing .snooze_btn').appendChild(div);
}

function hide_snooze_tooltip() {
  document.querySelector('.snooze_tooltip')?.remove();
}

const eventUtils = {
  currentVol: 50,
  snoozed: false,
};

function eventSongAdvance(e) {
  if (e.startTime < 2) {
    if (eventUtils.snoozed) {
      QueUp.room.player.setVolume(eventUtils.currentVol);
      eventUtils.snoozed = false;
    }
    return true;
  }
}

function snooze() {
  if (
    !eventUtils.snoozed &&
    !QueUp.room.player.muted_player &&
    QueUp.playerController.volume > 2
  ) {
    eventUtils.currentVol = QueUp.playerController.volume;
    QueUp.room.player.mutePlayer();
    eventUtils.snoozed = true;
    QueUp.Events.bind('realtime:room_playlist-update', eventSongAdvance);
  } else if (eventUtils.snoozed) {
    QueUp.room.player.setVolume(eventUtils.currentVol);
    QueUp.room.player.updateVolumeBar();
    eventUtils.snoozed = false;
  }
}

export default function () {
  if (document.querySelector('.player_sharing .snooze_btn')) {
    document.querySelector('.player_sharing .snooze_btn').remove();
  }

  window.dubplus.snowTooltipShow = snooze_tooltip;
  window.dubplus.snoozeTooltipHide = hide_snooze_tooltip;
  window.dubplus.snoozeClick = snooze;

  const snoozeBtn = document.createElement('span');
  snoozeBtn.className = 'icon-mute snooze_btn';
  snoozeBtn.style.position = 'relative';

  snoozeBtn.setAttribute('onmouseover', 'window.dubplus.snowTooltipShow()');
  snoozeBtn.setAttribute('onmouseout', 'window.dubplus.snoozeTooltipHide()');
  snoozeBtn.setAttribute('onclick', 'window.dubplus.snoozeClick()');

  document.querySelector('.player_sharing').appendChild(snoozeBtn);
}
