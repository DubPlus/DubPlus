<script>
  import { teleport } from '../actions/teleport.svelte';
  import {
    getQueuePosition,
    getCurrentSongMinutes,
    PLAYER_BUTTONS_CONTAINER,
  } from '../queup.ui';
  import { t } from '../stores/i18n.svelte';

  let eta = $state('ETA');

  /**
   * @returns {string}
   */
  function getEta() {
    const booth_position = getQueuePosition()?.textContent;
    if (!booth_position) {
      return t('Eta.tooltip.notInQueue');
    }

    // average time of a song in minutes
    const average_song_minutes = 4;

    // current_time is the minutes of the currently playing song
    const current_time = parseInt(getCurrentSongMinutes()?.textContent ?? '');

    const position_in_queue = parseInt(booth_position);

    // we caclulate an ESTIMATE using the position in the queue * the average time of a song + the current time
    const booth_time =
      position_in_queue * average_song_minutes -
      average_song_minutes +
      current_time;
    if (booth_time >= 0) {
      return t('Eta.tootltip', { minutes: booth_time });
    } else {
      return t('Eta.tooltip.notInQueue');
    }
  }
</script>

<button
  use:teleport={{ to: PLAYER_BUTTONS_CONTAINER }}
  id="dubplus-eta"
  aria-label={eta}
  type="button"
  class="text-white/50 hover:text-white transition-colors eta_tooltip_t dubplus-btn-player"
  data-dp-tooltip={eta}
  onmouseenter={() => {
    eta = getEta();
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="w-5 h-5 lucide lucide-rotate-ccw-clock-icon lucide-rotate-ccw-clock"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
</button>
