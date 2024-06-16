<script>
  /**
   * @typedef {object} SwitchProps
   * @property {string} label
   * @property {(state: boolean) => void} onToggle
   */

  /**
   * @type {SwitchProps} props
   */
  let { label, onToggle } = $props();

  let checked = $state(false);

  /**
   * @param {KeyboardEvent} event
   */
  function handleKeydown(event) {
    // Only do something when space or return is pressed
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      checked = !checked;
      onToggle(checked);
    }
  }

  function handleClick() {
    checked = !checked;
    onToggle(checked);
  }
</script>

<div
  role="switch"
  aria-checked={checked}
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
  [role="switch"] {
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
    height: 12px;
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
    top: 1px;
    left: 2px;
    background: var(--dubplus-primary-color);
    transition: left 0.2s cubic-bezier(0.8, 0, 0.05, 1);
  }
  [role="switch"][aria-checked="true"] .dubplus-switch {
    background: #666;
  }
  [role="switch"][aria-checked="true"] .dubplus-switch span {
    background: var(--dubplus-secondary-color);
    border-color: var(--dubplus-secondary-color);
    left: 17px;
  }
</style>
