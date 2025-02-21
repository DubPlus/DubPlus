<script>
  import { teleport } from '../actions/teleport.svelte';
  import { t } from '../stores/i18n.svelte';

  let eta = $state('ETA');

  /**
   * @returns {string}
   */
  function getEta() {
    const booth_position =
      document.querySelector('.queue-position')?.textContent;
    if (!booth_position) {
      return t('Eta.tooltip.notInQueue');
    }

    // average time of a song in minutes
    const average_song_minutes = 4;

    // current_time is the minutes of the currently playing song
    const current_time = parseInt(
      document.querySelector(
        '#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min',
      )?.textContent,
    );

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
  use:teleport={{ to: '.player_sharing' }}
  id="dubplus-eta"
  aria-label={eta}
  type="button"
  class="icon-history eta_tooltip_t dubplus-btn-player"
  data-dp-tooltip={eta}
  onmouseenter={() => {
    eta = getEta();
  }}
>
</button>
