/**
 * Custom Background
 * Add your own custom background
 */
import { logError } from '../../utils/logger';
import { getBackgroundImage } from '../queup.ui';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

/**
 *
 * @param {string} url
 */
function addCustomBG(url) {
  const bgImageDiv = getBackgroundImage();
  if (bgImageDiv) {
    bgImageDiv.setAttribute('data-original', bgImageDiv.style.backgroundImage);
    bgImageDiv.style.backgroundImage = `url(${url})`;
  }
}

function removeCustomBG() {
  const bgImageDiv = getBackgroundImage();
  if (bgImageDiv && bgImageDiv.hasAttribute('data-original')) {
    const originalSrc = bgImageDiv.getAttribute('data-original') ?? '';
    if (originalSrc) {
      bgImageDiv.style.backgroundImage = originalSrc;
    } else {
      logError(
        'customBackground',
        'removeCustomBG',
        'No original background image found',
      );
    }
    bgImageDiv.removeAttribute('data-original');
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
