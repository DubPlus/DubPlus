/**
 * Custom Background
 * Add your own custom background
 */
import { getBackgroundImage } from '../queup.ui';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

/**
 *
 * @param {string} url
 */
function addCustomBG(url) {
  const img = getBackgroundImage();
  if (img) {
    img.setAttribute('data-original', img.src);
    img.src = url;
  }
}

function removeCustomBG() {
  const img = getBackgroundImage();
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
      // we can allow empty value which will just disable the feature
      if (value.trim() === '') return true;

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
