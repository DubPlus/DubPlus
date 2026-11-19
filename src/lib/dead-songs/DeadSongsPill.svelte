<script>
  import { t } from '../stores/i18n.svelte';
  import { deadSongs, restore } from './deadSongsState.svelte.js';

  const finished = $derived(!deadSongs.scanning && deadSongs.end !== null);
</script>

{#if deadSongs.open && deadSongs.minimized}
  <button
    type="button"
    class={['dp-ds-pill', { finished }]}
    title={t('deadsongs.pill.tooltip')}
    onclick={restore}
  >
    {#if finished}
      {t('deadsongs.pill.done', {
        count: deadSongs.findings.filter((r) => r.result !== 'unknown').length,
      })}
    {:else}
      {t('deadsongs.pill.progress', {
        checked: deadSongs.checked,
        total: deadSongs.total,
      })}
    {/if}
  </button>
{/if}

<style>
  .dp-ds-pill {
    position: fixed;
    top: calc(anchor(--queup-player-controls bottom) + 16px);
    right: anchor(--queup-player-controls right);
    z-index: 1000;
    border: none;
    border-radius: 9999px;
    padding: 8px 16px;
    font-weight: bold;
    font-family: var(--dubplus-font-family);
    background: #333;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }

  .dp-ds-pill.finished {
    background: #22c55e;
    color: #000;
    animation: dp-ds-pulse 1.2s ease-in-out infinite;
  }

  @keyframes dp-ds-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.8);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dp-ds-pill.finished {
      animation: none;
    }
  }
</style>
