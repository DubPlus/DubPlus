<script>
  import { teleport } from '../actions/teleport.svelte';
  import { getPlayerIframe, PLAYER_BUTTONS_CONTAINER } from '../queup.ui';
  import { t } from '../stores/i18n.svelte';
  import { onPlayerAdvance, offPlayerAdvance } from '../queup.v2';
  import Monitor from '../svg/Monitor.svelte';
  import MonitorOff from '../svg/MonitorOff.svelte';
  import { onDestroy } from 'svelte';

  /**
   * Snooze Video
   * Hides the video for the duration of the current song.
   *
   * This module is not a menu item. It is self-contained feature
   * that will always be automatically run on load.
   */

  let isSnoozed = $state(false);
  let tooltip = $state(t('SnoozeVideo.tooltip'));

  // During dev when doing HMR, svelte 5 doesn't re-run lifecycle hooks,
  // but will re-run the script so isSnoozed will be reset to false but the UI
  // will still be showing the overlay. This effect will clean up the dangling overlay.
  $effect(() => {
    if (!isSnoozed) {
      document.getElementById('dubplus-snooze-video-overlay')?.remove();
    }
  });

  function revert() {
    tooltip = t('SnoozeVideo.tooltip');
    isSnoozed = false;
    offPlayerAdvance(revert);
  }

  /**
   * Hide the video
   */
  function snooze() {
    if (!isSnoozed) {
      tooltip = t('SnoozeVideo.tooltip.undo');
      isSnoozed = true;
      onPlayerAdvance(revert);
    } else {
      revert();
    }
  }

  onDestroy(() => {
    offPlayerAdvance(revert);
  });
</script>

<button
  use:teleport={{ to: PLAYER_BUTTONS_CONTAINER }}
  id="dubplus-snooze-video"
  type="button"
  class="snooze-video-btn dubplus-btn-player text-white/50 hover:text-white transition-colors"
  aria-label={tooltip}
  data-dp-tooltip={tooltip}
  onclick={snooze}
>
  {#if isSnoozed}
    <Monitor class="w-5 h-5" />
  {:else}
    <MonitorOff class="w-5 h-5" />
  {/if}
</button>

{#if isSnoozed}
  <div
    use:teleport={{ to: () => getPlayerIframe()?.parentElement }}
    class="dubplus-snooze-video-overlay absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center"
    id="dubplus-snooze-video-overlay"
  >
    <MonitorOff class="w-5 h-5" />
  </div>
{/if}
