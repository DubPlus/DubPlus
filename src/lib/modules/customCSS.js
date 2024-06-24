/**
 * Custom CSS
 * Add custom CSS
 */

import { loadExternalCss } from "../../utils/css";
import { t } from "../stores/i18n.svelte";
import { settings } from "../stores/settings.svelte";

/**
 * @type {import("./module").DubPlusModule}
 */
export const customCss = {
  id: "custom-css",
  label: "custom-css.label",
  description: "custom-css.description",
  category: "customize",
  custom: {
    id: "custom-css",
    title: "custom-css.modal.title",
    content: "custom-css.modal.content",
    placeholder: "custom-css.modal.placeholder",
    maxlength: 500,
    validation(value) {
      if (!value) {
        // we allow blank value to remove the custom CSS
        return true;
      }
      if (!value.startsWith("http")) {
        return t("custom-css.modal.validation");
      }

      return true;
    },
    onConfirm(value) {
      document.querySelector(`.${this.id}`)?.remove();
      if (!value) {
        // a blank value means the user wanted to remove the custom CSS
        settings.options[this.id].enabled = false; // turn it back off
        return;
      }

      loadExternalCss(value, this.id);
    },
  },
  turnOn() {
    if (settings.options[this.id]?.value) {
      loadExternalCss(settings.options[this.id].value, this.id);
    }
  },

  turnOff() {
    document.querySelector(`.${this.id}`)?.remove();
  },
};
