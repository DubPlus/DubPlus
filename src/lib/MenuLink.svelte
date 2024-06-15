<script>
  /**
   * @typedef {object} MenuLinkProps
   * @property {string} icon
   * @property {string} href
   * @property {string} text
   */

  /** @type {MenuLinkProps} */
  let { icon, text, href } = $props();
</script>

<li class="dubplus-menu-icon">
  <span class="fa fa-{icon}"></span>
  <a
    href={href}
    class="dubplus-menu-label"
    target="_blank"
  >
    {text}
  </a>
</li>

<style>
  li {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }

  span {
    color: var(--dubplus-primary-color);
    width: 30px;
    text-align: center;
  }

  a {
    text-decoration: none;
    margin-left: 11px;
  }
</style>
