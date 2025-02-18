/**
 * Custom CSS
 * Add custom CSS
 */

import { loadExternalCss } from '../../utils/css';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

/**
 * Custom CSS
 * loads an external CSS file
 * @type {import("./module").DubPlusModule}
 */
export const customCss = {
  id: 'custom-css',
  label: 'custom-css.label',
  description: 'custom-css.description',
  category: 'customize',
  custom: {
    title: 'custom-css.modal.title',
    content: 'custom-css.modal.content',
    placeholder: 'custom-css.modal.placeholder',
    maxlength: 500,
    validation(value) {
      if (!value) {
        // we allow blank value to remove the custom CSS
        return true;
      }
      // basic validation that it's a url starting with http and ends with .css
      if (!/^http.+\.css$/.test(value)) {
        return t('custom-css.modal.validation');
      }

      return true;
    },
    onConfirm(value) {
      document.querySelector(`.${customCss.id}`)?.remove();
      if (!value) {
        // a blank value means the user wanted to remove the custom CSS
        settings.options[customCss.id] = false; // turn it back off
        return;
      }

      loadExternalCss(value, customCss.id);
    },
  },
  turnOn() {
    if (settings.custom[this.id]) {
      loadExternalCss(settings.custom[this.id], this.id);
    }
  },

  turnOff() {
    document.querySelector(`.${this.id}`)?.remove();
  },
};
