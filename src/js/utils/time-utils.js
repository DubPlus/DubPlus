
/**
 * Takes time in milliseconds and converts it to a H:MM:SS format
 *  The hours is not left padded
 * 
 * @export
 * @param {String|Number} duration
 * @returns {String}
 */
export function convertMStoTime(duration) {
  if (!duration) {
    return ""; // just in case songLength is missing for some reason
  }
  var seconds = parseInt((duration / 1000) % 60, 10);
  var minutes = parseInt((duration / (1000 * 60)) % 60, 10);
  var hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

  if (isNaN(seconds) || isNaN(minutes) || isNaN(hours)) { 
    return ""
  }

  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (hours) {
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + ":" + seconds;
  }

  return minutes + ":" + seconds;
}