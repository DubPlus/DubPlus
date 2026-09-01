/**
 * @type {import("./module").DubPlusModule}
 */
export const collapsibleImages = {
  id: 'collapsible-images',
  label: 'collapsible-images.label',
  description: 'collapsible-images.description',
  category: 'general',
  turnOn() {
    document.body.classList.add('dubplus-collapsible-images');
  },
  turnOff() {
    document.body.classList.remove('dubplus-collapsible-images');
  },
};
