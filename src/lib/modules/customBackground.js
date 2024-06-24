/**
 * Custom Background
 * Add your own custom background
 */

import { logError } from "../../utils/logger";
import { t } from "../stores/i18n.svelte";
import { modalState, updateModalState } from "../stores/modalState.svelte";
import { saveSetting, settings } from "../stores/settings.svelte";

/**
 *
 * @param {string} url
 * @param {string} className
 * @returns {HTMLDivElement}
 */
function makeBGdiv(url, className) {
  const div = document.createElement("div");
  div.className = className;
  div.style.backgroundImage = `url(${url})`;
  return div;
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const customBackground = {
  id: "custom-bg",
  label: "custom-bg.label",
  description: "custom-bg.description",
  category: "customize",
  custom: {
    id: "custom-bg",
    title: "custom-bg.modal.title",
    content: "custom-bg.modal.content",
    placeholder: "custom-bg.modal.placeholder",
    maxlength: 500,
    validation(value) {
      if (!value) {
        // we allow blank value to remove the custom notification sound
        return true;
      }
      if (!value.startsWith("http")) {
        return t("custom-bg.modal.validation");
      }
      return true;
    },
    onConfirm(value) {
      document.querySelector(`.${this.id}`)?.remove();
      if (!value) {
        // a blank value means the user wanted to remove the background image
        return;
      }
      // validation already happened so we can trust this value
      document.body.appendChild(makeBGdiv(value, this.id));
    },
  },
  turnOn() {
    document.querySelector(`.${this.id}`)?.remove();
    const savedCustomBG = settings.options[this.id]?.value;
    if (savedCustomBG) {
      document.body.appendChild(makeBGdiv(savedCustomBG, this.id));
    }
  },

  turnOff() {
    document.querySelector(`.${this.id}`)?.remove();
  },
};
