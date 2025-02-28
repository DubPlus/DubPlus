<script>
  import { teleport } from '../actions/teleport.svelte';
  import { t } from '../stores/i18n.svelte';

  let icon = $state('icon-eye-blocked');
  let tooltip = $state(t('SnoozeVideo.tooltip'));

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
      tooltip = t('SnoozeVideo.tooltip');
      icon = 'icon-eye-blocked';
      return true;
    }
  }

  /**
   * Hide the video
   */
  function snooze() {
    if (!document.body.classList.contains(SNOOZE_CLASS)) {
      tooltip = t('SnoozeVideo.tooltip.undo');
      icon = 'icon-eye-unblocked';
      document.body.classList.add(SNOOZE_CLASS);
      // setup event listener for song advance to restore video
      // when the song changes
      window.QueUp.Events.once(
        'realtime:room_playlist-update',
        eventSongAdvance,
      );
    } else {
      tooltip = t('SnoozeVideo.tooltip');
      icon = 'icon-eye-blocked';
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
  class={`${icon} snooze-video-btn dubplus-btn-player`}
  aria-label={tooltip}
  data-dp-tooltip={tooltip}
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
