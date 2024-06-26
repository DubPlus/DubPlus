<script>
  import { onDestroy, onMount } from "svelte";
  import { teleport } from "../actions/teleport.js";
  import { userImage } from "../api.js";
  import { getDubCount } from "../stores/dubsState.svelte";
  import { logError } from "../../utils/logger.js";
  import { t } from "../stores/i18n.svelte.js";

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
    positionBottom = rect.height - 2;
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
    chatInput.value = `${chatInput.value}@${username} `.trimStart();
    chatInput.focus();
  }
</script>

<div
  id={`dubplus-${dubType}s-container`}
  use:teleport={{ to: "body" }}
  class={`dubplus-dubs-container dubplus-${dubType}s-container`}
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
        {#if dubType === "updub" || dubType === "downdub"}
          {t("dubs-hover.no-votes", { dubType })}
        {:else}
          {t("dubs-hover.no-grabs", { dubType })}
        {/if}
      </li>
    {/if}
  </ul>
</div>

<style>
  .dubplus-dubs-container {
    position: fixed;
    overflow-y: auto;
    overflow-x: visible;
    height: 150px;
    width: 180px;
    z-index: 100001;
    background-color: rgba(0, 0, 0, 0.9);
    border: 1px solid white;
    border-radius: 0.4rem 0.4rem 0 0;
    border-bottom: none;
  }
  :global(.dubplus-updubs-container) {
    border-color: var(--queup-aqua) !important;
  }
  :global(.dubplus-downdubs-container) {
    border-color: var(--queup-magenta) !important;
  }
  :global(.dubplus-grabs-container) {
    border-color: var(--queup-green) !important;
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
  .preview-dubinfo-item {
    display: flex;
    align-items: center;
    padding: 6px 10px;
  }

  .dubinfo-image {
    width: 1.4em;
    border-radius: 10%;
    overflow: hidden;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  button {
    appearance: none;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    text-align: left;
    flex: 1;

    font-size: 0.8em;
    padding-left: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
