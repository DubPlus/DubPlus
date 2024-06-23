<script>
  import { onDestroy, onMount } from "svelte";
  import { teleport } from "../actions/teleport.js";
  import { userImage } from "../api.js";
  import { getDubCount } from "../stores/dubsState.svelte";
  import { logError } from "../../utils/logger.js";

  /**
   * @typedef {object} DubsInfoProps
   * @property {"updub" | "downdub" | "grab"} dubType
   */

  /**
   * @type {DubsInfoProps}
   */
  let { dubType } = $props();

  let dubData = $derived(getDubCount(dubType));
  let positionRight = $state(0);
  let positionBottom = $state(0);
  let display = $state("none");

  /**
   * @type {HTMLElement}
   */
  let hoverTarget;

  function onHover() {
    const rect = hoverTarget.getBoundingClientRect();
    positionRight = window.innerWidth - rect.right;
    positionBottom = rect.height - 1;
    display = "block";
  }

  /**
   * @param {MouseEvent} e
   */
  function onLeave(e) {
    if (
      e.relatedTarget &&
      /**@type {HTMLDivElement}*/ (e.relatedTarget).closest(
        ".dubplus-dubs-container",
      )
    ) {
      return;
    }
    display = "none";
  }

  onMount(() => {
    hoverTarget = document.querySelector(`.dubplus-${dubType}s-hover`);
    if (hoverTarget) {
      hoverTarget.addEventListener("mouseenter", onHover);
      hoverTarget.addEventListener("mouseleave", onLeave);
    } else {
      logError(`Could not find hover target for ${dubType} in onMount`);
    }
  });

  onDestroy(() => {
    if (hoverTarget) {
      hoverTarget.removeEventListener("mouseenter", onHover);
      hoverTarget.removeEventListener("mouseleave", onLeave);
    } else {
      logError(`Could not find hover target for ${dubType} in onDestroy`);
    }
  });

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

<div
  id={`dubplus-${dubType}s-container`}
  use:teleport={{ to: "body" }}
  class="dubplus-dubs-container"
  style={`bottom: ${positionBottom}px; right: ${positionRight}px; display: ${display};`}
  onmouseleave={() => (display = "none")}
  role="none"
>
  <ul
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
            <img src={userImage(dub.userid)} alt="User Avatar" />
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
        No {dubType}s have been casted yet!
      </li>
    {/if}
  </ul>
</div>

<style>
  .dubplus-dubs-container {
    display: none;
    position: fixed;
    overflow-y: auto;
    overflow-x: visible;
    height: 150px;
    width: 200px;
    z-index: 100001;
    background-color: rgba(0, 0, 0, 0.9);
    border: 1px solid white;
  }
  ul {
    display: block;
    padding: 0;
    list-style-type: none;
    margin: 0;
    width: 100%;
    color: white;
    height: 100%;
  }
  .dubplus-no-dubs {
    display: flex;
    align-items: center;
    justify-self: center;
    text-align: center;
  }
</style>
