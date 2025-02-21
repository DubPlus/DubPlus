/**
 * Show Timestamps
 * Toggle always showing chat message timestamps.
 * @type {import("./module").DubPlusModule}
 */
export const showTimestamps = {
  id: 'show-timestamps',
  label: 'show-timestamps.label',
  description: 'show-timestamps.description',
  category: 'user-interface',
  turnOn() {
    document.body.classList.add('dubplus-show-timestamp');
  },
  turnOff() {
    document.body.classList.remove('dubplus-show-timestamp');
  },
};
