<script>
  import { teleport } from "./actions/teleport";
  let eta = $state('ETA');

  /**
   * @returns {string}
   */
  function getEta() {
    const time = 4;
    const current_time = parseInt(
      document.querySelector(
        "#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min",
      )?.textContent,
    );
    const booth_duration = parseInt(
      document.querySelector(".queue-position").textContent,
    );
    const booth_time = booth_duration * time - time + current_time;
    if (booth_time >= 0) {
      return `ETA: ${booth_time} minutes`;
    } else {
      return "You're not in the queue";
    }
  }
</script>

<button
  use:teleport={".player_sharing"}
  type="button"
  class="icon-history eta_tooltip_t"
  data-dp-tooltip={eta}
  onmouseenter={() => {
    eta = getEta();
  }}
>
  ETA
</button>
