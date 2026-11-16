<script>
  import { settings, saveSetting } from '../stores/settings.svelte';
  import ChevronDown from '../svg/ChevronDown.svelte';
  import ChevronRight from '../svg/ChevronRight.svelte';

  /**
   * @typedef {object} MenuHeaderProps
   * @property {string} props.settingsId
   * @property {string} props.name
   */

  /** @type {MenuHeaderProps} */
  let { settingsId, name } = $props();
  let expanded = $state(true);

  $effect(() => {
    if (settings.menu[settingsId] === 'closed') {
      expanded = false;
    } else {
      expanded = true;
    }
  });

  function toggle() {
    settings.menu[settingsId] =
      settings.menu[settingsId] === 'closed' ? 'open' : 'closed';

    saveSetting('menu', settingsId, settings.menu[settingsId]);
  }
</script>

<button
  id={`dubplus-menu-section-header-${settingsId}`}
  type="button"
  class="dubplus-menu-section-header"
  onclick={toggle}
  aria-expanded={expanded}
  aria-controls={`dubplus-menu-section-${settingsId}`}
>
  <p>{name}</p>
  {#if expanded}
    <ChevronDown />
  {:else}
    <ChevronRight />
  {/if}
</button>

<style>
  button {
    border: none;
    display: flex;
    align-items: center;
    width: 100%;
    color: inherit;
    text-align: left;
    border-bottom: 1px solid #222;
    overflow: hidden;
    padding: 10px 15px;
    cursor: pointer;
    background-color: #202020;
  }
  button p {
    width: 90%;
    flex: 1;
    margin: 0;
    line-height: 1;
  }
</style>
