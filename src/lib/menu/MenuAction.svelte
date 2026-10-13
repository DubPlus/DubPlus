<script>
  import { onMount } from 'svelte';
  import { t } from '../stores/i18n.svelte';
  import { mobile } from '../stores/mobileState.svelte.js';
  import { isMod } from '../../utils/modcheck';
  import { getUserId } from '../queup.v2';

  /**
   * @typedef {object} MenuActionProps
   * @property {string} id
   * @property {string} label
   * @property {string} description
   * @property {boolean} [modOnly]
   * @property {boolean} [desktopOnly]
   * @property {import('svelte').Component} icon An SVG as a .svelte component
   * @property {() => void} [onClick]
   * @property {() => void} [init]
   */

  /**
   * @type {MenuActionProps}
   */
  let {
    id,
    label,
    description,
    icon: Icon,
    onClick = () => {},
    init,
    modOnly = false,
    desktopOnly = false,
  } = $props();

  function getDisabled() {
    if (desktopOnly && mobile.current) return true;
    if (modOnly && !isMod(getUserId())) return true;
    return false;
  }

  onMount(() => {
    if (init) init();
  });
</script>

<li {id} title={t(description)} class:disabled={getDisabled()}>
  <button aria-label={t(description)} type="button" onclick={onClick}>
    <Icon />
    <span class="dubplus-menu-label">{t(label)}</span>
  </button>
  <div class="dubplus-slash-command">
    /{id}
  </div>
</li>

<style>
  li {
    margin: 10px 0;
  }
  button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    appearance: none;
    color: inherit;
    font-size: inherit;
  }

  button :global(svg) {
    width: 29px;
    height: 18px;
    fill: var(--dubplus-primary-color);
  }

  .dubplus-menu-label {
    flex: 1;
    padding-left: 11px;
  }
</style>
