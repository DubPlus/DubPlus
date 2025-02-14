<script>
  import { teleport } from "../actions/teleport";
  import { t } from "../stores/i18n.svelte";

  let eta = $state("ETA");

  /**
   * @returns {string}
   */
  function getEta() {
    const booth_position =
      document.querySelector(".queue-position")?.textContent;
    if (!booth_position) {
      return t("Eta.tooltip.notInQueue");
    }

    // we take "minutes" of the playing track
    // and also your position in the booth
    const time = 4;
    const current_time = parseInt(
      document.querySelector(
        "#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min",
      )?.textContent,
    );
    const booth_duration = parseInt(booth_position);
    const booth_time = booth_duration * time - time + current_time;
    if (booth_time >= 0) {
      return t("Eta.tootltip", { minutes: booth_time });
    } else {
      return t("Eta.tooltip.notInQueue");
    }
  }
</script>

<button
  use:teleport={{ to: ".player_sharing" }}
  aria-label={eta}
  type="button"
  class="icon-history eta_tooltip_t dubplus-btn-player"
  data-dp-tooltip={eta}
  onmouseenter={() => {
    eta = getEta();
  }}
>
</button>
