<script>
  import Logo from "./Logo.svelte";
  import { teleport } from "./actions/teleport";
</script>

<button
  use:teleport={".header-right-navigation"}
  type="button"
  class="dubplus-icon"
  onclick={() => {
    document
      .querySelector(".dubplus-menu")
      .classList.toggle("dubplus-menu-open");
  }}
>
  <Logo />
</button>

<style>
  /* This is the Dub+ icon in the top right that's always showing
and triggers the open/close of Dub+ */
  .dubplus-icon {
    /* clear button styles */
    background: none;
    border: none;
    appearance: none;
    padding: none;

    width: 26px;
    font-size: 1.2rem;
    line-height: 1.2;
    cursor: pointer;
    position: relative;
    display: inline-block;
    vertical-align: bottom;
    margin-left: 1rem;

  }
</style>
