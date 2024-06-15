<script>
  import { onMount } from "svelte";
  /**
   * @typedef {object} ModalProps
   * @property {string} [title]
   * @property {string} [content] text that goes under the title
   * @property {string} [value] value to be displayed and edited in the textarea
   * @property {string} [placeholder] placeholder text for the textarea
   * @property {number} [maxlength]
   * @property {() => void} [onConfirm]
   * @property {boolean} show
   */

  /** @type {ModalProps} */
  let {
    title = "Dub+",
    content = "",
    value = "",
    placeholder = "",
    maxlength = 999,
    onConfirm,
    show
  } = $props();

  /** @type {HTMLDialogElement} */
  let dialog; // Reference to the dialog tag

  onMount(() => {
    dialog = /**@type {HTMLDialogElement}*/ (
      document.getElementById("dubplus-dialog")
    );
  });

  $effect(() => {
    if (show && dialog) {
      dialog.showModal();
    }
	});
</script>

<dialog id="dubplus-dialog" class="dp-modal">
  <h1>{title}</h1>
  <div class="dp-modal--content content">
    <p>{content}</p>
    {#if placeholder || value}
      <textarea {placeholder} {maxlength}>
        {value}
      </textarea>
    {/if}
  </div>
  <div class="dp-modal--buttons buttons">
    {#if typeof onConfirm === "function"}
      <button
        onclick={() => {
          dialog.close();
          show = false;
        }}
        class="dp-modal--cancel cancel">cancel</button
      >
      <button
        onclick={() => {
          dialog.close();
          show = false;
          onConfirm();
        }}
        class="dp-modal--confirm confirm">okay</button
      >
    {:else}
      <button
        onclick={() => {
          dialog.close();
          show = false;
        }}
        class="dp-modal--cancel cancel">close</button
      >
    {/if}
  </div>
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
    animation: fade-in 250ms;
  }

  dialog {
    box-shadow: 0 0 5px #000;
    background: #111;
    color: #fff;
    width: 500px;
    font-family: 'Trebuchet MS', Helvetica, sans-serif;
    padding: 0;
    border: none;
  }

  h1 {
    height: 54px;
    background: #333;
    margin: 0;
    text-align: center;
    padding-top: 12px;
    font-weight: 400;
  }
  .content {
    padding: 27px 0;
    font-size: 14px;
  }

  .content p {
    margin: 0;
    padding: 0 16px 16px;
  }

  textarea {
    width: 100% !important;
    min-height: 108px !important;
    background: #333;
    padding: 16px;
    color: white;
    border: transparent;
    font-size: inherit;
    resize: vertical;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
  }

  button {
    width: 50%;
    text-align: center;
    padding: 1em 0;
    border: none;
    text-transform: uppercase;
    color: #eee;
    font-size: 16px;
    cursor: pointer;
  }

  .confirm {
    background: #0ff;
    color: #555;
  }

  .cancel {
    background: #333;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
