<script>
  import Switch from "./Switch.svelte";
  import { onMount } from "svelte";
  import { saveSetting, settings } from "../stores/settings.svelte";
  import { modalState, updateModalState } from "../stores/modalState.svelte";
  import { t } from "../stores/i18n.svelte";
  /**
   * @typedef {object} MenuSwitchProps
   * @property {string} id
   * @property {string} label
   * @property {string} description
   * @property {(state: boolean) => void} onToggle
   * @property {() => void} [init]
   * @property {import('../../global').ModalProps} [customize]
   * 
   */

  /**
   * @type {MenuSwitchProps}
   */
  let { id, label, description, customize, onToggle, init } = $props();

  let isOn = $state(settings.options[id] ? "ON" : "OFF");

  onMount(() => {
    if (init) init();

    if (settings.options[id]) {
      onToggle(true);
    }
  });

  function openEditModal() {
    updateModalState({
      id: customize.id,
      title: t(customize.title),
      content: t(customize.content),
      placeholder: t(customize.placeholder),
      maxlength: customize.maxlength,
      value: settings.custom[customize.id] || "",
      onConfirm: (value) => {
        if (
          typeof customize.onConfirm === "function" &&
          customize.onConfirm(value)
        ) {
          saveSetting("custom", customize.id, value);
        }
        return true;
      },
      onCancel: () => {
        modalState.open = false;
      },
    });

    modalState.open = true;
  }
</script>

<li {id} title={`${isOn} - ${t(description)}`}>
  <Switch
    label={t(label)}
    onToggle={(state) => {
      onToggle(state);
      isOn = state ? t("Switch.on") : t("Switch.off");
    }}
    isOn={settings.options[id]}
  />
  {#if customize}
    <button onclick={openEditModal} type="button" class="fa fa-pencil">
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

    height: 100%;
    width: 9%;
  }
</style>
