<script>
  import { teleport } from "../actions/teleport.js";
  import { getDubCount } from "../stores/dubsState.svelte";

  /**
   * @typedef {object} DubsInfoProps
   * @property {"updub" | "downdub" | "grab"} dubType
   * @property {string} selector
   */

  /**
   * @type {DubsInfoProps}
   */
  let { dubType, selector } = $props();

  let dubData = $derived(getDubCount(dubType));

  /**
   * @param {string} username
   */
  function handleClick(username) {
    const chatInput = /**@type {HTMLInputElement}*/ (
      document.querySelector("#chat-txt-message")
    );
    chatInput.value = `@${username} `;
    chatInput.focus();
  }
</script>

<ul
  use:teleport={{ to: selector }}
  id="dubinfo-preview"
  class={`dubinfo-show dubplus-${dubType}-hover`}
  class:dubplus-no-dubs={dubData.length === 0}
>
  {#if dubData.length > 0}
    {#each dubData as dub}
      <li
        class={`preview-dubinfo-item users-previews dubplus-${dubType}-hover`}
      >
        <div class="dubinfo-image">
          <img
            src={`https://api.queup.net/user/${dub.userid}/image`}
            alt="User Avatar"
          />
        </div>
        <button
          type="button"
          onclick={() => handleClick(dub.username)}
          class="dubinfo-text"
        >
          @{dub.username}
        </button>
      </li>
    {/each}
  {:else}
    <li>
      <!-- TODO: move text to translate.js -->
      No updubs have been casted yet!
    </li>
  {/if}
</ul>

<style>
</style>
