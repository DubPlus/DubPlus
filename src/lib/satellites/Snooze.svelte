<script>
  import { teleport } from "../actions/teleport.svelte";
  import { t } from "../stores/i18n.svelte";

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
  function eventSongAdvance(e) {
    if (e.startTime < 2) {
      if (eventUtils.snoozed) {
        window.QueUp.room.player.setVolume(eventUtils.currentVol);
        eventUtils.snoozed = false;
      }
      return true;
    }
  }

  function snooze() {
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
      window.QueUp.Events.once(
        "realtime:room_playlist-update",
        eventSongAdvance,
      );
    } else if (eventUtils.snoozed) {
      window.QueUp.room.player.setVolume(eventUtils.currentVol);
      window.QueUp.room.player.updateVolumeBar();
      eventUtils.snoozed = false;
    }
  }
</script>

<button
  use:teleport={{ to: ".player_sharing" }}
  id="dubplus-snooze"
  type="button"
  class="icon-mute snooze_btn dubplus-btn-player"
  aria-label={t("Snooze.tooltip")}
  data-dp-tooltip={t("Snooze.tooltip")}
  onclick={snooze}
>
  <span>1</span>
</button>

<style>
  button::after {
    width: 186px;
  }
  span {
    content: "1";
    vertical-align: top;
    font-size: 0.75rem !important;
    font-weight: 700;
    margin-right: 0 !important;
  }
</style>
