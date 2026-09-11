import { logDebug } from './logger';
import { t } from '../lib/stores/i18n.svelte';
import { modalState, updateModalState } from '../lib/stores/modalState.svelte';
import { saveSetting, settings } from '../lib/stores/settings.svelte';

/**
 *
 * @param {import("../lib/modules/module").DubPlusModule} module
 * @returns {import('../types/global').ExternalChatCommand}
 */
export function getCommandConfig(module) {
  const description = [t(module.description)];
  if (module.custom) {
    description.push(t('SlashCommand.args'));
  }

  /**
   * @type {import('../types/global').ExternalChatCommand}
   */
  const chatCommandConfig = {
    name: module.id,
    usage: `/${module.id}`,
    description: description.join(' '),
    appName: 'Dub+',
    run: (context) => {
      /**
       * Example usage:
       * /afk -> this will just toggle on/off the option
       * /afk I am away -> this will set the custom message for the afk module and turn it on.
       *   Note: You can't clear a custom message from the slash commands, that still needs to be
       *   done through the UI.
       *
       * Updating the custom settings should follow the same rules:
       * - It must pass the custom validation if one is defined.
       * - It must not exceed the maximum length defined for the custom setting.
       * - If it successfully saves the custom setting, it should turn on the option if it's not on already.
       * - If trying to turn a module on that requires a custom setting and that setting is not set, it should
       *   display the customization modal. This mimics the behavior of the UI.
       */
      logDebug(`/${module.id} context:`, context);

      // Some modules are just actions (example: fullscreen).
      if (typeof module.onClick === 'function') {
        module.onClick();
        return;
      }

      const argsValue = context.args?.trim();
      const current = settings.options[module.id];

      if (argsValue) {
        applyCustomArgs(module, argsValue, current);
      } else {
        toggleModule(module, current);
      }
    },
  };
  if (module.custom) {
    chatCommandConfig.argSlots = ['text'];
  }
  return chatCommandConfig;
}

/**
 * Validates a custom setting value supplied via slash command args and, if valid,
 * saves it and turns the module on (if it isn't already). Shows an alert on failure.
 * @param {import("../lib/modules/module").DubPlusModule} module
 * @param {string} argsValue
 * @param {boolean} isOn - Whether the module is currently on.
 */
function applyCustomArgs(module, argsValue, isOn) {
  const maxLength = Math.min(module.custom?.maxlength ?? 999, 999);
  const validationResult = module.custom?.validation
    ? module.custom.validation(argsValue)
    : true;
  const exceedsMaxLength = argsValue.length > maxLength;

  if (validationResult !== true || exceedsMaxLength) {
    const errorMessages = [t('SlashCommand.invalid.value')];
    if (typeof validationResult === 'string') {
      errorMessages.push(validationResult);
    }
    if (exceedsMaxLength) {
      errorMessages.push(
        t('Modal.validation.maxlength', {
          maxlength: Math.min(module.custom?.maxlength ?? 999, 999),
        }),
      );
    }
    window.alert(errorMessages.join('\n'));
    return;
  }

  saveSetting('custom', module.id, argsValue);
  if (!isOn) {
    saveSetting('options', module.id, true);
    module.turnOn?.();
  }
}

/**
 * Toggles a module on/off.
 * If module requires a custom setting that hasn't been set, it will open the
 * customization modal (mimicking the behavior of the UI).
 * @param {import("../lib/modules/module").DubPlusModule} module
 * @param {boolean} isOn - Whether the module is currently on.
 */
function toggleModule(module, isOn) {
  if (module.custom && !settings.custom[module.id]) {
    openEditModal(module.id, module.custom, () =>
      saveSetting('options', module.id, false),
    );
    return;
  }

  saveSetting('options', module.id, !isOn);
  if (isOn) {
    module.turnOff?.();
  } else {
    module.turnOn?.();
  }
}

/**
 * @param {import("../lib/modules/module").DubPlusModule['id']} id - The ID of the module being edited.
 * @param {import("../lib/modules/module").DubPlusModule['custom']} customize
 * @param {import("../lib/modules/module").DubPlusModule['turnOff']} turnOff - The function to turn off the module.
 */
export function openEditModal(id, customize, turnOff) {
  updateModalState({
    title: t(customize?.title),
    content: t(customize?.content),
    placeholder: t(customize?.placeholder),
    defaultValue: customize?.defaultValue ? t(customize.defaultValue) : '',
    maxlength: customize?.maxlength,
    value: settings.custom[id] || '',
    validation: customize?.validation,
    onConfirm: (value) => {
      saveSetting('custom', id, value);

      // if the value is empty and there is no default value, then we
      // turn off the feature
      if (value.trim() === '' && !customize?.defaultValue) {
        saveSetting('options', id, false);
        turnOff?.();
      }

      if (typeof customize?.onConfirm === 'function') {
        customize.onConfirm(value);
      }
    },
    onCancel: () => {
      // if the saved custom setting is empty and there is no default value,
      // then we turn off the feature
      if (
        !customize?.defaultValue &&
        (typeof settings.custom[id] === 'undefined' ||
          settings.custom[id] === '')
      ) {
        saveSetting('options', id, false);
        turnOff?.();
      }
      if (typeof customize?.onCancel === 'function') customize?.onCancel();
    },
  });

  modalState.open = true;
}
