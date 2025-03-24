<script>
  import { PLAYLIST_UPDATE } from '../../events-constants';
  import { teleport } from '../actions/teleport.svelte';
  import { PLAYER_SHARING_CONTAINER } from '../queup.ui';
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

  function revert() {
    tooltip = t('SnoozeVideo.tooltip');
    icon = 'icon-eye-blocked';
    document.body.classList.remove(SNOOZE_CLASS);
    window.QueUp.Events.unbind(PLAYLIST_UPDATE, eventSongAdvance);
  }

  /**
   * Show the video again when the song changes
   * @param {{startTime: number}} e
   */
  function eventSongAdvance(e) {
    // the reason we use e.startTime is because the PLAYLIST_UPDATE can be triggered
    // when anything in the room's queue is updated, such as: a user joins the queue,
    // a user leaves the queue, a user changes their song in the queue, a new song
    // starts playing, etc.
    // The startTime is the time of the song that is currently playing and so the lower
    // the startTime, the more likely it is that the song has just started playing.
    if (e.startTime < 2) {
      revert();
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
      window.QueUp.Events.bind(PLAYLIST_UPDATE, eventSongAdvance);
    } else {
      revert();
    }
  }
</script>

<button
  use:teleport={{ to: PLAYER_SHARING_CONTAINER }}
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
