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
</style>
