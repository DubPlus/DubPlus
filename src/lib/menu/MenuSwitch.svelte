<script>
  import Switch from "./Switch.svelte";
  import IconPencil from "../svg/IconPencil.svelte";
  import { onMount } from "svelte";
  import { saveSetting, settings } from "../stores/settings.svelte";
  import { modalState, updateModalState } from "../stores/modalState.svelte";
  import { t } from "../stores/i18n.svelte";
  import { isMod } from "../../utils/modcheck";
  /**
   * @typedef {object} MenuSwitchProps
   * @property {string} id
   * @property {string} label
   * @property {string} description
   * @property {boolean} [modOnly]
   * @property {(state: boolean, onMount?: boolean) => void} onToggle `onMount` is `true`
   * when run from component onMount, `false` when run from a user action
   * @property {() => void} [init] always runs when the component mounts, whether
   * the switch is on or off
   * @property {import('../../global').ModalProps} [customize]
   *
   */

  /**
   * @type {MenuSwitchProps}
   */
  let { id, label, description, customize, onToggle, init, modOnly } = $props();

  onMount(() => {
    if (init) init();

    if (settings.options[id]) {
      // check user mod status if this is a mod only feature
      const status = modOnly ? isMod(window.QueUp.session.id) : true;
      onToggle(status, true);
    }
  });

  function openEditModal() {
    updateModalState({
      title: t(customize.title),
      content: t(customize.content),
      placeholder: t(customize.placeholder),
      maxlength: customize.maxlength,
      value: settings.custom[id] || "",
      validation: customize.validation,
      onConfirm: (value) => {
        saveSetting("custom", id, value);
        if (typeof customize.onConfirm === "function") {
          customize.onConfirm(value);
        }
      },
      onCancel: () => {
        if (typeof customize.onCancel === "function") customize.onCancel();
      },
    });

    modalState.open = true;
  }
</script>

<li 
  {id} 
  title={t(description)} 
  class:disabled={modOnly ? !isMod(window.QueUp.session.id) : false}>
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
      onToggle(state);
    }}
    isOn={settings.options[id]}
  />
  {#if customize}
    <button onclick={openEditModal} type="button">
      <IconPencil />
      <span class="sr-only">{t("MenuItem.edit")}</span>
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
