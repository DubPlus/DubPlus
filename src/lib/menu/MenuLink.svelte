<script>
  /**
   * @typedef {object} MenuLinkProps
   * @property {import('svelte').Component} icon
   * @property {string} href
   * @property {string} text
   */

  /** @type {MenuLinkProps} */
  let { icon: Icon, text, href } = $props();
</script>

<li class="dubplus-menu-icon">
  <Icon />
  <a {href} class="dubplus-menu-label" target="_blank">
    {text}
  </a>
</li>

<style>
  li {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  li :global(path) {
    fill: var(--dubplus-primary-color);
  }
  li :global(svg) {
    width: 20px;
    height: 20px;
    display: block;
  }

  a {
    text-decoration: none;
    margin-left: 11px;
  }
</style>
