/**
 * ETA
 *
 * This module is not a menu item, it is run once on load
 */

var eta = function() {
  var time = 4;
  var current_time = parseInt($('#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min').text());
  var booth_duration = parseInt($('.queue-position').text());
  var booth_time = (booth_duration * time - time) + current_time;
  
  if (booth_time >= 0) {
      $(this).append('<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">ETA: '+booth_time+' minutes</div>');
  } else {
      $(this).append('<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">You\'re not in the queue</div>');
  }
};

var hide_eta = function() {
  $(this).empty();
};

export default function() {
  $('.player_sharing').append('<span class="icon-history eta_tooltip_t"></span>');
  $('.eta_tooltip_t').mouseover(eta).mouseout(hide_eta);
}