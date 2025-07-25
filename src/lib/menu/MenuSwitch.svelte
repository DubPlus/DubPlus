<script>
  import Switch from './Switch.svelte';
  import IconPencil from '../svg/IconPencil.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { saveSetting, settings } from '../stores/settings.svelte';
  import { modalState, updateModalState } from '../stores/modalState.svelte';
  import { t } from '../stores/i18n.svelte';
  import { isMod } from '../../utils/modcheck';

  /**
   * @typedef {object} MenuSwitchProps
   * @property {string} id
   * @property {string} label
   * @property {string} description
   * @property {boolean} [modOnly]
   * @property {(onLoad?: boolean) => void} turnOn runs when the switch is turned on
   * @property {() => void} turnOff runs when the switch is turned off
   * @property {() => void} [init] always runs when the component mounts, whether
   * the switch is on or off
   * @property {import('../../global').ModalProps} [customize]
   * @property {import('../modules/module').DubPlusModule['secondaryAction']} [secondaryAction]
   *
   */

  /**
   * @type {MenuSwitchProps}
   */
  let {
    id,
    label,
    description,
    customize,
    turnOn,
    turnOff,
    init,
    modOnly,
    secondaryAction,
  } = $props();

  const SecondaryIcon = secondaryAction?.icon || IconPencil;

  onMount(() => {
    if (init) init();

    if (settings.options[id]) {
      // check user mod status if this is a mod only feature
      const allowed = modOnly ? isMod(window.QueUp.session.id) : true;
      if (allowed) turnOn(true);
    }
  });

  onDestroy(() => {
    if (settings.options[id]) {
      turnOff();
    }
  });

  function openEditModal() {
    updateModalState({
      title: t(customize.title),
      content: t(customize.content),
      placeholder: t(customize.placeholder),
      defaultValue: customize.defaultValue ? t(customize.defaultValue) : '',
      maxlength: customize.maxlength,
      value: settings.custom[id] || '',
      validation: customize.validation,
      onConfirm: (value) => {
        saveSetting('custom', id, value);

        // if the value is empty and there is no default value, then we
        // turn off the feature
        if (value.trim() === '' && !customize.defaultValue) {
          saveSetting('option', id, false);
          turnOff();
        }

        if (typeof customize.onConfirm === 'function') {
          customize.onConfirm(value);
        }
      },
      onCancel: () => {
        // if the saved custom setting is empty and there is no default value,
        // then we turn off the feature
        if (
          !customize.defaultValue &&
          (typeof settings.custom[id] === 'undefined' ||
            settings.custom[id] === '')
        ) {
          saveSetting('option', id, false);
          turnOff();
        }
        if (typeof customize.onCancel === 'function') customize.onCancel();
      },
    });

    modalState.open = true;
  }
</script>

<li
  id={`dubplus-${id}`}
  title={t(description)}
  class:disabled={modOnly ? !isMod(window.QueUp.session.id) : false}
>
  <Switch
    disabled={modOnly ? !isMod(window.QueUp.session.id) : false}
    label={t(label)}
    onToggle={(state) => {
      // When turning on a feature that requires a custom value, and that
      // value hasn't been set by the user yet, then we popup the modal
      if (customize && state === true && !settings.custom[id]) {
        openEditModal();
        return;
      }
      saveSetting('option', id, state);
      if (state) {
        turnOn();
      } else {
        turnOff();
      }
    }}
    optionId={id}
  />
  {#if customize}
    <button onclick={openEditModal} type="button">
      <IconPencil />
      <span class="sr-only">{t('MenuItem.edit')}</span>
    </button>
  {/if}
  {#if secondaryAction}
    <button
      onclick={secondaryAction.onClick}
      type="button"
      title={t(secondaryAction.description)}
    >
      <SecondaryIcon />
      <span class="sr-only">{t(secondaryAction.description)}</span>
    </button>
  {/if}
</li>

<style>
  li {
    display: flex;
    align-items: center;
    margin: 10px 0;
    justify-content: space-between;
  }

  button {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    color: #fff;
    cursor: pointer;

    height: 13px;
    width: 13px;
  }
  button :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
  button :global(path) {
    fill: var(--dubplus-text-color);
  }

  .disabled {
    opacity: 0.5;
  }
  .disabled:hover {
    cursor: not-allowed;
  }
</style>
