<script>
  import { settings } from '../stores/settings.svelte';

  /**
   * @typedef {object} SwitchProps
   * @property {string} label
   * @property {string} optionId
   * @property {boolean} [disabled]
   * @property {(state: boolean) => void} onToggle
   */

  /**
   * @type {SwitchProps} props
   */
  let { label, onToggle, optionId, disabled } = $props();

  function toggleOption() {
    settings.options[optionId] = !settings.options[optionId];
    onToggle(settings.options[optionId]);
  }

  /**
   * @param {KeyboardEvent} event
   */
  function handleKeydown(event) {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleOption();
    }
  }

  function handleClick() {
    if (disabled) return;
    toggleOption();
  }
</script>

<div
  role="switch"
  aria-disabled={disabled ? 'true' : 'false'}
  aria-checked={settings.options[optionId] ? 'true' : 'false'}
  tabindex="0"
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  <span class="dubplus-switch">
    <span></span>
  </span>
  <span class="dubplus-switch-label">{label}</span>
</div>

<style>
  [role='switch'] {
    user-select: none;
    display: flex;
    align-items: center;
  }

  .dubplus-switch-label {
    flex: 1;
    padding-left: 11px;
  }

  .dubplus-switch {
    position: relative;
    padding: 1px;
    height: 16px;
    width: 29px;
    border-radius: 20px;
    background: #333;
    border: 2px solid #666;
    cursor: pointer;
  }
  .dubplus-switch span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    vertical-align: middle;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 2px;
    background: var(--dubplus-primary-color);
    transition: left 0.2s cubic-bezier(0.8, 0, 0.05, 1);
  }
  [role='switch'][aria-checked='true'] .dubplus-switch {
    background: #666;
  }
  [role='switch'][aria-checked='true'] .dubplus-switch span {
    background: var(--dubplus-secondary-color);
    border-color: var(--dubplus-secondary-color);
    left: 13px;
  }
</style>
