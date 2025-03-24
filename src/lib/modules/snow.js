export const snow = {
  id: 'snow',
  label: 'snow.label',
  description: 'snow.description',
  category: 'general',

  turnOn() {
    // do nothing, we just want to turn the setting on
    // everything is handled within the Snow component.
    // MenuSwitch will set settings.options.snow to true
    // which will trigger the rendering of the Snow component
    // in Menu.svelte
  },

  turnOff() {},
};
