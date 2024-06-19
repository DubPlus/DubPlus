<script>
  import Switch from "../Switch.svelte";
  import { onMount } from "svelte";
  import { saveSetting, settings } from "../settings.svelte";
  import { modalState } from "../modalState.svelte";

  /**
   * @typedef {object} MenuItemProps
   * @property {string} id
   * @property {string} label
   * @property {string} description
   * @property {(state: boolean) => void} onToggle
   * @property {() => void} [init]
   * @property {import('../../global').ModalProps} [customize]
   */

  /**
   * @type {MenuItemProps}
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
    modalState.id = customize.id;
    modalState.title = customize.title;
    modalState.content = customize.content;
    modalState.placeholder = customize.placeholder;
    modalState.maxlength = customize.maxlength;
    modalState.value = settings.custom[customize.id] || "";
    modalState.onConfirm = (value) => {
      saveSetting("custom", modalState.id, value);
    };
    modalState.onCancel = () => {
      modalState.open = false;
    };

    // this must always go last to ensure the data above
    // is set before the modal is opened
    modalState.open = true;
  }
</script>

<li {id} title={`${isOn} - ${description}`}>
  <Switch
    {label}
    onToggle={(state) => {
      onToggle(state);
      isOn = state ? "ON" : "OFF";
    }}
    isOn={settings.options[id]}
  />
  {#if customize}
    <button onclick={openEditModal} type="button" class="fa fa-pencil">
      <span class="sr-only">Edit</span>
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
