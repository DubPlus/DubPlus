<script>
  import { teleport } from '../actions/teleport.svelte';
  import { createSnow } from '../../scripts/pure-snow';
  import { onDestroy, onMount } from 'svelte';

  onMount(() => {
    createSnow();
    window.addEventListener('resize', createSnow);
  });

  onDestroy(() => {
    window.removeEventListener('resize', createSnow);
  });
</script>

<div use:teleport={{ to: 'body' }} id="snow-container"></div>

<style>
  #snow-container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
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
