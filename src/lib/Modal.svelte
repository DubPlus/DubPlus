<script>
  import { onMount } from 'svelte';
  import { modalState } from './stores/modalState.svelte';
  import { t } from './stores/i18n.svelte';

  let errorMessage = $state('');

  /** @type {HTMLDialogElement} */
  let dialog; // Reference to the dialog tag

  onMount(() => {
    dialog = /**@type {HTMLDialogElement}*/ (
      document.getElementById('dubplus-dialog')
    );

    // this handles the closing via the ESC key
    dialog.addEventListener('close', () => {
      modalState.open = false;
    });
  });

  $effect(() => {
    if (modalState.open && dialog && !dialog.open) {
      dialog.showModal();
    }
  });
</script>

<dialog id="dubplus-dialog" class="dp-modal">
  <h1>{modalState.title}</h1>
  <div class="dp-modal--content content">
    <p>{modalState.content}</p>
    {#if modalState.defaultValue}
      <div class="default">
        <span class="default-label">{t('Modal.defaultValue')}:</span>
        <span class="default-value">
          {modalState.defaultValue}
        </span>
      </div>
    {/if}
    {#if modalState.placeholder || modalState.value}
      <textarea
        bind:value={modalState.value}
        placeholder={modalState.placeholder}
        maxlength={modalState.maxlength < 999 ? modalState.maxlength : 999}
      >
      </textarea>
    {/if}
    {#if errorMessage}
      <p class="dp-modal--error">{errorMessage}</p>
    {/if}
  </div>
  <div class="dp-modal--buttons buttons">
    {#if typeof modalState.onConfirm === 'function'}
      <button
        class="dp-modal--cancel cancel"
        onclick={() => {
          dialog.close();
          modalState.open = false;
          errorMessage = '';
          if (typeof modalState.onCancel === 'function') {
            modalState.onCancel();
          }
        }}
        >{t('Modal.cancel')}
      </button>
      <button
        class="dp-modal--confirm confirm"
        onclick={() => {
          const isValidOrErrorMessage = modalState.validation(modalState.value);
          if (isValidOrErrorMessage === true) {
            dialog.close();
            modalState.open = false;
            modalState.onConfirm(modalState.value);
            errorMessage = '';
          } else {
            errorMessage = isValidOrErrorMessage;
          }
        }}
        >{t('Modal.confirm')}
      </button>
    {:else}
      <button
        onclick={() => {
          dialog.close();
          modalState.open = false;
          errorMessage = '';
        }}
        class="dp-modal--cancel cancel"
        >{t('Modal.close')}
      </button>
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
    font-family: var(--dubplus-font-family);
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
    font-size: 16px;
  }

  .content p {
    margin: 0;
    padding: 0 16px 16px;
  }

  .default {
    font-size: 1rem;
    margin: 6px 10px;
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .default-label {
    font-weight: bold;
    border-radius: 5px;
    padding: 10px;
  }

  .default-value {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    padding: 10px;
    flex: 1;
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

  .dp-modal--error {
    color: red;
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
