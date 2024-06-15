/**
 * ETA
 *
 * This module is not a menu item, it is run once on load
 */

/**
 * @returns {string}
 */
function getEta() {
  const time = 4;
  const current_time = parseInt(
    document.querySelector(
      "#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min"
    )?.textContent
  );
  const booth_duration = parseInt(
    document.querySelector(".queue-position").textContent
  );
  const booth_time = booth_duration * time - time + current_time;
  if (booth_time >= 0) {
    return `ETA: ${booth_time} minutes`;
  } else {
    return "You're not in the queue";
  }
}

export function addETA() {
  if (document.querySelector(".eta_tooltip_t")) {
    document.querySelector(".eta_tooltip_t").remove();
  }
  const etaBtn = document.createElement("button");
  etaBtn.className = "icon-history eta_tooltip_t";
  etaBtn.setAttribute("data-dp-tooltip", "ETA");
  etaBtn.textContent = "ETA";

  etaBtn.addEventListener("mouseenter", function () {
    const newEta = getEta();
    etaBtn.setAttribute("data-dp-tooltip", newEta);
  });

  document.querySelector(".player_sharing").appendChild(etaBtn);
}
