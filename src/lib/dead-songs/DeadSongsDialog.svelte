<script>
  import { onDestroy } from 'svelte';
  import { t } from '../stores/i18n.svelte';
  import ExternalLink from '../svg/ExternalLink.svelte';
  import {
    deadSongs,
    startScan,
    stopScan,
    minimize,
    closeDeadSongs,
    deleteSelected,
  } from './deadSongsState.svelte.js';
  import { estimateScanSeconds } from './scan.js';

  let picked = $state('');
  // playlists load after the dialog opens; default to the first one
  const selectedId = $derived(picked || deadSongs.playlists[0]?.id || '');
  let confirming = $state(false);

  const groups = $derived.by(() => {
    /** @type {{id: string, name: string, rows: typeof deadSongs.findings}[]} */
    const list = [];
    for (const row of deadSongs.findings) {
      let group = list.find((g) => g.id === row.playlist.id);
      if (!group) {
        group = { id: row.playlist.id, name: row.playlist.name, rows: [] };
        list.push(group);
      }
      group.rows.push(row);
    }
    return list;
  });

  const selectable = $derived(
    deadSongs.findings.filter((r) => r.result !== 'unknown'),
  );
  const selected = $derived(selectable.filter((r) => r.selected));
  const selectedPlaylistCount = $derived(
    groups.filter((g) => g.rows.some((r) => r.selected)).length,
  );

  // null hides the estimate: scans under a minute don't need one
  const estimate = $derived.by(() => {
    const seconds = estimateScanSeconds(deadSongs.total);
    if (seconds < 60) return null;
    const total = Math.round(seconds / 60);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    return hours > 0
      ? t('deadsongs.estimate.hours', { hours, minutes })
      : t('deadsongs.estimate.minutes', { minutes });
  });

  /** @param {HTMLDialogElement} node */
  function syncOpen(node) {
    const shouldShow = deadSongs.open && !deadSongs.minimized;
    if (shouldShow && !node.open) node.showModal();
    if (!shouldShow && node.open) node.close();
  }

  // leaving the room unmounts Dub+, which stops the scan
  onDestroy(() => closeDeadSongs({ force: true }));

  /** @param {{type: string | null, fkid: string | null}} song */
  function songLink(song) {
    return String(song.type).toLowerCase() === 'soundcloud'
      ? `https://api.soundcloud.com/tracks/${song.fkid}`
      : `https://www.youtube.com/watch?v=${song.fkid}`;
  }

  /** @param {boolean} value */
  function selectAll(value) {
    for (const row of selectable) row.selected = value;
  }

  async function confirmDelete() {
    confirming = false;
    await deleteSelected();
  }

  function endMessage() {
    if (deadSongs.end === 'error') {
      return t('deadsongs.end.error', { error: deadSongs.error ?? '' });
    }
    return t(`deadsongs.end.${deadSongs.end}`);
  }
</script>

<dialog
  {@attach syncOpen}
  class="dp-dead-songs"
  onclose={() => {
    // minimizing closes the element too, but keeps everything running
    if (deadSongs.minimized) return;
    // the browser can force-close (e.g. repeated ESC) even while deleting;
    // fall back to the pill so the deletes stay visible
    if (deadSongs.deleting) deadSongs.minimized = true;
    else closeDeadSongs();
  }}
  oncancel={(e) => {
    if (deadSongs.deleting) e.preventDefault();
  }}
>
  <div class="dp-ds-header flex items-center justify-between px-4 py-3">
    <h1 class="m-0 text-xl font-normal">{t('deadsongs.title')}</h1>
    <div class="flex gap-2">
      <!-- nothing to minimize until a scan has started -->
      {#if deadSongs.scanning || deadSongs.end}
        <button type="button" class="dp-ds-btn" onclick={minimize}>
          {t('deadsongs.minimize')}
        </button>
      {/if}
      <button
        type="button"
        class="dp-ds-btn"
        disabled={deadSongs.deleting}
        onclick={() => closeDeadSongs()}
      >
        {t('Modal.close')}
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-3 p-4">
    {#if deadSongs.scanning && estimate}
      <p class="dp-ds-estimate">
        {t('deadsongs.estimate', { time: estimate, total: deadSongs.total })}
      </p>
    {/if}

    <div class="flex flex-wrap items-center gap-2">
      <select
        value={selectedId}
        onchange={(e) => (picked = e.currentTarget.value)}
        class="min-w-0 flex-1 rounded p-2"
        disabled={deadSongs.scanning}
      >
        {#each deadSongs.playlists as playlist (playlist.id)}
          <option value={playlist.id}>{playlist.name}</option>
        {/each}
      </select>
      <button
        type="button"
        class="dp-ds-btn"
        disabled={deadSongs.scanning || deadSongs.deleting || !selectedId}
        onclick={() => startScan([selectedId])}
      >
        {t('deadsongs.scan')}
      </button>
      <button
        type="button"
        class="dp-ds-btn"
        disabled={deadSongs.scanning ||
          deadSongs.deleting ||
          deadSongs.playlists.length === 0}
        onclick={() => startScan(deadSongs.playlists.map((p) => p.id))}
      >
        {t('deadsongs.scanAll')}
      </button>
    </div>

    {#if deadSongs.scanning}
      <div class="flex items-center justify-between">
        <span>
          {t('deadsongs.progress', {
            checked: deadSongs.checked,
            total: deadSongs.total,
          })}
        </span>
        <button type="button" class="dp-ds-btn" onclick={stopScan}>
          {t('deadsongs.stop')}
        </button>
      </div>
    {:else if deadSongs.end}
      <p class={['m-0', { 'text-red-400': deadSongs.end !== 'done' }]}>
        {endMessage()}
        {#if deadSongs.end === 'done' && deadSongs.findings.length === 0}
          — {t('deadsongs.none')}
        {/if}
      </p>
    {:else if deadSongs.error}
      <p class="m-0 text-red-400">{deadSongs.error}</p>
    {/if}

    {#if groups.length > 0}
      <div class="flex gap-3 text-sm">
        <button
          type="button"
          class="dp-ds-link"
          onclick={() => selectAll(true)}
        >
          {t('deadsongs.selectAll')}
        </button>
        |
        <button
          type="button"
          class="dp-ds-link"
          onclick={() => selectAll(false)}
        >
          {t('deadsongs.selectNone')}
        </button>
      </div>

      <div class="dp-ds-results">
        {#each groups as group (group.id)}
          <div
            class="flex justify-between mb-1 mt-3 text-base font-bold border-b"
          >
            <h2 class="m-0">{group.name}</h2>
            <span>Reason</span>
          </div>
          <ul class="m-0 list-none p-0">
            {#each group.rows as row (row.song.entryId)}
              <li class="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  bind:checked={row.selected}
                  disabled={row.result === 'unknown' || deadSongs.deleting}
                />
                <span class="min-w-0 flex-1 truncate" title={row.song.name}>
                  {row.song.name ?? row.song.fkid}
                </span>
                <span class="text-sm text-white/60">
                  {t(`deadsongs.reason.${row.result}`)}
                </span>
                <a
                  class="dp-ds-song-link text-sm"
                  href={songLink(row.song)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink />
                </a>
                {#if row.error}
                  <span class="text-sm text-red-400">{row.error}</span>
                {/if}
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    {/if}

    {#if deadSongs.summary}
      <p class="m-0">
        {t('deadsongs.summary', {
          deleted: deadSongs.summary.deleted,
          failed: deadSongs.summary.failed,
        })}
      </p>
    {/if}

    {#if selectable.length > 0}
      {#if confirming}
        <p class="m-0 font-bold">
          {t('deadsongs.confirm', {
            count: selected.length,
            playlists: selectedPlaylistCount,
          })}
        </p>
      {/if}
      <div class="dp-ds-actions">
        <p class="dp-ds-warning">{t('deadsongs.warning')}</p>
        {#if confirming}
          <button
            type="button"
            class="dp-ds-btn"
            onclick={() => (confirming = false)}
          >
            {t('Modal.cancel')}
          </button>
          <button
            type="button"
            class="dp-ds-btn dp-ds-danger"
            onclick={confirmDelete}
          >
            {t('deadsongs.delete')}
          </button>
        {:else}
          <button
            type="button"
            class="dp-ds-btn dp-ds-danger"
            disabled={selected.length === 0 ||
              deadSongs.scanning ||
              deadSongs.deleting}
            onclick={() => (confirming = true)}
          >
            {t('deadsongs.delete')}
          </button>
        {/if}
      </div>
    {/if}
  </div>
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
  }

  dialog {
    box-shadow: 0 0 5px #000;
    background: #111;
    color: #fff;
    width: 640px;
    max-width: calc(100vw - 32px);
    font-family: var(--dubplus-font-family);
    padding: 0;
    border: none;
    /* native controls (select, its popup, checkboxes, scrollbars) render dark */
    color-scheme: dark;
  }

  /* scoped CSS, not Tailwind arbitrary values: these keep Delete on screen */
  .dp-ds-results {
    max-height: 50vh;
    overflow-y: auto;
  }

  .dp-ds-estimate {
    margin: 0;
    padding: 10px 14px;
    border-radius: 4px;
    border-left: 3px solid var(--dubplus-secondary-color);
    background: rgba(255, 255, 255, 0.05);
    color: #ccc;
  }

  /* warning on the left, delete button(s) on the right, one line */
  .dp-ds-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dp-ds-warning {
    flex: 1;
    margin: 0;
    font-size: 0.9em;
    color: #ccc;
  }

  .dp-ds-btn {
    background: #333;
    color: #eee;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
  }

  .dp-ds-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dp-ds-danger:not(:disabled) {
    background: #b91c1c;
  }

  .dp-ds-header {
    background: #333;
  }

  .dp-ds-song-link {
    color: var(--dubplus-primary-color);
  }

  .dp-ds-link {
    background: none;
    border: none;
    padding: 0;
    color: var(--dubplus-primary-color);
    cursor: pointer;
  }
</style>
