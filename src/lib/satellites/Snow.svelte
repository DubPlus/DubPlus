<script>
  import { teleport } from "../actions/teleport.svelte";
  import { createSnow } from "../../external/pure-snow";
  import { onDestroy, onMount } from "svelte";

  onMount(() => {
    createSnow();
    window.addEventListener('resize', createSnow);
  });

  onDestroy(() => {
    window.removeEventListener('resize', createSnow);
  });

</script>

<div use:teleport={{to: "body"}} id="snow-container"></div>

<style>
  #snow-container {
    height: 100vw;
    width: 100vw;
  }
  :global(.snowflake) {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    filter: drop-shadow(0 0 10px white);
  }
</style>
