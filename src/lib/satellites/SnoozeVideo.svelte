<script>
  import { teleport } from '../actions/teleport.svelte';
  import { t } from '../stores/i18n.svelte';

  /**
   * Snooze Video
   * Hides the video for the duration of the current song.
   *
   * This module is not a menu item. It is self-contained feature
   * that will always be automatically run on load.
   */

  const SNOOZE_CLASS = 'dubplus-snooze-video';

  /**
   * Show the video again when the song changes
   * @param {{startTime: number}} e
   */
  function eventSongAdvance(e) {
    if (e.startTime < 2) {
      // remove css class that hides the video
      document.body.classList.remove(SNOOZE_CLASS);
    }
  }

  /**
   * Hide the video
   */
  function snooze() {
    if (!document.body.classList.contains(SNOOZE_CLASS)) {
      document.body.classList.add(SNOOZE_CLASS);
      // setup event listener for song advance to restore volume
      // when the song changes
      window.QueUp.Events.once(
        'realtime:room_playlist-update',
        eventSongAdvance,
      );
    } else {
      document.body.classList.remove(SNOOZE_CLASS);
      window.QueUp.Events.unbind(
        'realtime:room_playlist-update',
        eventSongAdvance,
      );
    }
  }
</script>

<button
  use:teleport={{ to: '.player_sharing' }}
  id="dubplus-snooze-video"
  type="button"
  class="icon-eye-blocked snooze-video-btn dubplus-btn-player"
  aria-label={t('SnoozeVideo.tooltip')}
  data-dp-tooltip={t('SnoozeVideo.tooltip')}
  onclick={snooze}
>
  <span>1</span>
</button>

<style>
  button::after {
    width: 186px;
  }
  span {
    content: '1';
    vertical-align: top;
    font-size: 0.75rem !important;
    font-weight: 700;
    margin-right: 0 !important;
  }
</style>
