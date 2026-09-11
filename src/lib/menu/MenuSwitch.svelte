<script>
  import Switch from './Switch.svelte';
  import IconPencil from '../svg/IconPencil.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { saveSetting, settings } from '../stores/settings.svelte';
  import { t } from '../stores/i18n.svelte';
  import { isMod } from '../../utils/modcheck';
  import { getUserId } from '../queup.v2';
  import { openEditModal } from '../../utils/module-setup-utils';

  /**
   * @typedef {object} MenuSwitchProps
   * @property {string} id
   * @property {string} label
   * @property {string} description
   * @property {boolean} [modOnly]
   * @property {(onLoad?: boolean) => void} [turnOn] runs when the switch is turned on
   * @property {() => void} [turnOff] runs when the switch is turned off
   * @property {() => void} [init] always runs when the component mounts, whether
   * the switch is on or off
   * @property {import('../../types/global').ModalProps} [customize]
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

  // svelte-ignore state_referenced_locally (this won't change after first mount)
  const SecondaryIcon = secondaryAction?.icon || IconPencil;

  onMount(() => {
    if (init) init();

    if (settings.options[id]) {
      // check user mod status if this is a mod only feature
      const allowed = modOnly ? isMod(getUserId()) : true;
      if (allowed) turnOn?.(true);
    }
  });

  onDestroy(() => {
    if (settings.options[id]) {
      turnOff?.();
    }
  });
</script>

<li
  id={`dubplus-${id}`}
  title={t(description)}
  class:disabled={modOnly ? !isMod(getUserId()) : false}
>
  <div class="menu-switch-content">
    <Switch
      disabled={modOnly ? !isMod(getUserId()) : false}
      label={t(label)}
      onToggle={(state) => {
        // When turning on a feature that requires a custom value, and that
        // value hasn't been set by the user yet, then we popup the modal
        if (customize && state === true && !settings.custom[id]) {
          openEditModal(id, customize, turnOff);
          return;
        }
        saveSetting('options', id, state);
        if (state) {
          turnOn?.();
        } else {
          turnOff?.();
        }
      }}
      optionId={id}
    />
    {#if customize}
      <button
        onclick={() => openEditModal(id, customize, turnOff)}
        type="button"
      >
        <IconPencil />
        <span class="sr-only">{t('MenuItem.edit')}</span>
      </button>
    {/if}
    {#if secondaryAction}
      <button
        onclick={secondaryAction.onClick}
        type="button"
        disabled={!settings.options[id]}
        title={t(secondaryAction.description)}
      >
        <SecondaryIcon />
        <span class="sr-only">{t(secondaryAction.description)}</span>
      </button>
    {/if}
  </div>
  <div class="menu-switch-command">
    /{id}
  </div>
</li>

<style>
  li {
    margin: 10px 0;
  }

  .menu-switch-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu-switch-command {
    margin-left: calc(29px + 11px);
    font-size: 0.9em;
    color: rgb(var(--dubplus-text-color) / 0.6);
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
    fill: rgb(var(--dubplus-text-color));
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .disabled {
    opacity: 0.5;
  }
  .disabled:hover {
    cursor: not-allowed;
  }
</style>
