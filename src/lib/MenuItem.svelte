<script>
  import Modal from "./Modal.svelte";
  import Switch from "./Switch.svelte";

  /**
   * @typedef {object} MenuItemProps
   * @property {string} id
   * @property {string} label
   * @property {string} description
   * @property {(state: boolean) => void} onToggle
   * @property {(value: string) => void} [onSaveCustom]
   * @property {import('../global').ModalProps} [modalProps]
   */

  /**
   * @type {MenuItemProps} props
   */
  let {
    id,
    label,
    description,
    onSaveCustom,
    modalProps,
    onToggle
  } = $props();
  let showModal = $state(false)
</script>

<li {id} title={description}>
  <Switch 
    label={label} 
    onToggle={onToggle}
   />
  {#if onSaveCustom}
    <button 
      onclick={() => showModal = true}
      type="button" 
      class="fa fa-pencil">
    </button>
    <Modal
      {...modalProps}
      show={showModal}
      onConfirm={(value) => {
        onSaveCustom(value);
        showModal = false;
      }}
      onCancel={() => showModal = false}
    />
  {/if}
</li>

<style>
  li {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
</style>
