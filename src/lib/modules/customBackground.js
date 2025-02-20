/**
 * Custom Background
 * Add your own custom background
 */
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

/**
 *
 * @param {string} url
 */
function addCustomBG(url) {
  /**
   * @type {HTMLImageElement}
   */
  const img = document.querySelector('.backstretch img');
  if (img) {
    img.setAttribute('data-original', img.src);
    img.src = url;
  }
}

function removeCustomBG() {
  /**
   * @type {HTMLImageElement}
   */
  const img = document.querySelector('.backstretch img');
  if (img && img.hasAttribute('data-original')) {
    img.src = img.getAttribute('data-original');
    img.removeAttribute;
  }
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const customBackground = {
  id: 'custom-bg',
  label: 'custom-bg.label',
  description: 'custom-bg.description',
  category: 'customize',
  custom: {
    title: 'custom-bg.modal.title',
    content: 'custom-bg.modal.content',
    placeholder: 'custom-bg.modal.placeholder',
    maxlength: 500,
    validation(value) {
      if (!value) {
        // we allow blank value to remove the custom notification sound
        return true;
      }
      if (!value.startsWith('http')) {
        return t('custom-bg.modal.validation');
      }
      return true;
    },
    onConfirm(value) {
      removeCustomBG();
      if (!value) {
        // a blank value means the user wanted to remove the background image
        return;
      }
      // validation already happened so we can trust this value
      addCustomBG(value);
    },
  },
  turnOn() {
    removeCustomBG();
    const savedCustomBG = settings.custom[this.id];
    if (savedCustomBG) {
      addCustomBG(savedCustomBG);
    }
  },

  turnOff() {
    removeCustomBG();
  },
};
