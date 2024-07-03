/**
 * ETA
 *
 * This module is not a menu item, it is run once on load
 */

function eta() {
  const tooltip = document.querySelector('.player_sharing .eta_tooltip_t');
  const div = document.createElement('div');
  div.className = 'eta_tooltip dubplus-tooltip';
  div.style.cssText =
    'min-width: 150px;position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;';

  const remainingTime = document.querySelector(
    '#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min'
  );

  const queuePosition = document.querySelector('.queue-position');
  const queueTotal = document.querySelector('.queue-total');

  if (!remainingTime.textContent || !queueTotal.textContent) {
    div.textContent = 'No one is in the queue';
    tooltip.appendChild(div);
    return;
  }

  if (!queuePosition.textContent) {
    div.textContent = "You're not in the queue";
    tooltip.appendChild(div);
    return;
  }

  const current_time = parseInt(remainingTime.textContent);
  const booth_duration = parseInt(queuePosition.textContent);

  const time = 4;
  const booth_time = booth_duration * time - time + current_time;
  if (booth_time >= 0) {
    div.textContent = `ETA: ${booth_time} minute${booth_time > 1 ? 's' : ''}`;
  } else {
    div.textContent = "You're not in the queue";
  }

  tooltip.appendChild(div);
}

function hide_eta() {
  document.querySelector('.eta_tooltip')?.remove();
}

export default function () {
  if (document.querySelector('.player_sharing .eta_tooltip_t')) {
    document.querySelector('.player_sharing .eta_tooltip_t').remove();
  }

  window.dubplus.etaTooltipShow = eta;
  window.dubplus.etaTooltipHide = hide_eta;

  const etaBtn = document.createElement('span');
  etaBtn.className = 'icon-history eta_tooltip_t';
  etaBtn.style.position = 'relative';

  etaBtn.setAttribute('onmouseover', 'window.dubplus.etaTooltipShow()');
  etaBtn.setAttribute('onmouseout', 'window.dubplus.etaTooltipHide()');

  document.querySelector('.player_sharing').appendChild(etaBtn);
}
