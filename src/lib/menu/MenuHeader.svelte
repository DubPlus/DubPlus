<script>
  import { settings, saveSetting } from "../settings.svelte";
  /**
   * @typedef {object} MenuHeaderProps
   * @property {string} props.settingsId
   * @property {string} props.name
   */

  /** @type {MenuHeaderProps} */
  let { settingsId, name } = $props();
  let arrow = $state("down");
  let expanded = $state(true);

  $effect(() => {
    if (settings.menu[settingsId] === "closed") {
      arrow = "right";
      expanded = false;
    } else {
      arrow = "down";
      expanded = true;
    }
  });

  function toggle() {
    settings.menu[settingsId] =
      settings.menu[settingsId] === "closed" ? "open" : "closed";

    saveSetting("menu", settingsId, settings.menu[settingsId]);
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
  <span class="fa fa-angle-{arrow}"></span>
  <p>{name}</p>
</button>

<style>
  button {
    border: none;
    display: block;
    width: 100%;
    color: inherit;
    text-align: left;
    border-bottom: 1px solid #222;
    overflow: hidden;
    padding: 10px 15px;
    cursor: pointer;
    background-color: #202020;
  }
  button span {
    display: block;
    width: 10%;
    float: left;
  }
  button p {
    width: 90%;
    float: left;
    margin: 0;
    line-height: 1;
  }
</style>
